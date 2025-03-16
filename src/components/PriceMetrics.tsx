
import { useState, useEffect } from 'react';
import { TickerData, get24hTicker } from '../services/binanceService';
import { formatPrice, formatPriceChange, formatVolume, getColorClass } from '../utils/chartUtils';
import { ArrowUpRight, ArrowDownRight, BarChart3, Gauge, Clock } from 'lucide-react';

interface PriceMetricsProps {
  symbol: string;
}

const PriceMetrics = ({ symbol }: PriceMetricsProps) => {
  const [data, setData] = useState<TickerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const tickerData = await get24hTicker(symbol);
        setData(tickerData);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error fetching price metrics:', err);
        setError('Failed to load price data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Setup periodic refresh
    const interval = setInterval(fetchData, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [symbol]);
  
  if (isLoading && !data) {
    return (
      <div className="glass-card rounded-lg p-4 animate-pulse">
        <div className="flex flex-col space-y-4">
          <div className="h-6 bg-secondary/50 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-16 bg-secondary/50 rounded"></div>
            <div className="h-16 bg-secondary/50 rounded"></div>
            <div className="h-16 bg-secondary/50 rounded"></div>
            <div className="h-16 bg-secondary/50 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="glass-card rounded-lg p-4">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="glass-card rounded-lg p-4">
        <p className="text-muted-foreground">No price data available</p>
      </div>
    );
  }
  
  const priceChangePercent = parseFloat(data.priceChangePercent);
  
  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{symbol} Overview</h3>
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Current Price */}
        <div className="flex flex-col justify-between">
          <span className="text-xs text-muted-foreground mb-1">Current Price</span>
          <div className="flex flex-col">
            <span className="text-xl font-semibold">{formatPrice(data.lastPrice)}</span>
            <div className={`flex items-center text-sm ${getColorClass(priceChangePercent)}`}>
              {priceChangePercent > 0 ? (
                <ArrowUpRight className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 mr-1" />
              )}
              {formatPriceChange(priceChangePercent)}
            </div>
          </div>
        </div>
        
        {/* 24h High/Low */}
        <div className="flex flex-col justify-between">
          <span className="text-xs text-muted-foreground mb-1">24h Range</span>
          <div className="flex flex-col">
            <div className="flex space-x-2 text-sm">
              <span className="text-muted-foreground">L:</span>
              <span>{formatPrice(data.lowPrice)}</span>
            </div>
            <div className="flex space-x-2 text-sm">
              <span className="text-muted-foreground">H:</span>
              <span>{formatPrice(data.highPrice)}</span>
            </div>
          </div>
        </div>
        
        {/* 24h Volume */}
        <div className="flex flex-col justify-between">
          <span className="text-xs text-muted-foreground mb-1 flex items-center">
            <BarChart3 className="w-3 h-3 mr-1" />
            24h Volume
          </span>
          <div className="flex flex-col">
            <span className="text-xl font-semibold">{formatVolume(data.volume)}</span>
            <span className="text-xs text-muted-foreground">
              {formatVolume(data.quoteVolume)} Quote
            </span>
          </div>
        </div>
        
        {/* Weighted Avg Price */}
        <div className="flex flex-col justify-between">
          <span className="text-xs text-muted-foreground mb-1 flex items-center">
            <Gauge className="w-3 h-3 mr-1" />
            Weighted Avg
          </span>
          <div className="flex flex-col">
            <span className="text-xl font-semibold">{formatPrice(data.weightedAvgPrice)}</span>
            <span className="text-xs text-muted-foreground">
              {data.count.toLocaleString()} trades
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceMetrics;
