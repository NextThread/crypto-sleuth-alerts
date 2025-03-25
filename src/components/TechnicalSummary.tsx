
import { useState, useEffect } from 'react';
import { KlineData, TimeInterval, getKlineData } from '../services/binanceService';
import { 
  calculateRSI, 
  calculateMACD, 
  calculateTrendDirection,
  detectPatterns,
  identifyEntryExitPoints,
  calculateSupportResistance
} from '../utils/technicalIndicators';
import { formatPrice } from '../utils/chartUtils';
import { AlertTriangle, BarChart2, TrendingUp, TrendingDown, Info, Sparkles, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TechnicalSummaryProps {
  symbol: string;
  interval: TimeInterval;
}

const TechnicalSummary = ({ symbol, interval }: TechnicalSummaryProps) => {
  const [data, setData] = useState<KlineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [confidence, setConfidence] = useState<number>(0);
  const [direction, setDirection] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const klineData = await getKlineData(symbol, interval);
        setData(klineData);
        
        // Generate technical analysis
        generateTechnicalAnalysis(klineData);
      } catch (err) {
        console.error('Error fetching technical analysis data:', err);
        setError('Failed to load analysis. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    const updateInterval = setInterval(fetchData, 120000); // Update every 2 minutes
    
    return () => clearInterval(updateInterval);
  }, [symbol, interval]);
  
  const generateTechnicalAnalysis = (klineData: KlineData[]) => {
    if (klineData.length < 30) return;
    
    // Calculate various technical indicators
    const rsiValues = calculateRSI(klineData);
    const currentRSI = rsiValues[rsiValues.length - 1];
    
    const macdResult = calculateMACD(klineData);
    const currentMACD = macdResult.macdLine[macdResult.macdLine.length - 1];
    const currentSignal = macdResult.signalLine[macdResult.signalLine.length - 1];
    
    const trend = calculateTrendDirection(klineData);
    setDirection(trend);
    
    const { entryPoints, exitPoints, stopLoss, takeProfit } = identifyEntryExitPoints(klineData);
    const { supports, resistances } = calculateSupportResistance(klineData);
    
    // Get price data
    const currentPrice = klineData[klineData.length - 1].close;
    const previousPrice = klineData[klineData.length - 10].close;
    const percentChange = ((currentPrice - previousPrice) / previousPrice) * 100;
    
    const volume = klineData[klineData.length - 1].volume;
    const avgVolume = klineData.slice(-10).reduce((sum, candle) => sum + candle.volume, 0) / 10;
    const volumeRatio = volume / avgVolume;
    
    // Patterns
    const patterns = detectPatterns(klineData);
    const patternsList: string[] = [];
    if (patterns.headAndShoulders?.length) patternsList.push('Head & Shoulders');
    if (patterns.doubleTop?.length) patternsList.push('Double Top');
    if (patterns.doubleBottom?.length) patternsList.push('Double Bottom');
    if (patterns.triangle?.length) patternsList.push(`${patterns.triangle[0]?.type} Triangle`);
    if (patterns.wedge?.length) patternsList.push(`${patterns.wedge[0]?.type} Wedge`);
    
    // Set confidence level (0-100)
    const signalStrength = trend === 'bullish' ? 
      (currentRSI > 50 ? 15 : 5) + (currentMACD > currentSignal ? 15 : 5) + (volumeRatio > 1 ? 10 : 0) + (patternsList.length * 5) : 
      trend === 'bearish' ? 
      (currentRSI < 50 ? 15 : 5) + (currentMACD < currentSignal ? 15 : 5) + (volumeRatio > 1 ? 10 : 0) + (patternsList.length * 5) : 
      50;
    
    setConfidence(Math.min(100, Math.max(0, 40 + signalStrength)));
    
    // Set risk level
    const volatility = Math.abs(percentChange) / 2;
    setRiskLevel(volatility > 5 ? 'high' : volatility > 2 ? 'medium' : 'low');
    
    // Generate key points
    const points = [
      `${trend === 'bullish' ? 'Bullish' : trend === 'bearish' ? 'Bearish' : 'Neutral'} trend over the ${getIntervalText(interval)} timeframe`,
      `RSI at ${currentRSI.toFixed(1)} - ${currentRSI > 70 ? 'overbought' : currentRSI < 30 ? 'oversold' : 'neutral'} conditions`,
      `MACD ${currentMACD > currentSignal ? 'above' : 'below'} signal line - ${currentMACD > currentSignal ? 'bullish' : 'bearish'} momentum`,
      volumeRatio > 1.5 ? 'Volume significantly above average - strong conviction' : 
      volumeRatio > 1 ? 'Volume above average - moderate conviction' : 
      'Volume below average - weak conviction',
      patternsList.length > 0 ? `Key patterns detected: ${patternsList.join(', ')}` : 'No significant patterns detected',
      supports.length > 0 ? `Nearest support at ${formatPrice(supports[0])}` : '',
      resistances.length > 0 ? `Nearest resistance at ${formatPrice(resistances[0])}` : ''
    ].filter(p => p !== '');
    
    setKeyPoints(points);
    
    // Generate full analysis text
    const analysisText = `
      Technical Analysis for ${symbol} on the ${getIntervalText(interval)} Timeframe:
      
      ${symbol} is currently trading at ${formatPrice(currentPrice)}, with a ${percentChange > 0 ? 'gain' : 'loss'} of ${Math.abs(percentChange).toFixed(2)}% over the past ${getTimeframeText(interval)}. The asset is demonstrating a ${trend} trend with ${volumeRatio > 1.5 ? 'strong' : volumeRatio > 1 ? 'moderate' : 'weak'} volume support. 
      
      From a momentum perspective, the Relative Strength Index (RSI) is registering a value of ${currentRSI.toFixed(1)}, indicating ${currentRSI > 70 ? 'overbought conditions that may suggest a potential reversal or pullback in the near term' : currentRSI < 30 ? 'oversold conditions that could present a buying opportunity as the asset may be undervalued' : 'neutral momentum without extreme buying or selling pressure'}. The Moving Average Convergence Divergence (MACD) is currently ${currentMACD > currentSignal ? 'above' : 'below'} its signal line, suggesting ${currentMACD > currentSignal ? 'bullish momentum is building' : 'bearish pressure is mounting'}.
      
      ${patternsList.length > 0 ? `Chart pattern analysis reveals the presence of ${patternsList.join(', ')}, which typically ${trend === 'bullish' ? 'supports upward movement' : trend === 'bearish' ? 'indicates potential downside risk' : 'suggests a period of consolidation'}.` : 'No significant chart patterns have been identified in the current timeframe, indicating a possible period of consolidation or transition between trend phases.'}
      
      Support and resistance analysis identifies critical price levels that market participants should monitor. ${supports.length > 0 ? `The nearest support zone is established at ${formatPrice(supports[0])}, with secondary support at ${supports.length > 1 ? formatPrice(supports[1]) : 'a lower level'}.` : ''} ${resistances.length > 0 ? `Key resistance is located at ${formatPrice(resistances[0])}, with further resistance at ${resistances.length > 1 ? formatPrice(resistances[1]) : 'a higher level'} if the upward momentum continues.` : ''}
      
      Volume analysis shows ${volume > avgVolume ? `trading activity ${(volume/avgVolume).toFixed(1)}x above the 10-period average, indicating ${volume > avgVolume * 1.5 ? 'strong market interest and conviction in the current move' : 'moderate conviction in the current price action'}` : 'below-average trading activity, suggesting limited conviction from market participants at current levels'}.
      
      In terms of risk assessment, ${symbol} currently presents a ${riskLevel} risk profile based on recent volatility and market conditions. The reward-to-risk ratio for potential new positions should be evaluated carefully, with appropriate position sizing to manage exposure.
      
      ${trend === 'bullish' ? `For bullish scenarios, traders might consider entry points near ${supports.length > 0 ? formatPrice(supports[0]) : 'support levels'} with targets at ${resistances.length > 0 ? formatPrice(resistances[0]) : 'overhead resistance'} and stop-loss orders below ${stopLoss ? formatPrice(stopLoss) : 'recent lows'} to manage downside risk.` : 
      trend === 'bearish' ? `For bearish scenarios, traders might consider short entries near ${resistances.length > 0 ? formatPrice(resistances[0]) : 'resistance levels'} with targets at ${supports.length > 0 ? formatPrice(supports[0]) : 'support levels'} and stop-loss orders above ${stopLoss ? formatPrice(stopLoss) : 'recent highs'} to control potential losses.` : 
      `Given the current neutral trend, traders might consider waiting for clearer directional signals before establishing new positions or focus on range-bound strategies between ${supports.length > 0 ? formatPrice(supports[0]) : 'support'} and ${resistances.length > 0 ? formatPrice(resistances[0]) : 'resistance'}.`}
      
      Market participants should remain vigilant for potential catalysts that could impact price action, including broader market trends, sector-specific developments, and any relevant news events. As always, risk management should be a priority, with position sizes appropriate to account size and risk tolerance.
    `;
    
    setAnalysis(analysisText.trim().replace(/\s+/g, ' ').replace(/      /g, '\n\n'));
  };
  
  const getIntervalText = (interval: TimeInterval): string => {
    switch (interval) {
      case '1s': return 'second';
      case '1m': return 'minute';
      case '5m': return '5-minute';
      case '15m': return '15-minute';
      case '1h': return 'hourly';
      case '4h': return '4-hour';
      case '1d': return 'daily';
      case '1w': return 'weekly';
      case '1M': return 'monthly';
      default: return interval;
    }
  };
  
  const getTimeframeText = (interval: TimeInterval): string => {
    switch (interval) {
      case '1s': return 'few seconds';
      case '1m': return 'few minutes';
      case '5m': return '25 minutes';
      case '15m': return 'few hours';
      case '1h': return 'day';
      case '4h': return 'few days';
      case '1d': return 'week';
      case '1w': return 'month';
      case '1M': return 'several months';
      default: return 'period';
    }
  };
  
  const getRiskBadgeVariant = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low': return 'success';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };
  
  if (isLoading && data.length === 0) {
    return (
      <Card className="glass-card rounded-lg p-4 animate-pulse h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">Loading detailed analysis...</p>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="glass-card rounded-lg p-4 h-[400px] flex flex-col items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive mb-2" />
        <p className="text-destructive">{error}</p>
      </Card>
    );
  }
  
  if (data.length === 0) {
    return (
      <Card className="glass-card rounded-lg p-4 h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </Card>
    );
  }
  
  return (
    <Card className="glass-card rounded-lg overflow-hidden transition-all duration-300 transform hover:shadow-lg">
      <CardHeader className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Detailed Technical Summary
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getRiskBadgeVariant(riskLevel)} className="capitalize">
              {riskLevel} Risk
            </Badge>
            <Badge variant={direction === 'bullish' ? 'success' : direction === 'bearish' ? 'destructive' : 'secondary'} className="capitalize">
              {direction}
            </Badge>
            <Badge variant="outline" className="bg-primary/10">
              Confidence: {confidence}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="w-full sm:w-2/3">
              <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                Key Insights
              </h3>
              <ul className="space-y-2">
                {keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-full sm:w-1/3 bg-secondary/10 rounded-md p-4 flex flex-col items-center justify-center border border-white/5">
              <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-primary" />
                Signal Strength
              </h3>
              <div className="w-full h-4 bg-secondary/40 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${direction === 'bullish' ? 'bg-crypto-bullish' : direction === 'bearish' ? 'bg-crypto-bearish' : 'bg-primary'}`}
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <div className="flex justify-between w-full mt-1 text-xs text-muted-foreground">
                <span>Weak</span>
                <span>Moderate</span>
                <span>Strong</span>
              </div>
              <p className="mt-3 text-sm text-center">
                {confidence < 40 && "Signals are weak. Consider waiting for confirmation."}
                {confidence >= 40 && confidence < 70 && "Moderate signal strength. Proceed with caution."}
                {confidence >= 70 && "Strong signals detected. High confidence setup."}
              </p>
            </div>
          </div>
          
          <Separator className="bg-white/10" />
          
          <div>
            <h3 className="text-base font-medium flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-primary" />
              Comprehensive Analysis
            </h3>
            <div className="text-muted-foreground text-sm space-y-3 leading-relaxed">
              {analysis.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="bg-secondary/20 text-primary/90">
              {`Last updated: ${new Date().toLocaleTimeString()}`}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalSummary;
