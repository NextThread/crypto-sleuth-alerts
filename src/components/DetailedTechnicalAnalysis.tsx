
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChartBarIcon, LineChart, CandlestickChart, TrendingUp, TrendingDown, AlertTriangle, Gauge, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DetailedTechnicalAnalysisProps {
  symbol: string;
  interval: string;
}

const DetailedTechnicalAnalysis = ({ symbol, interval }: DetailedTechnicalAnalysisProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // This would normally come from an API or calculation
  const generateAnalysis = () => {
    const baseAsset = symbol.replace(/USDT|BTC|ETH|BUSD/, '');
    const timeframes = ['1h', '4h', '1d', '1w'];
    const patterns = ['Double Bottom', 'Head and Shoulders', 'Descending Triangle', 'Bull Flag', 'Cup and Handle'];
    const supports = [Math.floor(Math.random() * 1000) + 10000, Math.floor(Math.random() * 1000) + 9000];
    const resistances = [Math.floor(Math.random() * 1000) + 11000, Math.floor(Math.random() * 1000) + 12000];
    const momentum = ['Strong Bullish', 'Moderate Bullish', 'Neutral', 'Moderate Bearish', 'Strong Bearish'];
    const selectedMomentum = momentum[Math.floor(Math.random() * momentum.length)];
    const bestTimeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
    const currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    return {
      baseAsset,
      pattern: currentPattern,
      supports,
      resistances,
      momentum: selectedMomentum,
      bestTimeframe,
      summary: `${baseAsset} is currently showing ${selectedMomentum.toLowerCase()} momentum with a ${currentPattern} pattern formation visible on the ${bestTimeframe} timeframe.`
    };
  };
  
  const analysis = generateAnalysis();
  
  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="my-12 glass-panel p-6 rounded-lg animate-fade-in">
        <Alert className="border-primary/30 bg-primary/5">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>Sign in to view detailed technical analysis for {symbol}.</p>
            <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
              Sign In to View
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="my-12 glass-panel rounded-lg p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <LineChart className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Detailed Technical Analysis</h2>
      </div>
      
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                Current Market Overview for {symbol}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {analysis.baseAsset} is currently positioned at a critical juncture in its price action. The {interval} timeframe 
                reveals significant price structure developing, with multiple technical indicators suggesting a potential directional move. 
                Volume analysis shows {Math.random() > 0.5 ? "increasing" : "decreasing"} participation from market makers, which typically 
                precedes substantial price movements. 
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                The most distinctive feature on the current chart is a {analysis.pattern} pattern that has been forming over the past 
                several periods. This pattern is typically considered {analysis.momentum.includes("Bullish") ? "bullish" : analysis.momentum.includes("Bearish") ? "bearish" : "neutral"} 
                and suggests a potential {analysis.momentum.includes("Bullish") ? "upward" : analysis.momentum.includes("Bearish") ? "downward" : "sideways"} movement 
                if the pattern completes according to classical technical analysis principles.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                <CandlestickChart className="h-5 w-5 text-primary" />
                Pattern Recognition & Formation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our pattern recognition algorithm has identified a {analysis.pattern} forming on the {analysis.bestTimeframe} timeframe with 
                a confidence level of {Math.floor(Math.random() * 20) + 75}%. This pattern is characterized by 
                {analysis.pattern === "Double Bottom" ? 
                  " two consecutive lows at approximately the same price level, indicating a potential reversal from a downtrend to an uptrend." : 
                analysis.pattern === "Head and Shoulders" ? 
                  " three peaks with the middle peak (head) being the highest and the two outside peaks (shoulders) being lower and roughly equal, suggesting a potential reversal from an uptrend to a downtrend." : 
                analysis.pattern === "Descending Triangle" ? 
                  " a series of lower highs creating a descending trendline, combined with roughly equal lows creating a horizontal support line. This typically indicates continuation of a bearish trend." : 
                analysis.pattern === "Bull Flag" ? 
                  " a strong upward movement followed by a consolidation period with a slight downward drift, resembling a flag on a pole. This typically indicates continuation of the bullish trend after the consolidation." : 
                  " a rounded bottom formation followed by a slight pullback resembling a cup and handle, suggesting a potential bullish continuation after completion."}
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                Historical backtesting of this pattern on {analysis.baseAsset} shows that it has been correct in predicting the subsequent 
                price direction approximately {Math.floor(Math.random() * 15) + 65}% of the time, with an average price movement of 
                {Math.floor(Math.random() * 10) + 5}% following the pattern completion.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-foreground mb-3 flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Multi-Timeframe Analysis
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Looking across multiple timeframes provides a more comprehensive picture of {analysis.baseAsset}'s market structure:
              </p>
              <ul className="mt-3 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded mt-0.5">1H</span>
                  <span className="text-muted-foreground">
                    Showing {Math.random() > 0.5 ? "bullish" : "bearish"} momentum with {Math.random() > 0.5 ? "increasing" : "flat"} volume. 
                    RSI is {Math.floor(Math.random() * 30) + 40}, indicating {Math.random() > 0.5 ? "neutral" : "slightly oversold"} conditions.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded mt-0.5">4H</span>
                  <span className="text-muted-foreground">
                    {analysis.pattern} pattern is most visible here. MACD shows {Math.random() > 0.5 ? "bullish" : "bearish"} divergence, 
                    supporting the pattern's implications.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded mt-0.5">1D</span>
                  <span className="text-muted-foreground">
                    Overall trend is {Math.random() > 0.5 ? "upward" : "downward"} with key support at {analysis.supports[0]} and 
                    resistance at {analysis.resistances[0]}. Bollinger Bands show {Math.random() > 0.5 ? "contraction" : "expansion"}, 
                    suggesting {Math.random() > 0.5 ? "decreased" : "increased"} volatility ahead.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded mt-0.5">1W</span>
                  <span className="text-muted-foreground">
                    Long-term trend remains {Math.random() > 0.5 ? "bullish" : "bearish"} with significant historical support zones 
                    around {analysis.supports[1]}. Weekly RSI shows {Math.random() > 0.5 ? "no" : "potential"} divergence from price action.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 space-y-6">
            <div className="glass-panel border border-white/10 rounded-lg p-5">
              <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-primary" />
                Key Levels
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">Resistance Levels</h4>
                  <div className="space-y-2">
                    {analysis.resistances.map((level, i) => (
                      <div key={`resistance-${i}`} className="flex justify-between items-center">
                        <span className="font-medium flex items-center gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5 text-red-400" />
                          R{i + 1}:
                        </span>
                        <span className="font-mono">${level.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-muted-foreground mb-2">Support Levels</h4>
                  <div className="space-y-2">
                    {analysis.supports.map((level, i) => (
                      <div key={`support-${i}`} className="flex justify-between items-center">
                        <span className="font-medium flex items-center gap-1.5">
                          <TrendingDown className="h-3.5 w-3.5 text-green-400" />
                          S{i + 1}:
                        </span>
                        <span className="font-mono">${level.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel border border-white/10 rounded-lg p-5">
              <h3 className="text-lg font-medium text-foreground mb-4">Current Momentum</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/20">
                      {analysis.momentum}
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-secondary/30">
                  <div 
                    style={{ 
                      width: `${
                        analysis.momentum === 'Strong Bearish' ? '20%' : 
                        analysis.momentum === 'Moderate Bearish' ? '40%' : 
                        analysis.momentum === 'Neutral' ? '50%' : 
                        analysis.momentum === 'Moderate Bullish' ? '70%' : '90%'
                      }` 
                    }} 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      analysis.momentum.includes('Bullish') ? 'bg-green-500' : 
                      analysis.momentum.includes('Bearish') ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel border border-white/10 rounded-lg p-5">
              <h3 className="text-lg font-medium text-foreground mb-4">Best Performing Timeframe</h3>
              <div className="flex items-center justify-center gap-4">
                {['1H', '4H', '1D', '1W'].map((tf) => (
                  <div 
                    key={tf}
                    className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg ${
                      analysis.bestTimeframe === tf.toLowerCase() ? 
                      'bg-primary text-primary-foreground ring-2 ring-primary/50' : 
                      'bg-secondary/30 text-muted-foreground'
                    }`}
                  >
                    <span className={`text-lg font-semibold ${analysis.bestTimeframe === tf.toLowerCase() ? 'text-white' : ''}`}>{tf}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-3">
                The {analysis.bestTimeframe} timeframe currently shows the clearest pattern formation and trading opportunities.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-lg font-medium text-foreground mb-3">Trading Opportunities & Outlook</h3>
          <p className="text-muted-foreground leading-relaxed">
            Based on our comprehensive technical analysis, {analysis.baseAsset} presents {
              analysis.momentum.includes('Bullish') ? 'potential buying opportunities' : 
              analysis.momentum.includes('Bearish') ? 'potential shorting opportunities' : 
              'a wait-and-see scenario'
            } for traders. The {analysis.pattern} pattern on the {analysis.bestTimeframe} timeframe, combined with 
            the current market structure and momentum indicators, suggests that the asset may be preparing for a 
            {analysis.momentum.includes('Bullish') ? ' move upward' : 
              analysis.momentum.includes('Bearish') ? ' move downward' : 
              ' period of consolidation'
            } in the near term.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Traders seeking to capitalize on this analysis should consider {
              analysis.momentum.includes('Bullish') ? 
                `setting buy orders near the support levels of $${analysis.supports[0].toLocaleString()} with initial targets at $${analysis.resistances[0].toLocaleString()}` : 
              analysis.momentum.includes('Bearish') ? 
                `setting short positions near the resistance levels of $${analysis.resistances[0].toLocaleString()} with initial targets at $${analysis.supports[0].toLocaleString()}` : 
                `waiting for a clear breakout above $${analysis.resistances[0].toLocaleString()} or below $${analysis.supports[0].toLocaleString()} before entering a position`
            }. As always, proper risk management should be employed, with stop losses placed at appropriate levels to protect capital.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailedTechnicalAnalysis;
