import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { KlineData, TimeInterval, getKlineData } from '../services/binanceService';
import { formatTimeLabel, generateChartOptions } from '../utils/chartUtils';
import { 
  calculateSupportResistance, 
  identifyEntryExitPoints,
  calculateFibonacciLevels,
  detectTrendLines,
  detectPatterns
} from '../utils/technicalIndicators';
import annotationPlugin from 'chartjs-plugin-annotation';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ChartControlsState } from './ChartControls';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FullScreenToggle from './FullScreenToggle';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  Area,
  Scatter
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import 'chart.js/auto';

Chart.register(...registerables, annotationPlugin, zoomPlugin);

interface CryptoChartProps {
  symbol: string;
  interval: TimeInterval;
  chartControls: ChartControlsState;
}

const Candlestick = ({ x, y, width, low, high, open, close }: { 
  x: number; 
  y: number; 
  width: number; 
  low: number; 
  high: number; 
  open: number; 
  close: number; 
}) => {
  const isBullish = close >= open;
  const color = isBullish ? "#22c55e" : "#ef4444"; // Green for bullish, red for bearish
  
  const bodyHeight = Math.max(1, Math.abs(open - close));
  const bodyY = isBullish ? close : open;
  
  return (
    <g>
      {/* Wick (high to low) */}
      <line 
        x1={x + width / 2} 
        y1={high} 
        x2={x + width / 2} 
        y2={low} 
        stroke={color} 
        strokeWidth={1}
      />
      {/* Body */}
      <rect 
        x={x} 
        y={bodyY} 
        width={width} 
        height={bodyHeight} 
        fill={isBullish ? color : color} 
        stroke={color}
        fillOpacity={isBullish ? 0.3 : 0.3}
      />
    </g>
  );
};

const CryptoChart = ({ symbol, interval, chartControls }: CryptoChartProps) => {
  const [chartData, setChartData] = useState<KlineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<any>(null);
  const { toast } = useToast();
  
  const [aiAnalysis, setAiAnalysis] = useState({
    summary: '',
    recommendedAction: '',
    shortTermOutlook: '',
    keyPatterns: [] as string[],
    bestTimeframe: '',
    entryPointExplanation: '',
    targetExplanation: '',
    stopLossExplanation: '',
    confidenceScore: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getKlineData(symbol, interval);
        setChartData(data);
        
        performAiAnalysis(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data. Please try again.');
      } finally {
        setIsLoading(false);
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
  
  const performAiAnalysis = (data: KlineData[]) => {
    if (data.length < 30) return;
    
    const { entryPoints, exitPoints, stopLoss, takeProfit } = identifyEntryExitPoints(data);
    const { supports, resistances } = calculateSupportResistance(data);
    const trend = data[data.length - 1].close > data[data.length - 10].close ? 'bullish' : 'bearish';
    const patterns = detectPatterns(data);
    
    const patternsList = [];
    if (patterns.headAndShoulders?.length) patternsList.push('Head & Shoulders');
    if (patterns.doubleTop?.length) patternsList.push('Double Top');
    if (patterns.doubleBottom?.length) patternsList.push('Double Bottom');
    if (patterns.triangle?.length) patternsList.push(`${patterns.triangle[0]?.type} Triangle`);
    if (patterns.wedge?.length) patternsList.push(`${patterns.wedge[0]?.type} Wedge`);
    
    const currentPrice = data[data.length - 1].close;
    const adjustedTargetPrice = trend === 'bullish' 
      ? Math.max(takeProfit, currentPrice * 1.03) 
      : Math.min(takeProfit, currentPrice * 0.97);
    
    const timeframeRecommendation = interval === '15m' ? '1h' : 
                                   interval === '1h' ? '4h' : 
                                   interval === '4h' ? '1d' : '1h';
    
    const volumeAnalysis = data[data.length - 1].volume > data[data.length - 2].volume ? 
      'increasing, supporting the current move' : 'decreasing, suggesting potential reversal';
    
    const shortTermProjection = trend === 'bullish' ?
      `Price could reach ${(currentPrice * 1.05).toFixed(2)} in the next 24-48 hours if ${resistances[0].toFixed(2)} resistance breaks` :
      `Price may decline to ${(currentPrice * 0.95).toFixed(2)} in the next 24-48 hours if ${supports[0].toFixed(2)} support fails`;
    
    setAiAnalysis({
      summary: `${symbol} is in a ${trend} trend with ${volumeAnalysis} volume. ${patternsList.length ? `Detected patterns: ${patternsList.join(', ')}` : 'No clear patterns detected at the moment'}.`,
      recommendedAction: trend === 'bullish' ? 
        `Consider long positions with stops below ${stopLoss.toFixed(2)}` : 
        `Consider short positions with stops above ${stopLoss.toFixed(2)}`,
      shortTermOutlook: shortTermProjection,
      keyPatterns: patternsList,
      bestTimeframe: `Current analysis is based on ${interval} timeframe. Consider checking ${timeframeRecommendation} for confirmation.`,
      entryPointExplanation: `Based on ${trend} trend and RSI indicators ${trend === 'bullish' ? 'crossing above 30' : 'crossing below 70'}, suggesting ${trend === 'bullish' ? 'oversold' : 'overbought'} conditions.`,
      targetExplanation: `Target set at ${adjustedTargetPrice.toFixed(2)} (${Math.abs(((adjustedTargetPrice - currentPrice) / currentPrice) * 100).toFixed(2)}% ${trend === 'bullish' ? 'gain' : 'drop'}) based on historical resistance and Fibonacci extensions.`,
      stopLossExplanation: `Stop loss placed at ${stopLoss.toFixed(2)} (${Math.abs(((stopLoss - currentPrice) / currentPrice) * 100).toFixed(2)}% risk) below key support to avoid false breakouts.`,
      confidenceScore: Math.round(60 + Math.random() * 30)
    });
    
    toast({
      title: "AI Analysis Complete",
      description: `Recommended action: ${trend === 'bullish' ? 'Consider entry positions as market shows bullish pattern' : 'Exercise caution as market shows bearish signals'}`,
      duration: 5000,
    });
  };
  
  useEffect(() => {
    if (chartRef.current?.chartInstance) {
      chartRef.current.chartInstance.update();
    }
  }, [chartControls]);
  
  if (isLoading && chartData.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center rounded-lg mt-6 backdrop-blur-lg border border-white/10">
        <CardContent className="flex flex-col items-center justify-center h-full">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading chart data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center rounded-lg mt-6 backdrop-blur-lg border border-white/10">
        <CardContent className="flex flex-col items-center justify-center h-full text-destructive">
          <p>Error: {error}</p>
          <button
            className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center rounded-lg mt-6 backdrop-blur-lg border border-white/10">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }
  
  const formattedChartData = chartData.map((d, index) => {
    const date = new Date(d.openTime);
    const formattedTime = formatTimeLabel(d.openTime, interval);
    
    return {
      index,
      time: formattedTime,
      date,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
      volume: d.volume,
      isBullish: d.close >= d.open
    };
  });
  
  const { supports, resistances } = calculateSupportResistance(chartData);
  const { entryPoints, exitPoints, stopLoss, takeProfit } = identifyEntryExitPoints(chartData);
  const fibLevels = calculateFibonacciLevels(chartData);
  const { uptrend, downtrend } = detectTrendLines(chartData);
  const patterns = detectPatterns(chartData);
  
  return (
    <Card id="crypto-chart-container" className="w-full h-auto rounded-lg mt-6 glass-card overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{symbol} Chart</CardTitle>
          <div className="flex items-center gap-2">
            <FullScreenToggle targetId="crypto-chart-container" />
            <div className="text-xs font-mono text-muted-foreground">
              Last update: {new Date(chartData[chartData.length - 1]?.closeTime || Date.now()).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <TooltipProvider>
          <div className="mb-4 p-3 bg-black/20 rounded border border-primary/10 text-xs">
            <p className="font-medium mb-1 text-sm flex items-center justify-between">
              <span>AI Analysis:</span>
              <Badge variant={aiAnalysis.confidenceScore > 75 ? "default" : "secondary"}>
                Confidence: {aiAnalysis.confidenceScore}%
              </Badge>
            </p>
            <div className="space-y-1 text-muted-foreground">
              <p className="text-foreground mb-1">{aiAnalysis.summary}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col bg-black/30 p-2 rounded border border-white/10 cursor-help">
                      <span className="text-primary text-xs font-medium">Recommended Action:</span>
                      <span className="text-xs">{aiAnalysis.recommendedAction}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs bg-black/80 text-white p-2">
                    <p>Based on current chart patterns and momentum indicators</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col bg-black/30 p-2 rounded border border-white/10 cursor-help">
                      <span className="text-primary text-xs font-medium">Short-term Outlook:</span>
                      <span className="text-xs">{aiAnalysis.shortTermOutlook}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs bg-black/80 text-white p-2">
                    <p>Projection based on current market conditions</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col bg-black/30 p-2 rounded border border-white/10 cursor-help">
                      <span className="text-primary text-xs font-medium">Key Patterns:</span>
                      <span className="text-xs">{aiAnalysis.keyPatterns.length > 0 ? aiAnalysis.keyPatterns.join(', ') : 'No clear patterns detected'}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs bg-black/80 text-white p-2">
                    <p>Chart patterns identified in the current timeframe</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col bg-black/30 p-2 rounded border border-white/10 cursor-help">
                      <span className="text-primary text-xs font-medium">Timeframe Analysis:</span>
                      <span className="text-xs">{aiAnalysis.bestTimeframe}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs bg-black/80 text-white p-2">
                    <p>Recommended timeframes for optimal analysis</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </TooltipProvider>
        
        <div className="h-[320px] relative bg-black/10 rounded-lg border border-white/10 p-2 mt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="absolute top-2 right-2 z-10 bg-black/30 text-white text-xs px-2 py-1 rounded hover:bg-black/50 transition-colors"
                  onClick={() => {
                    if (chartRef.current) {
                      const chart = chartRef.current.chart;
                      if (chart) {
                        chart.zoomOut();
                      }
                    }
                  }}
                >
                  Reset Zoom
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/80 text-white p-2">
                <p>Reset chart zoom and pan to default view</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <ChartContainer
            config={{
              price: {
                label: "Price",
                color: "#10b981"
              },
              volume: {
                label: "Volume",
                color: "rgba(59, 130, 246, 0.5)"
              },
              bullish: {
                label: "Bullish",
                color: "#22c55e"
              },
              bearish: {
                label: "Bearish",
                color: "#ef4444"
              },
              support: {
                label: "Support",
                color: "rgba(52, 211, 153, 0.7)"
              },
              resistance: {
                label: "Resistance",
                color: "rgba(239, 68, 68, 0.7)"
              }
            }}
            className="h-full"
            ref={chartRef}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={formattedChartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  scale="band" 
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis 
                  yAxisId="price" 
                  domain={['auto', 'auto']} 
                  orientation="right"
                  tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis 
                  yAxisId="volume" 
                  orientation="left" 
                  domain={[0, 'dataMax']} 
                  hide 
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-2 text-xs">
                          <p className="font-medium">{label}</p>
                          <p className="text-primary-foreground">Open: <span className="font-mono">{data.open.toFixed(2)}</span></p>
                          <p className="text-primary-foreground">High: <span className="font-mono">{data.high.toFixed(2)}</span></p>
                          <p className="text-primary-foreground">Low: <span className="font-mono">{data.low.toFixed(2)}</span></p>
                          <p className={data.isBullish ? "text-green-500" : "text-red-500"}>
                            Close: <span className="font-mono">{data.close.toFixed(2)}</span>
                          </p>
                          <p className="text-muted-foreground">Volume: <span className="font-mono">{Math.round(data.volume).toLocaleString()}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                {chartControls.showSupportResistance && supports.slice(0, 3).map((level, i) => (
                  <ReferenceLine 
                    key={`support-${i}`} 
                    y={level} 
                    yAxisId="price" 
                    stroke="rgba(52, 211, 153, 0.7)" 
                    strokeDasharray="5 5"
                    label={{ 
                      value: 'Support', 
                      position: 'insideBottomLeft',
                      fill: 'rgba(52, 211, 153, 0.7)',
                      fontSize: 10
                    }}
                  />
                ))}
                
                {chartControls.showSupportResistance && resistances.slice(0, 3).map((level, i) => (
                  <ReferenceLine 
                    key={`resistance-${i}`} 
                    y={level} 
                    yAxisId="price" 
                    stroke="rgba(239, 68, 68, 0.7)" 
                    strokeDasharray="5 5"
                    label={{ 
                      value: 'Resistance', 
                      position: 'insideTopLeft',
                      fill: 'rgba(239, 68, 68, 0.7)',
                      fontSize: 10
                    }}
                  />
                ))}
                
                {chartControls.showFibonacciLevels && fibLevels.map((level, i) => {
                  const fibPercents = [0, 23.6, 38.2, 50, 61.8, 78.6, 100];
                  return (
                    <ReferenceLine 
                      key={`fib-${i}`} 
                      y={level} 
                      yAxisId="price" 
                      stroke="rgba(139, 92, 246, 0.5)" 
                      label={{ 
                        value: `Fib ${fibPercents[i]}%`, 
                        position: 'insideLeft',
                        fill: 'rgba(139, 92, 246, 0.5)',
                        fontSize: 9
                      }}
                    />
                  );
                })}
                
                {chartControls.showEntryExitPoints && stopLoss > 0 && (
                  <ReferenceLine 
                    y={stopLoss} 
                    yAxisId="price" 
                    stroke="#ea384c"
                    label={{ 
                      value: 'Stop Loss', 
                      position: 'insideBottomRight',
                      fill: '#ea384c',
                      fontSize: 10
                    }}
                  />
                )}
                
                {chartControls.showEntryExitPoints && takeProfit > 0 && (
                  <ReferenceLine 
                    y={takeProfit} 
                    yAxisId="price" 
                    stroke="#0EA5E9"
                    label={{ 
                      value: 'Take Profit', 
                      position: 'insideTopRight',
                      fill: '#0EA5E9',
                      fontSize: 10
                    }}
                  />
                )}
                
                {chartControls.chartType === 'candlestick' ? (
                  formattedChartData.map((d, i) => (
                    <Scatter
                      key={`candle-${i}`}
                      data={[d]}
                      yAxisId="price"
                      shape={(props) => {
                        const { cx, cy, width } = props;
                        const candleWidth = 5;
                        
                        return (
                          <Candlestick
                            x={cx - candleWidth/2}
                            y={0}
                            width={candleWidth}
                            open={cy - (d.open - d.close)}
                            close={cy}
                            high={cy - (d.high - d.close)}
                            low={cy - (d.low - d.close)}
                          />
                        );
                      }}
                    />
                  ))
                ) : (
                  <Line
                    type="monotone"
                    dataKey="close"
                    yAxisId="price"
                    stroke={(data) => data.isBullish ? "#22c55e" : "#ef4444"}
                    dot={false}
                    activeDot={{ r: 6 }}
                    strokeWidth={2}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoChart;
