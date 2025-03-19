
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, TrendingDown, AlertCircle, Gem, Clock, ExternalLink, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface NewsItem {
  title: string;
  url: string;
  source: string;
}

interface CryptoRecommendation {
  symbol: string;
  name: string;
  action: 'buy' | 'sell' | 'hold';
  reason: string;
  confidence: number;
  timeframe: string;
  price: number;
  priceTarget: number;
  stopLoss?: number;
  catalyst: string;
  lastUpdated: Date;
  relatedNews?: NewsItem[];
}

const MOCK_RECOMMENDATIONS: CryptoRecommendation[] = [
  {
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    action: 'buy',
    reason: 'Breaking above key resistance level at $71,000, with increasing volume indicating strong momentum. Recent ETF inflows are accelerating and on-chain metrics show accumulation.',
    confidence: 85,
    timeframe: '1-3 weeks',
    price: 70250.50,
    priceTarget: 78500.00,
    stopLoss: 67800.00,
    catalyst: 'ETF inflows acceleration and institutional adoption',
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    relatedNews: [
      {
        title: 'Bitcoin ETFs see record $631 million inflows despite price drop',
        url: 'https://www.coindesk.com/markets/2023/03/23/bitcoin-etfs-mark-strongest-trading-day-since-mid-january/',
        source: 'CoinDesk'
      },
      {
        title: 'MicroStrategy Buys 14,620 More Bitcoin for $615.7M',
        url: 'https://www.coindesk.com/business/2023/12/27/microstrategy-buys-14620-more-bitcoin-for-6157m/',
        source: 'CoinDesk'
      }
    ]
  },
  {
    symbol: 'ETHUSDT',
    name: 'Ethereum',
    action: 'buy',
    reason: 'Approaching Dencun upgrade, expected to reduce layer 2 fees significantly. Technical patterns show accumulation phase ending with bullish divergence on RSI.',
    confidence: 78,
    timeframe: '2-4 weeks',
    price: 3850.25,
    priceTarget: 4200.00,
    stopLoss: 3650.00,
    catalyst: 'Upcoming protocol upgrade and increased staking activity',
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    relatedNews: [
      {
        title: 'Ethereum Layer 2 TVL surges to new heights following Dencun upgrade',
        url: 'https://cointelegraph.com/news/ethereum-layer-2-networks-hit-all-time-high-activity-following-dencun-upgrade',
        source: 'CoinTelegraph'
      }
    ]
  },
  {
    symbol: 'SOLUSDT',
    name: 'Solana',
    action: 'hold',
    reason: 'Trading in a consolidation range after significant rally. Network activity remains strong, but technical indicators show mixed signals with potential distribution patterns.',
    confidence: 65,
    timeframe: '1-2 weeks',
    price: 145.75,
    priceTarget: 160.00,
    catalyst: 'DeFi and NFT ecosystem growth on Solana',
    lastUpdated: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    relatedNews: [
      {
        title: 'Solana DeFi ecosystem approaching $5B in TVL as network activity soars',
        url: 'https://defillama.com/chain/Solana',
        source: 'DeFi Llama'
      }
    ]
  },
  {
    symbol: 'DOGEUSDT',
    name: 'Dogecoin',
    action: 'sell',
    reason: 'Retail interest waning after recent hype cycle. Historical pattern shows declining volume after price peaks. Social media mentions are down significantly from peak.',
    confidence: 72,
    timeframe: '1-2 weeks',
    price: 0.175,
    priceTarget: 0.145,
    catalyst: 'Decreasing social media engagement and memecoin rotation',
    lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    relatedNews: [
      {
        title: 'Memecoins lose steam as market focus shifts to utility tokens',
        url: 'https://www.theblock.co/post/232197/interest-in-memecoins-dropping-rapidly-to-levels-of-december-2023',
        source: 'The Block'
      }
    ]
  },
  {
    symbol: 'BNBUSDT',
    name: 'Binance Coin',
    action: 'buy',
    reason: 'Recent BNB burn event reduced supply while exchange volumes remain high. Token utility expanding across Binance ecosystem with new features and partnerships.',
    confidence: 81,
    timeframe: '2-4 weeks',
    price: 605.50,
    priceTarget: 650.00,
    stopLoss: 580.00,
    catalyst: 'Token burn event and ecosystem expansion',
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    relatedNews: [
      {
        title: 'Binance completes 28th quarterly BNB burn, removing $539M worth of tokens',
        url: 'https://www.binance.com/en/blog/ecosystem/binance-completes-28th-bnb-burn-2023051616701187519',
        source: 'Binance Blog'
      }
    ]
  }
];

const CryptoRecommendations = () => {
  const [recommendations, setRecommendations] = useState<CryptoRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { currentSubscription } = useSubscription();
  const isPremiumUser = currentSubscription.planId !== null;

  useEffect(() => {
    // In a real implementation, fetch from API
    // For now using mock data
    setTimeout(() => {
      setRecommendations(MOCK_RECOMMENDATIONS);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  const getActionColor = (action: 'buy' | 'sell' | 'hold') => {
    switch (action) {
      case 'buy':
        return 'bg-emerald-600/20 text-emerald-500 border-emerald-500/30';
      case 'sell':
        return 'bg-rose-600/20 text-rose-500 border-rose-500/30';
      case 'hold':
        return 'bg-amber-600/20 text-amber-500 border-amber-500/30';
    }
  };

  const getActionIcon = (action: 'buy' | 'sell' | 'hold') => {
    switch (action) {
      case 'buy':
        return <TrendingUp className="h-4 w-4" />;
      case 'sell':
        return <TrendingDown className="h-4 w-4" />;
      case 'hold':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleUnlockClick = () => {
    navigate('/subscription');
  };

  return (
    <Card className="glass-card w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Gem className="h-5 w-5 text-primary" />
          Crypto Market Recommendations
          {!isPremiumUser && (
            <Badge variant="outline" className="ml-2 bg-yellow-600/20 text-yellow-500 border-yellow-500/30">
              Pro Feature
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          AI-powered trading recommendations based on technical analysis, market sentiment, and news catalysts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className={`relative ${!isPremiumUser ? 'overflow-hidden' : ''}`}>
            {!isPremiumUser && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center z-10">
                <Lock className="h-12 w-12 text-primary mb-4 animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
                <p className="text-center text-muted-foreground mb-4 max-w-md px-4">
                  Unlock expert crypto recommendations and real-time market insights with a premium subscription.
                </p>
                <Button 
                  onClick={handleUnlockClick}
                  className="bg-primary hover:bg-primary/90"
                >
                  Unlock Premium Features
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5 hover:border-primary/20 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">{rec.name}</h3>
                      <p className="text-xs text-muted-foreground">{rec.symbol}</p>
                    </div>
                    <Badge className={`text-xs ${getActionColor(rec.action)} uppercase flex items-center gap-1`}>
                      {getActionIcon(rec.action)}
                      {rec.action}
                    </Badge>
                  </div>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm line-clamp-3 mb-3 cursor-help">{rec.reason}</p>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>{rec.reason}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-black/20 p-2 rounded">
                      <p className="text-muted-foreground">Current Price</p>
                      <p className="font-mono font-medium">${rec.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                    <div className="bg-black/20 p-2 rounded">
                      <p className="text-muted-foreground">Target Price</p>
                      <p className="font-mono font-medium">${rec.priceTarget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    </div>
                  </div>
                  
                  {/* Related News Links */}
                  {rec.relatedNews && rec.relatedNews.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-medium mb-1 text-muted-foreground">Related News:</h4>
                      <div className="space-y-1">
                        {rec.relatedNews.map((news, idx) => (
                          <a 
                            key={idx}
                            href={news.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span className="line-clamp-1">{news.title}</span>
                            <span className="text-muted-foreground">({news.source})</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="bg-blue-600/10 text-blue-400 border-blue-400/20 rounded-sm">
                        {rec.confidence}% Confidence
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(rec.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoRecommendations;
