
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Bookmark, 
  ThumbsUp, 
  MessageSquare,
  Tag,
  User,
  Twitter,
  Facebook,
  Linkedin,
  Copy
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Import all blog post data
import { 
  technicalAnalysisPosts,
  fundamentalAnalysisPosts,
  tradingStrategyPosts,
  cryptoForexPosts,
  BlogPost as BlogPostType
} from "@/data/blogPosts";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  
  useEffect(() => {
    // Combine all posts
    const allPosts = [
      ...technicalAnalysisPosts,
      ...fundamentalAnalysisPosts,
      ...tradingStrategyPosts,
      ...cryptoForexPosts
    ];
    
    // Find the current post
    const currentPost = allPosts.find(p => p.slug === slug);
    setPost(currentPost || null);
    
    // If post found, find related posts from the same category
    if (currentPost) {
      const related = allPosts
        .filter(p => p.category === currentPost.category && p.slug !== currentPost.slug)
        .slice(0, 3);
      setRelatedPosts(related);
      
      // Scroll to top when post loads
      window.scrollTo(0, 0);
    }
  }, [slug]);
  
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "ChartPulse Blog Post";
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast("Link copied to clipboard");
        break;
      default:
        break;
    }
  };
  
  if (!post) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <Badge className="mb-4">{post.category}</Badge>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>ChartPulse Team</span>
            </div>
          </div>
          
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-[300px] md:h-[400px] object-cover rounded-lg mb-8" 
          />
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-primary" />
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-secondary/30">{tag}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5" 
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5" 
                onClick={() => handleShare('linkedin')}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1.5" 
                onClick={() => handleShare('copy')}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator className="mb-8" />
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg mb-6">
              {post.description}
            </p>
            
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <>
                <h2>Introduction</h2>
                <p>
                  In the dynamic world of financial markets, understanding key concepts and strategies is crucial for successful trading. This article provides a detailed exploration of {post.title.toLowerCase()}, offering valuable insights for both beginners and experienced traders.
                </p>
                
                <h2>Why This Matters</h2>
                <p>
                  Whether you're just starting out or looking to refine your approach, mastering these fundamentals can significantly improve your trading performance and help you make more informed decisions in the market.
                </p>
                
                <h2>Key Concepts</h2>
                <ul>
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <strong>{tag.charAt(0).toUpperCase() + tag.slice(1)}</strong>: An essential element for understanding market dynamics and making profitable trades.
                    </li>
                  ))}
                </ul>
                
                <h2>Implementation Strategy</h2>
                <p>
                  To effectively implement these concepts in your trading:
                </p>
                <ol>
                  <li>Begin with thorough research and analysis</li>
                  <li>Develop a consistent methodology</li>
                  <li>Practice with paper trading before risking real capital</li>
                  <li>Keep detailed records of your trades to identify patterns</li>
                  <li>Continuously refine your approach based on results</li>
                </ol>
                
                <h2>Common Mistakes to Avoid</h2>
                <p>
                  Many traders fall into these common traps:
                </p>
                <ul>
                  <li>Overtrading based on emotions rather than analysis</li>
                  <li>Ignoring risk management principles</li>
                  <li>Failing to adapt to changing market conditions</li>
                  <li>Overcomplicating strategies with too many indicators</li>
                </ul>
                
                <h2>Conclusion</h2>
                <p>
                  Mastering {post.title.toLowerCase()} requires practice, patience, and continuous learning. By understanding these fundamental concepts and implementing them consistently in your trading strategy, you'll be better positioned to navigate market fluctuations and achieve your financial goals.
                </p>
              </>
            )}
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="gap-1.5">
                <ThumbsUp className="h-4 w-4" />
                Like
              </Button>
              <Button variant="outline" className="gap-1.5">
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
            </div>
            
            <Button variant="outline" className="gap-1.5">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          
          <Separator className="mb-8" />
          
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-6">Leave a Comment</h3>
            <div className="flex gap-4 items-start">
              <img 
                src="https://ui-avatars.com/api/?name=Guest&background=random" 
                alt="Guest" 
                className="w-10 h-10 rounded-full" 
              />
              <div className="flex-1">
                <textarea 
                  placeholder="Share your thoughts..." 
                  className="w-full p-3 rounded-md bg-secondary/30 border border-primary/10 focus:border-primary/40 focus:outline-none min-h-32"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <Button className="gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {relatedPosts.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6">Related Articles</h3>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <Link 
                    to={`/blog/${relatedPost.slug}`} 
                    key={relatedPost.slug}
                    className="transition-all duration-300 hover:scale-[1.02]"
                  >
                    <Card className="h-full glass-card border-secondary/30 hover:border-primary/30 transition-all overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <img 
                          src={relatedPost.image} 
                          alt={relatedPost.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-bold line-clamp-2 mb-2">{relatedPost.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
