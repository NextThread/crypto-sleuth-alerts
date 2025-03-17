import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, ChevronDown, ChevronUp, Newspaper, RefreshCw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  source: string;
  date: string;
  category: string;
}

interface CryptoNewsProps {
  initialExpandedCount?: number;
}

const CryptoNews = ({ initialExpandedCount = 6 }: CryptoNewsProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(initialExpandedCount);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchCryptoNews = async () => {
    setLoading(true);
    try {
      // Using Crypto Compare News API
      const response = await fetch(
        "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&categories=BTC,ETH,Cryptocurrency,Trading"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      
      const data = await response.json();
      
      if (data.Data && Array.isArray(data.Data)) {
        const formattedNews: NewsItem[] = data.Data.map((item: any) => ({
          title: item.title,
          description: item.body.length > 200 ? item.body.substring(0, 200) + "..." : item.body,
          url: item.url,
          source: item.source,
          date: new Date(item.published_on * 1000).toISOString(),
          category: item.categories || "Crypto"
        }));
        
        setNews(formattedNews);
        setError(null);
      } else {
        // Fallback to sample data if API doesn't return expected format
        setNews(getSampleNews());
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Using sample data instead.');
      // Fallback to sample data
      setNews(getSampleNews());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const getSampleNews = (): NewsItem[] => {
    const currentDate = new Date();
    return [
      {
        title: "Bitcoin Breaks $100K: Institutional Adoption Accelerates",
        description: "Bitcoin has reached a new all-time high, crossing the $100,000 mark as major financial institutions continue to add it to their balance sheets.",
        url: "https://www.coindesk.com/markets/2023/05/10/bitcoin-breaks-100k/",
        source: "CoinDesk",
        date: new Date(currentDate.getTime() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        category: "Markets"
      },
      {
        title: "Ethereum 2.0 Upgrade Completes Final Testnet Phase",
        description: "The final testnet for Ethereum's major upgrade has been successfully deployed, paving the way for the full transition to proof-of-stake.",
        url: "https://cointelegraph.com/news/ethereum-2-0-testnet",
        source: "CoinTelegraph",
        date: new Date(currentDate.getTime() - 1000 * 60 * 90).toISOString(), // 90 minutes ago
        category: "Technology"
      },
      {
        title: "SEC Approves Multiple Spot Ethereum ETFs",
        description: "The Securities and Exchange Commission has approved applications for spot Ethereum ETFs from multiple asset managers, opening the door for institutional investment.",
        url: "https://www.forbes.com/crypto/2023/sec-approves-ethereum-etfs/",
        source: "Forbes Crypto",
        date: new Date(currentDate.getTime() - 1000 * 60 * 180).toISOString(), // 3 hours ago
        category: "Regulation"
      },
      {
        title: "Solana Network Processes Record 100,000 TPS During Stress Test",
        description: "Solana's blockchain has successfully processed a record 100,000 transactions per second during a recent stress test, showcasing its scalability improvements.",
        url: "https://www.theblock.co/post/solana-tps-record",
        source: "The Block",
        date: new Date(currentDate.getTime() - 1000 * 60 * 240).toISOString(), // 4 hours ago
        category: "Technology"
      },
      {
        title: "European Central Bank Accelerates CBDC Development",
        description: "The ECB has announced that it is accelerating the development of its central bank digital currency, with a pilot program set to launch next quarter.",
        url: "https://www.ft.com/content/ecb-cbdc-development",
        source: "Financial Times",
        date: new Date(currentDate.getTime() - 1000 * 60 * 300).toISOString(), // 5 hours ago
        category: "CBDCs"
      },
      {
        title: "Ripple Wins Landmark Case Against SEC",
        description: "A federal court has ruled in favor of Ripple in its longstanding legal battle with the SEC, declaring that XRP is not a security in most cases.",
        url: "https://www.cnbc.com/crypto/ripple-wins-sec-case",
        source: "CNBC Crypto",
        date: new Date(currentDate.getTime() - 1000 * 60 * 420).toISOString(), // 7 hours ago
        category: "Legal"
      },
      {
        title: "Cardano Launches Smart Contract Optimization Tools",
        description: "Cardano has released a suite of tools aimed at optimizing smart contract performance and reducing transaction costs on its blockchain.",
        url: "https://decrypt.co/cardano-smart-contract-tools",
        source: "Decrypt",
        date: new Date(currentDate.getTime() - 1000 * 60 * 480).toISOString(), // 8 hours ago
        category: "Development"
      },
      {
        title: "Binance Announces $500M Fund for Web3 Gaming Development",
        description: "The world's largest cryptocurrency exchange has unveiled a $500 million fund dedicated to supporting developers building gaming applications on Web3 platforms.",
        url: "https://www.coindesk.com/business/binance-500m-web3-gaming/",
        source: "CoinDesk",
        date: new Date(currentDate.getTime() - 1000 * 60 * 540).toISOString(), // 9 hours ago
        category: "Business"
      },
      {
        title: "IMF Report Suggests 80% of Central Banks Exploring CBDCs",
        description: "A new report from the International Monetary Fund indicates that approximately 80% of central banks worldwide are currently exploring or developing central bank digital currencies.",
        url: "https://www.imf.org/en/News/Articles/cbdc-exploration",
        source: "IMF",
        date: new Date(currentDate.getTime() - 1000 * 60 * 600).toISOString(), // 10 hours ago
        category: "CBDCs"
      },
      {
        title: "Polkadot Ecosystem Surpasses 1,000 Active Parachains",
        description: "The Polkadot ecosystem has reached a significant milestone with more than 1,000 active parachains, highlighting the platform's growing interoperability capabilities.",
        url: "https://polkadot.network/blog/1000-parachains-milestone",
        source: "Polkadot Blog",
        date: new Date(currentDate.getTime() - 1000 * 60 * 660).toISOString(), // 11 hours ago
        category: "Ecosystem"
      },
      {
        title: "CryptoPunks NFT Sells for Record $24 Million",
        description: "A rare CryptoPunks NFT has sold for $24 million, setting a new record for the collection and signaling continued high-end demand in the NFT market.",
        url: "https://nftnow.com/news/cryptopunk-record-sale",
        source: "NFT Now",
        date: new Date(currentDate.getTime() - 1000 * 60 * 720).toISOString(), // 12 hours ago
        category: "NFTs"
      },
      {
        title: "Avalanche Foundation Launches $100M Development Fund",
        description: "The Avalanche Foundation has announced a $100 million fund aimed at supporting developers building decentralized applications on the Avalanche blockchain.",
        url: "https://www.avalabs.org/press/100m-development-fund",
        source: "Avalanche Blog",
        date: new Date(currentDate.getTime() - 1000 * 60 * 780).toISOString(), // 13 hours ago
        category: "Funding"
      }
    ];
  };
  
  useEffect(() => {
    fetchCryptoNews();
    
    // Refresh news every 30 minutes
    const intervalId = setInterval(fetchCryptoNews, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchCryptoNews();
  };
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const toggleExpand = () => {
    setExpanded(!expanded);
    setVisibleCount(expanded ? initialExpandedCount : news.length);
  };
  
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            Crypto News
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {news.length > initialExpandedCount && (
              <Button variant="ghost" size="sm" onClick={toggleExpand} className="text-xs flex items-center gap-1">
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show All ({news.length})
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6 text-muted-foreground">
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {news.slice(0, visibleCount).map((item, index) => (
              <div key={index} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-base mb-1 hover:text-primary transition-colors">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start">
                      {item.title}
                      <ExternalLink className="h-3.5 w-3.5 ml-1 mt-1 opacity-70" />
                    </a>
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.source}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{formatTimeAgo(item.date)}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CryptoNews;
