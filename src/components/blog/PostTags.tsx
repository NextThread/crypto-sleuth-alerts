
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/utils/blogDataUtils";

interface PostTagsProps {
  post: BlogPost;
}

const PostTags = ({ post }: PostTagsProps) => {
  const postTags = Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className="flex justify-between items-center border-t border-b border-border py-4 my-8">
      <div className="flex flex-wrap gap-2">
        {postTags.map((tag) => (
          <Badge key={tag} variant="outline" className="bg-secondary/10">
            {tag}
          </Badge>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
};

export default PostTags;
