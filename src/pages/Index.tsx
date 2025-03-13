
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import CryptoSearch from '../components/CryptoSearch';
import CryptoChart from '../components/CryptoChart';
import PriceMetrics from '../components/PriceMetrics';
import TechnicalAnalysis from '../components/TechnicalAnalysis';
import ChartControls, { ChartControlsState } from '../components/ChartControls';
import { TimeInterval } from '../services/binanceService';
import { getTimeLabelByInterval } from '../utils/chartUtils';
import { useToast } from '@/hooks/use-toast';

const INTERVALS: TimeInterval[] = ['1m', '5m', '15m', '1h', '4h', '1d'];
const DEFAULT_SYMBOL = 'BTCUSDT';

const Index = () => {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL);
  const [interval, setInterval] = useState<TimeInterval>('15m');
  const [chartControls, setChartControls] = useState<ChartControlsState>({
    showSupportResistance: true,
    showEntryExitPoints: true, 
    showPatterns: true,
    showFibonacciLevels: true,
    showTrendLines: true
  });
  const { toast } = useToast();
  
  useEffect(() => {
    // Check URL params for symbol and interval
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
    // Update URL when symbol or interval changes
    const url = new URL(window.location.href);
    url.searchParams.set('symbol', symbol);
    url.searchParams.set('interval', interval);
    window.history.replaceState({}, '', url.toString());
    
    // Show toast notification on symbol change
    if (symbol !== DEFAULT_SYMBOL) {
      toast({
        title: 'Symbol Changed',
        description: `Now analyzing ${symbol}`,
        duration: 3000,
      });
    }
  }, [symbol, interval, toast]);
  
  const handleSymbolSelect = (newSymbol: string) => {
    setSymbol(newSymbol);
  };
  
  const handleIntervalChange = (newInterval: TimeInterval) => {
    setInterval(newInterval);
  };
  
  const handleChartControlsChange = (newControls: ChartControlsState) => {
    setChartControls(newControls);
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold animate-fade-in">Crypto Market Analysis</h1>
            <p className="text-muted-foreground animate-fade-in animation-delay-300">
              Real-time charts and technical analysis
            </p>
          </div>
          <CryptoSearch onSymbolSelect={handleSymbolSelect} selectedSymbol={symbol} />
        </div>
        
        {/* Time Interval Tabs */}
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
        
        {/* Price Metrics */}
        <div className="mb-6 animate-fade-in animation-delay-300">
          <PriceMetrics symbol={symbol} />
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 animate-fade-in">
            <CryptoChart symbol={symbol} interval={interval} chartControls={chartControls} />
          </div>
          <div className="animate-fade-in animation-delay-300 space-y-6">
            <ChartControls onControlsChange={handleChartControlsChange} />
            <TechnicalAnalysis symbol={symbol} interval={interval} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
