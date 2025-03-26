
import { BlogPost, ensureValidImage } from "@/utils/blogDataUtils";
import { useState, useEffect } from "react";

interface PostImageProps {
  post: BlogPost;
  priority?: boolean;
}

const PostImage = ({ post, priority = false }: PostImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  
  const postTitle = post.title || "Untitled Post";
  const slugId = post.slug?.split('-')[0] || '0';
  const fallbackIndex = parseInt(slugId, 10);
  
  // Set up the image URL on component mount and whenever post changes
  useEffect(() => {
    // Use the existing function to get a valid image URL
    const validImageUrl = ensureValidImage(
      post.image, 
      fallbackIndex
    );
    setImageUrl(validImageUrl);
  }, [post, fallbackIndex]);

  // Handle image load error
  const handleImageError = () => {
    setHasError(true);
    setImageLoaded(true);
    // Get random fallback image on error
    setImageUrl(ensureValidImage("", Math.floor(Math.random() * 9)));
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-muted/30">
      {!imageLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={imageUrl}
        alt={postTitle}
        className={`w-full rounded-lg object-cover aspect-video shadow-md transition-opacity duration-300 ${imageLoaded && !hasError ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
        onError={handleImageError}
        loading={priority ? "eager" : "lazy"}
      />
    </div>
  );
};

export default PostImage;
