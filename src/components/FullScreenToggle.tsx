
import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FullScreenToggleProps {
  targetId: string;
}

const FullScreenToggle = ({ targetId }: FullScreenToggleProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const element = document.getElementById(targetId);
    
    if (!element) return;
    
    if (!isFullScreen) {
      // Enter full screen
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      // Exit full screen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullScreen(false);
    }
  };
  
  // Listen for fullscreen change events
  document.addEventListener('fullscreenchange', () => {
    setIsFullScreen(!!document.fullscreenElement);
  });

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleFullScreen}
      className="bg-black/20 hover:bg-black/40 border-white/10"
    >
      {isFullScreen ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
      <span className="ml-2">{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</span>
    </Button>
  );
};

export default FullScreenToggle;
