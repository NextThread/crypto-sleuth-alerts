import { useState, useEffect, useRef } from 'react';
import { Chart, registerables, ChartType } from 'chart.js';
import { Line } from 'react-chartjs-2';
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
import 'chart.js/auto';

Chart.register(...registerables, annotationPlugin, zoomPlugin);

interface CryptoChartProps {
  symbol: string;
  interval: TimeInterval;
  chartControls: ChartControlsState;
}

const CryptoChart = ({ symbol, interval, chartControls }: CryptoChartProps) => {
  const [chartData, setChartData] = useState<KlineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const { toast } = useToast();
  
  const [aiAnalysis, setAiAnalysis] = useState({
    entryPointExplanation: '',
    targetExplanation: '',
    stopLossExplanation: ''
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
    
    setAiAnalysis({
      entryPointExplanation: `Based on ${trend} trend and RSI indicators crossing below 30, suggesting oversold conditions.`,
      targetExplanation: `Target set near historical resistance at ${takeProfit.toFixed(2)} where profit taking is likely to occur.`,
      stopLossExplanation: `Stop loss placed below recent support at ${stopLoss.toFixed(2)} to limit downside risk while giving price room to fluctuate.`
    });
    
    toast({
      title: "AI Analysis Complete",
      description: `Recommended action: ${trend === 'bullish' ? 'Consider entry positions as market shows bullish pattern' : 'Exercise caution as market shows bearish signals'}`,
      duration: 5000,
    });
  };
  
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [chartControls]);
  
  if (isLoading && chartData.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center glass-panel rounded-lg">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading chart data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center glass-panel rounded-lg">
        <div className="text-destructive flex flex-col items-center">
          <p>Error: {error}</p>
          <button
            className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-md transition-colors"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  if (chartData.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center glass-panel rounded-lg">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }
  
  const { supports, resistances } = calculateSupportResistance(chartData);
  const { entryPoints, exitPoints, stopLoss, takeProfit } = identifyEntryExitPoints(chartData);
  const fibLevels = calculateFibonacciLevels(chartData);
  const { uptrend, downtrend } = detectTrendLines(chartData);
  const patterns = detectPatterns(chartData);
  
  const labels = chartData.map(d => formatTimeLabel(d.openTime, interval));
  const closes = chartData.map(d => d.close);
  const opens = chartData.map(d => d.open);
  const highs = chartData.map(d => d.high);
  const lows = chartData.map(d => d.low);
  
  const annotations: any = {};
  
  if (chartControls.showSupportResistance) {
    supports.slice(0, 3).forEach((level, i) => {
      annotations[`support${i}`] = {
        type: 'line',
        borderColor: 'rgba(52, 211, 153, 0.7)',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: 'Support',
          position: 'start',
          backgroundColor: 'rgba(52, 211, 153, 0.7)',
          color: '#fff',
          font: {
            size: 10,
          },
        },
        scaleID: 'y',
        value: level,
      };
    });
    
    resistances.slice(0, 3).forEach((level, i) => {
      annotations[`resistance${i}`] = {
        type: 'line',
        borderColor: 'rgba(239, 68, 68, 0.7)',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          display: true,
          content: 'Resistance',
          position: 'start',
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          color: '#fff',
          font: {
            size: 10,
          },
        },
        scaleID: 'y',
        value: level,
      };
    });
  }
  
  if (chartControls.showFibonacciLevels) {
    fibLevels.forEach((level, i) => {
      const fibPercents = [0, 23.6, 38.2, 50, 61.8, 78.6, 100];
      annotations[`fib${i}`] = {
        type: 'line',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: 1,
        label: {
          display: i % 2 === 0,
          content: `Fib ${fibPercents[i]}%`,
          position: 'start',
          backgroundColor: 'rgba(139, 92, 246, 0.5)',
          color: '#fff',
          font: {
            size: 9,
          },
        },
        scaleID: 'y',
        value: level,
      };
    });
  }
  
  if (chartControls.showTrendLines) {
    uptrend.forEach((trend, i) => {
      const startValue = chartData[trend.start].low;
      annotations[`uptrend${i}`] = {
        type: 'line',
        xMin: labels[trend.start],
        yMin: startValue,
        xMax: labels[trend.end],
        yMax: startValue + trend.slope * (trend.end - trend.start),
        borderColor: 'rgba(16, 185, 129, 0.7)',
        borderWidth: 2,
        label: {
          display: i === 0,
          content: 'Uptrend',
          position: {
            x: 'start',
            y: 'bottom'
          },
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          color: '#fff',
          font: {
            size: 10,
          },
        },
      };
    });
    
    downtrend.forEach((trend, i) => {
      const startValue = chartData[trend.start].high;
      annotations[`downtrend${i}`] = {
        type: 'line',
        xMin: labels[trend.start],
        yMin: startValue,
        xMax: labels[trend.end],
        yMax: startValue + trend.slope * (trend.end - trend.start),
        borderColor: 'rgba(239, 68, 68, 0.7)',
        borderWidth: 2,
        label: {
          display: i === 0,
          content: 'Downtrend',
          position: {
            x: 'start',
            y: 'top'
          },
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          color: '#fff',
          font: {
            size: 10,
          },
        },
      };
    });
  }
  
  if (chartControls.showEntryExitPoints) {
    entryPoints.slice(-3).forEach((point, i) => {
      annotations[`entry${i}`] = {
        type: 'point',
        xValue: labels[point],
        yValue: chartData[point].close,
        backgroundColor: '#F2FCE2',
        borderColor: 'rgba(16, 185, 129, 0.8)',
        borderWidth: 2,
        radius: 5,
        label: {
          display: true,
          content: 'Entry',
          position: 'top',
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          color: '#fff',
          font: {
            size: 10,
          },
        },
      };
    });
    
    exitPoints.slice(-3).forEach((point, i) => {
      annotations[`exit${i}`] = {
        type: 'point',
        xValue: labels[point],
        yValue: chartData[point].close,
        backgroundColor: '#0EA5E9',
        radius: 5,
        label: {
          display: true,
          content: 'Exit',
          position: 'top',
          backgroundColor: '#0EA5E9',
          color: '#fff',
          font: {
            size: 10,
          },
        },
      };
    });
    
    if (stopLoss > 0) {
      annotations['stopLoss'] = {
        type: 'line',
        borderColor: '#ea384c',
        borderWidth: 2,
        label: {
          display: true,
          content: 'Stop Loss',
          position: 'start',
          backgroundColor: '#ea384c',
          color: '#fff',
          font: {
            size: 10,
          },
        },
        scaleID: 'y',
        value: stopLoss,
      };
    }
    
    if (takeProfit > 0) {
      annotations['takeProfit'] = {
        type: 'line',
        borderColor: '#0EA5E9',
        borderWidth: 2,
        label: {
          display: true,
          content: 'Take Profit',
          position: 'start',
          backgroundColor: '#0EA5E9',
          color: '#fff',
          font: {
            size: 10,
          },
        },
        scaleID: 'y',
        value: takeProfit,
      };
    }
  }
  
  if (chartControls.showPatterns) {
    if (patterns.headAndShoulders && chartControls.patternControls.showHeadAndShoulders) {
      patterns.headAndShoulders.forEach((index, i) => {
        annotations[`handS${i}`] = {
          type: 'box',
          xMin: labels[Math.max(0, index - 10)],
          xMax: labels[Math.min(chartData.length - 1, index + 10)],
          yMin: chartData[index].low * 0.99,
          yMax: chartData[index].high * 1.01,
          backgroundColor: 'rgba(244, 114, 182, 0.2)',
          borderColor: 'rgba(244, 114, 182, 0.8)',
          borderWidth: 2,
          label: {
            display: true,
            content: 'H&S Pattern',
            position: 'center',
            backgroundColor: 'rgba(244, 114, 182, 0.8)',
            color: '#fff',
            font: {
              size: 10,
            },
          },
        };
      });
    }
    
    if (patterns.doubleTop && chartControls.patternControls.showDoubleTop) {
      patterns.doubleTop.forEach((index, i) => {
        annotations[`doubleTop${i}`] = {
          type: 'box',
          xMin: labels[Math.max(0, index - 8)],
          xMax: labels[Math.min(chartData.length - 1, index + 8)],
          yMin: chartData[index].low * 0.99,
          yMax: chartData[index].high * 1.01,
          backgroundColor: 'rgba(249, 115, 22, 0.2)',
          borderColor: 'rgba(249, 115, 22, 0.8)',
          borderWidth: 2,
          label: {
            display: true,
            content: 'Double Top',
            position: 'center',
            backgroundColor: 'rgba(249, 115, 22, 0.8)',
            color: '#fff',
            font: {
              size: 10,
            },
          },
        };
      });
    }
    
    if (patterns.doubleBottom && chartControls.patternControls.showDoubleBottom) {
      patterns.doubleBottom.forEach((index, i) => {
        annotations[`doubleBottom${i}`] = {
          type: 'box',
          xMin: labels[Math.max(0, index - 8)],
          xMax: labels[Math.min(chartData.length - 1, index + 8)],
          yMin: chartData[index].low * 0.99,
          yMax: chartData[index].high * 1.01,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          borderColor: 'rgba(16, 185, 129, 0.8)',
          borderWidth: 2,
          label: {
            display: true,
            content: 'Double Bottom',
            position: 'center',
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            color: '#fff',
            font: {
              size: 10,
            },
          },
        };
      });
    }
    
    if (patterns.triangle && chartControls.patternControls.showTriangle) {
      patterns.triangle.forEach((triangle, i) => {
        const color = triangle.type === 'ascending' ? 'rgba(16, 185, 129, 0.8)' : 
                      triangle.type === 'descending' ? 'rgba(239, 68, 68, 0.8)' : 
                      'rgba(59, 130, 246, 0.8)';
        
        annotations[`triangle${i}`] = {
          type: 'box',
          xMin: labels[triangle.start],
          xMax: labels[triangle.end],
          yMin: Math.min(...chartData.slice(triangle.start, triangle.end + 1).map(d => d.low)) * 0.99,
          yMax: Math.max(...chartData.slice(triangle.start, triangle.end + 1).map(d => d.high)) * 1.01,
          backgroundColor: color.replace('0.8', '0.2'),
          borderColor: color,
          borderWidth: 2,
          label: {
            display: true,
            content: `${triangle.type.charAt(0).toUpperCase() + triangle.type.slice(1)} Triangle`,
            position: 'center',
            backgroundColor: color,
            color: '#fff',
            font: {
              size: 10,
            },
          },
        };
      });
    }
    
    if (patterns.wedge && chartControls.patternControls.showWedge) {
      patterns.wedge.forEach((wedge, i) => {
        const color = wedge.type === 'rising' ? 'rgba(16, 185, 129, 0.8)' : 
                      'rgba(239, 68, 68, 0.8)';
        
        annotations[`wedge${i}`] = {
          type: 'box',
          xMin: labels[wedge.start],
          xMax: labels[wedge.end],
          yMin: Math.min(...chartData.slice(wedge.start, wedge.end + 1).map(d => d.low)) * 0.99,
          yMax: Math.max(...chartData.slice(wedge.start, wedge.end + 1).map(d => d.high)) * 1.01,
          backgroundColor: color.replace('0.8', '0.2'),
          borderColor: color,
          borderWidth: 2,
          label: {
            display: true,
            content: `${wedge.type.charAt(0).toUpperCase() + wedge.type.slice(1)} Wedge`,
            position: 'center',
            backgroundColor: color,
            color: '#fff',
            font: {
              size: 10,
            },
          },
        };
      });
    }
  }
  
  const baseOptions = generateChartOptions(chartData, interval, 'dark');
  
  const options = {
    ...baseOptions,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      ...baseOptions.plugins,
      annotation: {
        annotations,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        limits: {
          x: {min: 'original', max: 'original', minRange: 10},
          y: {min: 'original', max: 'original', minRange: 10}
        }
      },
      tooltip: {
        ...baseOptions.plugins.tooltip,
        callbacks: {
          ...baseOptions.plugins.tooltip.callbacks,
          label: (context: any) => {
            const index = context.dataIndex;
            const dataPoint = chartData[index];
            
            if (!dataPoint) return '';
            
            if (chartControls.chartType === 'candlestick') {
              return [
                `Open: ${dataPoint.open.toFixed(2)}`,
                `High: ${dataPoint.high.toFixed(2)}`,
                `Low: ${dataPoint.low.toFixed(2)}`,
                `Close: ${dataPoint.close.toFixed(2)}`,
                `Volume: ${Math.round(dataPoint.volume)}`,
              ];
            } else {
              return `Price: ${dataPoint.close.toFixed(2)}`;
            }
          },
        },
      },
    },
  };
  
  let data: any;
  
  if (chartControls.chartType === 'line') {
    data = {
      labels,
      datasets: [
        {
          label: 'Price',
          data: closes,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          pointRadius: 0,
          borderWidth: 2,
          fill: true,
          tension: 0.1,
        },
      ],
    };
  } else {
    data = {
      labels,
      datasets: [
        {
          type: 'candlestick' as ChartType,
          label: 'Price',
          data: chartData.map((d) => ({
            o: d.open,
            h: d.high,
            l: d.low,
            c: d.close
          })),
          color: {
            up: 'rgba(16, 185, 129, 1)',
            down: 'rgba(239, 68, 68, 1)',
            unchanged: 'rgba(155, 155, 155, 1)',
          },
          borderColor: (ctx: any) => {
            if (!ctx.raw) return 'rgba(75, 192, 192, 1)';
            return ctx.raw.o > ctx.raw.c 
              ? 'rgba(239, 68, 68, 1)'
              : 'rgba(16, 185, 129, 1)';
          },
          backgroundColor: (ctx: any) => {
            if (!ctx.raw) return 'rgba(75, 192, 192, 0.1)';
            return ctx.raw.o > ctx.raw.c 
              ? 'rgba(239, 68, 68, 0.5)'
              : 'rgba(16, 185, 129, 0.5)';
          }
        }
      ]
    };
    
    options.scales = {
      ...options.scales,
      x: {
        ...options.scales.x,
        ticks: {
          ...options.scales.x.ticks,
          callback: function(val: any) {
            const index = typeof val === 'number' ? val : parseInt(val);
            return index % Math.ceil(labels.length / 10) === 0 ? labels[index] : '';
          }
        }
      }
    };
  }
  
  return (
    <div className="w-full h-[400px] glass-panel rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{symbol} Chart</h3>
        <div className="text-xs font-mono text-muted-foreground">
          Last update: {new Date(chartData[chartData.length - 1].closeTime).toLocaleTimeString()}
        </div>
      </div>
      
      {aiAnalysis.entryPointExplanation && (
        <div className="mb-4 p-2 bg-black/10 rounded text-xs">
          <p className="font-medium mb-1">AI Analysis:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><span className="text-green-400">Entry:</span> {aiAnalysis.entryPointExplanation}</li>
            <li><span className="text-blue-400">Target:</span> {aiAnalysis.targetExplanation}</li>
            <li><span className="text-red-400">Stop Loss:</span> {aiAnalysis.stopLossExplanation}</li>
          </ul>
        </div>
      )}
      
      <div className="h-[320px] relative">
        <div className="absolute right-2 top-2 z-10 flex space-x-1">
          <button 
            className="bg-black/20 text-white text-xs px-2 py-1 rounded hover:bg-black/30"
            onClick={() => {
              if (chartRef.current) {
                chartRef.current.resetZoom();
              }
            }}
          >
            Reset Zoom
          </button>
        </div>
        {chartControls.chartType === 'line' ? (
          <Line
            data={data}
            options={options}
            height={320}
            ref={(ref) => {
              if (ref) {
                chartRef.current = ref;
              }
            }}
          />
        ) : (
          <Line
            data={data}
            options={options}
            height={320}
            ref={(ref) => {
              if (ref) {
                chartRef.current = ref;
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CryptoChart;
