
import { BlogPost, ensureValidImage } from "@/utils/blogDataUtils";

interface PostImageProps {
  post: BlogPost;
}

const PostImage = ({ post }: PostImageProps) => {
  const postTitle = post.title || "Untitled Post";
  const postImage = ensureValidImage(
    post.image, 
    parseInt(post.slug?.split('-')[0] || '0', 10)
  );

  return (
    <div className="relative">
      <img
        src={postImage}
        alt={postTitle}
        className="w-full rounded-lg object-cover aspect-video shadow-md"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = ensureValidImage("", Math.floor(Math.random() * 9));
        }}
      />
    </div>
  );
};

export default PostImage;
