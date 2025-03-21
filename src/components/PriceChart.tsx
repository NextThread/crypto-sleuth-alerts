
import React, { useState, useEffect } from 'react';
import { ApiService } from '@/lib/api';
import { ChartData } from '@/lib/types';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Chip } from './ui/chip';

interface PriceChartProps {
  coinId: string;
}

const timeRanges = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '3M', days: 90 },
  { label: 'YTD', days: 365 }
];

const PriceChart: React.FC<PriceChartProps> = ({ coinId }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = useState(timeRanges[2]); // Default to 30 days
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getCryptoChartData(coinId, timeRange.days);
        setChartData(data);
      } catch (error) {
        console.error('Failed to load chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChartData();
  }, [coinId, timeRange]);
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };
  
  // Determine if price trend is positive (for color styling)
  const isPriceUp = chartData.length > 1 && 
    chartData[chartData.length - 1].close > chartData[0].close;
  
  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 h-96">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Price Chart</h2>
          
          <div className="flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range.label}
                onClick={() => setTimeRange(range)}
                className={`
                  px-3 py-1 text-xs font-medium rounded-full transition-colors
                  ${timeRange.label === range.label
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary'}
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="loading-shimmer h-64 w-full rounded-lg"></div>
          </div>
        ) : (
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop 
                      offset="5%" 
                      stopColor={isPriceUp ? "rgb(22, 199, 132)" : "rgb(234, 57, 67)"} 
                      stopOpacity={0.3} 
                    />
                    <stop 
                      offset="95%" 
                      stopColor={isPriceUp ? "rgb(22, 199, 132)" : "rgb(234, 57, 67)"} 
                      stopOpacity={0} 
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatDate} 
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.6)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.6)' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  width={80}
                />
                <Tooltip 
                  formatter={formatTooltipValue}
                  labelFormatter={formatDate}
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 17, 21, 0.8)', 
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 8,
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="close" 
                  stroke={isPriceUp ? "#16C784" : "#EA3943"} 
                  fillOpacity={1}
                  fill="url(#colorPrice)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;
