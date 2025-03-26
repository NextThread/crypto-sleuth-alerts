import { useEffect, useState } from 'react';

// Blog post type definition
export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  description: string;
  content?: string;
  date: string;
  category?: string;
  tags?: string[];
  image?: string;
  author?: string;
  readingTime?: string;
}

// Fallback blog posts with new Fundamental Analysis posts
const fallbackPosts: BlogPost[] = [
  {
    slug: "1-technical-analysis-basics",
    title: "The Ultimate Guide to Technical Analysis for Beginners",
    description: "Learn the fundamentals of technical analysis and how to apply chart patterns to improve your trading decisions.",
    date: "2023-07-15",
    category: "Technical Analysis",
    tags: ["Beginner", "Chart Patterns", "Indicators"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    author: "Alex Thompson",
    readingTime: "8 min read",
    content: `Technical analysis content...`
  },
  
  // New Fundamental Analysis Posts
  {
    slug: "10-fundamental-analysis-for-long-term-investors",
    title: "Fundamental Analysis: The Cornerstone of Long-Term Investment Success",
    description: "Discover how fundamental analysis can help you identify undervalued companies and build a robust long-term investment portfolio.",
    date: "2023-09-05",
    category: "Fundamental Analysis",
    tags: ["Long-Term Investing", "Financial Statements", "Valuation Metrics"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
    author: "Sarah Maxwell",
    readingTime: "12 min read",
    content: `Fundamental analysis content...`
  },
  {
    slug: "11-financial-statement-analysis-investors-guide",
    title: "Financial Statement Analysis: The Investor's Complete Guide",
    description: "Master the art of analyzing income statements, balance sheets, and cash flow statements to make informed investment decisions.",
    date: "2023-10-10",
    category: "Fundamental Analysis",
    tags: ["Financial Statements", "Ratio Analysis", "Investment Research"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
    author: "Michael Chen",
    readingTime: "15 min read",
    content: `Financial statement analysis content...`
  },
  {
    slug: "12-valuation-metrics-market-analysis",
    title: "Mastering Valuation Metrics for Effective Market Analysis",
    description: "Explore essential valuation metrics from P/E ratios to DCF models that help determine whether a stock is undervalued or overpriced.",
    date: "2023-11-15",
    category: "Fundamental Analysis",
    tags: ["Valuation", "Investment Analysis", "Stock Selection"],
    image: "https://images.unsplash.com/photo-1590283603385-c1e84d7c3ccd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
    author: "Daniel Rodriguez",
    readingTime: "10 min read",
    content: `Valuation metrics content...`
  },
  {
    slug: "13-economic-indicators-market-impact",
    title: "Economic Indicators and Their Impact on Financial Markets",
    description: "Learn how key economic indicators like GDP, employment figures, and inflation rates influence various asset classes and market trends.",
    date: "2023-12-20",
    category: "Fundamental Analysis",
    tags: ["Economic Indicators", "Market Analysis", "Macroeconomics"],
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
    author: "Elizabeth Warren",
    readingTime: "11 min read",
    content: `Economic indicators content...`
  },
  {
    slug: "14-company-analysis-framework",
    title: "Building a Comprehensive Company Analysis Framework",
    description: "A step-by-step approach to analyzing companies using both quantitative metrics and qualitative factors for superior investment decisions.",
    date: "2024-01-25",
    category: "Fundamental Analysis",
    tags: ["Company Analysis", "Investment Research", "Competitive Analysis"],
    image: "https://images.unsplash.com/photo-1553484771-11998c592b9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
    author: "James Peterson",
    readingTime: "14 min read",
    content: `Company analysis framework content...`
  },
];

// Get blog posts from data file or use fallback
export const useSafeBlogData = () => {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      // Use the fallback posts directly since the original data file is problematic
      setAllPosts(fallbackPosts);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setHasError(true);
      setAllPosts(fallbackPosts);
      setIsLoaded(true);
    }
  }, []);

  return {
    allPosts,
    isLoaded,
    hasError
  };
};

// Function to find a specific post by slug
export const usePostBySlug = (slug: string) => {
  const { allPosts, isLoaded, hasError } = useSafeBlogData();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const foundPost = allPosts.find(p => p.slug === slug) || null;
      setPost(foundPost);
      setLoading(false);
      if (!foundPost) {
        setError(true);
      }
    } else if (hasError) {
      setError(true);
      setLoading(false);
    }
  }, [slug, allPosts, isLoaded, hasError]);

  return { post, loading, error };
};

// Function to get related posts
export const getRelatedPosts = (currentPost: BlogPost, allPosts: BlogPost[], count: number = 3): BlogPost[] => {
  if (!currentPost || !currentPost.category || allPosts.length === 0) {
    return [];
  }

  // Filter out the current post and get posts with the same category
  const sameCategoryPosts = allPosts.filter(post => 
    post.slug !== currentPost.slug && 
    post.category === currentPost.category
  );

  // If we have enough posts with the same category, return them
  if (sameCategoryPosts.length >= count) {
    return sameCategoryPosts.slice(0, count);
  }

  // Otherwise, add posts with matching tags
  let relatedPosts = [...sameCategoryPosts];
  
  // Get posts that share at least one tag with the current post
  if (currentPost.tags && currentPost.tags.length > 0) {
    const postsWithMatchingTags = allPosts.filter(post => 
      post.slug !== currentPost.slug && 
      !relatedPosts.some(p => p.slug === post.slug) && // Not already in our related posts
      post.tags && 
      post.tags.some(tag => currentPost.tags!.includes(tag))
    );
    
    relatedPosts = [...relatedPosts, ...postsWithMatchingTags];
  }
  
  // If we still don't have enough, add other random posts
  if (relatedPosts.length < count) {
    const remainingPosts = allPosts.filter(post => 
      post.slug !== currentPost.slug && 
      !relatedPosts.some(p => p.slug === post.slug)
    );
    
    relatedPosts = [...relatedPosts, ...remainingPosts];
  }
  
  return relatedPosts.slice(0, count);
};

// Function to ensure images are valid, with fallbacks for broken images
export const ensureValidImage = (imageUrl: string | undefined, index: number): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    // Fallback images when no image is provided
    const fallbackImages = [
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1590283603385-c1e84d7c3ccd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
      'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
      'https://images.unsplash.com/photo-1553484771-11998c592b9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
      'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80',
      'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'
    ];
    
    const fallbackIndex = index % fallbackImages.length;
    return fallbackImages[fallbackIndex];
  }
  
  return imageUrl;
};
