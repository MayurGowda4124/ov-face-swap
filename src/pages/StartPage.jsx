import { useNavigate } from "react-router-dom";
import "../styles/StartPage.css";

const StartPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/character-selection");
  };

  return (
    <div className="screen welcome-background">
      <div className="start-content">
        <h1 className="start-title">Capture your organic vibe</h1>
        <img 
          src="/assets/start.png" 
          alt="Start" 
          className="start-button-image" 
          onClick={handleStart}
        />
      </div>
    </div>
  );
};

export default StartPage;

