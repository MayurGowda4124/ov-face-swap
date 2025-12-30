import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { swapFaces, base64ToBlobUrl } from "../utils/api";
import "../styles/ProcessingPage.css";

const ProcessingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processImages = async () => {
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProcessingPage.jsx:10',message:'processImages started',data:{hasCapturedImage:!!localStorage.getItem("capturedImageBlob"),hasSelectedCharacter:!!localStorage.getItem("selectedCharacter")},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      try {
        // Get the necessary data
        const capturedImageBlob = localStorage.getItem("capturedImageBlob");
        const selectedCharacter = localStorage.getItem("selectedCharacter");
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProcessingPage.jsx:16',message:'Retrieved from localStorage',data:{capturedImageBlob:capturedImageBlob?.substring(0,50),selectedCharacter},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
        // #endregion

        if (!capturedImageBlob || !selectedCharacter) {
          navigate("/capture");
          return;
        }

        // Convert blob URL to blob
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProcessingPage.jsx:23',message:'Before converting blob URL',data:{capturedImageBlob:capturedImageBlob?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion
        const imageBlob = await fetch(capturedImageBlob).then((r) => r.blob());
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProcessingPage.jsx:25',message:'Blob converted',data:{blobSize:imageBlob.size,blobType:imageBlob.type},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
        // #endregion

        // Call the face swap API (name and email are optional for iPad version)
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProcessingPage.jsx:28',message:'Before swapFaces call',data:{selectedCharacter,imageBlobSize:imageBlob.size},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
        // #endregion
        const result = await swapFaces(imageBlob, selectedCharacter, {
          name: "iPad User",
          email: ""
        });
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProcessingPage.jsx:33',message:'swapFaces completed',data:{hasPublicUrl:!!result.publicUrl,hasImageBase64:!!result.imageBase64,hasRecordId:!!result.recordId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
        // #endregion

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
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProcessingPage.jsx:48',message:'processImages error caught',data:{errorMessage:error.message,errorName:error.name,errorStack:error.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
        // #endregion
        console.error("Face swap failed:", error);
        const errorMessage = error.message || "Unknown error";
        // Show detailed error in alert
        const detailedError = `Error Details:\n${errorMessage}\n\nBackend URL: ${localStorage.getItem("backendUrl") || "Not set"}\nCharacter: ${localStorage.getItem("selectedCharacter") || "Not set"}`;
        alert(`Failed to process image. Please try again.\n\n${detailedError}\n\nMake sure the backend is running on your laptop and accessible from this device.`);
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

