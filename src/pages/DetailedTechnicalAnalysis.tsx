
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, CheckCircle, BarChart2, ChartPie, LineChart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface DetailedTechnicalAnalysisProps {
  symbol: string;
  interval: string;
}

const DetailedTechnicalAnalysis: React.FC<DetailedTechnicalAnalysisProps> = ({ symbol, interval }) => {
  const { currentSubscription } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const isPremiumUser = currentSubscription.planId !== null;
  
  // Generate realistic analysis based on the symbol and interval
  const getAnalysis = () => {
    const analysisPatterns = [
      {
        pattern: "Head and Shoulders",
        description: "A reversal pattern signaling the potential end of an uptrend, characterized by three peaks with the middle peak being the highest.",
        timeframe: "1D",
        sentiment: "bearish",
        confidence: 75
      },
      {
        pattern: "Double Bottom",
        description: "A bullish reversal pattern formed after a downtrend, characterized by two lows at approximately the same level, indicating potential support.",
        timeframe: "4H",
        sentiment: "bullish",
        confidence: 82
      },
      {
        pattern: "Ascending Triangle",
        description: "A bullish continuation pattern characterized by a horizontal line at the top and an upward-sloping line at the bottom.",
        timeframe: "1H",
        sentiment: "bullish",
        confidence: 68
      },
      {
        pattern: "Descending Triangle",
        description: "A bearish continuation pattern characterized by a horizontal line at the bottom and a downward-sloping line at the top.",
        timeframe: "1D",
        sentiment: "bearish",
        confidence: 71
      },
      {
        pattern: "Cup and Handle",
        description: "A bullish continuation pattern resembling a cup with a handle, signaling a pause in an uptrend followed by continuation.",
        timeframe: "1W",
        sentiment: "bullish",
        confidence: 79
      }
    ];
    
    // Deterministic selection based on symbol and interval
    const symbolHash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const intervalHash = interval.length;
    const patternIndex = (symbolHash + intervalHash) % analysisPatterns.length;
    
    return analysisPatterns[patternIndex];
  };
  
  const analysis = getAnalysis();
  
  // Generate realistic support and resistance levels
  const getSupportResistance = (base: number) => {
    const getRandomOffset = (percent: number) => base * (percent / 100);
    
    return {
      strongSupport: base - getRandomOffset(7.5),
      moderateSupport: base - getRandomOffset(3.2),
      weakSupport: base - getRandomOffset(1.8),
      weakResistance: base + getRandomOffset(2.1),
      moderateResistance: base + getRandomOffset(4.6),
      strongResistance: base + getRandomOffset(9.3)
    };
  };
  
  // Sample base price for demo
  const basePrice = symbol.includes('BTC') ? 26800 : 
                   symbol.includes('ETH') ? 1850 : 
                   symbol.includes('SOL') ? 28.5 : 45.25;
  
  const levels = getSupportResistance(basePrice);
  
  // Technical analysis insights
  const technicalInsights = [
    {
      indicator: "RSI (14)",
      value: "58.24",
      interpretation: "Neutral with bullish bias",
      signal: "neutral"
    },
    {
      indicator: "MACD (12,26,9)",
      value: "Bullish Crossover",
      interpretation: "Strong bullish momentum developing",
      signal: "bullish"
    },
    {
      indicator: "Stochastic (14,3,3)",
      value: "76.35",
      interpretation: "Approaching overbought territory",
      signal: "neutral"
    },
    {
      indicator: "Bollinger Bands",
      value: "Price testing upper band",
      interpretation: "Potential price breakout or reversal",
      signal: "neutral"
    },
    {
      indicator: "MA50/MA200",
      value: "Recent Golden Cross",
      interpretation: "Long-term bullish signal",
      signal: "bullish"
    }
  ];
  
  if (!user) {
    return (
      <Alert className="mb-10 border-primary/30 bg-primary/5">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>Sign in to view detailed technical analysis and pattern recognition.</p>
          <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
            Sign In to View Analysis
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!isPremiumUser) {
    return (
      <Alert className="mb-10 border-yellow-600/30 bg-yellow-600/5">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>Upgrade to access detailed technical analysis with pattern recognition.</p>
          <Button onClick={() => navigate('/subscription')} className="bg-yellow-600 hover:bg-yellow-700">
            Upgrade to Premium
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="mb-10 glass-card animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ChartPie className="h-5 w-5 text-primary" />
          Detailed Technical Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Pattern Analysis
              </h3>
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{analysis.pattern}</span>
                    <Badge variant={analysis.sentiment === 'bullish' ? 'success' : 'destructive'} className="capitalize">
                      {analysis.sentiment}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="bg-secondary/30">
                    {analysis.timeframe} Timeframe
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {analysis.description}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-muted-foreground mr-2">Confidence:</span>
                  <div className="w-full bg-secondary/20 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        analysis.confidence > 70 ? 'bg-crypto-bullish' : 
                        analysis.confidence > 50 ? 'bg-yellow-500' : 'bg-crypto-bearish'
                      }`}
                      style={{ width: `${analysis.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs ml-2 font-mono">{analysis.confidence}%</span>
                </div>
              </div>
              
              <h4 className="text-sm font-medium mb-2 mt-6">Technical Analysis Summary</h4>
              <p className="text-muted-foreground text-sm italic mb-4 leading-relaxed">
                {symbol} is currently displaying characteristics of a {analysis.pattern} pattern on the {analysis.timeframe} timeframe, 
                suggesting a {analysis.sentiment} bias. This pattern typically forms when {
                  analysis.sentiment === 'bullish' 
                    ? 'buying pressure is starting to overcome selling pressure, indicating potential upward movement.' 
                    : 'selling pressure is overcoming buying pressure, indicating potential downward movement.'
                } With a confidence level of {analysis.confidence}%, traders should monitor for {
                  analysis.sentiment === 'bullish' 
                    ? 'breakout above the resistance levels, particularly around $' + levels.moderateResistance.toFixed(2) + '.'
                    : 'breakdown below the support levels, particularly around $' + levels.moderateSupport.toFixed(2) + '.'
                }
              </p>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Timeframe Analysis</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">15m</div>
                    <Badge variant={Math.random() > 0.5 ? 'success' : 'destructive'} className="w-full">
                      {Math.random() > 0.5 ? 'Bullish' : 'Bearish'}
                    </Badge>
                  </div>
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">1H</div>
                    <Badge variant={Math.random() > 0.5 ? 'success' : 'destructive'} className="w-full">
                      {Math.random() > 0.5 ? 'Bullish' : 'Bearish'}
                    </Badge>
                  </div>
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">4H</div>
                    <Badge variant={Math.random() > 0.5 ? 'success' : 'destructive'} className="w-full">
                      {Math.random() > 0.5 ? 'Bullish' : 'Bearish'}
                    </Badge>
                  </div>
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">1D</div>
                    <Badge variant={Math.random() > 0.5 ? 'success' : 'destructive'} className="w-full">
                      {Math.random() > 0.5 ? 'Bullish' : 'Bearish'}
                    </Badge>
                  </div>
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">1W</div>
                    <Badge variant={Math.random() > 0.5 ? 'success' : 'destructive'} className="w-full">
                      {Math.random() > 0.5 ? 'Bullish' : 'Bearish'}
                    </Badge>
                  </div>
                  <div className="bg-secondary/10 p-2 rounded-md">
                    <div className="text-xs text-muted-foreground mb-1">1M</div>
                    <Badge variant={Math.random() > 0.5 ? 'success' : 'destructive'} className="w-full">
                      {Math.random() > 0.5 ? 'Bullish' : 'Bearish'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/20 backdrop-blur-sm border border-white/5">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-primary" />
                Support & Resistance
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-crypto-bearish flex items-center">
                    <TrendingUp className="h-4 w-4 rotate-180 mr-1" />
                    Resistance Levels
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Strong</span>
                      <span className="font-mono text-sm font-medium">${levels.strongResistance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Moderate</span>
                      <span className="font-mono text-sm font-medium">${levels.moderateResistance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Weak</span>
                      <span className="font-mono text-sm font-medium">${levels.weakResistance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-3">
                  <h4 className="text-sm font-medium mb-2 text-crypto-bullish flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Support Levels
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Weak</span>
                      <span className="font-mono text-sm font-medium">${levels.weakSupport.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Moderate</span>
                      <span className="font-mono text-sm font-medium">${levels.moderateSupport.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Strong</span>
                      <span className="font-mono text-sm font-medium">${levels.strongSupport.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-3">Technical Indicators</h4>
                <div className="space-y-3">
                  {technicalInsights.map((insight, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div>
                        <span className="text-sm font-medium">{insight.indicator}</span>
                        <div className="text-xs text-muted-foreground">{insight.interpretation}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-sm">{insight.value}</span>
                        {insight.signal === 'bullish' && (
                          <CheckCircle className="h-4 w-4 text-crypto-bullish" />
                        )}
                        {insight.signal === 'bearish' && (
                          <AlertTriangle className="h-4 w-4 text-crypto-bearish" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-secondary/20 p-4 rounded-lg backdrop-blur-sm border border-white/5">
          <h3 className="text-lg font-medium mb-3">Expert Analysis</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The {symbol} chart is currently forming a {analysis.pattern} pattern, which is a classic {analysis.sentiment} pattern in technical analysis. 
            This pattern is most visible on the {analysis.timeframe} timeframe and suggests potential {
              analysis.sentiment === 'bullish' ? 'upward momentum in the coming periods.' : 'downward pressure in the coming periods.'
            }
          </p>
          
          <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
            Key support levels have been established at ${levels.moderateSupport.toFixed(2)} and ${levels.strongSupport.toFixed(2)}, 
            while resistance is observed at ${levels.moderateResistance.toFixed(2)} and ${levels.strongResistance.toFixed(2)}. 
            {analysis.sentiment === 'bullish' 
              ? `Traders might consider long positions if the price breaks above $${levels.weakResistance.toFixed(2)} with increased volume, with a stop loss below $${levels.weakSupport.toFixed(2)}.` 
              : `Traders might consider short positions if the price breaks below $${levels.weakSupport.toFixed(2)} with increased volume, with a stop loss above $${levels.weakResistance.toFixed(2)}.`
            }
          </p>
          
          <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
            The current RSI reading of 58.24 indicates a neutral market with a slight bullish bias, not showing overbought or oversold conditions. 
            The MACD has recently formed a bullish crossover, suggesting growing positive momentum. These indicators, combined with the recent 
            golden cross of the 50-day and 200-day moving averages, provide a generally {
              analysis.sentiment === 'bullish' ? 'optimistic outlook for ' : 'cautious stance on '
            }
            {symbol} in the medium term.
          </p>
          
          <div className="mt-4 text-sm">
            <Badge className="mr-2" variant={analysis.sentiment === 'bullish' ? 'success' : 'destructive'}>
              {analysis.sentiment === 'bullish' ? 'BULLISH OUTLOOK' : 'BEARISH OUTLOOK'}
            </Badge>
            <Badge variant="outline" className="bg-secondary/30">Confidence: {analysis.confidence}%</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedTechnicalAnalysis;
