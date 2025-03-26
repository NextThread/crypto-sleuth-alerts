
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PostErrorProps {
  error: string;
}

const PostError = ({ error }: PostErrorProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Link to="/blog">
          <Button variant="outline" className="mt-2">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PostError;
