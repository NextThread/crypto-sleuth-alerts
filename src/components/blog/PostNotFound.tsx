
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookX, Search } from "lucide-react";

const PostNotFound = () => {
  return (
    <div className="container mx-auto px-4 py-12 text-center max-w-md">
      <div className="bg-secondary/20 p-8 rounded-lg border border-secondary/30 shadow-sm">
        <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <BookX className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, the article you are looking for does not exist or may have been moved.
        </p>
        <div className="space-y-3">
          <Link to="/blog">
            <Button variant="default" className="w-full">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full">
              <Search className="mr-2 h-4 w-4" /> Browse Other Content
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostNotFound;
