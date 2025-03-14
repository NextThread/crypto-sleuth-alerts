
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2 } from "lucide-react";

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput = ({ onGenerate, isLoading }: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          placeholder="Enter your meme prompt (e.g., 'When you finally clean your room and can't find anything')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 bg-white border-meme-primary/30 focus-visible:ring-meme-primary text-meme-text placeholder:text-gray-400"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !prompt.trim()}
          className="bg-gradient-to-r from-meme-primary to-meme-secondary hover:opacity-90 transition-opacity"
        >
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Generate Meme"}
        </Button>
      </div>
    </form>
  );
};

export default PromptInput;
