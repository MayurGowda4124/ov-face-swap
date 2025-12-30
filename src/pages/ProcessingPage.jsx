import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { swapFaces, base64ToBlobUrl } from "../utils/api";
import "../styles/ProcessingPage.css";

const ProcessingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processImages = async () => {
      try {
        // Get the necessary data
        const capturedImageBlob = localStorage.getItem("capturedImageBlob");
        const selectedCharacter = localStorage.getItem("selectedCharacter");

        if (!capturedImageBlob || !selectedCharacter) {
          navigate("/capture");
          return;
        }

        // Convert blob URL to blob
        const imageBlob = await fetch(capturedImageBlob).then((r) => r.blob());

        // Call the face swap API (name and email are optional for iPad version)
        const result = await swapFaces(imageBlob, selectedCharacter, {
          name: "iPad User",
          email: ""
        });

        // Store the result (matching main project's localStorage key)
        // Use Supabase public URL if available, otherwise fallback to local blob
        if (result.publicUrl) {
          localStorage.setItem("swappedImageUrl", result.publicUrl);
        } else if (result.imageBase64) {
          const resultImageUrl = base64ToBlobUrl(result.imageBase64);
          localStorage.setItem("swappedImageUrl", resultImageUrl);
        }

        // Store record ID if available (for Supabase)
        if (result.recordId) {
          localStorage.setItem("swappedImageRecordId", String(result.recordId));
        } else {
          localStorage.removeItem("swappedImageRecordId");
        }

        // Navigate to result screen
        navigate("/result");
      } catch (error) {
        console.error("Face swap failed:", error);
        const errorMessage = error.message || "Unknown error";
        alert(`Failed to process image. Please try again.\n\nError: ${errorMessage}\n\nMake sure the backend is running on your laptop and accessible from this device.`);
        navigate("/capture");
      }
    };

    processImages();
  }, [navigate]);

  return (
    <div className="screen third-background">
      <div className="processing-content">
        <div className="processing-frame">
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        </div>
        <h2 className="processing-title">Processing your image...</h2>
        <p className="processing-subtitle">This may take a few moments</p>
      </div>
    </div>
  );
};

export default ProcessingPage;

