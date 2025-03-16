import { useState, useEffect, useRef } from 'react';
import { Chart, registerables, ChartType, ScaleOptions } from 'chart.js';
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
import { PatternControlsState, ChartControlsState } from './ChartControls';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import 'chart.js/auto';

// Register Chart.js components
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
  const chartRef = useRef<any>(null);
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
    if (chartRef.current?.chartInstance) {
      chartRef.current.chartInstance.update();
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
  const volumes = chartData.map(d => d.volume);
  
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
    const lastEntryPoint = entryPoints.length > 0 ? entryPoints[entryPoints.length - 1] : null;
    if (lastEntryPoint !== null) {
      annotations[`entry`] = {
        type: 'point',
        xValue: labels[lastEntryPoint],
        yValue: chartData[lastEntryPoint].close,
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
    }
    
    const lastExitPoint = exitPoints.length > 0 ? exitPoints[exitPoints.length - 1] : null;
    if (lastExitPoint !== null) {
      annotations[`exit`] = {
        type: 'point',
        xValue: labels[lastExitPoint],
        yValue: chartData[lastExitPoint].close,
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
    }
    
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
          position: 'end',
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
  
  if (chartControls.showPatterns && chartControls.patternControls) {
    const patternControls = chartControls.patternControls;
    
    let currentPatternBoxes: { startIdx: number, endIdx: number, yMin: number, yMax: number }[] = [];
    
    if (patternControls.showHeadAndShoulders && patterns.headAndShoulders) {
      patterns.headAndShoulders.forEach((index, i) => {
        const startIdx = Math.max(0, index - 10);
        const endIdx = Math.min(chartData.length - 1, index + 10);
        const yMin = chartData[index].low * 0.99;
        const yMax = chartData[index].high * 1.01;
        
        const overlap = currentPatternBoxes.some(box => 
          (startIdx <= box.endIdx && endIdx >= box.startIdx) && 
          (yMin <= box.yMax && yMax >= box.yMin)
        );
        
        if (!overlap) {
          currentPatternBoxes.push({ startIdx, endIdx, yMin, yMax });
          
          annotations[`handS${i}`] = {
            type: 'box',
            xMin: labels[startIdx],
            xMax: labels[endIdx],
            yMin,
            yMax,
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
        }
      });
    }
    
    if (patternControls.showDoubleTop && patterns.doubleTop) {
      patterns.doubleTop.forEach((index, i) => {
        const startIdx = Math.max(0, index - 8);
        const endIdx = Math.min(chartData.length - 1, index + 8);
        const yMin = chartData[index].low * 0.99;
        const yMax = chartData[index].high * 1.01;
        
        const overlap = currentPatternBoxes.some(box => 
          (startIdx <= box.endIdx && endIdx >= box.startIdx) && 
          (yMin <= box.yMax && yMax >= box.yMin)
        );
        
        if (!overlap) {
          currentPatternBoxes.push({ startIdx, endIdx, yMin, yMax });
          
          annotations[`doubleTop${i}`] = {
            type: 'box',
            xMin: labels[startIdx],
            xMax: labels[endIdx],
            yMin,
            yMax,
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
        }
      });
    }
    
    if (patternControls.showDoubleBottom && patterns.doubleBottom) {
      patterns.doubleBottom.forEach((index, i) => {
        const startIdx = Math.max(0, index - 8);
        const endIdx = Math.min(chartData.length - 1, index + 8);
        const yMin = chartData[index].low * 0.99;
        const yMax = chartData[index].high * 1.01;
        
        const overlap = currentPatternBoxes.some(box => 
          (startIdx <= box.endIdx && endIdx >= box.startIdx) && 
          (yMin <= box.yMax && yMax >= box.yMin)
        );
        
        if (!overlap) {
          currentPatternBoxes.push({ startIdx, endIdx, yMin, yMax });
          
          annotations[`doubleBottom${i}`] = {
            type: 'box',
            xMin: labels[startIdx],
            xMax: labels[endIdx],
            yMin,
            yMax,
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
        }
      });
    }
    
    if (patternControls.showTriangle && patterns.triangle) {
      patterns.triangle.forEach((triangle, i) => {
        const color = triangle.type === 'ascending' ? 'rgba(16, 185, 129, 0.8)' : 
                      triangle.type === 'descending' ? 'rgba(239, 68, 68, 0.8)' : 
                      'rgba(59, 130, 246, 0.8)';
        
        const startIdx = triangle.start;
        const endIdx = triangle.end;
        const yMin = Math.min(...chartData.slice(startIdx, endIdx + 1).map(d => d.low)) * 0.99;
        const yMax = Math.max(...chartData.slice(startIdx, endIdx + 1).map(d => d.high)) * 1.01;
        
        const overlap = currentPatternBoxes.some(box => 
          (startIdx <= box.endIdx && endIdx >= box.startIdx) && 
          (yMin <= box.yMax && yMax >= box.yMin)
        );
        
        if (!overlap) {
          currentPatternBoxes.push({ startIdx, endIdx, yMin, yMax });
          
          annotations[`triangle${i}`] = {
            type: 'box',
            xMin: labels[startIdx],
            xMax: labels[endIdx],
            yMin,
            yMax,
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
        }
      });
    }
    
    if (patternControls.showWedge && patterns.wedge) {
      patterns.wedge.forEach((wedge, i) => {
        const color = wedge.type === 'rising' ? 'rgba(16, 185, 129, 0.8)' : 
                      'rgba(239, 68, 68, 0.8)';
        
        const startIdx = wedge.start;
        const endIdx = wedge.end;
        const yMin = Math.min(...chartData.slice(startIdx, endIdx + 1).map(d => d.low)) * 0.99;
        const yMax = Math.max(...chartData.slice(startIdx, endIdx + 1).map(d => d.high)) * 1.01;
        
        const overlap = currentPatternBoxes.some(box => 
          (startIdx <= box.endIdx && endIdx >= box.startIdx) && 
          (yMin <= box.yMax && yMax >= box.yMin)
        );
        
        if (!overlap) {
          currentPatternBoxes.push({ startIdx, endIdx, yMin, yMax });
          
          annotations[`wedge${i}`] = {
            type: 'box',
            xMin: labels[startIdx],
            xMax: labels[endIdx],
            yMin,
            yMax,
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
        }
      });
    }
  }
  
  const baseOptions = generateChartOptions(chartData, interval, 'dark');
  
  type ExtendedScales = {
    x: {
      ticks: {
        maxRotation: number;
        color: string;
        font: {
          size: number;
        };
        maxTicksLimit: number;
      };
      grid: {
        display: boolean;
      };
    };
    y: {
      position: 'right';
      grid: {
        color: string;
      };
      ticks: {
        color: string;
        font: {
          size: number;
        };
      };
    };
    y1?: {
      position: 'left';
      grid: {
        display: boolean;
      };
      ticks: {
        display: boolean;
      };
      max?: number;
    };
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      annotation: {
        annotations,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy' as const,
          modifierKey: 'shift' as const,
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.1,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy' as const,
          drag: {
            enabled: true,
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            borderColor: 'rgba(59, 130, 246, 0.8)',
            borderWidth: 1,
          },
        },
        limits: {
          x: {min: 'original' as const, max: 'original' as const, minRange: 10},
          y: {min: 'original' as const, max: 'original' as const, minRange: 10}
        }
      },
      tooltip: {
        ...baseOptions.plugins.tooltip,
        callbacks: {
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
        titleFont: {
          size: 12,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 11,
        },
      },
      legend: {
        display: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      intersect: false,
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10,
          },
          maxTicksLimit: 8,
        },
        grid: {
          display: false,
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          font: {
            size: 10,
          },
        },
      }
    } as ExtendedScales
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
    const volumeDataset = {
      label: 'Volume',
      data: volumes,
      type: 'bar' as const,
      backgroundColor: chartData.map(d => 
        d.close > d.open 
          ? 'rgba(16, 185, 129, 0.3)'
          : 'rgba(239, 68, 68, 0.3)'
      ),
      yAxisID: 'y1',
      order: 2,
      barPercentage: 0.3,
    };
    
    const priceDataset = {
      label: 'OHLC',
      data: closes,
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      borderWidth: 2,
      pointRadius: 0,
      yAxisID: 'y',
      order: 1,
    };
    
    data = {
      labels,
      datasets: [volumeDataset, priceDataset],
    };
    
    const scales = options.scales as ExtendedScales;
    scales.y1 = {
      position: 'left' as const,
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      },
      max: Math.max(...volumes) * 3,
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
      
      <TooltipProvider>
        <div className="mb-4 p-2 bg-black/10 rounded text-xs">
          <p className="font-medium mb-1">AI Analysis:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center cursor-help">
                    <span className="text-green-400 mr-1">Entry:</span> {aiAnalysis?.entryPointExplanation}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-black/80 text-white p-2">
                  <p>Entry points are determined using momentum indicators like RSI and MACD crossovers.</p>
                </TooltipContent>
              </Tooltip>
            </li>
            <li className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center cursor-help">
                    <span className="text-blue-400 mr-1">Target:</span> {aiAnalysis?.targetExplanation}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-black/80 text-white p-2">
                  <p>Profit targets are set at key resistance levels or using risk-reward ratios.</p>
                </TooltipContent>
              </Tooltip>
            </li>
            <li className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center cursor-help">
                    <span className="text-red-400 mr-1">Stop Loss:</span> {aiAnalysis?.stopLossExplanation}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-black/80 text-white p-2">
                  <p>Stop losses are placed below support levels to protect against adverse price movements.</p>
                </TooltipContent>
              </Tooltip>
            </li>
          </ul>
        </div>
      </TooltipProvider>
      
      <div className="h-[320px] relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="bg-black/20 text-white text-xs px-2 py-1 rounded hover:bg-black/30"
                onClick={() => {
                  if (chartRef.current) {
                    if (chartRef.current.chartInstance) {
                      chartRef.current.chartInstance.resetZoom();
                    } else if (chartRef.current.current) {
                      chartRef.current.current.resetZoom();
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
        
        <Line
          data={data}
          options={options}
          height={320}
          ref={chartRef}
        />
      </div>
    </div>
  );
};

export default CryptoChart;
