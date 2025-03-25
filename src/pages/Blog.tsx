import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Clock, Eye, ScrollText, Tag } from "lucide-react";

const Blog = () => {
  const { hash } = useLocation();
  
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold">ChartPulse Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover insights, strategies, and technical analysis to improve your trading decisions.
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-4">
            <TabsList className="bg-secondary/40">
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
              <TabsTrigger value="fundamental">Fundamental Analysis</TabsTrigger>
              <TabsTrigger value="strategies">Trading Strategies</TabsTrigger>
              <TabsTrigger value="crypto">Crypto & Forex</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-8">
            <BlogSection 
              title="Technical Analysis" 
              description="Learn about chart patterns, indicators, and techniques to analyze price movements."
              id="technical"
              posts={technicalAnalysisPosts}
            />
            
            <BlogSection 
              title="Fundamental Analysis" 
              description="Discover how to evaluate assets based on financial data and economic indicators."
              id="fundamental"
              posts={fundamentalAnalysisPosts}
            />
            
            <BlogSection 
              title="Trading Strategies & Psychology" 
              description="Explore different trading approaches and the mental aspects of successful trading."
              id="strategies"
              posts={tradingStrategyPosts}
            />
            
            <BlogSection 
              title="Crypto & Forex Trading" 
              description="Specialized insights for cryptocurrency and foreign exchange markets."
              id="crypto"
              posts={cryptoForexPosts}
            />
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-8">
            <BlogSection 
              title="Technical Analysis" 
              description="Learn about chart patterns, indicators, and techniques to analyze price movements."
              id="technical"
              posts={technicalAnalysisPosts}
              showViewAll={false}
            />
          </TabsContent>
          
          <TabsContent value="fundamental" className="space-y-8">
            <BlogSection 
              title="Fundamental Analysis" 
              description="Discover how to evaluate assets based on financial data and economic indicators."
              id="fundamental"
              posts={fundamentalAnalysisPosts}
              showViewAll={false}
            />
          </TabsContent>
          
          <TabsContent value="strategies" className="space-y-8">
            <BlogSection 
              title="Trading Strategies & Psychology" 
              description="Explore different trading approaches and the mental aspects of successful trading."
              id="strategies"
              posts={tradingStrategyPosts}
              showViewAll={false}
            />
          </TabsContent>
          
          <TabsContent value="crypto" className="space-y-8">
            <BlogSection 
              title="Crypto & Forex Trading" 
              description="Specialized insights for cryptocurrency and foreign exchange markets."
              id="crypto"
              posts={cryptoForexPosts}
              showViewAll={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface BlogSectionProps {
  title: string;
  description: string;
  id: string;
  posts: BlogPost[];
  showViewAll?: boolean;
}

const BlogSection = ({ title, description, id, posts, showViewAll = true }: BlogSectionProps) => {
  return (
    <section id={id} className="space-y-6 scroll-mt-24">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {title}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {showViewAll && (
          <Link to={`/blog#${id}`}>
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        )}
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};

interface BlogPost {
  title: string;
  description: string;
  slug: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  image: string;
}

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  return (
    <Link to={`/blog/${post.slug}`} className="transition-all duration-300 hover:scale-[1.02]">
      <Card className="h-full glass-card border-secondary/30 hover:border-primary/30 transition-all overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          <Badge className="absolute top-4 right-4 bg-secondary/80 backdrop-blur-md">
            {post.category}
          </Badge>
        </div>
        <CardHeader className="space-y-1">
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3" />
            <span>{post.readingTime}</span>
            <span className="text-muted-foreground/40">•</span>
            <span>{post.date}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">
            {post.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-secondary/30 py-3 px-6">
          <div className="flex items-center gap-1.5 text-xs">
            <Tag className="h-3 w-3 text-primary" />
            <div className="flex gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-muted-foreground">{tag}</span>
              ))}
              {post.tags.length > 2 && <span className="text-muted-foreground">+{post.tags.length - 2}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {Math.floor(Math.random() * 500) + 100}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Bookmark className="h-3 w-3" />
              {Math.floor(Math.random() * 50) + 5}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

const technicalAnalysisPosts: BlogPost[] = [
  {
    title: "Support & Resistance Levels: How to Identify & Use Them Effectively",
    description: "Learn how to identify and utilize support and resistance levels to make better trading decisions. These price levels can act as barriers, preventing an asset's price from moving in a certain direction.",
    slug: "support-resistance-levels",
    date: "May 23, 2023",
    readingTime: "8 min read",
    category: "Technical Analysis",
    tags: ["support", "resistance", "price action", "trading"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Top 5 Candlestick Patterns Every Trader Should Know",
    description: "Discover the most important candlestick patterns that can help you predict potential price reversals and continuation patterns in the market with higher accuracy.",
    slug: "candlestick-patterns",
    date: "Jun 12, 2023",
    readingTime: "10 min read",
    category: "Technical Analysis",
    tags: ["candlesticks", "patterns", "trading", "price action"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Breakouts vs. Fakeouts: How to Avoid Traps in Trading",
    description: "Learn to distinguish between genuine breakouts and false breakouts (fakeouts) that can lead to significant losses. Develop the skills to identify true market movements.",
    slug: "breakouts-vs-fakeouts",
    date: "Jul 5, 2023",
    readingTime: "7 min read",
    category: "Technical Analysis",
    tags: ["breakouts", "fakeouts", "trading", "risk management"],
    image: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Moving Averages (SMA vs. EMA): How to Use Them for Trend Analysis",
    description: "Explore the differences between Simple Moving Averages (SMA) and Exponential Moving Averages (EMA) and how to apply them effectively in your trading strategy for trend identification.",
    slug: "moving-averages-sma-ema",
    date: "Aug 18, 2023",
    readingTime: "9 min read",
    category: "Technical Analysis",
    tags: ["moving averages", "SMA", "EMA", "trend analysis"],
    image: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "RSI & MACD Indicators: A Beginner's Guide to Momentum Trading",
    description: "A comprehensive introduction to two of the most powerful momentum indicators: Relative Strength Index (RSI) and Moving Average Convergence Divergence (MACD).",
    slug: "rsi-macd-beginners-guide",
    date: "Sep 2, 2023",
    readingTime: "11 min read",
    category: "Technical Analysis",
    tags: ["RSI", "MACD", "momentum", "indicators"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop"
  }
];

const fundamentalAnalysisPosts: BlogPost[] = [
  {
    title: "P/E Ratio, EPS & Other Key Metrics: How to Analyze a Stock",
    description: "Learn about the essential financial metrics used to evaluate stocks, including Price-to-Earnings (P/E) ratio, Earnings Per Share (EPS), and more.",
    slug: "key-stock-metrics",
    date: "May 10, 2023",
    readingTime: "9 min read",
    category: "Fundamental Analysis",
    tags: ["P/E ratio", "EPS", "stocks", "investing"],
    image: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "How to Read a Company's Balance Sheet for Investment Decisions",
    description: "A comprehensive guide to understanding and analyzing a company's balance sheet to make informed investment decisions and spot potential red flags.",
    slug: "reading-balance-sheets",
    date: "Jun 5, 2023",
    readingTime: "12 min read",
    category: "Fundamental Analysis",
    tags: ["balance sheet", "financial statements", "investing", "financial analysis"],
    image: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=1770&auto=format&fit=crop"
  },
  {
    title: "How Economic Indicators Affect the Stock Market (GDP, Inflation, etc.)",
    description: "Discover the relationship between key economic indicators such as GDP, inflation, unemployment rates, and their impact on stock market performance.",
    slug: "economic-indicators-stock-market",
    date: "Jul 22, 2023",
    readingTime: "10 min read",
    category: "Fundamental Analysis",
    tags: ["GDP", "inflation", "economic indicators", "stock market"],
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Impact of Interest Rate Changes on Stock Prices & Market Trends",
    description: "A detailed analysis of how changes in interest rates by central banks affect different sectors of the stock market and overall market trends.",
    slug: "interest-rates-stock-market",
    date: "Aug 14, 2023",
    readingTime: "8 min read",
    category: "Fundamental Analysis",
    tags: ["interest rates", "central banks", "market trends", "sector analysis"],
    image: "https://images.unsplash.com/photo-1626266061368-46a8632bac35?q=80&w=1974&auto=format&fit=crop"
  }
];

const tradingStrategyPosts: BlogPost[] = [
  {
    title: "Risk Management: Stop-Loss, Take-Profit & Position Sizing",
    description: "Learn the essential risk management techniques every trader should implement, including proper stop-loss placement, take-profit targets, and position sizing.",
    slug: "risk-management-trading",
    date: "May 5, 2023",
    readingTime: "9 min read",
    category: "Trading Strategies",
    tags: ["risk management", "stop-loss", "position sizing", "trading"],
    image: "https://images.unsplash.com/photo-1634704784915-aacf363b021f?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Scalping vs. Swing Trading vs. Investing: Which One Suits You?",
    description: "Compare different trading timeframes and strategies to determine which approach best matches your personality, lifestyle, and financial goals.",
    slug: "trading-timeframes-comparison",
    date: "Jun 20, 2023",
    readingTime: "11 min read",
    category: "Trading Strategies",
    tags: ["scalping", "swing trading", "investing", "trading styles"],
    image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Trading Psychology: Controlling Emotions & Avoiding Impulsive Trades",
    description: "Explore the psychological aspects of trading and learn techniques to manage emotions like fear and greed that often lead to poor trading decisions.",
    slug: "trading-psychology",
    date: "Jul 15, 2023",
    readingTime: "10 min read",
    category: "Trading Strategies",
    tags: ["psychology", "emotions", "discipline", "mindset"],
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
  }
];

const cryptoForexPosts: BlogPost[] = [
  {
    title: "Bitcoin & Ethereum: How to Perform Technical Analysis on Crypto",
    description: "Learn the unique aspects of applying technical analysis to cryptocurrencies like Bitcoin and Ethereum, considering their 24/7 market and high volatility.",
    slug: "crypto-technical-analysis",
    date: "May 28, 2023",
    readingTime: "10 min read",
    category: "Crypto Trading",
    tags: ["Bitcoin", "Ethereum", "cryptocurrency", "technical analysis"],
    image: "https://images.unsplash.com/photo-1629339942248-45d4b10faed3?q=80&w=1932&auto=format&fit=crop"
  },
  {
    title: "Forex Trading Basics: Best Currency Pairs & Key Indicators",
    description: "A beginner's guide to forex trading, covering the most traded currency pairs, important technical indicators, and fundamental factors affecting forex markets.",
    slug: "forex-trading-basics",
    date: "Jun 8, 2023",
    readingTime: "12 min read",
    category: "Forex Trading",
    tags: ["forex", "currency pairs", "indicators", "trading"],
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop"
  }
];

export default Blog;

const getFallbackImage = (index: number) => {
  const fallbackImages = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
  ];
  
  return fallbackImages[index % fallbackImages.length];
};

export const ensureValidImage = (imageUrl: string | undefined, index: number) => {
  if (!imageUrl || imageUrl.trim() === '' || imageUrl.includes('undefined')) {
    return getFallbackImage(index);
  }
  return imageUrl;
};
