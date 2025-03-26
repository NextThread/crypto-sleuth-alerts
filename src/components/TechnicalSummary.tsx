
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
import { AlertTriangle, BarChart2, TrendingUp, TrendingDown, Info, Sparkles, Target, Zap, Shield, ArrowRight, AlertCircle, Gauge, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [marketInsights, setMarketInsights] = useState<string[]>([]);
  const [tradingSentiment, setTradingSentiment] = useState<string>('');
  
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
    
    // Generate market insights
    const insights = [
      `${symbol} is demonstrating ${currentRSI > 70 ? 'extreme buying pressure' : currentRSI < 30 ? 'extreme selling pressure' : 'balanced buying and selling activity'} based on RSI analysis.`,
      `MACD crossover analysis indicates ${currentMACD > currentSignal ? 'potential upward momentum building' : 'potential downward pressure forming'}.`,
      `${volumeRatio > 1.5 ? 'Extraordinary volume suggests strong institutional interest' : volumeRatio > 1 ? 'Above-average volume confirms the current price action' : 'Below-average volume indicates lack of conviction'}.`,
      `Price action is forming a ${patternsList.length > 0 ? patternsList.join(' and ') + ' pattern' : 'consolidation phase without clear patterns'}.`,
      `Support and resistance analysis reveals critical price levels at ${supports.length > 0 ? formatPrice(supports[0]) : 'prior lows'} and ${resistances.length > 0 ? formatPrice(resistances[0]) : 'prior highs'}.`,
      `Market sentiment indicators suggest ${trend === 'bullish' ? 'accumulation phase may be underway' : trend === 'bearish' ? 'distribution phase may be occurring' : 'a period of indecision and consolidation'}.`,
      `Risk assessment: ${riskLevel === 'high' ? 'High volatility requires strict risk management' : riskLevel === 'medium' ? 'Moderate risk profile suitable for balanced portfolios' : 'Lower risk environment favorable for position building'}.`,
    ];
    
    setMarketInsights(insights);
    
    // Set trading sentiment
    const sentiment = trend === 'bullish' ? 
      'Bullish momentum is evident across multiple indicators, suggesting potential for upward price movement. Traders may consider strategic entries after pullbacks to key support levels.' :
      trend === 'bearish' ?
      'Bearish signals are dominating the technical landscape, indicating possible continued downward pressure. Risk management and defensive positioning are advised.' :
      'Market indicators show conflicting signals, suggesting a period of consolidation. Range-bound trading strategies may be optimal until clearer directional bias emerges.';
    
    setTradingSentiment(sentiment);
    
    // Generate full analysis text
    const analysisText = `
      **Comprehensive Technical Analysis for ${symbol} on the ${getIntervalText(interval)} Timeframe**
      
      ${symbol} is currently trading at ${formatPrice(currentPrice)}, with a ${percentChange > 0 ? 'gain' : 'loss'} of ${Math.abs(percentChange).toFixed(2)}% over the past ${getTimeframeText(interval)}. The asset is demonstrating a ${trend} trend with ${volumeRatio > 1.5 ? 'strong' : volumeRatio > 1 ? 'moderate' : 'weak'} volume support. 
      
      **Momentum Analysis:**
      
      The Relative Strength Index (RSI) is registering a value of ${currentRSI.toFixed(1)}, indicating ${currentRSI > 70 ? 'overbought conditions that may suggest a potential reversal or pullback in the near term' : currentRSI < 30 ? 'oversold conditions that could present a buying opportunity as the asset may be undervalued' : 'neutral momentum without extreme buying or selling pressure'}. The Moving Average Convergence Divergence (MACD) is currently ${currentMACD > currentSignal ? 'above' : 'below'} its signal line, suggesting ${currentMACD > currentSignal ? 'bullish momentum is building' : 'bearish pressure is mounting'}.
      
      **Pattern Recognition Analysis:**
      
      ${patternsList.length > 0 ? `Chart pattern analysis reveals the presence of ${patternsList.join(', ')}, which typically ${trend === 'bullish' ? 'supports upward movement' : trend === 'bearish' ? 'indicates potential downside risk' : 'suggests a period of consolidation'}.` : 'No significant chart patterns have been identified in the current timeframe, indicating a possible period of consolidation or transition between trend phases.'}
      
      **Support & Resistance Analysis:**
      
      Support and resistance analysis identifies critical price levels that market participants should monitor. ${supports.length > 0 ? `The nearest support zone is established at ${formatPrice(supports[0])}, with secondary support at ${supports.length > 1 ? formatPrice(supports[1]) : 'a lower level'}.` : ''} ${resistances.length > 0 ? `Key resistance is located at ${formatPrice(resistances[0])}, with further resistance at ${resistances.length > 1 ? formatPrice(resistances[1]) : 'a higher level'} if the upward momentum continues.` : ''}
      
      **Volume Analysis:**
      
      Volume analysis shows ${volume > avgVolume ? `trading activity ${(volume/avgVolume).toFixed(1)}x above the 10-period average, indicating ${volume > avgVolume * 1.5 ? 'strong market interest and conviction in the current move' : 'moderate conviction in the current price action'}` : 'below-average trading activity, suggesting limited conviction from market participants at current levels'}.
      
      **Risk Assessment:**
      
      In terms of risk assessment, ${symbol} currently presents a ${riskLevel} risk profile based on recent volatility and market conditions. The reward-to-risk ratio for potential new positions should be evaluated carefully, with appropriate position sizing to manage exposure.
      
      **Trading Strategy Insights:**
      
      ${trend === 'bullish' ? `For bullish scenarios, traders might consider entry points near ${supports.length > 0 ? formatPrice(supports[0]) : 'support levels'} with targets at ${resistances.length > 0 ? formatPrice(resistances[0]) : 'overhead resistance'} and stop-loss orders below ${stopLoss ? formatPrice(stopLoss) : 'recent lows'} to manage downside risk.` : 
      trend === 'bearish' ? `For bearish scenarios, traders might consider short entries near ${resistances.length > 0 ? formatPrice(resistances[0]) : 'resistance levels'} with targets at ${supports.length > 0 ? formatPrice(supports[0]) : 'support levels'} and stop-loss orders above ${stopLoss ? formatPrice(stopLoss) : 'recent highs'} to control potential losses.` : 
      `Given the current neutral trend, traders might consider waiting for clearer directional signals before establishing new positions or focus on range-bound strategies between ${supports.length > 0 ? formatPrice(supports[0]) : 'support'} and ${resistances.length > 0 ? formatPrice(resistances[0]) : 'resistance'}.`}
      
      **Market Context & Future Outlook:**
      
      Market participants should remain vigilant for potential catalysts that could impact price action, including broader market trends, sector-specific developments, and any relevant news events. As always, risk management should be a priority, with position sizes appropriate to account size and risk tolerance.
      
      The overall market structure suggests ${trend === 'bullish' ? 'potential for continued upward movement if key resistance levels are broken with conviction' : trend === 'bearish' ? 'risk of further decline if support levels fail to hold under selling pressure' : 'a period of price discovery and consolidation before the next directional move'}.
      
      **Advanced Indicator Confluence:**
      
      Multiple technical indicators are currently ${trend === 'bullish' ? 'aligning in bullish confluence' : trend === 'bearish' ? 'converging in bearish alignment' : 'showing mixed signals'}. This ${confidence > 70 ? 'strong' : confidence > 50 ? 'moderate' : 'weak'} indicator consensus suggests a ${confidence > 70 ? 'high-probability' : confidence > 50 ? 'potential' : 'possible'} continuation of the current ${trend} bias in the short to medium term.
    `;
    
    setAnalysis(analysisText.trim());
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
  
  const getDirectionTextColor = (dir: 'bullish' | 'bearish' | 'neutral') => {
    switch (dir) {
      case 'bullish': return 'text-green-500';
      case 'bearish': return 'text-red-500';
      case 'neutral': return 'text-blue-500';
      default: return '';
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
      <CardHeader className="p-4 border-b border-white/5 bg-gradient-to-r from-secondary/20 to-transparent">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-primary" />
            Advanced Technical Analysis
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
        <div className="flex flex-col space-y-6">
        
          {/* Trading Sentiment Alert */}
          <Alert className={`border-0 ${
            direction === 'bullish' ? 'bg-green-500/10' : 
            direction === 'bearish' ? 'bg-red-500/10' : 
            'bg-blue-500/10'
          }`}>
            <AlertCircle className={`h-5 w-5 ${
              direction === 'bullish' ? 'text-green-500' : 
              direction === 'bearish' ? 'text-red-500' : 
              'text-blue-500'
            }`} />
            <AlertDescription className="font-medium">
              {tradingSentiment}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="w-full sm:w-2/3">
              <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-gradient-primary font-semibold">Key Insights</span>
              </h3>
              <ul className="space-y-3">
                {keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm bg-secondary/5 p-2 rounded-md border-l-2 border-primary/30">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-muted-foreground">
                      {point.includes('Bullish') ? (
                        <span>
                          <strong className="text-green-500">Bullish</strong>{point.replace('Bullish', '')}
                        </span>
                      ) : point.includes('Bearish') ? (
                        <span>
                          <strong className="text-red-500">Bearish</strong>{point.replace('Bearish', '')}
                        </span>
                      ) : point.includes('RSI') ? (
                        <span>
                          <strong className="text-primary">RSI</strong>{point.replace('RSI', '')}
                        </span>
                      ) : point.includes('MACD') ? (
                        <span>
                          <strong className="text-primary">MACD</strong>{point.replace('MACD', '')}
                        </span>
                      ) : point.includes('Volume') ? (
                        <span>
                          <strong className="text-primary">Volume</strong>{point.replace('Volume', '')}
                        </span>
                      ) : point.includes('patterns detected') ? (
                        <span>
                          <strong className="text-yellow-500">Key patterns detected:</strong>{point.replace('Key patterns detected:', '')}
                        </span>
                      ) : point.includes('support') ? (
                        <span>
                          <strong className="text-green-500">Support:</strong>{point.replace('Nearest support at', '')}
                        </span>
                      ) : point.includes('resistance') ? (
                        <span>
                          <strong className="text-red-500">Resistance:</strong>{point.replace('Nearest resistance at', '')}
                        </span>
                      ) : (
                        point
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-full sm:w-1/3 bg-secondary/10 rounded-md p-4 flex flex-col items-center justify-center border border-white/5">
              <h3 className="text-base font-medium flex items-center gap-2 mb-3">
                <Gauge className="h-4 w-4 text-primary" />
                <span className="text-gradient-primary font-semibold">Signal Strength</span>
              </h3>
              <div className="w-full h-4 bg-secondary/40 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${direction === 'bullish' ? 'bg-green-500' : direction === 'bearish' ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${confidence}%` }}
                ></div>
              </div>
              <div className="flex justify-between w-full mt-1 text-xs text-muted-foreground">
                <span>Weak</span>
                <span>Moderate</span>
                <span>Strong</span>
              </div>
              <p className={`mt-3 text-sm text-center font-medium ${
                confidence < 40 ? 'text-yellow-500' : 
                confidence >= 40 && confidence < 70 ? 'text-blue-500' : 
                'text-green-500'
              }`}>
                {confidence < 40 && "Signals are weak. Consider waiting for confirmation."}
                {confidence >= 40 && confidence < 70 && "Moderate signal strength. Proceed with caution."}
                {confidence >= 70 && "Strong signals detected. High conviction setup."}
              </p>
            </div>
          </div>
          
          <Separator className="bg-white/10" />
          
          <div>
            <h3 className="text-base font-medium flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-gradient-primary font-semibold">Market Structure Insights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {marketInsights.map((insight, index) => (
                <div key={index} className="bg-secondary/5 p-3 rounded-lg border-l-2 border-primary/20">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.includes('RSI') ? (
                      <span>
                        <strong className="text-primary">RSI Analysis:</strong>{insight.replace(symbol + ' is demonstrating', '')}
                      </span>
                    ) : insight.includes('MACD') ? (
                      <span>
                        <strong className="text-primary">MACD Signals:</strong>{insight.replace('MACD crossover analysis indicates', '')}
                      </span>
                    ) : insight.includes('volume') ? (
                      <span>
                        <strong className="text-primary">Volume Profile:</strong>{insight.replace('Extraordinary volume', 'Volume')}
                      </span>
                    ) : insight.includes('pattern') ? (
                      <span>
                        <strong className="text-yellow-500">Pattern Formation:</strong>{insight.replace('Price action is forming a', '')}
                      </span>
                    ) : insight.includes('Support and resistance') ? (
                      <span>
                        <strong className="text-blue-500">Key Levels:</strong>{insight.replace('Support and resistance analysis reveals', '')}
                      </span>
                    ) : insight.includes('Market sentiment') ? (
                      <span>
                        <strong className="text-purple-500">Market Psychology:</strong>{insight.replace('Market sentiment indicators suggest', '')}
                      </span>
                    ) : insight.includes('Risk assessment') ? (
                      <span>
                        <strong className={`${
                          insight.includes('High volatility') ? 'text-red-500' : 
                          insight.includes('Moderate risk') ? 'text-yellow-500' : 
                          'text-green-500'
                        }`}>Risk Profile:</strong>{insight.replace('Risk assessment:', '')}
                      </span>
                    ) : (
                      insight
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="bg-white/10" />
          
          <div>
            <h3 className="text-base font-medium flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-gradient-primary font-semibold">Comprehensive Analysis</span>
            </h3>
            <div className="text-muted-foreground text-sm space-y-4 leading-relaxed">
              {analysis.split('\n\n').map((paragraph, index) => {
                // Check if paragraph is a header (starts with **)
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return (
                    <h4 key={index} className="text-lg font-bold text-foreground mt-4">
                      {paragraph.replace(/\*\*/g, '')}
                    </h4>
                  );
                }
                
                // Check if paragraph has bold text within it
                if (paragraph.includes('**')) {
                  const parts = paragraph.split('**');
                  let isHeader = false;
                  
                  return (
                    <p key={index} className="leading-relaxed">
                      {parts.map((part, i) => {
                        if (i % 2 === 1) { // Bold parts
                          isHeader = true;
                          return <strong key={i} className="text-primary">{part}</strong>;
                        } else {
                          // Check for special terms to highlight
                          let processedText = part;
                          
                          // Highlight bullish/bearish terms
                          processedText = processedText.replace(/\b(bullish|upward|buying|accumulation|oversold)\b/gi, match => 
                            `<span class="text-green-500 font-medium">${match}</span>`
                          );
                          processedText = processedText.replace(/\b(bearish|downward|selling|distribution|overbought)\b/gi, match => 
                            `<span class="text-red-500 font-medium">${match}</span>`
                          );
                          
                          // Highlight technical terms
                          processedText = processedText.replace(/\b(RSI|MACD|volume|pattern|support|resistance|momentum|trend|consolidation|volatility|reversal)\b/gi, match => 
                            `<span class="text-blue-500 font-medium">${match}</span>`
                          );
                          
                          return <span key={i} dangerouslySetInnerHTML={{ __html: processedText }} />;
                        }
                      })}
                    </p>
                  );
                }
                
                // Regular paragraph with term highlighting
                let processedText = paragraph;
                
                // Highlight bullish/bearish terms
                processedText = processedText.replace(/\b(bullish|upward|buying|accumulation|oversold)\b/gi, match => 
                  `<span class="text-green-500 font-medium">${match}</span>`
                );
                processedText = processedText.replace(/\b(bearish|downward|selling|distribution|overbought)\b/gi, match => 
                  `<span class="text-red-500 font-medium">${match}</span>`
                );
                
                // Highlight technical terms
                processedText = processedText.replace(/\b(RSI|MACD|volume|pattern|support|resistance|momentum|trend|consolidation|volatility|reversal)\b/gi, match => 
                  `<span class="text-blue-500 font-medium">${match}</span>`
                );
                
                return <p key={index} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: processedText }} />;
              })}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <Badge variant="outline" className="bg-secondary/20 text-primary/90">
              {`Last updated: ${new Date().toLocaleTimeString()}`}
            </Badge>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="mr-1">Powered by </span>
              <span className="font-semibold text-primary">ChartPulse AI</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalSummary;
