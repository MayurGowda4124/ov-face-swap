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
    // Ensure URL is properly formatted
    let url = savedUrl.trim();
    // If it's a ngrok domain without protocol, add https://
    if (url.includes('.ngrok') && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    // If it's a regular IP without protocol, add http://
    if (!url.startsWith('http://') && !url.startsWith('https://') && /^\d+\.\d+\.\d+\.\d+/.test(url)) {
      // Extract port if included
      const parts = url.split(':');
      if (parts.length === 2) {
        url = `http://${parts[0]}:${parts[1]}`;
      } else {
        url = `http://${url}:8000`; // Default port
      }
    }
    return url;
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
  // #region agent log
  fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:44',message:'swapFaces called',data:{targetImageUrl,userDetailsName:userDetails.name,sourceImageBlobType:sourceImageBlob?.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  try {
    const formData = new FormData();

    // Convert relative URL to absolute URL if needed
    let characterImageUrl = targetImageUrl;
    if (targetImageUrl.startsWith('/')) {
      // Relative path - convert to absolute URL using current origin
      characterImageUrl = `${window.location.origin}${targetImageUrl}`;
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:52',message:'Character image URL resolved',data:{originalUrl:targetImageUrl,resolvedUrl:characterImageUrl,origin:window.location.origin},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    console.log("Fetching character image from:", characterImageUrl);
    
    // Fetch the character image - this will be the base image (sourceImage)
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:58',message:'Before character image fetch',data:{characterImageUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    const characterResponse = await fetch(characterImageUrl);
    
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:62',message:'Character image fetch response',data:{status:characterResponse.status,statusText:characterResponse.statusText,ok:characterResponse.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    if (!characterResponse.ok) {
      const errorDetail = `Character image fetch failed: ${characterResponse.status} ${characterResponse.statusText}. URL: ${characterImageUrl}`;
      console.error(errorDetail);
      throw new Error(errorDetail);
    }
    
    const characterImageBlob = await characterResponse.blob();
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:70',message:'Character image blob created',data:{blobSize:characterImageBlob.size,blobType:characterImageBlob.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
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
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:78',message:'Before backend API call',data:{backendUrl,apiUrl,formDataKeys:Array.from(formData.keys())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    console.log("Calling API:", apiUrl);
    const swapResponse = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:85',message:'Backend API response received',data:{status:swapResponse.status,statusText:swapResponse.statusText,ok:swapResponse.ok,headers:Object.fromEntries(swapResponse.headers.entries())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    if (!swapResponse.ok) {
      let errorText = '';
      try {
        errorText = await swapResponse.text();
      } catch (e) {
        errorText = 'Could not read error response';
      }
      const errorDetail = `Backend API error: ${swapResponse.status} ${swapResponse.statusText}. URL: ${apiUrl}. Error: ${errorText.substring(0, 200)}`;
      console.error(errorDetail);
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:90',message:'Backend API error',data:{status:swapResponse.status,errorText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      throw new Error(errorDetail);
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
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:145',message:'swapFaces error caught',data:{errorMessage:error.message,errorName:error.name,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
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

