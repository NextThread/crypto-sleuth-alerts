import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import CryptoSearch from '../components/CryptoSearch';
import CryptoChart from '../components/CryptoChart';
import PriceMetrics from '../components/PriceMetrics';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import TradeDetails from '../components/TradeDetails';
import ChartControls, { ChartControlsState } from '../components/ChartControls';
import { TimeInterval, getKlineData } from '../services/binanceService';
import { getTimeLabelByInterval } from '../utils/chartUtils';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, BarChart2 } from 'lucide-react';
import { doc, getDoc, setDoc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const INTERVALS: TimeInterval[] = ['1m', '5m', '15m', '1h', '4h', '1d'];
const DEFAULT_SYMBOL = 'BTCUSDT';
const CHART_COUNT_KEY = 'globalChartCount';

// Default chart controls
const DEFAULT_CHART_CONTROLS: ChartControlsState = {
  showSupportResistance: true,
  showEntryExitPoints: true, 
  showPatterns: true,
  showFibonacciLevels: true,
  showTrendLines: true,
  chartType: 'line',
  patternControls: {
    showHeadAndShoulders: true,
    showDoubleTop: true,
    showDoubleBottom: true,
    showTriangle: true,
    showWedge: true
  }
};

const Index = () => {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [interval, setInterval] = useState<TimeInterval>('15m');
  const [chartControls, setChartControls] = useState<ChartControlsState>(() => {
    try {
      const savedControls = localStorage.getItem('chartControls');
      const parsedControls = savedControls ? JSON.parse(savedControls) : {};
      
      return { 
        ...DEFAULT_CHART_CONTROLS, 
        ...parsedControls,
        patternControls: {
          ...DEFAULT_CHART_CONTROLS.patternControls,
          ...(parsedControls.patternControls || {})
        }
      };
    } catch (error) {
      console.error('Error parsing localStorage chart controls', error);
      return DEFAULT_CHART_CONTROLS;
    }
  });
  
  const [chartData, setChartData] = useState([]);
  const [totalSearches, setTotalSearches] = useState<number>(0);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentSubscription, decrementSearches } = useSubscription();
  const [searchLimitReached, setSearchLimitReached] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchGlobalChartCount = async () => {
      try {
        const countRef = doc(db, 'stats', CHART_COUNT_KEY);
        const countDoc = await getDoc(countRef);
        
        if (countDoc.exists()) {
          setTotalSearches(countDoc.data().count || 0);
        } else {
          await setDoc(countRef, { count: 0 });
        }
      } catch (error) {
        console.error('Error fetching global chart count:', error);
        const savedTotalSearches = localStorage.getItem('totalSearches');
        setTotalSearches(savedTotalSearches ? parseInt(savedTotalSearches, 10) : 0);
      }
    };
    
    fetchGlobalChartCount();
  }, []);
  
  useEffect(() => {
    if (currentSubscription.searchesRemaining <= 0) {
      setSearchLimitReached(true);
    } else {
      setSearchLimitReached(false);
    }
  }, [currentSubscription.searchesRemaining]);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const symbolParam = urlParams.get('symbol');
    const intervalParam = urlParams.get('interval') as TimeInterval | null;
    
    if (symbolParam) {
      setSymbol(symbolParam.toUpperCase());
    }
    
    if (intervalParam && INTERVALS.includes(intervalParam)) {
      setInterval(intervalParam);
    }
  }, []);
  
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('interval', interval);
    window.history.replaceState({}, '', url.toString());
    
    if (symbol !== DEFAULT_SYMBOL) {
      toast({
        title: 'Symbol Changed',
        description: `Now analyzing ${symbol}`,
        duration: 3000,
      });
    }
  }, [symbol, interval, toast]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getKlineData(symbol, interval);
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    };
    
    fetchData();
    
    const wsEndpoint = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;
    const ws = new WebSocket(wsEndpoint);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.k) {
        const { t: openTime, o: open, h: high, l: low, c: close, v: volume, T: closeTime, n: numberOfTrades } = message.k;
        
        setChartData(prev => {
          const newData = [...prev];
          const lastIndex = newData.findIndex(candle => candle.openTime === openTime);
          
          if (lastIndex >= 0) {
            newData[lastIndex] = {
              openTime,
              open: parseFloat(open),
              high: parseFloat(high),
              low: parseFloat(low),
              close: parseFloat(close),
              volume: parseFloat(volume),
              closeTime,
              quoteAssetVolume: 0,
              numberOfTrades,
            };
          } else if (newData.length > 0 && openTime > newData[newData.length - 1].openTime) {
            newData.push({
              openTime,
              open: parseFloat(open),
              high: parseFloat(high),
              low: parseFloat(low),
              close: parseFloat(close),
              volume: parseFloat(volume),
              closeTime,
              quoteAssetVolume: 0,
              numberOfTrades,
            });
            if (newData.length > 500) {
              newData.shift();
            }
          }
          
          return newData;
        });
      }
    };
    
    return () => {
      ws.close();
    };
  }, [symbol, interval]);
  
  useEffect(() => {
    localStorage.setItem('totalSearches', totalSearches.toString());
  }, [totalSearches]);
  
  const handleSymbolSelect = async (newSymbol: string) => {
    if (
      newSymbol !== symbol && 
      currentSubscription.searchesRemaining <= 0
    ) {
      toast({
        title: "Search Limit Reached",
        description: "You've reached your search limit. Please subscribe to continue.",
        variant: "destructive",
      });
      setSearchLimitReached(true);
      return;
    }
    
    if (newSymbol !== symbol) {
      decrementSearches();
      setSymbol(newSymbol);
      
      try {
        const countRef = doc(db, 'stats', CHART_COUNT_KEY);
        await updateDoc(countRef, {
          count: increment(1)
        });
        
        setTotalSearches(prev => prev + 1);
      } catch (error) {
        console.error('Error updating global chart count:', error);
        const newCount = totalSearches + 1;
        setTotalSearches(newCount);
        localStorage.setItem('totalSearches', newCount.toString());
      }
    }
  };
  
  const handleIntervalChange = (newInterval: TimeInterval) => {
    setInterval(newInterval);
  };
  
  const handleChartControlsChange = (newControls: ChartControlsState) => {
    const mergedControls = {
      ...newControls,
      patternControls: {
        ...DEFAULT_CHART_CONTROLS.patternControls,
        ...(newControls.patternControls || {})
      }
    };
    
    setChartControls(mergedControls);
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold animate-fade-in">Crypto Market Analysis</h1>
            <p className="text-muted-foreground animate-fade-in animation-delay-300">
              Real-time charts and technical analysis
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-2 text-sm bg-black/20 rounded-md px-3 py-1 animate-fade-in">
              <BarChart2 className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Charts Analyzed:</span>
              <span className="font-mono font-medium">{totalSearches}</span>
            </div>
            <CryptoSearch onSymbolSelect={handleSymbolSelect} selectedSymbol={symbol} />
          </div>
        </div>
        
        {searchLimitReached && (
          <Alert className="mb-6 border-yellow-600 bg-yellow-600/10 animate-fade-in">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="flex justify-between items-center">
              <div>
                You've reached your search limit. Subscribe to analyze more cryptocurrencies.
              </div>
              <Button
                size="sm"
                onClick={() => navigate('/subscription')}
                className="ml-4"
              >
                Subscribe Now
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex overflow-x-auto scrollbar-none space-x-1 mb-6 glass-panel inline-flex p-1 rounded-lg animate-fade-in animation-delay-600">
          {INTERVALS.map((item) => (
            <button
              key={item}
              onClick={() => handleIntervalChange(item)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                interval === item
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-secondary text-muted-foreground'
              }`}
            >
              {getTimeLabelByInterval(item)}
            </button>
          ))}
        </div>
        
        <div className="mb-6 animate-fade-in animation-delay-300">
          <PriceMetrics symbol={symbol} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 animate-fade-in">
            <CryptoChart symbol={symbol} interval={interval} chartControls={chartControls} />
          </div>
          <div className="animate-fade-in animation-delay-300 space-y-6">
            <ChartControls onControlsChange={handleChartControlsChange} />
            <TechnicalAnalysis symbol={symbol} interval={interval} />
          </div>
        </div>
        
        <div className="mb-6 animate-fade-in animation-delay-600">
          <TradeDetails chartData={chartData} symbol={symbol} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
