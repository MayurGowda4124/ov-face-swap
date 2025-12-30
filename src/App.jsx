import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import StartPage from "./pages/StartPage";
import CapturePage from "./pages/CapturePage";
import CharacterSelectionPage from "./pages/CharacterSelectionPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultPage from "./pages/ResultPage";
import QrCodePage from "./pages/QrCodePage";
import SettingsPage from "./pages/SettingsPage";
import Logo from "./components/Logo";

// Component to check if settings are configured
const ProtectedRoute = ({ children }) => {
  const backendUrl = localStorage.getItem("backendUrl");
  const cameraFacing = localStorage.getItem("cameraFacing");
  
  // Redirect to settings if not configured
  if (!backendUrl || !cameraFacing) {
    return <Navigate to="/settings" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Logo />
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <StartPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/capture" element={<CapturePage />} />
        <Route path="/character-selection" element={<CharacterSelectionPage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/qr-code" element={<QrCodePage />} />
      </Routes>
    </Router>
  );
}

export default App;

