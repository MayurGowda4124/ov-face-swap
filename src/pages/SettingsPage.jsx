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
        // Try to parse as URL
        const url = new URL(savedBackendUrl);
        setHostIP(url.hostname);
        // For ngrok URLs, don't set port (uses default 443)
        if (url.hostname.includes('.ngrok')) {
          setPort(""); // Empty for ngrok
        } else {
          setPort(url.port || "8000");
        }
      } catch (e) {
        // If URL parsing fails, try to extract from saved value
        // Handle HTTPS URLs
        const httpsMatch = savedBackendUrl.match(/https:\/\/([^/:]+)/);
        if (httpsMatch) {
          setHostIP(httpsMatch[1]);
          setPort(""); // HTTPS uses default port 443
        } else {
          // Handle HTTP URLs
          const httpMatch = savedBackendUrl.match(/http:\/\/([^:]+):?(\d*)/);
          if (httpMatch) {
            setHostIP(httpMatch[1]);
            setPort(httpMatch[2] || "8000");
          } else {
            // Just a domain or IP
            setHostIP(savedBackendUrl);
            setPort("8000");
          }
        }
      }
    }

    setCameraFacing(savedCameraFacing);
  }, []);

  useEffect(() => {
    // Validate inputs
    const ipValid = hostIP.trim().length > 0;
    // Port is optional for ngrok URLs (HTTPS uses default port 443)
    // For regular IPs, port is required
    const isNgrokUrl = hostIP.trim().includes('.ngrok') || 
                       hostIP.trim().startsWith('http://') || 
                       hostIP.trim().startsWith('https://');
    const portValid = isNgrokUrl ? true : (port.trim().length > 0 && !isNaN(parseInt(port)));
    setIsValid(ipValid && portValid);
  }, [hostIP, port]);

  const testBackendConnection = async () => {
    // Check if we have at least a host/IP
    if (hostIP.trim().length === 0) {
      setTestResult({ success: false, message: "Please enter a backend host IP or ngrok URL first" });
      return;
    }
    
    // For ngrok URLs, port is optional. For regular IPs, we need port
    const isNgrokUrl = hostIP.trim().includes('.ngrok') || 
                       hostIP.trim().startsWith('http://') || 
                       hostIP.trim().startsWith('https://');
    
    if (!isNgrokUrl && (port.trim().length === 0 || isNaN(parseInt(port)))) {
      setTestResult({ success: false, message: "Please enter a valid port number for IP addresses" });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    // Handle both HTTP and HTTPS URLs, and ngrok-style URLs
    let backendUrl;
    const trimmedHost = hostIP.trim();
    const trimmedPort = port.trim();
    
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:89',message:'Test connection started',data:{trimmedHost,trimmedPort,hostIPOriginal:hostIP,portOriginal:port},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
    // #endregion
    
    // Simple URL construction - avoid complex parsing
    if (trimmedHost.startsWith('http://') || trimmedHost.startsWith('https://')) {
      // Full URL provided - use as is, remove trailing slash if any
      backendUrl = trimmedHost.replace(/\/+$/, '');
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:95',message:'Full URL detected',data:{backendUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
      // #endregion
    } else if (trimmedHost.includes('.ngrok')) {
      // ngrok domain - always use HTTPS
      backendUrl = `https://${trimmedHost}`;
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:100',message:'ngrok URL detected',data:{backendUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
      // #endregion
    } else {
      // Regular IP - use HTTP (will fail from HTTPS page due to mixed content)
      if (!trimmedPort || isNaN(parseInt(trimmedPort))) {
        setTestResult({ 
          success: false, 
          message: "Port is required for IP addresses. Please enter a port number (e.g., 8000)." 
        });
        setIsTesting(false);
        return;
      }
      backendUrl = `http://${trimmedHost}:${trimmedPort}`;
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:111',message:'Regular IP URL',data:{backendUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
      // #endregion
    }
    
    // Construct test URL - ensure no double slashes
    const testUrl = `${backendUrl.replace(/\/+$/, '')}/api/test`;
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:118',message:'Test URL constructed',data:{testUrl,backendUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'M'})}).catch(()=>{});
    // #endregion
    console.log("Constructed test URL:", testUrl);
    console.log("Backend URL:", backendUrl);

    try {
      // Validate URL format before making request
      let validatedUrl;
      try {
        validatedUrl = new URL(testUrl); // This will throw if URL is invalid
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:130',message:'URL validation passed',data:{testUrl,protocol:validatedUrl.protocol,hostname:validatedUrl.hostname,port:validatedUrl.port,pathname:validatedUrl.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'N'})}).catch(()=>{});
        // #endregion
      } catch (urlError) {
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:134',message:'URL validation failed',data:{testUrl,errorMessage:urlError.message,errorName:urlError.name,errorStack:urlError.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'N'})}).catch(()=>{});
        // #endregion
        setTestResult({ 
          success: false, 
          message: `❌ Invalid URL Format\n\nURL: ${testUrl}\nError: ${urlError.message}\n\nPlease check:\n- No spaces or special characters\n- Correct format (domain or IP)\n- For ngrok: just the domain (e.g., luetta-cosmological-laylah.ngrok-free.dev)` 
        });
        setIsTesting(false);
        return;
      }
      
      console.log("Testing backend connection to:", testUrl);
      console.log("Current page origin:", window.location.origin);
      console.log("Current page protocol:", window.location.protocol);
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:145',message:'Before fetch request',data:{testUrl,pageOrigin:window.location.origin,pageProtocol:window.location.protocol},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'O'})}).catch(()=>{});
      // #endregion
      const response = await fetch(testUrl, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // #region agent log
      fetch('http://127.0.0.1:7247/ingest/f7542cce-9a3b-4010-a074-f818ed42306f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SettingsPage.jsx:153',message:'Fetch response received',data:{status:response.status,statusText:response.statusText,ok:response.ok,headers:Object.fromEntries(response.headers.entries())},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'O'})}).catch(()=>{});
      // #endregion

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
      const errorMsg = error.message || "Unknown error";
      
      // Check for mixed content error
      const isMixedContent = window.location.protocol === 'https:' && testUrl.startsWith('http:');
      const mixedContentNote = isMixedContent 
        ? "\n\n⚠️ MIXED CONTENT ISSUE DETECTED:\nYour app is on HTTPS (Vercel) but backend is HTTP.\nBrowsers block HTTPS→HTTP requests for security.\n\nSOLUTIONS:\n1. Use ngrok or similar to create HTTPS tunnel to backend\n2. Set up SSL certificate for backend\n3. Test from HTTP page (not Vercel)"
        : "";
      
      setTestResult({ 
        success: false, 
        message: `❌ Connection failed: ${errorMsg}${mixedContentNote}\n\nURL tried: ${testUrl}\n\nNote: Direct browser access works, but fetch from app fails.\nThis suggests a CORS or Mixed Content security issue.` 
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate: need at least host/IP
    if (hostIP.trim().length === 0) {
      alert("Please enter a backend host IP or ngrok URL");
      return;
    }
    
    // For ngrok URLs, port is optional. For regular IPs, we need port
    const isNgrokUrl = hostIP.trim().includes('.ngrok') || 
                       hostIP.trim().startsWith('http://') || 
                       hostIP.trim().startsWith('https://');
    
    if (!isNgrokUrl && (port.trim().length === 0 || isNaN(parseInt(port)))) {
      alert("Please enter a valid port number for IP addresses");
      return;
    }

    // Construct backend URL (same logic as test function)
    let backendUrl;
    if (hostIP.trim().startsWith('http://') || hostIP.trim().startsWith('https://')) {
      backendUrl = hostIP.trim();
      if (port.trim() && port.trim() !== '80' && port.trim() !== '443') {
        const urlObj = new URL(backendUrl);
        urlObj.port = port.trim();
        backendUrl = urlObj.toString();
      }
    } else if (hostIP.trim().includes('.ngrok') || hostIP.trim().includes('.ngrok-free.app') || hostIP.trim().includes('.ngrok-free.dev')) {
      backendUrl = `https://${hostIP.trim()}`;
    } else {
      backendUrl = `http://${hostIP.trim()}:${port.trim()}`;
    }
    
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
            <label htmlFor="hostIP">Backend Host IP or ngrok URL</label>
            <input
              type="text"
              id="hostIP"
              value={hostIP}
              onChange={(e) => setHostIP(e.target.value)}
              placeholder="192.168.1.100 or abc123.ngrok-free.app"
              className="form-input"
            />
            <small className="form-hint">Your laptop's IP address OR ngrok HTTPS URL (required for Vercel HTTPS app)</small>
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

