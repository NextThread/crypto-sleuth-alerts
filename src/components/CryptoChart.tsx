import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { KlineData, TimeInterval, getKlineData } from '../services/binanceService';
import { formatTimeLabel, generateChartOptions } from '../utils/chartUtils';
import { calculateSupportResistance, identifyEntryExitPoints } from '../utils/technicalIndicators';

// Register Chart.js components
Chart.register(...registerables);

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
  
  // Prepare data for the chart
  const labels = chartData.map(d => formatTimeLabel(d.openTime, interval));
  const closes = chartData.map(d => d.close);
  
  // Add annotations for technical analysis
  const annotations: any = {};
  
  // Add support levels
  supports.slice(0, 3).forEach((level, i) => {
    annotations[`support${i}`] = {
      type: 'line',
      borderColor: 'rgba(52, 211, 153, 0.7)',
      borderWidth: 1,
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
      borderColor: 'rgba(239, 68, 68, 0.7)',
      borderWidth: 1,
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
  
  // Add entry points
  entryPoints.slice(-3).forEach((point, i) => {
    annotations[`entry${i}`] = {
      type: 'point',
      xValue: labels[point],
      yValue: chartData[point].close,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      radius: 5,
      label: {
        display: true,
        content: 'Entry',
        position: 'top',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
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
      backgroundColor: 'rgba(52, 211, 153, 0.8)',
      radius: 5,
      label: {
        display: true,
        content: 'Exit',
        position: 'top',
        backgroundColor: 'rgba(52, 211, 153, 0.8)',
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
