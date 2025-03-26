
import { Badge } from "@/components/ui/badge";
import { Calendar, User, MessageSquare, Tag } from "lucide-react";
import { BlogPost } from "@/utils/blogDataUtils";
import { formatDate } from "@/utils/blogDataUtils";

interface PostHeaderProps {
  post: BlogPost;
}

const PostHeader = ({ post }: PostHeaderProps) => {
  const postTitle = post.title || "Untitled Post";
  const postDescription = post.description || "No description available";
  const postCategory = post.category || "Uncategorized";
  const postDate = post.date || new Date();
  const postReadingTime = post.readingTime || "5 min read";
  const postTags = Array.isArray(post.tags) ? post.tags.slice(0, 3) : [];

  return (
    <header className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
          {postCategory}
        </Badge>
        {postTags.map((tag) => (
          <Badge key={tag} variant="outline" className="bg-secondary/10">
            {tag}
          </Badge>
        ))}
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold">{postTitle}</h1>
      <p className="text-lg text-muted-foreground">
        {postDescription}
      </p>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <time dateTime={String(postDate)}>
            {formatDate(postDate)}
          </time>
        </div>
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{post.author || "ChartPulse Team"}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{Math.floor(Math.random() * 10) + 1} Comments</span>
        </div>
        <div className="flex items-center gap-1">
          <Tag className="h-4 w-4" />
          <span>{postReadingTime}</span>
        </div>
      </div>
    </header>
  );
};

export default PostHeader;
