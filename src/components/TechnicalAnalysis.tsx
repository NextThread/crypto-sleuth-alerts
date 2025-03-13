
import { useState, useEffect } from 'react';
import { KlineData, TimeInterval, getKlineData } from '../services/binanceService';
import { 
  calculateRSI, 
  calculateMACD, 
  calculateTrendDirection,
  detectPatterns
} from '../utils/technicalIndicators';
import { formatPrice } from '../utils/chartUtils';
import { TrendingUp, TrendingDown, Minus, Target, AlertTriangle, Activity, BarChart2 } from 'lucide-react';

interface TechnicalAnalysisProps {
  symbol: string;
  interval: TimeInterval;
}

const TechnicalAnalysis = ({ symbol, interval }: TechnicalAnalysisProps) => {
  const [data, setData] = useState<KlineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Technical indicators
  const [rsi, setRsi] = useState<number | null>(null);
  const [macd, setMacd] = useState<{ value: number; signal: number } | null>(null);
  const [trend, setTrend] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [riskReward, setRiskReward] = useState<number | null>(null);
  const [patternCount, setPatternCount] = useState<{
    headAndShoulders: number;
    doubleTop: number;
    doubleBottom: number;
    triangle: number;
  }>({ headAndShoulders: 0, doubleTop: 0, doubleBottom: 0, triangle: 0 });
  
  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const klineData = await getKlineData(symbol, interval);
        setData(klineData);
        
        // Calculate technical indicators
        const rsiValues = calculateRSI(klineData);
        setRsi(rsiValues[rsiValues.length - 1]);
        
        const macdResult = calculateMACD(klineData);
        setMacd({
          value: macdResult.macdLine[macdResult.macdLine.length - 1],
          signal: macdResult.signalLine[macdResult.signalLine.length - 1],
        });
        
        setTrend(calculateTrendDirection(klineData));
        
        // Calculate risk-reward ratio
        // Simple example: Distance to nearest support vs resistance
        const currentPrice = klineData[klineData.length - 1].close;
        const recentLows = klineData.slice(-20).map(d => d.low);
        const recentHighs = klineData.slice(-20).map(d => d.high);
        const nearestSupport = Math.max(...recentLows.filter(p => p < currentPrice));
        const nearestResistance = Math.min(...recentHighs.filter(p => p > currentPrice));
        
        if (nearestSupport && nearestResistance) {
          const risk = currentPrice - nearestSupport;
          const reward = nearestResistance - currentPrice;
          setRiskReward(reward / risk);
        }
        
        // Get patterns
        const patterns = detectPatterns(klineData);
        setPatternCount({
          headAndShoulders: patterns.headAndShoulders.length,
          doubleTop: patterns.doubleTop.length,
          doubleBottom: patterns.doubleBottom.length,
          triangle: patterns.triangle.length
        });
      } catch (err) {
        console.error('Error fetching technical analysis data:', err);
        setError('Failed to load analysis. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Update data periodically
    const updateInterval = setInterval(fetchData, 60000); // Update every minute
    
    return () => clearInterval(updateInterval);
  }, [symbol, interval]);
  
  // Helper function to get RSI class
  const getRsiClass = () => {
    if (rsi === null) return 'text-muted-foreground';
    if (rsi >= 70) return 'text-crypto-bearish'; // Overbought
    if (rsi <= 30) return 'text-crypto-bullish'; // Oversold
    return 'text-muted-foreground';
  };
  
  // Helper function to get MACD class
  const getMacdClass = () => {
    if (!macd) return 'text-muted-foreground';
    return macd.value > macd.signal ? 'text-crypto-bullish' : 'text-crypto-bearish';
  };
  
  // Helper function to get trend icon
  const getTrendIcon = () => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="w-5 h-5 text-crypto-bullish" />;
      case 'bearish':
        return <TrendingDown className="w-5 h-5 text-crypto-bearish" />;
      default:
        return <Minus className="w-5 h-5 text-crypto-neutral" />;
    }
  };
  
  // Get pattern evaluation
  const getPatternEvaluation = () => {
    const { headAndShoulders, doubleTop, doubleBottom, triangle } = patternCount;
    
    // Count bearish vs bullish patterns
    const bearishPatterns = headAndShoulders + doubleTop;
    const bullishPatterns = doubleBottom;
    
    if (bearishPatterns > bullishPatterns) {
      return {
        evaluation: 'bearish',
        description: `${bearishPatterns} bearish pattern${bearishPatterns !== 1 ? 's' : ''} detected`
      };
    } else if (bullishPatterns > bearishPatterns) {
      return {
        evaluation: 'bullish',
        description: `${bullishPatterns} bullish pattern${bullishPatterns !== 1 ? 's' : ''} detected`
      };
    } else if (triangle > 0) {
      return {
        evaluation: 'neutral',
        description: `${triangle} triangle pattern${triangle !== 1 ? 's' : ''} detected`
      };
    } else {
      return {
        evaluation: 'neutral',
        description: 'No significant patterns detected'
      };
    }
  };
  
  if (isLoading && data.length === 0) {
    return (
      <div className="glass-card rounded-lg p-4 animate-pulse h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading analysis...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="glass-card rounded-lg p-4 h-[400px] flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive mb-2" />
        <p className="text-destructive">{error}</p>
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="glass-card rounded-lg p-4 h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }
  
  const currentPrice = data[data.length - 1].close;
  const patternEval = getPatternEvaluation();
  
  return (
    <div className="glass-card rounded-lg p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">Technical Analysis</h3>
      
      {/* Overall Trend */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Trend
        </span>
        <div className="flex items-center space-x-2">
          {getTrendIcon()}
          <span className={`font-medium capitalize ${trend === 'bullish' ? 'text-crypto-bullish' : trend === 'bearish' ? 'text-crypto-bearish' : 'text-crypto-neutral'}`}>
            {trend}
          </span>
        </div>
      </div>
      
      {/* Pattern Detection */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-muted-foreground flex items-center gap-2">
          <BarChart2 className="w-4 h-4" />
          Patterns
        </span>
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${
            patternEval.evaluation === 'bullish' ? 'text-crypto-bullish' : 
            patternEval.evaluation === 'bearish' ? 'text-crypto-bearish' : 
            'text-crypto-neutral'
          }`}>
            {patternEval.description}
          </span>
        </div>
      </div>
      
      {/* RSI */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-muted-foreground">RSI</span>
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${getRsiClass()}`}>
            {rsi !== null ? rsi.toFixed(2) : 'N/A'}
          </span>
          <div className="text-xs px-1.5 py-0.5 rounded-full bg-secondary">
            {rsi !== null ? (rsi >= 70 ? 'Overbought' : rsi <= 30 ? 'Oversold' : 'Neutral') : ''}
          </div>
        </div>
      </div>
      
      {/* MACD */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-muted-foreground">MACD</span>
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${getMacdClass()}`}>
            {macd ? macd.value.toFixed(6) : 'N/A'}
          </span>
          <div className="text-xs px-1.5 py-0.5 rounded-full bg-secondary">
            {macd ? (macd.value > macd.signal ? 'Bullish' : 'Bearish') : ''}
          </div>
        </div>
      </div>
      
      {/* Risk/Reward Ratio */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-muted-foreground">Risk/Reward</span>
        <div className="flex items-center space-x-2">
          <span className="font-medium">
            {riskReward !== null ? `1:${riskReward.toFixed(2)}` : 'N/A'}
          </span>
          <div className="text-xs px-1.5 py-0.5 rounded-full bg-secondary">
            {riskReward !== null ? (riskReward >= 2 ? 'Favorable' : 'Unfavorable') : ''}
          </div>
        </div>
      </div>
      
      {/* Pattern Summary */}
      {(patternCount.headAndShoulders > 0 || patternCount.doubleTop > 0 || 
        patternCount.doubleBottom > 0 || patternCount.triangle > 0) && (
        <div className="mb-6 p-3 bg-secondary/30 rounded-md">
          <h4 className="text-sm font-medium mb-2">Patterns Detected:</h4>
          <ul className="text-xs space-y-1.5">
            {patternCount.headAndShoulders > 0 && (
              <li className="flex justify-between">
                <span className="text-muted-foreground">Head & Shoulders:</span>
                <span className="text-crypto-bearish">{patternCount.headAndShoulders} (Bearish)</span>
              </li>
            )}
            {patternCount.doubleTop > 0 && (
              <li className="flex justify-between">
                <span className="text-muted-foreground">Double Top:</span>
                <span className="text-crypto-bearish">{patternCount.doubleTop} (Bearish)</span>
              </li>
            )}
            {patternCount.doubleBottom > 0 && (
              <li className="flex justify-between">
                <span className="text-muted-foreground">Double Bottom:</span>
                <span className="text-crypto-bullish">{patternCount.doubleBottom} (Bullish)</span>
              </li>
            )}
            {patternCount.triangle > 0 && (
              <li className="flex justify-between">
                <span className="text-muted-foreground">Triangle:</span>
                <span className="text-crypto-neutral">{patternCount.triangle} (Neutral)</span>
              </li>
            )}
          </ul>
        </div>
      )}
      
      {/* Price Target */}
      <div className="mt-auto pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Suggested Target</span>
          </div>
          <span className="font-medium">
            {formatPrice(currentPrice * (trend === 'bullish' ? 1.05 : trend === 'bearish' ? 0.95 : 1))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAnalysis;
