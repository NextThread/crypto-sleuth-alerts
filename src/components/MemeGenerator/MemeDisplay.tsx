
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Download, RefreshCw, Type, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface MemeDisplayProps {
  memeUrl: string | null;
  prompt: string;
  onRegenerate: () => void;
  isLoading: boolean;
}

const MemeDisplay = ({ memeUrl, prompt, onRegenerate, isLoading }: MemeDisplayProps) => {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [fontSize, setFontSize] = useState(36);
  const [topTextPosition, setTopTextPosition] = useState({ x: 50, y: 10 });
  const [bottomTextPosition, setBottomTextPosition] = useState({ x: 50, y: 85 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editing, setEditing] = useState<"top" | "bottom" | null>(null);

  useEffect(() => {
    if (memeUrl && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        drawMeme(img, ctx);
      };
      img.src = memeUrl;
    }
  }, [memeUrl, topText, bottomText, fontSize, topTextPosition, bottomTextPosition]);

  const drawMeme = (img: HTMLImageElement, ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw image
    ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Configure text style
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = fontSize / 15;
    ctx.font = `bold ${fontSize}px Impact, sans-serif`;

    // Draw top text
    if (topText) {
      const xPos = (topTextPosition.x / 100) * ctx.canvas.width;
      const yPos = (topTextPosition.y / 100) * ctx.canvas.height;
      ctx.fillText(topText, xPos, yPos + fontSize / 2);
      ctx.strokeText(topText, xPos, yPos + fontSize / 2);
    }
    
    // Draw bottom text
    if (bottomText) {
      const xPos = (bottomTextPosition.x / 100) * ctx.canvas.width;
      const yPos = (bottomTextPosition.y / 100) * ctx.canvas.height;
      ctx.fillText(bottomText, xPos, yPos);
      ctx.strokeText(bottomText, xPos, yPos);
    }
    
    // Add watermark
    ctx.font = "14px Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fillText("MemeMaster", ctx.canvas.width - 10, ctx.canvas.height - 10);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `meme-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Meme downloaded successfully!");
  };

  const adjustPosition = (direction: "up" | "down" | "left" | "right") => {
    const textPosition = editing === "top" ? topTextPosition : bottomTextPosition;
    const step = 2; // Percentage of canvas to move

    let newPosition = { ...textPosition };
    switch (direction) {
      case "up":
        newPosition.y = Math.max(0, textPosition.y - step);
        break;
      case "down":
        newPosition.y = Math.min(100, textPosition.y + step);
        break;
      case "left":
        newPosition.x = Math.max(0, textPosition.x - step);
        break;
      case "right":
        newPosition.x = Math.min(100, textPosition.x + step);
        break;
    }

    if (editing === "top") {
      setTopTextPosition(newPosition);
    } else {
      setBottomTextPosition(newPosition);
    }
  };

  if (!memeUrl && !isLoading) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center p-5 bg-gray-50 w-full max-w-2xl">
        <p className="text-gray-500 text-center">
          Enter a prompt above to generate your meme. Be creative!
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center p-5 bg-gray-50 w-full max-w-2xl">
        <RefreshCw className="h-8 w-8 text-meme-primary animate-spin mb-3" />
        <p className="text-gray-500 text-center">Crafting your hilarious meme...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="relative overflow-hidden rounded-lg shadow-lg">
        <canvas
          ref={canvasRef}
          className="w-full h-auto object-contain bg-black/5"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-meme-primary" />
              <span className="text-sm font-medium">Meme Text</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Top text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  className="text-sm"
                  onFocus={() => setEditing("top")}
                />
              </div>
              <div className="flex-1">
                <Input
                  placeholder="Bottom text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  className="text-sm"
                  onFocus={() => setEditing("bottom")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Move className="h-4 w-4 text-meme-primary" />
              <span className="text-sm font-medium">
                {editing ? `Adjust ${editing === "top" ? "Top" : "Bottom"} Text Position` : "Select text to position it"}
              </span>
            </div>
            {editing && (
              <div className="flex justify-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => adjustPosition("left")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => adjustPosition("up")}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => adjustPosition("down")}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => adjustPosition("right")}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium">Font Size: {fontSize}px</span>
            </label>
            <Slider
              value={[fontSize]}
              min={20}
              max={80}
              step={1}
              onValueChange={(value) => setFontSize(value[0])}
              className="py-2"
            />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            onClick={onRegenerate} 
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            New Template
          </Button>
          <Button 
            onClick={handleDownload}
            className="bg-gradient-to-r from-meme-accent to-meme-secondary hover:opacity-90 transition-opacity gap-2"
          >
            <Download className="h-4 w-4" />
            Download Meme
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemeDisplay;
