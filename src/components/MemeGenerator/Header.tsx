
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="flex flex-col items-center mb-8">
      <div className="flex items-center gap-2 text-4xl md:text-5xl font-bold text-meme-primary animate-float">
        <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-meme-secondary" />
        <h1>MemeMaster</h1>
        <Sparkles className="h-8 w-8 md:h-10 md:w-10 text-meme-accent" />
      </div>
      <p className="text-meme-text mt-2 text-lg md:text-xl max-w-xl text-center">
        Generate hilarious memes with AI! Enter your prompt and let the magic happen.
      </p>
    </header>
  );
};

export default Header;
