
import { useState, useEffect } from 'react';
import { KlineData } from '../services/binanceService';
import { identifyEntryExitPoints } from '../utils/technicalIndicators';
import { formatPrice } from '../utils/chartUtils';
import { MoveUpRight, MoveDownRight, Target, Ban, ArrowUpRight, ArrowDownRight, BarChart2, TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TradeDetailsProps {
  chartData: KlineData[];
  symbol: string;
}

const TradeDetails = ({ chartData, symbol }: TradeDetailsProps) => {
  const [tradeInfo, setTradeInfo] = useState({
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    riskRewardRatio: 0,
    trend: 'neutral' as 'bullish' | 'bearish' | 'neutral',
    entryExplanation: '',
    targetExplanation: '',
    stopLossExplanation: '',
    patterns: [] as string[],
    supportLevels: [] as number[],
    resistanceLevels: [] as number[],
    volumeIndication: '',
    momentumIndicators: '',
    timeframes: {
      shortTerm: '' as 'bullish' | 'bearish' | 'neutral',
      mediumTerm: '' as 'bullish' | 'bearish' | 'neutral',
      longTerm: '' as 'bullish' | 'bearish' | 'neutral'
    },
    keyEvents: [] as string[]
  });
  
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (chartData.length < 30) return;

    const { entryPoints, exitPoints, stopLoss, takeProfit } = identifyEntryExitPoints(chartData);

    const lastIndex = chartData.length - 1;
    const currentPrice = chartData[lastIndex].close;
    const recentTrend = currentPrice > chartData[lastIndex - 10].close ? 'bullish' : 'bearish';

    // Get entry price from the last entry point if exists
    let entryPrice = currentPrice;
    if (entryPoints.length > 0) {
      const lastEntryIndex = entryPoints[entryPoints.length - 1];
      entryPrice = chartData[lastEntryIndex].close;
    }

    // Calculate risk-reward ratio
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(takeProfit - entryPrice);
    const riskRewardRatio = risk > 0 ? reward / risk : 0;

    // Generate explanations
    const entryExplanation = `Based on ${recentTrend} trend and RSI indicators crossing ${recentTrend === 'bullish' ? 'above 30' : 'below 70'}, suggesting ${recentTrend === 'bullish' ? 'oversold' : 'overbought'} conditions.`;
    const targetExplanation = `Target set near historical resistance at ${takeProfit.toFixed(2)} where profit taking is likely to occur.`;
    const stopLossExplanation = `Stop loss placed below recent support at ${stopLoss.toFixed(2)} to limit downside risk while giving price room to fluctuate.`;

    // Mock additional analysis data
    const patterns = recentTrend === 'bullish' 
      ? ['Double Bottom', 'Bullish Engulfing', 'Golden Cross approaching']
      : ['Head and Shoulders', 'Bearish Divergence', 'Death Cross forming'];
    
    const supportLevels = [
      stopLoss,
      stopLoss * 0.95,
      stopLoss * 0.9
    ];
    
    const resistanceLevels = [
      takeProfit,
      takeProfit * 1.05,
      takeProfit * 1.1
    ];
    
    const volumeIndication = recentTrend === 'bullish'
      ? 'Increasing volume on up days indicates strong buying pressure'
      : 'Higher volume on down days suggests distribution phase';
    
    const momentumIndicators = recentTrend === 'bullish'
      ? 'RSI rising from oversold, MACD showing bullish crossover'
      : 'RSI falling from overbought, MACD showing bearish crossover';
    
    const timeframes = {
      shortTerm: recentTrend as 'bullish' | 'bearish' | 'neutral',
      mediumTerm: Math.random() > 0.3 ? recentTrend : (recentTrend === 'bullish' ? 'bearish' : 'bullish') as 'bullish' | 'bearish' | 'neutral',
      longTerm: Math.random() > 0.5 ? recentTrend : (recentTrend === 'bullish' ? 'bearish' : 'bullish') as 'bullish' | 'bearish' | 'neutral'
    };
    
    const keyEvents = [
      `${symbol.slice(0, -4)} network upgrade expected in Q3`,
      'Market volatility likely during FOMC meeting',
      'Watch for resistance at key Fibonacci levels'
    ];

    setTradeInfo({
      entryPrice,
      stopLoss,
      takeProfit,
      riskRewardRatio,
      trend: recentTrend as 'bullish' | 'bearish' | 'neutral',
      entryExplanation,
      targetExplanation,
      stopLossExplanation,
      patterns,
      supportLevels,
      resistanceLevels,
      volumeIndication,
      momentumIndicators,
      timeframes,
      keyEvents
    });
  }, [chartData, symbol]);

  if (chartData.length < 30 || tradeInfo.entryPrice === 0) {
    return (
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-base">Trade Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Insufficient data to generate trade details</p>
        </CardContent>
      </Card>
    );
  }

  const calculatePercentage = (price1: number, price2: number) => {
    return ((price1 - price2) / price2 * 100).toFixed(2);
  };

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className="glass-panel animate-fade-in"
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center">
              <span>Trade Details</span>
              <Badge variant={tradeInfo.trend === 'bullish' ? 'default' : 'destructive'} className="ml-2">
                {tradeInfo.trend === 'bullish' ? 
                  <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                }
                {tradeInfo.trend.toUpperCase()}
              </Badge>
            </CardTitle>
            <CollapsibleTrigger className="text-xs text-muted-foreground hover:text-primary">
              {isExpanded ? "Show less" : "View full analysis"}
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-1 mb-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center justify-center p-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-help">
                    <MoveUpRight className="h-4 w-4 text-green-500 mb-1" />
                    <span className="text-xs font-medium">Entry</span>
                    <span className="text-sm font-mono">{formatPrice(tradeInfo.entryPrice)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">{tradeInfo.entryExplanation}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center justify-center p-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-help">
                    <Ban className="h-4 w-4 text-red-500 mb-1" />
                    <span className="text-xs font-medium">Stop Loss</span>
                    <span className="text-sm font-mono">{formatPrice(tradeInfo.stopLoss)}</span>
                    <span className="text-xs text-red-500">{calculatePercentage(tradeInfo.stopLoss, tradeInfo.entryPrice)}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">{tradeInfo.stopLossExplanation}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center justify-center p-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors cursor-help">
                    <Target className="h-4 w-4 text-blue-500 mb-1" />
                    <span className="text-xs font-medium">Target</span>
                    <span className="text-sm font-mono">{formatPrice(tradeInfo.takeProfit)}</span>
                    <span className="text-xs text-green-500">{calculatePercentage(tradeInfo.takeProfit, tradeInfo.entryPrice)}%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="text-xs">{tradeInfo.targetExplanation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Risk/Reward:</span>
            <Badge variant={tradeInfo.riskRewardRatio >= 2 ? "outline" : "secondary"}>
              1:{tradeInfo.riskRewardRatio.toFixed(2)}
            </Badge>
          </div>
          
          <CollapsibleContent>
            <div className="mt-6 pt-4 border-t border-white/5 space-y-6">
              {/* Chart Patterns */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  Chart Patterns
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tradeInfo.patterns.map((pattern, idx) => (
                    <Badge key={idx} variant="outline" className="bg-secondary/20">
                      {pattern}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Support and Resistance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-crypto-bullish flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4" />
                    Support Levels
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {tradeInfo.supportLevels.map((level, idx) => (
                      <li key={idx} className="font-mono flex justify-between">
                        <span className="text-muted-foreground">S{idx + 1}:</span>
                        <span>{formatPrice(level)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2 text-crypto-bearish flex items-center gap-1.5">
                    <TrendingDown className="h-4 w-4" />
                    Resistance Levels
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {tradeInfo.resistanceLevels.map((level, idx) => (
                      <li key={idx} className="font-mono flex justify-between">
                        <span className="text-muted-foreground">R{idx + 1}:</span>
                        <span>{formatPrice(level)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Volume and Momentum */}
              <div className="bg-secondary/10 p-3 rounded-md border border-white/5">
                <h4 className="text-sm font-medium mb-2">Indicator Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Volume: </span>
                    <span>{tradeInfo.volumeIndication}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Momentum: </span>
                    <span>{tradeInfo.momentumIndicators}</span>
                  </div>
                </div>
              </div>
              
              {/* Timeframe Analysis */}
              <div>
                <h4 className="text-sm font-medium mb-2">Timeframe Analysis</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 border border-white/5 rounded-md text-center">
                    <div className="text-xs text-muted-foreground mb-1">Short Term</div>
                    <Badge 
                      variant={tradeInfo.timeframes.shortTerm === 'bullish' ? 'default' : 'destructive'}
                      className="w-full justify-center"
                    >
                      {tradeInfo.timeframes.shortTerm}
                    </Badge>
                  </div>
                  <div className="p-2 border border-white/5 rounded-md text-center">
                    <div className="text-xs text-muted-foreground mb-1">Medium Term</div>
                    <Badge 
                      variant={tradeInfo.timeframes.mediumTerm === 'bullish' ? 'default' : 'destructive'}
                      className="w-full justify-center"
                    >
                      {tradeInfo.timeframes.mediumTerm}
                    </Badge>
                  </div>
                  <div className="p-2 border border-white/5 rounded-md text-center">
                    <div className="text-xs text-muted-foreground mb-1">Long Term</div>
                    <Badge 
                      variant={tradeInfo.timeframes.longTerm === 'bullish' ? 'default' : 'destructive'}
                      className="w-full justify-center"
                    >
                      {tradeInfo.timeframes.longTerm}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Key Events */}
              <div>
                <h4 className="text-sm font-medium mb-2">Key Events to Watch</h4>
                <ul className="space-y-1 text-sm">
                  {tradeInfo.keyEvents.map((event, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
};

export default TradeDetails;
