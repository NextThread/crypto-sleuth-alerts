
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Newspaper, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsItem {
  title: string;
  url: string;
  publishedAt: string;
  source: string;
  urlToImage?: string;
  description?: string;
}

const CryptoNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const { toast } = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would call an actual crypto news API
        // For this demo, we'll create some mock data
        const mockNews: NewsItem[] = [
          {
            title: 'Bitcoin Surges Past $60,000 Amid Growing Institutional Adoption',
            url: '#',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: 'CryptoInsider',
            urlToImage: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            description: 'Bitcoin has broken through the $60,000 barrier once again as institutional investors continue to pour into the market.',
          },
          {
            title: 'Ethereum Upgrade Expected to Reduce Gas Fees by 30%',
            url: '#',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            source: 'BlockchainReport',
            urlToImage: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            description: 'The upcoming Ethereum network upgrade is projected to significantly reduce transaction costs for users.',
          },
          {
            title: 'New Crypto Regulation Framework Proposed by EU Commission',
            url: '#',
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            source: 'RegulationWatch',
            urlToImage: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            description: 'European Union officials have unveiled a comprehensive framework for cryptocurrency regulation focused on consumer protection.',
          },
          {
            title: 'Solana Outperforms Market with 15% Weekly Gain',
            url: '#',
            publishedAt: new Date(Date.now() - 14400000).toISOString(),
            source: 'AltCoinDaily',
            urlToImage: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
            description: 'Solana has shown remarkable strength in the past week, outperforming the broader crypto market with double-digit gains.',
          },
        ];
        
        setNews(mockNews);
      } catch (error) {
        console.error('Error fetching crypto news:', error);
        toast({
          title: "Error fetching news",
          description: "Could not load the latest crypto news",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [toast]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
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

  return (
    <Card className="glass-card w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Crypto News</CardTitle>
          </div>
          <CardDescription className="text-xs flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Updates hourly
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="trending" className="mb-4">
          <TabsList className="w-full grid grid-cols-2 h-9">
            <TabsTrigger 
              value="trending" 
              className="flex items-center gap-1"
              onClick={() => setActiveTab('trending')}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger 
              value="latest"
              className="flex items-center gap-1"
              onClick={() => setActiveTab('latest')}
            >
              <Newspaper className="h-3.5 w-3.5" />
              <span>Latest</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="space-y-4 mt-3">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {news.map((item, index) => (
                  <a 
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 group hover:bg-secondary/20 p-2 rounded-md transition-colors"
                  >
                    {item.urlToImage ? (
                      <div className="h-20 w-20 relative overflow-hidden rounded-md flex-shrink-0">
                        <img 
                          src={item.urlToImage} 
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 bg-secondary/40 rounded-md flex items-center justify-center flex-shrink-0">
                        <Newspaper className="h-8 w-8 text-primary/40" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-medium">{item.source}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {formatTimeAgo(item.publishedAt)}
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="latest" className="space-y-4 mt-3">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-4">
                    <Skeleton className="h-20 w-20 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[...news].sort((a, b) => 
                  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                ).map((item, index) => (
                  <a 
                    key={index}
                    href={item.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex gap-3 group hover:bg-secondary/20 p-2 rounded-md transition-colors"
                  >
                    {item.urlToImage ? (
                      <div className="h-20 w-20 relative overflow-hidden rounded-md flex-shrink-0">
                        <img 
                          src={item.urlToImage} 
                          alt={item.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 bg-secondary/40 rounded-md flex items-center justify-center flex-shrink-0">
                        <Newspaper className="h-8 w-8 text-primary/40" />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-medium">{item.source}</span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          {formatTimeAgo(item.publishedAt)}
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <a 
          href="#" 
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          View all news
          <ExternalLink className="h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
};

export default CryptoNews;
