
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define interface for blog post data
export interface BlogPost {
  title?: string;
  description?: string;
  slug?: string;
  date?: string | Date;
  readingTime?: string;
  category?: string;
  tags?: string[];
  image?: string;
  content?: string;
  author?: string;
}

// Safe utility for loading blog posts
export const useSafeBlogData = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        // Create a dummy array as fallback in case of import failure
        let posts: BlogPost[] = [];
        
        try {
          // Try to import blog posts directly
          const importedModule = await import('../data/blogPosts');
          
          // Extract arrays from different categories, handling potential undefined values
          const extractArrays = (obj: any): BlogPost[] => {
            let result: BlogPost[] = [];
            if (!obj || typeof obj !== 'object') return result;
            
            // Look for arrays in the object
            Object.keys(obj).forEach(key => {
              if (Array.isArray(obj[key])) {
                result = [...result, ...obj[key]];
              }
            });
            
            return result;
          };
          
          // Extract blog posts from imported module
          posts = extractArrays(importedModule);
          
          console.log(`Found ${posts.length} posts in blog data`);
        } catch (importError) {
          console.error("Error importing blog data:", importError);
          // Generate static fallback data if import fails
          posts = generateFallbackPosts();
          toast({
            title: "Warning: Using fallback blog data",
            description: "The blog data couldn't be loaded correctly",
            variant: "destructive"
          });
        }
        
        // Filter and validate posts
        const validatedPosts = posts
          .filter(Boolean)
          .filter(post => {
            // Basic validation for post structure
            return (
              post && 
              typeof post === 'object' && 
              typeof post.slug === 'string' && 
              post.slug.trim() !== ''
            );
          })
          .map(post => ({
            // Ensure all fields have valid defaults
            title: sanitizeString(post.title) || "Untitled Post",
            description: sanitizeString(post.description) || "No description available",
            slug: sanitizeString(post.slug) || generateRandomId(),
            date: post.date || new Date(),
            readingTime: sanitizeString(post.readingTime) || "5 min read",
            category: sanitizeString(post.category) || "Uncategorized",
            tags: Array.isArray(post.tags) ? post.tags.filter(tag => typeof tag === 'string') : [],
            image: sanitizeString(post.image) || "",
            content: sanitizeString(post.content) || "",
            author: sanitizeString(post.author) || "ChartPulse Team"
          }));

        setAllPosts(validatedPosts);
        
        if (validatedPosts.length === 0) {
          setAllPosts(generateFallbackPosts());
          toast({
            title: "No valid blog posts found",
            description: "Using fallback blog data instead",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error processing blog data:", error);
        setLoadError((error as Error).message || "Failed to load blog data");
        setAllPosts(generateFallbackPosts());
        toast({
          title: "Error loading blog posts",
          description: "Using fallback data instead",
          variant: "destructive"
        });
      } finally {
        setIsLoaded(true);
      }
    };

    loadBlogData();
  }, [toast]);

  return { allPosts, isLoaded, loadError };
};

// Helper function to sanitize strings and prevent errors
const sanitizeString = (value: any): string => {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  try {
    return String(value).trim();
  } catch (e) {
    return '';
  }
};

// Generate a random ID for posts without slugs
const generateRandomId = (): string => {
  return `post-${Math.floor(Math.random() * 10000)}`;
};

// Fallback blog posts in case data loading fails
const generateFallbackPosts = (): BlogPost[] => {
  return [
    {
      title: "Understanding Technical Analysis Basics",
      description: "Learn the fundamentals of technical analysis for trading markets effectively.",
      slug: "technical-analysis-basics",
      date: new Date().toISOString(),
      readingTime: "5 min read",
      category: "Technical Analysis",
      tags: ["beginners", "indicators", "charts"],
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
      content: "Technical analysis is the study of price movements and patterns on charts to predict future market behavior. This approach is based on the premise that history tends to repeat itself and that market psychology often manifests in predictable patterns.\n\n### Key Principles of Technical Analysis\n\nTechnical analysis relies on a few core principles:\n\n- **Markets discount everything**: All known information is already reflected in the price.\n- **Price moves in trends**: Markets tend to continue in the same direction once a trend is established.\n- **History repeats itself**: Chart patterns tend to recur, reflecting market psychology.\n\n### Getting Started with Chart Analysis\n\nBegin by learning to read candlestick charts and identifying basic patterns. Look for support and resistance levels where prices tend to reverse. Start with simple indicators like moving averages before advancing to more complex tools.",
      author: "ChartPulse Team"
    },
    {
      title: "Risk Management Strategies for Traders",
      description: "Discover essential risk management techniques to protect your trading capital.",
      slug: "risk-management-strategies",
      date: new Date().toISOString(),
      readingTime: "7 min read",
      category: "Trading Strategies",
      tags: ["risk management", "stop-loss", "position sizing"],
      image: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop",
      content: "Risk management is arguably the most important aspect of successful trading. Without proper risk controls, even the best trading strategy will eventually fail.\n\n### The 1% Rule\n\nOne of the most common risk management techniques is the 1% rule, which states that you should never risk more than 1% of your total trading capital on a single trade. This ensures that a string of losses won't significantly deplete your account.\n\n### Effective Stop-Loss Placement\n\nA stop-loss order is a predetermined price level at which you'll exit a losing trade. Place stop-losses based on technical levels rather than arbitrary dollar amounts. Consider using volatility-based stops that adapt to changing market conditions.\n\n### Position Sizing Formula\n\nUse this formula to calculate the appropriate position size:\n\nPosition Size = (Account Risk Amount) ÷ (Trade Risk)\n\nWhere Account Risk Amount is the dollar amount you're willing to risk (e.g., 1% of your account), and Trade Risk is the difference between your entry price and stop-loss price.",
      author: "Risk Management Expert"
    }
  ];
};

// Safe image handling function
export const ensureValidImage = (imageUrl: string | undefined, index: number) => {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    "https://images.unsplash.com/photo-1642790551116-18e150f248e5",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    "https://images.unsplash.com/photo-1560472355-536de3962603",
    "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c"
  ];
  
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '' || imageUrl.includes('undefined')) {
    return fallbackImages[Math.abs(index) % fallbackImages.length];
  }
  
  return imageUrl;
};

// Safe date formatting
export const formatDate = (dateString: string | Date | undefined) => {
  try {
    if (!dateString) {
      return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch (error) {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
};
