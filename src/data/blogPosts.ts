import { ensureValidImage } from '../pages/Blog';

export interface BlogPost {
  title: string;
  description: string;
  slug: string;
  date: string;
  readingTime: string;
  category: string;
  tags: string[];
  image: string;
  content?: string; // Optional HTML content
}

export const technicalAnalysisPosts: BlogPost[] = [
  {
    title: "Support & Resistance Levels: How to Identify & Use Them Effectively",
    description: "Learn how to identify and utilize support and resistance levels to make better trading decisions. These price levels can act as barriers, preventing an asset's price from moving in a certain direction.",
    slug: "support-resistance-levels",
    date: "May 23, 2023",
    readingTime: "8 min read",
    category: "Technical Analysis",
    tags: ["support", "resistance", "price action", "trading"],
    image: ensureValidImage("https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop", 0)
  },
  {
    title: "Top 5 Candlestick Patterns Every Trader Should Know",
    description: "Discover the most important candlestick patterns that can help you predict potential price reversals and continuation patterns in the market with higher accuracy.",
    slug: "candlestick-patterns",
    date: "Jun 12, 2023",
    readingTime: "10 min read",
    category: "Technical Analysis",
    tags: ["candlesticks", "patterns", "trading", "price action"],
    image: ensureValidImage("https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop", 1)
  },
  {
    title: "Breakouts vs. Fakeouts: How to Avoid Traps in Trading",
    description: "Learn to distinguish between genuine breakouts and false breakouts (fakeouts) that can lead to significant losses. Develop the skills to identify true market movements.",
    slug: "breakouts-vs-fakeouts",
    date: "Jul 5, 2023",
    readingTime: "7 min read",
    category: "Technical Analysis",
    tags: ["breakouts", "fakeouts", "trading", "risk management"],
    image: ensureValidImage("https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop", 2)
  },
  {
    title: "Moving Averages (SMA vs. EMA): How to Use Them for Trend Analysis",
    description: "Explore the differences between Simple Moving Averages (SMA) and Exponential Moving Averages (EMA) and how to apply them effectively in your trading strategy for trend identification.",
    slug: "moving-averages-sma-ema",
    date: "Aug 18, 2023",
    readingTime: "9 min read",
    category: "Technical Analysis",
    tags: ["moving averages", "SMA", "EMA", "trend analysis"],
    image: ensureValidImage("https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop", 3)
  },
  {
    title: "RSI & MACD Indicators: A Beginner's Guide to Momentum Trading",
    description: "A comprehensive introduction to two of the most powerful momentum indicators: Relative Strength Index (RSI) and Moving Average Convergence Divergence (MACD).",
    slug: "rsi-macd-beginners-guide",
    date: "Sep 2, 2023",
    readingTime: "11 min read",
    category: "Technical Analysis",
    tags: ["RSI", "MACD", "momentum", "indicators"],
    image: ensureValidImage("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop", 4)
  }
];

export const fundamentalAnalysisPosts: BlogPost[] = [
  {
    title: "P/E Ratio, EPS & Other Key Metrics: How to Analyze a Stock",
    description: "Learn about the essential financial metrics used to evaluate stocks, including Price-to-Earnings (P/E) ratio, Earnings Per Share (EPS), and more.",
    slug: "key-stock-metrics",
    date: "May 10, 2023",
    readingTime: "9 min read",
    category: "Fundamental Analysis",
    tags: ["P/E ratio", "EPS", "stocks", "investing"],
    image: ensureValidImage("https://images.unsplash.com/photo-1642790551116-18e150f248e5?q=80&w=2070&auto=format&fit=crop", 5)
  },
  {
    title: "How to Read a Company's Balance Sheet for Investment Decisions",
    description: "A comprehensive guide to understanding and analyzing a company's balance sheet to make informed investment decisions and spot potential red flags.",
    slug: "reading-balance-sheets",
    date: "Jun 5, 2023",
    readingTime: "12 min read",
    category: "Fundamental Analysis",
    tags: ["balance sheet", "financial statements", "investing", "financial analysis"],
    image: ensureValidImage("https://images.unsplash.com/photo-1614028674026-a65e31bfd27c?q=80&w=1770&auto=format&fit=crop", 6)
  },
  {
    title: "How Economic Indicators Affect the Stock Market (GDP, Inflation, etc.)",
    description: "Discover the relationship between key economic indicators such as GDP, inflation, unemployment rates, and their impact on stock market performance.",
    slug: "economic-indicators-stock-market",
    date: "Jul 22, 2023",
    readingTime: "10 min read",
    category: "Fundamental Analysis",
    tags: ["GDP", "inflation", "economic indicators", "stock market"],
    image: ensureValidImage("https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=2070&auto=format&fit=crop", 7)
  },
  {
    title: "Impact of Interest Rate Changes on Stock Prices & Market Trends",
    description: "A detailed analysis of how changes in interest rates by central banks affect different sectors of the stock market and overall market trends.",
    slug: "interest-rates-stock-market",
    date: "Aug 14, 2023",
    readingTime: "8 min read",
    category: "Fundamental Analysis",
    tags: ["interest rates", "central banks", "market trends", "sector analysis"],
    image: ensureValidImage("https://images.unsplash.com/photo-1626266061368-46a8632bac35?q=80&w=1974&auto=format&fit=crop", 8)
  }
];

export const tradingStrategyPosts: BlogPost[] = [
  {
    title: "Risk Management: Stop-Loss, Take-Profit & Position Sizing",
    description: "Learn the essential risk management techniques every trader should implement, including proper stop-loss placement, take-profit targets, and position sizing.",
    slug: "risk-management-trading",
    date: "May 5, 2023",
    readingTime: "9 min read",
    category: "Trading Strategies",
    tags: ["risk management", "stop-loss", "position sizing", "trading"],
    image: ensureValidImage("https://images.unsplash.com/photo-1634704784915-aacf363b021f?q=80&w=2070&auto=format&fit=crop", 9)
  },
  {
    title: "Scalping vs. Swing Trading vs. Investing: Which One Suits You?",
    description: "Compare different trading timeframes and strategies to determine which approach best matches your personality, lifestyle, and financial goals.",
    slug: "trading-timeframes-comparison",
    date: "Jun 20, 2023",
    readingTime: "11 min read",
    category: "Trading Strategies",
    tags: ["scalping", "swing trading", "investing", "trading styles"],
    image: ensureValidImage("https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2070&auto=format&fit=crop", 10)
  },
  {
    title: "Trading Psychology: Controlling Emotions & Avoiding Impulsive Trades",
    description: "Explore the psychological aspects of trading and learn techniques to manage emotions like fear and greed that often lead to poor trading decisions.",
    slug: "trading-psychology",
    date: "Jul 15, 2023",
    readingTime: "10 min read",
    category: "Trading Strategies",
    tags: ["psychology", "emotions", "discipline", "mindset"],
    image: ensureValidImage("https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop", 11)
  }
];

export const cryptoForexPosts: BlogPost[] = [
  {
    title: "Bitcoin & Ethereum: How to Perform Technical Analysis on Crypto",
    description: "Learn the unique aspects of applying technical analysis to cryptocurrencies like Bitcoin and Ethereum, considering their 24/7 market and high volatility.",
    slug: "crypto-technical-analysis",
    date: "May 28, 2023",
    readingTime: "10 min read",
    category: "Crypto Trading",
    tags: ["Bitcoin", "Ethereum", "cryptocurrency", "technical analysis"],
    image: ensureValidImage("https://images.unsplash.com/photo-1629339942248-45d4b10faed3?q=80&w=1932&auto=format&fit=crop", 12)
  },
  {
    title: "Forex Trading Basics: Best Currency Pairs & Key Indicators",
    description: "A beginner's guide to forex trading, covering the most traded currency pairs, important technical indicators, and fundamental factors affecting forex markets.",
    slug: "forex-trading-basics",
    date: "Jun 8, 2023",
    readingTime: "12 min read",
    category: "Forex Trading",
    tags: ["forex", "currency pairs", "indicators", "trading"],
    image: ensureValidImage("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop", 13)
  }
];
