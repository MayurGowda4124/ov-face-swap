/**
 * API utility for communicating with the local backend
 * Configure BACKEND_URL to match your local IP address
 */
import { supabase } from "../database/supabaseClient";

// Get the backend URL from localStorage (set in settings) or environment or use localhost
// For iPad to connect to laptop on same WiFi, use your laptop's local IP
// Example: http://192.168.1.100:8000
// Get backend URL dynamically (can change if user updates settings)
const getBackendUrl = () => {
  // First check localStorage (from settings page)
  const savedUrl = localStorage.getItem("backendUrl");
  if (savedUrl) {
    return savedUrl;
  }
  // Then check environment variable
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  // Default fallback
  return 'http://localhost:8000';
};

// Helper function to convert image to JPEG format
function convertImageToJPEG(blob) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(resolve, "image/jpeg", 0.95);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

export const swapFaces = async (sourceImageBlob, targetImageUrl, userDetails = {}) => {
  try {
    const formData = new FormData();

    // Convert relative URL to absolute URL if needed
    let characterImageUrl = targetImageUrl;
    if (targetImageUrl.startsWith('/')) {
      // Relative path - convert to absolute URL using current origin
      characterImageUrl = `${window.location.origin}${targetImageUrl}`;
    }
    
    console.log("Fetching character image from:", characterImageUrl);
    
    // Fetch the character image - this will be the base image (sourceImage)
    const characterResponse = await fetch(characterImageUrl);
    
    if (!characterResponse.ok) {
      throw new Error(`Failed to fetch character image: ${characterResponse.status} ${characterResponse.statusText}`);
    }
    
    const characterImageBlob = await characterResponse.blob();
    formData.append(
      "sourceImage",
      new File([characterImageBlob], "sourceImage.jpg", { type: "image/jpeg" })
    );

    // Add captured photo - this will be the face to swap onto the character (targetImage)
    formData.append(
      "targetImage",
      new File([sourceImageBlob], "targetImage.jpg", { type: "image/jpeg" })
    );

    // Add user details (required by backend)
    // Backend signature shows File(...) but these are strings, so we send as form fields
    formData.append("name", userDetails.name || "Guest");
    formData.append("email", userDetails.email || "");

    // Make API call to local backend (get URL dynamically)
    const backendUrl = getBackendUrl();
    // Remove trailing slash from backendUrl and ensure single slash before endpoint
    const cleanBackendUrl = backendUrl.replace(/\/+$/, '');
    const apiUrl = `${cleanBackendUrl}/api/swap-face/`;  // Use trailing slash to match backend
    console.log("Calling API:", apiUrl);
    const swapResponse = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!swapResponse.ok) {
      const errorText = await swapResponse.text();
      throw new Error(`API error: ${swapResponse.status} - ${errorText}`);
    }

    // Get the response
    const responseData = await swapResponse.json();

    // Extract base64 image
    if (!responseData.image_base64) {
      throw new Error("No image data in response");
    }

    // Convert base64 to blob
    const swappedImageBlob = base64ToBlob(responseData.image_base64, "image/jpeg");
    const convertedBlob = await convertImageToJPEG(swappedImageBlob);

    // Upload to Supabase storage
    const timestamp = Date.now();
    const fileName = `kingfisher/${timestamp}-result.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("ai_face_swap")
      .upload(fileName, convertedBlob, {
        contentType: "image/jpeg",
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      // Don't throw - continue with base64 fallback if upload fails
      console.warn("Supabase upload failed, using base64 fallback");
    }

    // Get the public URL only if upload succeeded
    let publicURL = null;
    let recordId = null;

    if (!uploadError) {
      publicURL = `https://ytsojsmbmertwicztubd.supabase.co/storage/v1/object/public/ai_face_swap/${fileName}`;

      const payload = {
        image_url: publicURL,
        created_at: new Date(timestamp).toISOString(),
      };

      if (userDetails) {
        payload.email = userDetails.email || '';
        payload.name = userDetails.name || '';
        payload.contact = userDetails.contact || '';
      }

      const { data: insertedRows, error: userError } = await supabase
        .from('kingfisher-info')
        .insert(payload)
        .select()
        .maybeSingle();

      if (userError) {
        console.error("Error saving user info:", userError);
      } else if (insertedRows?.id) {
        recordId = insertedRows.id;
      }
    }

    return {
      publicUrl: publicURL,
      recordId,
      imageBase64: responseData.image_base64, // Keep for local fallback
      localPath: responseData.local_path,
    };
  } catch (error) {
    console.error("Face swap error:", error);
    throw error;
  }
};

// Helper function to convert base64 to blob
function base64ToBlob(base64, contentType) {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  const sliceSize = 1024;

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return new Blob(byteArrays, { type: contentType });
}

// Helper function to convert base64 to blob URL
export const base64ToBlobUrl = (base64String) => {
  const byteCharacters = atob(base64String);
  const byteArrays = [];
  const sliceSize = 1024;

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    byteArrays.push(new Uint8Array(byteNumbers));
  }

  const blob = new Blob(byteArrays, { type: "image/jpeg" });
  return URL.createObjectURL(blob);
};

