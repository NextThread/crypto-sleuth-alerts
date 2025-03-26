
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const PostNotFound = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
      <p>Sorry, the post you are looking for does not exist.</p>
      <Link to="/blog">
        <Button variant="outline" className="mt-4">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
        </Button>
      </Link>
    </div>
  );
};

export default PostNotFound;
