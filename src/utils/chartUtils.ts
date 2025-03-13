
import { KlineData, TimeInterval } from '../services/binanceService';

export const formatTimeLabel = (timestamp: number, interval: TimeInterval): string => {
  const date = new Date(timestamp);
  
  switch (interval) {
    case '1m':
    case '5m':
    case '15m':
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    case '1h':
    case '4h':
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    case '1d':
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
    default:
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
};

export const formatPrice = (price: number | string): string => {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  
  if (num >= 1000) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  } else if (num >= 100) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 3 });
  } else if (num >= 1) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 5 });
  } else if (num >= 0.1) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 6 });
  } else if (num >= 0.01) {
    return num.toLocaleString('en-US', { maximumFractionDigits: 7 });
  } else {
    return num.toLocaleString('en-US', { maximumFractionDigits: 8 });
  }
};

export const formatPriceChange = (change: number | string): string => {
  const num = typeof change === 'string' ? parseFloat(change) : change;
  
  return num >= 0 
    ? `+${num.toFixed(2)}%` 
    : `${num.toFixed(2)}%`;
};

export const formatVolume = (volume: number | string): string => {
  const num = typeof volume === 'string' ? parseFloat(volume) : volume;
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(2)}K`;
  } else {
    return num.toFixed(2);
  }
};

export const getColorClass = (value: number): string => {
  if (value > 0) return 'value-up';
  if (value < 0) return 'value-down';
  return 'value-neutral';
};

export const getTimeLabelByInterval = (interval: TimeInterval): string => {
  switch (interval) {
    case '1m': return '1 Minute';
    case '5m': return '5 Minutes';
    case '15m': return '15 Minutes';
    case '1h': return '1 Hour';
    case '4h': return '4 Hours';
    case '1d': return '1 Day';
    default: return interval;
  }
};

export const generateChartOptions = (
  data: KlineData[],
  interval: TimeInterval,
  theme: 'dark' | 'light' = 'dark'
) => {
  const timeLabels = data.map(d => formatTimeLabel(d.openTime, interval));
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          font: {
            size: 10,
          },
          maxTicksLimit: 8,
        },
      },
      y: {
        position: 'right',
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
          font: {
            size: 10,
          },
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        bodyColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 8,
        cornerRadius: 4,
        titleFont: {
          size: 12,
          weight: 'bold',
        },
        bodyFont: {
          size: 11,
        },
        callbacks: {
          label: (context: any) => {
            if (context.dataset.type === 'candlestick') {
              const dataPoint = data[context.dataIndex];
              return [
                `Open: ${formatPrice(dataPoint.open)}`,
                `High: ${formatPrice(dataPoint.high)}`,
                `Low: ${formatPrice(dataPoint.low)}`,
                `Close: ${formatPrice(dataPoint.close)}`,
                `Volume: ${formatVolume(dataPoint.volume)}`,
              ];
            }
            return context.dataset.label + ': ' + formatPrice(context.raw);
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };
};
