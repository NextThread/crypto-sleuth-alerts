import { TimeInterval } from '../services/binanceService';

export const formatTimeLabel = (timestamp: number, interval: TimeInterval): string => {
  const date = new Date(timestamp);
  
  switch (interval) {
    case '1s':
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    case '1m':
    case '5m':
    case '15m':
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    case '1h':
    case '4h':
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:00`;
    case '1d':
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
    case '1w':
      return `Week of ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`;
    case '1M':
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    default:
      return date.toLocaleString();
  }
};

export const getTimeLabelByInterval = (interval: TimeInterval): string => {
  switch (interval) {
    case '1s':
      return '1 Second';
    case '1m':
      return '1 Minute';
    case '5m':
      return '5 Minutes';
    case '15m':
      return '15 Minutes';
    case '1h':
      return '1 Hour';
    case '4h':
      return '4 Hours';
    case '1d':
      return '1 Day';
    case '1w':
      return '1 Week';
    case '1M':
      return '1 Month';
    default:
      return interval;
  }
};

export const generateChartOptions = (data: any[], interval: TimeInterval, theme: 'light' | 'dark' = 'light') => {
  const isDark = theme === 'dark';

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDark ? '#fff' : '#334155',
        bodyColor: isDark ? '#cbd5e1' : '#475569',
        borderColor: isDark ? 'rgba(55, 65, 81, 0.7)' : 'rgba(229, 231, 235, 0.7)',
        borderWidth: 1,
        padding: 10,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: getTimeUnit(interval),
          displayFormats: {
            millisecond: 'h:mm:ss.SSS a',
            second: 'h:mm:ss a',
            minute: 'h:mm a',
            hour: 'hA',
            day: 'MMM D',
            week: 'MMM D',
            month: 'MMM',
            quarter: '[Q]Q - YYYY',
            year: 'YYYY',
          },
        },
        ticks: {
          source: 'auto' as const,
          maxTicksLimit: 10,
        },
        grid: {
          display: false,
        },
      },
      y: {
        position: 'right' as const,
        grid: {
          color: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.3)',
        },
      },
    },
  };
};

const getTimeUnit = (interval: TimeInterval) => {
  switch (interval) {
    case '1s':
      return 'second';
    case '1m':
      return 'minute';
    case '5m':
    case '15m':
      return 'minute';
    case '1h':
    case '4h':
      return 'hour';
    case '1d':
      return 'day';
    case '1w':
      return 'week';
    case '1M':
      return 'month';
    default:
      return 'day';
  }
};
