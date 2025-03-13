
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
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

// Register Chart.js components
Chart.register(...registerables, annotationPlugin);

interface CryptoChartProps {
  symbol: string;
  interval: TimeInterval;
}

const CryptoChart = ({ symbol, interval }: CryptoChartProps) => {
  const [chartData, setChartData] = useState<KlineData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<Chart | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getKlineData(symbol, interval);
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up websocket for real-time updates
    const wsEndpoint = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;
    const ws = new WebSocket(wsEndpoint);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.k) {
        const { t: openTime, o: open, h: high, l: low, c: close, v: volume, T: closeTime, n: numberOfTrades } = message.k;
        
        // Update last candle if it exists, or add a new one
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
              quoteAssetVolume: 0, // Not provided in the websocket
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
            // Keep only the last 500 candles
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
  
  // Calculate technical indicators
  const { supports, resistances } = calculateSupportResistance(chartData);
  const { entryPoints, exitPoints, stopLoss, takeProfit } = identifyEntryExitPoints(chartData);
  const fibLevels = calculateFibonacciLevels(chartData);
  const { uptrend, downtrend } = detectTrendLines(chartData);
  const patterns = detectPatterns(chartData);
  
  // Prepare data for the chart
  const labels = chartData.map(d => formatTimeLabel(d.openTime, interval));
  const closes = chartData.map(d => d.close);
  
  // Add annotations for technical analysis
  const annotations: any = {};
  
  // Add support levels
  supports.slice(0, 3).forEach((level, i) => {
    annotations[`support${i}`] = {
      type: 'line',
      borderColor: 'rgba(52, 211, 153, 0.7)', // Green
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
  
  // Add resistance levels
  resistances.slice(0, 3).forEach((level, i) => {
    annotations[`resistance${i}`] = {
      type: 'line',
      borderColor: 'rgba(239, 68, 68, 0.7)', // Red
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
  
  // Add Fibonacci retracement levels
  fibLevels.forEach((level, i) => {
    const fibPercents = [0, 23.6, 38.2, 50, 61.8, 78.6, 100];
    annotations[`fib${i}`] = {
      type: 'line',
      borderColor: 'rgba(139, 92, 246, 0.5)', // Purple
      borderWidth: 1,
      label: {
        display: i % 2 === 0, // Only show labels for every other level to avoid crowding
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
  
  // Add trend lines
  uptrend.forEach((trend, i) => {
    const startValue = chartData[trend.start].low;
    annotations[`uptrend${i}`] = {
      type: 'line',
      xMin: labels[trend.start],
      yMin: startValue,
      xMax: labels[trend.end],
      yMax: startValue + trend.slope * (trend.end - trend.start),
      borderColor: 'rgba(16, 185, 129, 0.7)', // Green
      borderWidth: 2,
      label: {
        display: i === 0, // Only show label for the first trend line
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
      borderColor: 'rgba(239, 68, 68, 0.7)', // Red
      borderWidth: 2,
      label: {
        display: i === 0, // Only show label for the first trend line
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
  
  // Add entry points with green markers
  entryPoints.slice(-3).forEach((point, i) => {
    annotations[`entry${i}`] = {
      type: 'point',
      xValue: labels[point],
      yValue: chartData[point].close,
      backgroundColor: 'rgba(16, 185, 129, 0.8)', // Green
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
  
  // Add exit points
  exitPoints.slice(-3).forEach((point, i) => {
    annotations[`exit${i}`] = {
      type: 'point',
      xValue: labels[point],
      yValue: chartData[point].close,
      backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue
      radius: 5,
      label: {
        display: true,
        content: 'Exit',
        position: 'top',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        color: '#fff',
        font: {
          size: 10,
        },
      },
    };
  });
  
  // Add stop-loss level
  if (stopLoss > 0) {
    annotations['stopLoss'] = {
      type: 'line',
      borderColor: 'rgba(239, 68, 68, 0.8)', // Red
      borderWidth: 2,
      label: {
        display: true,
        content: 'Stop Loss',
        position: 'start',
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        color: '#fff',
        font: {
          size: 10,
        },
      },
      scaleID: 'y',
      value: stopLoss,
    };
  }
  
  // Add take-profit level
  if (takeProfit > 0) {
    annotations['takeProfit'] = {
      type: 'line',
      borderColor: 'rgba(59, 130, 246, 0.8)', // Blue
      borderWidth: 2,
      label: {
        display: true,
        content: 'Take Profit',
        position: 'start',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        color: '#fff',
        font: {
          size: 10,
        },
      },
      scaleID: 'y',
      value: takeProfit,
    };
  }
  
  // Add chart pattern annotations
  patterns.headAndShoulders.forEach((index, i) => {
    annotations[`handS${i}`] = {
      type: 'box',
      xMin: labels[Math.max(0, index - 10)],
      xMax: labels[Math.min(chartData.length - 1, index + 10)],
      yMin: chartData[index].low * 0.99,
      yMax: chartData[index].high * 1.01,
      backgroundColor: 'rgba(244, 114, 182, 0.2)', // Pink
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
  
  patterns.doubleTop.forEach((index, i) => {
    annotations[`doubleTop${i}`] = {
      type: 'box',
      xMin: labels[Math.max(0, index - 8)],
      xMax: labels[Math.min(chartData.length - 1, index + 8)],
      yMin: chartData[index].low * 0.99,
      yMax: chartData[index].high * 1.01,
      backgroundColor: 'rgba(249, 115, 22, 0.2)', // Orange
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
  
  patterns.doubleBottom.forEach((index, i) => {
    annotations[`doubleBottom${i}`] = {
      type: 'box',
      xMin: labels[Math.max(0, index - 8)],
      xMax: labels[Math.min(chartData.length - 1, index + 8)],
      yMin: chartData[index].low * 0.99,
      yMax: chartData[index].high * 1.01,
      backgroundColor: 'rgba(16, 185, 129, 0.2)', // Green
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
  
  patterns.triangle.forEach((triangle, i) => {
    const color = triangle.type === 'ascending' ? 'rgba(16, 185, 129, 0.8)' : // Green
                  triangle.type === 'descending' ? 'rgba(239, 68, 68, 0.8)' : // Red
                  'rgba(59, 130, 246, 0.8)'; // Blue for symmetrical
    
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
  
  const data = {
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
  
  const options = {
    ...generateChartOptions(chartData, interval, 'dark'),
    plugins: {
      ...generateChartOptions(chartData, interval, 'dark').plugins,
      annotation: {
        annotations,
      },
      tooltip: {
        ...generateChartOptions(chartData, interval, 'dark').plugins.tooltip,
        callbacks: {
          ...generateChartOptions(chartData, interval, 'dark').plugins.tooltip.callbacks,
          label: (context: any) => {
            const index = context.dataIndex;
            const dataPoint = chartData[index];
            return [
              `Open: ${dataPoint.open.toFixed(2)}`,
              `High: ${dataPoint.high.toFixed(2)}`,
              `Low: ${dataPoint.low.toFixed(2)}`,
              `Close: ${dataPoint.close.toFixed(2)}`,
              `Volume: ${Math.round(dataPoint.volume)}`,
            ];
          },
        },
      },
    },
  };
  
  return (
    <div className="w-full h-[400px] glass-panel rounded-lg p-4">
      {/* Chart Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{symbol} Chart</h3>
        <div className="text-xs font-mono text-muted-foreground">
          Last update: {new Date(chartData[chartData.length - 1].closeTime).toLocaleTimeString()}
        </div>
      </div>
      
      {/* The Chart */}
      <div className="h-[320px]">
        <Line
          data={data}
          options={options as any}
          height={320}
          //@ts-ignore
          ref={chartRef}
        />
      </div>
    </div>
  );
};

export default CryptoChart;
