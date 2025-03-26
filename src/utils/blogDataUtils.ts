
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
        // Skip trying to import the corrupted blogPosts.ts file altogether
        // and use fallback posts directly
        console.log("Using fallback blog posts data instead of attempting to load the corrupted file");
        const fallbackPosts = generateFallbackPosts();
        setAllPosts(fallbackPosts);
        
        toast({
          title: "Using fallback blog data",
          description: "The blog data source is currently unavailable",
          variant: "warning"
        });
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

// Expanded fallback blog posts to provide a richer user experience
const generateFallbackPosts = (): BlogPost[] => {
  return [
    {
      title: "Understanding Technical Analysis Basics",
      description: "Learn the fundamentals of technical analysis for trading markets effectively.",
      slug: "1-technical-analysis-basics",
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
      slug: "2-risk-management-strategies",
      date: new Date().toISOString(),
      readingTime: "7 min read",
      category: "Trading Strategies",
      tags: ["risk management", "stop-loss", "position sizing"],
      image: "https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop",
      content: "Risk management is arguably the most important aspect of successful trading. Without proper risk controls, even the best trading strategy will eventually fail.\n\n### The 1% Rule\n\nOne of the most common risk management techniques is the 1% rule, which states that you should never risk more than 1% of your total trading capital on a single trade. This ensures that a string of losses won't significantly deplete your account.\n\n### Effective Stop-Loss Placement\n\nA stop-loss order is a predetermined price level at which you'll exit a losing trade. Place stop-losses based on technical levels rather than arbitrary dollar amounts. Consider using volatility-based stops that adapt to changing market conditions.\n\n### Position Sizing Formula\n\nUse this formula to calculate the appropriate position size:\n\nPosition Size = (Account Risk Amount) ÷ (Trade Risk)\n\nWhere Account Risk Amount is the dollar amount you're willing to risk (e.g., 1% of your account), and Trade Risk is the difference between your entry price and stop-loss price.",
      author: "Risk Management Expert"
    },
    {
      title: "Introduction to Candlestick Patterns",
      description: "Master the art of reading Japanese candlestick patterns for better trade entries and exits.",
      slug: "3-candlestick-patterns-intro",
      date: new Date().toISOString(),
      readingTime: "6 min read",
      category: "Technical Analysis",
      tags: ["candlesticks", "chart patterns", "price action"],
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2070&auto=format&fit=crop",
      content: "Japanese candlestick patterns offer valuable insights into market sentiment and potential price reversals. These patterns have been used for centuries and remain relevant in modern trading.\n\n### The Anatomy of a Candlestick\n\nEach candlestick represents a specific time period and shows four key price points: open, close, high, and low. A bullish candle (usually green or white) indicates the close was higher than the open, while a bearish candle (usually red or black) shows the close was lower than the open.\n\n### Common Reversal Patterns\n\n- **Doji**: When open and close are virtually equal, suggesting indecision\n- **Hammer**: A bullish reversal pattern with a small body and long lower shadow\n- **Shooting Star**: A bearish reversal pattern with a small body and long upper shadow\n- **Engulfing Pattern**: When a candle completely engulfs the previous candle, signaling a potential trend change",
      author: "ChartPulse Team"
    },
    {
      title: "Fibonacci Retracement Trading Strategy",
      description: "How to use Fibonacci levels to identify potential support and resistance zones.",
      slug: "4-fibonacci-trading-strategy",
      date: new Date().toISOString(),
      readingTime: "8 min read",
      category: "Trading Strategies",
      tags: ["fibonacci", "retracement", "support and resistance"],
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2070&auto=format&fit=crop",
      content: "Fibonacci retracement levels help traders identify potential support and resistance areas based on the mathematical Fibonacci sequence. These levels are derived from the golden ratio (1.618) and its related ratios.\n\n### Key Fibonacci Levels\n\nThe most commonly used Fibonacci retracement levels are 23.6%, 38.2%, 50%, 61.8%, and 78.6%. The 50% level isn't actually a Fibonacci ratio but is widely used due to its significance in Dow Theory.\n\n### How to Apply Fibonacci Retracements\n\n1. Identify a clear trend\n2. For an uptrend: Draw the Fibonacci tool from the significant low to the significant high\n3. For a downtrend: Draw the Fibonacci tool from the significant high to the significant low\n4. Watch for price reactions at the retracement levels\n\n### Combining with Other Indicators\n\nFibonacci levels become more powerful when confirmed by other technical indicators. Look for confluence with moving averages, RSI, or key chart patterns to increase the probability of successful trades.",
      author: "Fibonacci Expert"
    },
    {
      title: "Crypto Market Cycles Explained",
      description: "Understanding the four phases of cryptocurrency market cycles to time your investments better.",
      slug: "5-crypto-market-cycles",
      date: new Date().toISOString(),
      readingTime: "9 min read",
      category: "Crypto",
      tags: ["bitcoin", "market cycles", "investment timing"],
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2070&auto=format&fit=crop",
      content: "Cryptocurrency markets tend to move in cycles, similar to traditional markets but often with more extreme price swings. Understanding these cycles can help you make better investment decisions.\n\n### The Four Phases of Market Cycles\n\n1. **Accumulation Phase**: Smart money begins buying while prices are still low and market sentiment is negative\n2. **Mark-Up Phase**: Prices begin rising steadily as more investors recognize the trend\n3. **Distribution Phase**: Smart money begins selling to late entrants as euphoria takes hold\n4. **Mark-Down Phase**: Prices decline as selling pressure increases, often ending in capitulation\n\n### Identifying the Current Cycle Phase\n\nLook at a combination of price action, volume, social media sentiment, and on-chain metrics. For Bitcoin specifically, the halving events (approximately every four years) have historically influenced market cycles.\n\n### Dollar-Cost Averaging Strategy\n\nGiven the difficulty of timing market tops and bottoms perfectly, many investors use dollar-cost averaging to build positions across different cycle phases, reducing the impact of volatility on their overall entry price.",
      author: "Crypto Analyst"
    },
    {
      title: "Understanding Moving Average Convergence Divergence (MACD)",
      description: "How to effectively use the MACD indicator for momentum trading and trend confirmation.",
      slug: "6-understanding-macd",
      date: new Date().toISOString(),
      readingTime: "5 min read",
      category: "Technical Analysis",
      tags: ["indicators", "momentum", "trend trading"],
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=2070&auto=format&fit=crop",
      content: "The Moving Average Convergence Divergence (MACD) is a versatile indicator that helps traders identify changes in momentum, direction, and strength of a price trend.\n\n### Components of the MACD\n\n- **MACD Line**: The difference between the 12-period and 26-period Exponential Moving Averages (EMAs)\n- **Signal Line**: A 9-period EMA of the MACD Line\n- **Histogram**: The difference between the MACD Line and Signal Line\n\n### Common MACD Trading Signals\n\n1. **MACD Crossovers**: When the MACD Line crosses above the Signal Line (bullish) or below it (bearish)\n2. **Zero Line Crossovers**: When the MACD Line crosses above zero (bullish) or below zero (bearish)\n3. **Divergences**: When the price makes a new high/low but the MACD doesn't confirm it, suggesting a potential reversal\n\n### Optimizing MACD Settings\n\nThe standard settings (12, 26, 9) work well for daily charts, but you may want to adjust them for different timeframes. Shorter settings can provide more signals but with more noise, while longer settings offer fewer but potentially more reliable signals.",
      author: "Technical Analyst"
    },
    {
      title: "Forex Fundamentals: How to Analyze Currency Pairs",
      description: "Essential factors to consider when evaluating and trading foreign exchange markets.",
      slug: "7-forex-fundamentals",
      date: new Date().toISOString(),
      readingTime: "7 min read",
      category: "Forex",
      tags: ["currency pairs", "fundamental analysis", "central banks"],
      image: "https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=2070&auto=format&fit=crop",
      content: "Forex trading requires understanding both technical and fundamental factors that influence currency values. Unlike stocks, currencies are always traded in pairs, representing the relative value of one currency against another.\n\n### Key Fundamental Factors\n\n1. **Interest Rate Differentials**: Higher interest rates typically attract foreign capital, strengthening a currency\n2. **Economic Indicators**: GDP growth, employment figures, inflation, and manufacturing data impact currency valuation\n3. **Central Bank Policies**: Monetary policy decisions and forward guidance significantly influence currency trends\n4. **Political Stability**: Elections, geopolitical tensions, and policy changes can create volatility\n\n### Major Currency Pairs\n\nThe most traded currency pairs involve the US Dollar (USD) paired with the Euro (EUR), Japanese Yen (JPY), British Pound (GBP), and Swiss Franc (CHF). These \"majors\" typically have the tightest spreads and highest liquidity.\n\n### Using an Economic Calendar\n\nSuccessful forex traders regularly monitor economic calendars to stay informed about upcoming events that might impact currency prices. Pay special attention to events marked as high-impact, particularly interest rate decisions and employment reports.",
      author: "Forex Specialist"
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

