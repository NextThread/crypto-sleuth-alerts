
import { Link } from "react-router-dom";
import { BlogPost, ensureValidImage } from "@/utils/blogDataUtils";

interface RelatedPostsProps {
  posts: BlogPost[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 pt-6 border-t border-border">
      <h3 className="text-xl font-bold mb-4">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(relatedPost => {
          if (!relatedPost) return null;
          
          const relatedPostImage = ensureValidImage(
            relatedPost.image, 
            parseInt(relatedPost.slug?.split('-')[0] || '0', 10)
          );
          
          return (
            <Link key={relatedPost.slug} to={`/blog/${relatedPost.slug}`} className="group">
              <div className="flex gap-4 items-start">
                <img 
                  src={relatedPostImage} 
                  alt={relatedPost.title} 
                  className="w-20 h-20 object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = ensureValidImage("", Math.floor(Math.random() * 9));
                  }}
                />
                <div>
                  <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {relatedPost.title || "Untitled Post"}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {relatedPost.readingTime || "5 min read"}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedPosts;
