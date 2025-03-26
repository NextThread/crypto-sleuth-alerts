
import { BlogPost, ensureValidImage } from "@/utils/blogDataUtils";
import { useState } from "react";

interface PostImageProps {
  post: BlogPost;
}

const PostImage = ({ post }: PostImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const postTitle = post.title || "Untitled Post";
  const slugId = post.slug?.split('-')[0] || '0';
  const fallbackIndex = parseInt(slugId, 10);
  
  // Use the existing function to get a valid image URL
  const postImage = ensureValidImage(
    post.image, 
    fallbackIndex
  );

  return (
    <div className="relative rounded-lg overflow-hidden bg-muted/30">
      {!imageLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={postImage}
        alt={postTitle}
        className={`w-full rounded-lg object-cover aspect-video shadow-md transition-opacity duration-300 ${imageLoaded && !hasError ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImageLoaded(true)}
        onError={(e) => {
          setHasError(true);
          setImageLoaded(true);
          const target = e.target as HTMLImageElement;
          // Get random fallback image
          target.src = ensureValidImage("", Math.floor(Math.random() * 9));
          target.classList.remove('opacity-0');
          target.classList.add('opacity-100');
        }}
      />
    </div>
  );
};

export default PostImage;
