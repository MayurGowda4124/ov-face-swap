import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CapturePage.css";

const CapturePage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    // Check if character is selected
    const selectedCharacter = localStorage.getItem("selectedCharacter");
    if (!selectedCharacter) {
      navigate("/character-selection");
      return;
    }

    // Start camera
    startCamera();

    // Cleanup function
    return () => {
      stopCamera();
    };
  }, [navigate]);

  const startCamera = async () => {
    try {
      // Get camera preference from localStorage (set in settings)
      const cameraFacing = localStorage.getItem("cameraFacing") || "user";
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: cameraFacing, // "user" for front, "environment" for back
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Unable to access camera. Please check your permissions and try again."
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const startCountdown = () => {
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame to the canvas
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);
        localStorage.setItem("capturedImageBlob", imageUrl);
        stopCamera();
      },
      "image/jpeg",
      0.95
    );
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleContinue = () => {
    navigate("/processing");
  };

  return (
    <div className="screen third-background">
      <div className="capture-container">
        <h2 className="capture-title">Position your face in the frame</h2>
        
        <div className="camera-frame">
          {!capturedImage ? (
            <div className="camera-wrapper">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`camera-feed ${isCameraReady ? "ready" : ""}`}
              />
              {countdown !== null && (
                <div className="countdown-overlay">
                  <div className="countdown">{countdown}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="camera-wrapper">
              <img
                src={capturedImage}
                alt="Captured"
                className="captured-image"
              />
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <div className="camera-controls">
          {!capturedImage ? (
            <button
              className="button capture-button"
              onClick={startCountdown}
              disabled={!isCameraReady || countdown !== null}
            >
              {countdown !== null ? "Capturing..." : "Capture Photo"}
            </button>
          ) : (
            <div className="post-capture-buttons">
              <button className="button retake-button" onClick={handleRetake}>
                Retake
              </button>
              <button className="button continue-button" onClick={handleContinue}>
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapturePage;

