
import { useState } from "react";
import Header from "@/components/MemeGenerator/Header";
import PromptInput from "@/components/MemeGenerator/PromptInput";
import MemeDisplay from "@/components/MemeGenerator/MemeDisplay";
import { generateMeme } from "@/services/memeService";
import { toast } from "sonner";

const Index = () => {
  const [memeUrl, setMemeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const handleGenerateMeme = async (prompt: string) => {
    try {
      setIsLoading(true);
      setCurrentPrompt(prompt);
      const url = await generateMeme(prompt);
      setMemeUrl(url);
      toast.success("Meme generated! Now add some text to it!");
    } catch (error) {
      console.error("Failed to generate meme:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (currentPrompt) {
      handleGenerateMeme(currentPrompt);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-meme-background to-white">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <Header />
        
        <div className="w-full flex flex-col items-center space-y-8">
          <PromptInput onGenerate={handleGenerateMeme} isLoading={isLoading} />
          
          <MemeDisplay 
            memeUrl={memeUrl} 
            prompt={currentPrompt}
            onRegenerate={handleRegenerate}
            isLoading={isLoading}
          />
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© 2023 MemeMaster. All rights reserved.</p>
          <p className="mt-1">Create and share hilarious memes in seconds!</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
