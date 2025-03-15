
import { useState, useEffect } from 'react';
import { KlineData } from '../services/binanceService';
import { identifyEntryExitPoints } from '../utils/technicalIndicators';
import { formatPrice } from '../utils/chartUtils';
import { MoveUpRight, MoveDownRight, Target, Ban, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    stopLossExplanation: ''
  });

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

    setTradeInfo({
      entryPrice,
      stopLoss,
      takeProfit,
      riskRewardRatio,
      trend: recentTrend as 'bullish' | 'bearish' | 'neutral',
      entryExplanation,
      targetExplanation,
      stopLossExplanation
    });
  }, [chartData]);

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
    <Card className="glass-panel animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Trade Details</span>
          <Badge variant={tradeInfo.trend === 'bullish' ? 'success' : 'destructive'} className="ml-2">
            {tradeInfo.trend === 'bullish' ? 
              <ArrowUpRight className="h-3 w-3 mr-1" /> : 
              <ArrowDownRight className="h-3 w-3 mr-1" />
            }
            {tradeInfo.trend.toUpperCase()}
          </Badge>
        </CardTitle>
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
      </CardContent>
    </Card>
  );
};

export default TradeDetails;
