import { KlineData } from '../services/binanceService';

// Calculate Support and Resistance Levels
export const calculateSupportResistance = (
  data: KlineData[],
  lookbackPeriod: number = 50,
  significance: number = 3
): { supports: number[], resistances: number[] } => {
  const supports: number[] = [];
  const resistances: number[] = [];

  // Need at least lookbackPeriod + significance candles
  if (data.length < lookbackPeriod + significance) {
    return { supports, resistances };
  }

  for (let i = significance; i < data.length - significance; i++) {
    // Check for potential local minimum (support)
    let isSupport = true;
    for (let j = i - significance; j < i; j++) {
      if (data[j].low <= data[i].low) {
        isSupport = false;
        break;
      }
    }
    for (let j = i + 1; j <= i + significance; j++) {
      if (data[j].low <= data[i].low) {
        isSupport = false;
        break;
      }
    }
    if (isSupport) {
      supports.push(data[i].low);
    }

    // Check for potential local maximum (resistance)
    let isResistance = true;
    for (let j = i - significance; j < i; j++) {
      if (data[j].high >= data[i].high) {
        isResistance = false;
        break;
      }
    }
    for (let j = i + 1; j <= i + significance; j++) {
      if (data[j].high >= data[i].high) {
        isResistance = false;
        break;
      }
    }
    if (isResistance) {
      resistances.push(data[i].high);
    }
  }

  // Filter out levels that are too close to each other
  const filteredSupports = filterCloseLevels(supports, data[data.length - 1].close * 0.005);
  const filteredResistances = filterCloseLevels(resistances, data[data.length - 1].close * 0.005);

  return { 
    supports: filteredSupports,
    resistances: filteredResistances
  };
};

// Filter out levels that are too close to each other
const filterCloseLevels = (levels: number[], minDistance: number): number[] => {
  if (levels.length <= 1) return levels;
  
  levels.sort((a, b) => a - b);
  const filtered: number[] = [levels[0]];
  
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - filtered[filtered.length - 1] > minDistance) {
      filtered.push(levels[i]);
    }
  }
  
  return filtered;
};

// Calculate RSI (Relative Strength Index)
export const calculateRSI = (
  data: KlineData[],
  period: number = 14
): number[] => {
  if (data.length <= period) {
    return Array(data.length).fill(50);
  }

  const rsiValues: number[] = Array(period).fill(0);
  
  // Calculate price changes
  const changes: number[] = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i].close - data[i-1].close);
  }
  
  // Calculate average gains and losses for the first period
  let sumGain = 0;
  let sumLoss = 0;
  
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) {
      sumGain += changes[i];
    } else {
      sumLoss += Math.abs(changes[i]);
    }
  }
  
  let avgGain = sumGain / period;
  let avgLoss = sumLoss / period;
  
  // Calculate RSI using the smoothed method
  for (let i = period; i < changes.length; i++) {
    // Update average gain and loss
    avgGain = ((avgGain * (period - 1)) + (changes[i] > 0 ? changes[i] : 0)) / period;
    avgLoss = ((avgLoss * (period - 1)) + (changes[i] < 0 ? Math.abs(changes[i]) : 0)) / period;
    
    // Calculate RS and RSI
    const rs = avgGain / (avgLoss === 0 ? 0.001 : avgLoss); // Avoid division by zero
    const rsi = 100 - (100 / (1 + rs));
    
    rsiValues.push(rsi);
  }
  
  return rsiValues;
};

// Calculate MACD (Moving Average Convergence Divergence)
export const calculateMACD = (
  data: KlineData[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): { macdLine: number[], signalLine: number[], histogram: number[] } => {
  // Calculate EMA (Exponential Moving Average)
  const calculateEMA = (prices: number[], period: number): number[] => {
    const ema: number[] = [];
    const multiplier = 2 / (period + 1);
    
    // SMA for the first value
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += prices[i];
    }
    ema.push(sum / period);
    
    // EMA for the rest
    for (let i = period; i < prices.length; i++) {
      ema.push((prices[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]);
    }
    
    return ema;
  };
  
  const prices = data.map(d => d.close);
  
  // Calculate fast and slow EMAs
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  // Calculate MACD line
  const macdLine: number[] = [];
  for (let i = 0; i < slowEMA.length; i++) {
    const fastIndex = fastEMA.length - slowEMA.length + i;
    if (fastIndex >= 0) {
      macdLine.push(fastEMA[fastIndex] - slowEMA[i]);
    }
  }
  
  // Calculate signal line (EMA of MACD line)
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  // Calculate histogram (MACD line - signal line)
  const histogram: number[] = [];
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[macdLine.length - signalLine.length + i] - signalLine[i]);
  }
  
  return { macdLine, signalLine, histogram };
};

// Calculate Trend Direction
export const calculateTrendDirection = (
  data: KlineData[],
  longPeriod: number = 50,
  shortPeriod: number = 20
): 'bullish' | 'bearish' | 'neutral' => {
  if (data.length < Math.max(longPeriod, shortPeriod)) {
    return 'neutral';
  }
  
  // Calculate simple moving averages
  const calculateSMA = (prices: number[], period: number): number => {
    const sum = prices.slice(prices.length - period).reduce((a, b) => a + b, 0);
    return sum / period;
  };
  
  const prices = data.map(d => d.close);
  const shortSMA = calculateSMA(prices, shortPeriod);
  const longSMA = calculateSMA(prices, longPeriod);
  
  // Check the trend
  if (shortSMA > longSMA * 1.005) {
    return 'bullish';
  } else if (shortSMA < longSMA * 0.995) {
    return 'bearish';
  } else {
    return 'neutral';
  }
};

// Identify potential entry and exit points
export const identifyEntryExitPoints = (
  data: KlineData[]
): { entryPoints: number[], exitPoints: number[], stopLoss: number, takeProfit: number } => {
  if (data.length < 30) {
    return { entryPoints: [], exitPoints: [], stopLoss: 0, takeProfit: 0 };
  }
  
  const entryPoints: number[] = [];
  const exitPoints: number[] = [];
  
  // Simple strategy: RSI crosses below 30 (entry) or above 70 (exit)
  const rsiValues = calculateRSI(data);
  
  for (let i = 1; i < rsiValues.length; i++) {
    if (rsiValues[i - 1] > 30 && rsiValues[i] <= 30) {
      entryPoints.push(i + data.length - rsiValues.length);
    } else if (rsiValues[i - 1] < 70 && rsiValues[i] >= 70) {
      exitPoints.push(i + data.length - rsiValues.length);
    }
  }
  
  // Calculate stop loss and take profit for the most recent entry point
  const currentPrice = data[data.length - 1].close;
  let stopLoss = 0;
  let takeProfit = 0;
  
  if (entryPoints.length > 0) {
    const lastEntry = entryPoints[entryPoints.length - 1];
    const lastEntryPrice = data[lastEntry].close;
    
    // Calculate ATR (Average True Range) for volatility-based stop loss
    const atr = calculateATR(data.slice(data.length - 14), 14);
    
    if (lastEntryPrice < currentPrice) { // Long position
      stopLoss = lastEntryPrice - (atr * 2);
      takeProfit = lastEntryPrice + (atr * 3);
    } else { // Short position
      stopLoss = lastEntryPrice + (atr * 2);
      takeProfit = lastEntryPrice - (atr * 3);
    }
  }
  
  return { entryPoints, exitPoints, stopLoss, takeProfit };
};

// Calculate ATR (Average True Range)
const calculateATR = (data: KlineData[], period: number): number => {
  if (data.length < period) return 0;
  
  const trValues: number[] = [];
  
  // Calculate True Range
  for (let i = 1; i < data.length; i++) {
    const tr1 = data[i].high - data[i].low;
    const tr2 = Math.abs(data[i].high - data[i-1].close);
    const tr3 = Math.abs(data[i].low - data[i-1].close);
    
    trValues.push(Math.max(tr1, tr2, tr3));
  }
  
  // Calculate simple average for ATR
  const atr = trValues.slice(trValues.length - period).reduce((a, b) => a + b, 0) / period;
  
  return atr;
};

// Fibonacci Retracement Levels
export const calculateFibonacciLevels = (data: KlineData[], lookbackPeriod: number = 100): number[] => {
  if (data.length < lookbackPeriod) return [];
  
  const recentData = data.slice(-lookbackPeriod);
  const highestPoint = Math.max(...recentData.map(d => d.high));
  const lowestPoint = Math.min(...recentData.map(d => d.low));
  const diff = highestPoint - lowestPoint;
  
  // Standard Fibonacci retracement levels
  const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
  
  return fibLevels.map(level => {
    // For uptrend: Subtract retracement from highest point
    return highestPoint - (diff * level);
  });
};

// Detect trend lines
export const detectTrendLines = (
  data: KlineData[],
  lookbackPeriod: number = 50
): { uptrend: {start: number, end: number, slope: number}[], downtrend: {start: number, end: number, slope: number}[] } => {
  if (data.length < lookbackPeriod) {
    return { uptrend: [], downtrend: [] };
  }
  
  const recentData = data.slice(-lookbackPeriod);
  const uptrend: {start: number, end: number, slope: number}[] = [];
  const downtrend: {start: number, end: number, slope: number}[] = [];
  
  // Find local minima for uptrend lines
  const localMinIndices: number[] = [];
  for (let i = 2; i < recentData.length - 2; i++) {
    if (recentData[i].low < recentData[i-1].low && 
        recentData[i].low < recentData[i-2].low && 
        recentData[i].low < recentData[i+1].low && 
        recentData[i].low < recentData[i+2].low) {
      localMinIndices.push(i);
    }
  }
  
  // Find local maxima for downtrend lines
  const localMaxIndices: number[] = [];
  for (let i = 2; i < recentData.length - 2; i++) {
    if (recentData[i].high > recentData[i-1].high && 
        recentData[i].high > recentData[i-2].high && 
        recentData[i].high > recentData[i+1].high && 
        recentData[i].high > recentData[i+2].high) {
      localMaxIndices.push(i);
    }
  }
  
  // Connect minima for uptrend lines
  for (let i = 0; i < localMinIndices.length - 1; i++) {
    const start = localMinIndices[i];
    const end = localMinIndices[i + 1];
    
    // Only consider as uptrend if second point is higher
    if (recentData[end].low > recentData[start].low) {
      const slope = (recentData[end].low - recentData[start].low) / (end - start);
      uptrend.push({
        start: data.length - lookbackPeriod + start,
        end: data.length - lookbackPeriod + end,
        slope
      });
    }
  }
  
  // Connect maxima for downtrend lines
  for (let i = 0; i < localMaxIndices.length - 1; i++) {
    const start = localMaxIndices[i];
    const end = localMaxIndices[i + 1];
    
    // Only consider as downtrend if second point is lower
    if (recentData[end].high < recentData[start].high) {
      const slope = (recentData[end].high - recentData[start].high) / (end - start);
      downtrend.push({
        start: data.length - lookbackPeriod + start,
        end: data.length - lookbackPeriod + end,
        slope
      });
    }
  }
  
  return { uptrend, downtrend };
};

// Detect chart patterns
export const detectPatterns = (
  data: KlineData[]
): { 
  headAndShoulders: number[], 
  doubleTop: number[], 
  doubleBottom: number[],
  triangle: { start: number, end: number, type: 'ascending' | 'descending' | 'symmetrical' }[],
  wedge: { start: number, end: number, type: 'rising' | 'falling' }[]
} => {
  const result = {
    headAndShoulders: [] as number[],
    doubleTop: [] as number[],
    doubleBottom: [] as number[],
    triangle: [] as { start: number, end: number, type: 'ascending' | 'descending' | 'symmetrical' }[],
    wedge: [] as { start: number, end: number, type: 'rising' | 'falling' }[]
  };
  
  if (data.length < 100) return result;
  
  // Find local maxima and minima
  const localMaxIndices: number[] = [];
  const localMinIndices: number[] = [];
  
  for (let i = 5; i < data.length - 5; i++) {
    // Local maximum
    let isMax = true;
    for (let j = 1; j <= 5; j++) {
      if (data[i].high <= data[i-j].high || data[i].high <= data[i+j].high) {
        isMax = false;
        break;
      }
    }
    if (isMax) localMaxIndices.push(i);
    
    // Local minimum
    let isMin = true;
    for (let j = 1; j <= 5; j++) {
      if (data[i].low >= data[i-j].low || data[i].low >= data[i+j].low) {
        isMin = false;
        break;
      }
    }
    if (isMin) localMinIndices.push(i);
  }
  
  // Detect Double Top
  for (let i = 0; i < localMaxIndices.length - 1; i++) {
    const first = localMaxIndices[i];
    const second = localMaxIndices[i + 1];
    
    // Check if the two tops are roughly at the same level
    if (Math.abs(data[first].high - data[second].high) / data[first].high < 0.015 &&
        second - first > 10 && second - first < 50) {
      result.doubleTop.push(second);
    }
  }
  
  // Detect Double Bottom
  for (let i = 0; i < localMinIndices.length - 1; i++) {
    const first = localMinIndices[i];
    const second = localMinIndices[i + 1];
    
    // Check if the two bottoms are roughly at the same level
    if (Math.abs(data[first].low - data[second].low) / data[first].low < 0.015 &&
        second - first > 10 && second - first < 50) {
      result.doubleBottom.push(second);
    }
  }
  
  // Detect Head and Shoulders
  for (let i = 0; i < localMaxIndices.length - 2; i++) {
    const leftShoulder = localMaxIndices[i];
    const head = localMaxIndices[i + 1];
    const rightShoulder = localMaxIndices[i + 2];
    
    // Head must be higher than shoulders
    if (data[head].high > data[leftShoulder].high && 
        data[head].high > data[rightShoulder].high) {
      
      // Shoulders should be at similar heights
      if (Math.abs(data[leftShoulder].high - data[rightShoulder].high) / data[leftShoulder].high < 0.05) {
        result.headAndShoulders.push(head);
      }
    }
  }
  
  // Detect Triangles
  for (let i = 0; i < data.length - 30; i++) {
    const windowData = data.slice(i, i + 30);
    
    // Get highs and lows of the window
    const highs = windowData.map(d => d.high);
    const lows = windowData.map(d => d.low);
    
    // Simple linear regression on highs and lows
    const highTrend = calculateTrendSlope(highs);
    const lowTrend = calculateTrendSlope(lows);
    
    // Detect triangle type
    if (Math.abs(highTrend) < 0.001 && lowTrend > 0.001) {
      // Ascending triangle: Flat top, rising bottom
      result.triangle.push({
        start: i,
        end: i + 30,
        type: 'ascending'
      });
    } else if (highTrend < -0.001 && Math.abs(lowTrend) < 0.001) {
      // Descending triangle: Falling top, flat bottom
      result.triangle.push({
        start: i,
        end: i + 30,
        type: 'descending'
      });
    } else if (highTrend < -0.001 && lowTrend > 0.001) {
      // Symmetrical triangle: Falling top, rising bottom
      result.triangle.push({
        start: i,
        end: i + 30,
        type: 'symmetrical'
      });
    }
  }
  
  // Detect Wedges
  for (let i = 0; i < data.length - 30; i++) {
    const windowData = data.slice(i, i + 30);
    
    // Get highs and lows of the window
    const highs = windowData.map(d => d.high);
    const lows = windowData.map(d => d.low);
    
    // Simple linear regression on highs and lows
    const highTrend = calculateTrendSlope(highs);
    const lowTrend = calculateTrendSlope(lows);
    
    // Detect wedge type
    if (highTrend < -0.001 && lowTrend < -0.001 && Math.abs(highTrend) > Math.abs(lowTrend)) {
      // Falling wedge (bullish)
      result.wedge.push({
        start: i,
        end: i + 30,
        type: 'falling'
      });
    } else if (highTrend > 0.001 && lowTrend > 0.001 && Math.abs(highTrend) < Math.abs(lowTrend)) {
      // Rising wedge (bearish)
      result.wedge.push({
        start: i,
        end: i + 30,
        type: 'rising'
      });
    }
  }
  
  return result;
};

// Helper function to calculate trend slope
const calculateTrendSlope = (values: number[]): number => {
  const n = values.length;
  if (n < 2) return 0;
  
  const indices = Array.from({length: n}, (_, i) => i);
  
  // Calculate means
  const meanX = indices.reduce((sum, x) => sum + x, 0) / n;
  const meanY = values.reduce((sum, y) => sum + y, 0) / n;
  
  // Calculate slope
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (indices[i] - meanX) * (values[i] - meanY);
    denominator += Math.pow(indices[i] - meanX, 2);
  }
  
  return denominator !== 0 ? numerator / denominator : 0;
};
