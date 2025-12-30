import { useEffect } from "react";
import "../styles/Logo.css";

const Logo = () => {
  const handleFullscreen = () => {
    const element = document.documentElement;
    
    // Check if already in fullscreen
    const isFullscreen = document.fullscreenElement || 
                         document.webkitFullscreenElement || 
                         document.mozFullScreenElement || 
                         document.msFullscreenElement;
    
    if (!isFullscreen) {
      // Enter fullscreen
      if (element.requestFullscreen) {
        element.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable fullscreen:", err);
        });
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen - logo acts as toggle
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes to hide X button
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Try to hide any close buttons that appear
      const closeButtons = document.querySelectorAll('button, [role="button"]');
      closeButtons.forEach(btn => {
        const text = btn.textContent || btn.innerText || '';
        if (text.includes('✕') || text.includes('×') || text.includes('X') || 
            btn.getAttribute('aria-label')?.toLowerCase().includes('close') ||
            btn.getAttribute('aria-label')?.toLowerCase().includes('exit')) {
          btn.style.display = 'none';
          btn.style.visibility = 'hidden';
          btn.style.opacity = '0';
          btn.style.pointerEvents = 'none';
        }
      });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <img 
      src="/assets/logo.png" 
      alt="Logo" 
      className="app-logo" 
      onClick={handleFullscreen}
    />
  );
};

export default Logo;

