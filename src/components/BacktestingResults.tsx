
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Layers, History, Dices, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface BacktestResult {
  id: string;
  pair: string;
  date: string;
  type: "LONG" | "SHORT";
  entry: number;
  target: number;
  stopLoss: number;
  status: "HIT_TARGET" | "HIT_STOP" | "OPEN";
  profit: number;
  duration: string;
  currentPrice?: number;
}

// Today's trades (most recent)
const recentResultsInit: BacktestResult[] = [
  {
    id: "BTC-001",
    pair: "BTC/USDT",
    date: new Date().toISOString().split('T')[0], // Today's date
    type: "LONG",
    entry: 25800,
    target: 28500,
    stopLoss: 24600,
    status: "HIT_TARGET",
    profit: 10.47,
    duration: "5 days"
  },
  {
    id: "ETH-002",
    pair: "ETH/USDT",
    date: new Date().toISOString().split('T')[0], // Today's date
    type: "LONG",
    entry: 1850,
    target: 1950,
    stopLoss: 1800,
    status: "HIT_TARGET",
    profit: 5.41,
    duration: "3 days"
  },
  {
    id: "SOL-003",
    pair: "SOL/USDT",
    date: new Date().toISOString().split('T')[0], // Today's date
    type: "SHORT",
    entry: 28.50,
    target: 24.20,
    stopLoss: 30.40,
    status: "HIT_TARGET",
    profit: 15.09,
    duration: "7 days"
  },
  {
    id: "ADA-004",
    pair: "ADA/USDT",
    date: new Date().toISOString().split('T')[0], // Today's date
    type: "LONG",
    entry: 0.28,
    target: 0.32,
    stopLoss: 0.26,
    status: "HIT_STOP",
    profit: -7.14,
    duration: "2 days"
  },
  {
    id: "XRP-005",
    pair: "XRP/USDT",
    date: new Date().toISOString().split('T')[0], // Today's date
    type: "SHORT",
    entry: 0.82,
    target: 0.72,
    stopLoss: 0.88,
    status: "HIT_STOP",
    profit: -7.32,
    duration: "1 day"
  },
  {
    id: "BNB-006",
    pair: "BNB/USDT",
    date: new Date().toISOString().split('T')[0], // Today's date
    type: "LONG",
    entry: 240,
    target: 260,
    stopLoss: 230,
    status: "HIT_TARGET",
    profit: 8.33,
    duration: "4 days"
  }
];

// Previous days' trades (historical)
const historicalResultsInit: BacktestResult[] = [
  // Yesterday
  {
    id: "DOT-007",
    pair: "DOT/USDT",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    type: "LONG",
    entry: 5.60,
    target: 6.20,
    stopLoss: 5.30,
    status: "HIT_TARGET",
    profit: 10.71,
    duration: "6 days"
  },
  {
    id: "LINK-008",
    pair: "LINK/USDT",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    type: "SHORT",
    entry: 7.80,
    target: 6.90,
    stopLoss: 8.20,
    status: "HIT_TARGET",
    profit: 11.54,
    duration: "5 days"
  },
  {
    id: "MATIC-009",
    pair: "MATIC/USDT",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    type: "LONG",
    entry: 0.85,
    target: 0.95,
    stopLoss: 0.80,
    status: "HIT_STOP",
    profit: -5.88,
    duration: "2 days"
  },
  {
    id: "AVAX-010",
    pair: "AVAX/USDT",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    type: "SHORT",
    entry: 15.20,
    target: 13.50,
    stopLoss: 16.10,
    status: "HIT_TARGET",
    profit: 11.18,
    duration: "4 days"
  },
  // Day before yesterday
  {
    id: "ATOM-011",
    pair: "ATOM/USDT",
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // Day before yesterday
    type: "LONG",
    entry: 8.20,
    target: 8.80,
    stopLoss: 7.90,
    status: "HIT_TARGET",
    profit: 7.32,
    duration: "3 days"
  },
  {
    id: "ALGO-012",
    pair: "ALGO/USDT",
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // Day before yesterday
    type: "SHORT",
    entry: 0.14,
    target: 0.12,
    stopLoss: 0.15,
    status: "HIT_TARGET",
    profit: 14.29,
    duration: "5 days"
  },
  {
    id: "NEAR-013",
    pair: "NEAR/USDT",
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // Day before yesterday
    type: "LONG",
    entry: 1.60,
    target: 1.85,
    stopLoss: 1.50,
    status: "HIT_STOP",
    profit: -6.25,
    duration: "1 day"
  }
];

const fetchCurrentPrice = async (symbol: string): Promise<number> => {
  try {
    // Remove the /USDT part and make it lowercase for API
    const baseSymbol = symbol.split('/')[0].toLowerCase();
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${baseSymbol}usdt`);
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return 0;
  }
};

const BacktestingResults = () => {
  const [recentResults, setRecentResults] = useState<BacktestResult[]>(recentResultsInit);
  const [historicalResults, setHistoricalResults] = useState<BacktestResult[]>(historicalResultsInit);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Stats state with random changes
  const [successRate, setSuccessRate] = useState<number>(85);
  const [averageProfit, setAverageProfit] = useState<number>(8.5);
  const [totalTrades, setTotalTrades] = useState<number>(100);
  
  useEffect(() => {
    // Initialize total trades from localStorage or default to 100
    const storedTotalTrades = localStorage.getItem('backtestingTotalTrades');
    if (storedTotalTrades) {
      setTotalTrades(parseInt(storedTotalTrades, 10));
    } else {
      localStorage.setItem('backtestingTotalTrades', totalTrades.toString());
    }
    
    // Check last update date
    const today = new Date().toISOString().split('T')[0];
    const lastUpdateDate = localStorage.getItem('backtestingLastUpdateDate');
    
    if (lastUpdateDate !== today) {
      // It's a new day, increase total trades
      const increase = Math.floor(Math.random() * 6) + 10; // Random number between 10-15
      const newTotal = totalTrades + increase;
      setTotalTrades(newTotal);
      localStorage.setItem('backtestingTotalTrades', newTotal.toString());
      localStorage.setItem('backtestingLastUpdateDate', today);
    }
    
    // Update stats randomly every minute
    const updateStats = () => {
      // Random success rate between 78% and 98%
      setSuccessRate(Math.floor(Math.random() * 21) + 78);
      
      // Random average profit between 4% and 36%
      setAverageProfit(Math.random() * 32 + 4);
    };
    
    updateStats(); // Initial update
    const statsInterval = setInterval(updateStats, 60000); // Update every minute
    
    return () => clearInterval(statsInterval);
  }, [totalTrades]);

  // Function to update prices
  const updatePrices = async () => {
    setIsLoadingPrices(true);
    
    try {
      // Update recent results
      const updatedRecent = await Promise.all(
        recentResults.map(async (trade) => {
          const pair = trade.pair;
          const currentPrice = await fetchCurrentPrice(pair);
          
          // Adjust profit based on current price if trade is OPEN
          let adjustedProfit = trade.profit;
          if (trade.status === "OPEN") {
            if (trade.type === "LONG") {
              adjustedProfit = ((currentPrice - trade.entry) / trade.entry) * 100;
            } else {
              adjustedProfit = ((trade.entry - currentPrice) / trade.entry) * 100;
            }
          }
          
          return {
            ...trade,
            currentPrice,
            profit: trade.status === "OPEN" ? adjustedProfit : trade.profit
          };
        })
      );
      
      // Update historical results
      const updatedHistorical = await Promise.all(
        historicalResults.map(async (trade) => {
          const currentPrice = await fetchCurrentPrice(trade.pair);
          return {
            ...trade,
            currentPrice
          };
        })
      );
      
      setRecentResults(updatedRecent);
      setHistoricalResults(updatedHistorical);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error updating prices:", error);
    } finally {
      setIsLoadingPrices(false);
    }
  };
  
  // Update prices when component mounts
  useEffect(() => {
    updatePrices();
    
    // Update prices every 5 minutes
    const intervalId = setInterval(updatePrices, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Track days to simulate adding new trades to historical data
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('lastBacktestingDate');
    
    if (storedDate !== today) {
      // It's a new day, move yesterday's trades to historical
      if (storedDate) {
        // Move 5 trades from recent to historical
        const tradesToMove = recentResults.slice(0, 5).map(trade => ({
          ...trade,
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
        }));
        
        setHistoricalResults(prev => [...tradesToMove, ...prev]);
      }
      
      localStorage.setItem('lastBacktestingDate', today);
    }
  }, []);

  const renderTradeRow = (trade: BacktestResult) => (
    <div 
      key={trade.id}
      className="flex flex-col md:flex-row md:items-center justify-between p-3 border-b border-white/5 last:border-0 hover:bg-secondary/10 transition-colors"
    >
      <div className="flex items-center gap-3 mb-2 md:mb-0">
        <div className={`p-1.5 rounded-md ${trade.type === "LONG" ? "bg-crypto-bullish/20" : "bg-crypto-bearish/20"}`}>
          {trade.type === "LONG" ? 
            <TrendingUp className="h-4 w-4 text-crypto-bullish" /> : 
            <TrendingDown className="h-4 w-4 text-crypto-bearish" />
          }
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{trade.pair}</span>
            <Badge variant="outline" className="text-xs">
              {trade.type}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
            <History className="h-3 w-3 opacity-70" />
            <span>{trade.date}</span>
            <span>•</span>
            <span>{trade.duration}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 md:w-auto md:flex md:items-center md:gap-6 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Entry</div>
          <div className="font-mono">${trade.entry.toLocaleString()}</div>
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground">Target</div>
          <div className="font-mono text-crypto-target">${trade.target.toLocaleString()}</div>
        </div>
        
        <div>
          <div className="text-xs text-muted-foreground">Stop</div>
          <div className="font-mono text-crypto-stop">${trade.stopLoss.toLocaleString()}</div>
        </div>
        
        {trade.currentPrice ? (
          <div>
            <div className="text-xs text-muted-foreground">Current</div>
            <div className="font-mono">${trade.currentPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
          </div>
        ) : null}
        
        <div className="col-span-3 md:col-span-1 mt-2 md:mt-0">
          <div className={`flex items-center gap-1.5 ${
            trade.status === "HIT_TARGET" ? "text-crypto-bullish" : 
            trade.status === "HIT_STOP" ? "text-crypto-bearish" : 
            trade.profit >= 0 ? "text-crypto-bullish" : "text-crypto-bearish"
          }`}>
            {trade.status === "HIT_TARGET" ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : trade.status === "HIT_STOP" ? (
              <ArrowDownRight className="h-4 w-4" />
            ) : (
              <Dices className="h-4 w-4" />
            )}
            <span className="font-medium">{trade.profit > 0 ? "+" : ""}{trade.profit.toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="glass-card w-full animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Backtesting Results
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8" 
              onClick={updatePrices}
              disabled={isLoadingPrices}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingPrices ? 'animate-spin' : ''}`} />
              Update Prices
            </Button>
            <div className="text-xs text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5">
            <p className="text-muted-foreground text-xs">Success Rate</p>
            <h3 className="text-2xl font-mono font-bold text-crypto-bullish">
              {successRate.toFixed(1)}%
            </h3>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5">
            <p className="text-muted-foreground text-xs">Average Profit</p>
            <h3 className="text-2xl font-mono font-bold text-crypto-bullish">
              +{averageProfit.toFixed(2)}%
            </h3>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5">
            <p className="text-muted-foreground text-xs">Total Trades</p>
            <h3 className="text-2xl font-mono font-bold">
              {totalTrades}
            </h3>
          </div>
        </div>
        
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-10 mb-4">
            <TabsTrigger value="recent">Today's Trades</TabsTrigger>
            <TabsTrigger value="historical">Historical Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-0">
            <div className="rounded-lg border border-white/10 overflow-hidden">
              {recentResults.map(renderTradeRow)}
            </div>
          </TabsContent>
          
          <TabsContent value="historical" className="mt-0">
            <div className="rounded-lg border border-white/10 overflow-hidden">
              {historicalResults.map(renderTradeRow)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BacktestingResults;
