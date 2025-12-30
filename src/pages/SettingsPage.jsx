import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SettingsPage.css";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [hostIP, setHostIP] = useState("");
  const [port, setPort] = useState("8000");
  const [cameraFacing, setCameraFacing] = useState("user"); // "user" for front, "environment" for back
  const [isValid, setIsValid] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    // Load saved settings
    const savedBackendUrl = localStorage.getItem("backendUrl");
    const savedCameraFacing = localStorage.getItem("cameraFacing") || "user";

    if (savedBackendUrl) {
      try {
        const url = new URL(savedBackendUrl);
        setHostIP(url.hostname);
        setPort(url.port || "8000");
      } catch (e) {
        // If URL parsing fails, try to extract from saved value
        const match = savedBackendUrl.match(/http:\/\/([^:]+):?(\d*)/);
        if (match) {
          setHostIP(match[1]);
          setPort(match[2] || "8000");
        }
      }
    }

    setCameraFacing(savedCameraFacing);
  }, []);

  useEffect(() => {
    // Validate inputs
    const ipValid = hostIP.trim().length > 0;
    const portValid = port.trim().length > 0 && !isNaN(parseInt(port));
    setIsValid(ipValid && portValid);
  }, [hostIP, port]);

  const testBackendConnection = async () => {
    if (!isValid) {
      setTestResult({ success: false, message: "Please enter a valid IP and port first" });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const backendUrl = `http://${hostIP.trim()}:${port.trim()}`;
    const testUrl = `${backendUrl}/api/test`;

    try {
      console.log("Testing backend connection to:", testUrl);
      const response = await fetch(testUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult({ 
          success: true, 
          message: `✅ Connection successful! Backend is running.\nResponse: ${JSON.stringify(data)}` 
        });
      } else {
        setTestResult({ 
          success: false, 
          message: `❌ Connection failed: ${response.status} ${response.statusText}\nURL: ${testUrl}` 
        });
      }
    } catch (error) {
      console.error("Backend connection test failed:", error);
      setTestResult({ 
        success: false, 
        message: `❌ Connection failed: ${error.message}\n\nPossible issues:\n- Backend not running\n- Wrong IP address\n- Firewall blocking connection\n- Not on same WiFi network\n\nURL tried: ${testUrl}` 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isValid) return;

    // Construct backend URL
    const backendUrl = `http://${hostIP.trim()}:${port.trim()}`;
    
    // Save settings
    localStorage.setItem("backendUrl", backendUrl);
    localStorage.setItem("cameraFacing", cameraFacing);
    
    // Navigate to start page using React Router
    navigate("/", { replace: true });
  };

  const handleSkip = () => {
    // Use default settings
    const defaultUrl = "http://localhost:8000";
    localStorage.setItem("backendUrl", defaultUrl);
    localStorage.setItem("cameraFacing", "user");
    navigate("/", { replace: true });
  };

  return (
    <div className="screen settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Configuration</h1>
        <p className="settings-subtitle">Configure your backend connection and camera settings</p>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="hostIP">Backend Host IP</label>
            <input
              type="text"
              id="hostIP"
              value={hostIP}
              onChange={(e) => setHostIP(e.target.value)}
              placeholder="192.168.1.100"
              className="form-input"
            />
            <small className="form-hint">Your laptop's local IP address</small>
          </div>

          <div className="form-group">
            <label htmlFor="port">Port</label>
            <input
              type="text"
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="8000"
              className="form-input"
            />
            <small className="form-hint">Backend server port (default: 8000)</small>
          </div>

          <div className="form-group">
            <label htmlFor="camera">Camera</label>
            <select
              id="camera"
              value={cameraFacing}
              onChange={(e) => setCameraFacing(e.target.value)}
              className="form-select"
            >
              <option value="user">Front Camera</option>
              <option value="environment">Back Camera</option>
            </select>
            <small className="form-hint">Select which camera to use for capture</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={testBackendConnection}
              disabled={!isValid || isTesting}
              className="button test-button"
              style={{ 
                backgroundColor: "#4CAF50", 
                color: "white",
                marginBottom: "10px"
              }}
            >
              {isTesting ? "Testing Connection..." : "Test Backend Connection"}
            </button>
            
            {testResult && (
              <div style={{
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
                backgroundColor: testResult.success ? "#d4edda" : "#f8d7da",
                color: testResult.success ? "#155724" : "#721c24",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
                textAlign: "left"
              }}>
                {testResult.message}
              </div>
            )}

            <button
              type="button"
              onClick={handleSkip}
              className="button skip-button"
            >
              Skip (Use Defaults)
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="button submit-button"
            >
              Save & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;

