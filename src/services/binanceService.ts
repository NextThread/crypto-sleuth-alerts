// Interfaces for API responses
export interface CryptoSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  category: 'Crypto' | 'Forex' | 'Commodities';
}

export interface KlineData {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  numberOfTrades: number;
}

export interface TickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export type TimeInterval = '1s' | '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w' | '1M';

const API_BASE_URL = 'https://api.binance.com/api/v3';

// Common forex pairs to include
const FOREX_PAIRS = [
  { symbol: 'EURUSD', baseAsset: 'EUR', quoteAsset: 'USD' },
  { symbol: 'GBPUSD', baseAsset: 'GBP', quoteAsset: 'USD' },
  { symbol: 'USDJPY', baseAsset: 'USD', quoteAsset: 'JPY' },
  { symbol: 'AUDUSD', baseAsset: 'AUD', quoteAsset: 'USD' },
  { symbol: 'USDCAD', baseAsset: 'USD', quoteAsset: 'CAD' },
  { symbol: 'NZDUSD', baseAsset: 'NZD', quoteAsset: 'USD' },
  { symbol: 'USDCHF', baseAsset: 'USD', quoteAsset: 'CHF' },
  { symbol: 'EURGBP', baseAsset: 'EUR', quoteAsset: 'GBP' },
  { symbol: 'EURJPY', baseAsset: 'EUR', quoteAsset: 'JPY' },
  { symbol: 'GBPJPY', baseAsset: 'GBP', quoteAsset: 'JPY' },
];

// Popular commodities to include
const COMMODITIES = [
  { symbol: 'XAUUSDT', baseAsset: 'XAU', quoteAsset: 'USDT', name: 'Gold' },
  { symbol: 'XAGUSDT', baseAsset: 'XAG', quoteAsset: 'USDT', name: 'Silver' },
  { symbol: 'WTIUSDT', baseAsset: 'WTI', quoteAsset: 'USDT', name: 'Crude Oil WTI' },
  { symbol: 'BRENTUSDT', baseAsset: 'BRENT', quoteAsset: 'USDT', name: 'Crude Oil Brent' },
  { symbol: 'NATGASUSDT', baseAsset: 'NATGAS', quoteAsset: 'USDT', name: 'Natural Gas' },
];

// Popular crypto assets to ensure they appear in search
const POPULAR_CRYPTO = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'DOGE', 'SHIB', 'AVAX', 'MATIC'];

// Get all available symbols
export const getSymbols = async (): Promise<CryptoSymbol[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exchangeInfo`);
    const data = await response.json();
    
    // Filter and categorize crypto symbols
    const cryptoSymbols = data.symbols
      .filter((symbol: any) => symbol.status === 'TRADING')
      .map((symbol: any) => ({
        ...symbol,
        category: 'Crypto' as const
      }));
    
    // Add forex pairs
    const forexSymbols = FOREX_PAIRS.map(pair => ({
      ...pair,
      status: 'TRADING',
      category: 'Forex' as const
    }));
    
    // Add commodities
    const commoditiesSymbols = COMMODITIES.map(commodity => ({
      ...commodity,
      status: 'TRADING',
      category: 'Commodities' as const
    }));
    
    return [...cryptoSymbols, ...forexSymbols, ...commoditiesSymbols];
  } catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
};

// Search for symbols
export const searchSymbols = async (query: string): Promise<CryptoSymbol[]> => {
  try {
    const symbols = await getSymbols();
    const lowercaseQuery = query.toLowerCase();
    
    // Check for commodity names in search query
    const commodityMatches = symbols.filter(
      symbol => 
        symbol.category === 'Commodities' && 
        ((symbol as any).name?.toLowerCase().includes(lowercaseQuery) || 
         symbol.baseAsset.toLowerCase().includes(lowercaseQuery))
    );
    
    // First, check for direct matches with popular crypto assets to ensure they appear
    const popularMatches = symbols.filter(symbol => 
      POPULAR_CRYPTO.includes(symbol.baseAsset) && 
      symbol.baseAsset.toLowerCase().includes(lowercaseQuery)
    );
    
    // Check for forex pairs
    const forexMatches = symbols.filter(symbol => 
      symbol.category === 'Forex' &&
      (symbol.symbol.toLowerCase().includes(lowercaseQuery) ||
       symbol.baseAsset.toLowerCase().includes(lowercaseQuery) ||
       symbol.quoteAsset.toLowerCase().includes(lowercaseQuery))
    );
    
    // Then get other matches
    const otherMatches = symbols.filter(symbol => 
      symbol.category === 'Crypto' &&
      !POPULAR_CRYPTO.includes(symbol.baseAsset) && 
      (symbol.symbol.toLowerCase().includes(lowercaseQuery) ||
       symbol.baseAsset.toLowerCase().includes(lowercaseQuery) ||
       symbol.quoteAsset.toLowerCase().includes(lowercaseQuery))
    );
    
    // Combine and limit results, ensuring commodities and popular cryptos appear first
    return [...commodityMatches, ...popularMatches, ...forexMatches, ...otherMatches].slice(0, 15);
  } catch (error) {
    console.error('Error searching symbols:', error);
    throw error;
  }
};

// Generate sample historical data for Forex and Commodities
const generateSampleData = (
  symbol: string, 
  interval: TimeInterval, 
  limit: number = 500,
  startPrice: number,
  volatility: number
): KlineData[] => {
  const now = Date.now();
  const timeIntervals: Record<TimeInterval, number> = {
    '1s': 1000,
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000
  };
  
  const intervalMs = timeIntervals[interval];
  const data: KlineData[] = [];
  
  let price = startPrice;
  
  for (let i = 0; i < limit; i++) {
    const openTime = now - (limit - i) * intervalMs;
    const closeTime = openTime + intervalMs;
    
    // Generate random price movement with some trend
    const change = (Math.random() - 0.5) * volatility * price;
    const trend = Math.sin(i / 50) * volatility * price * 0.5; // Add some cyclical pattern
    
    price += change + trend;
    
    // Calculate high, low, open, close
    const amplitude = Math.random() * volatility * price;
    const high = price + amplitude;
    const low = Math.max(price - amplitude, 0.01); // Ensure price doesn't go below 0
    const open = i === 0 ? startPrice : data[i - 1].close;
    const close = price;
    
    // Generate volume based on price movement
    const volume = Math.abs(close - open) * (1000 + Math.random() * 5000);
    const numberOfTrades = Math.floor(volume / 10 + Math.random() * 100);
    
    data.push({
      openTime,
      open: parseFloat(open.toFixed(5)),
      high: parseFloat(high.toFixed(5)),
      low: parseFloat(low.toFixed(5)),
      close: parseFloat(close.toFixed(5)),
      volume,
      closeTime,
      quoteAssetVolume: volume * close,
      numberOfTrades
    });
  }
  
  return data;
};

// Function to check if a symbol is a forex pair or commodity
const isForexOrCommodity = (symbol: string): boolean => {
  return FOREX_PAIRS.some(pair => pair.symbol === symbol) || 
         COMMODITIES.some(commodity => commodity.symbol === symbol);
};

// Get price seed for consistent data generation
const getPriceForSymbol = (symbol: string): number => {
  switch (symbol) {
    case 'EURUSD': return 1.08;
    case 'GBPUSD': return 1.27;
    case 'USDJPY': return 150.25;
    case 'AUDUSD': return 0.65;
    case 'USDCAD': return 1.37;
    case 'NZDUSD': return 0.59;
    case 'USDCHF': return 0.91;
    case 'EURGBP': return 0.85;
    case 'EURJPY': return 162.27;
    case 'GBPJPY': return 190.82;
    case 'XAUUSDT': return 2350.0;
    case 'XAGUSDT': return 27.5;
    case 'WTIUSDT': return 78.5;
    case 'BRENTUSDT': return 82.75;
    case 'NATGASUSDT': return 2.15;
    default: return 100.0;
  }
};

// Get volatility for symbol
const getVolatilityForSymbol = (symbol: string): number => {
  if (symbol.includes('XAU') || symbol.includes('XAG')) {
    return 0.005; // 0.5% for precious metals
  } else if (symbol.includes('WTI') || symbol.includes('BRENT') || symbol.includes('NATGAS')) {
    return 0.015; // 1.5% for energy commodities
  } else if (symbol.startsWith('EUR') || symbol.startsWith('GBP') || symbol.startsWith('USD')) {
    return 0.002; // 0.2% for major forex pairs
  }
  return 0.01; // 1% default
};

// Get OHLCV data for a symbol and interval
export const getKlineData = async (
  symbol: string,
  interval: TimeInterval,
  limit: number = 500
): Promise<KlineData[]> => {
  try {
    // Check if this is a forex pair or commodity for which we generate sample data
    if (isForexOrCommodity(symbol)) {
      const startPrice = getPriceForSymbol(symbol);
      const volatility = getVolatilityForSymbol(symbol);
      return generateSampleData(symbol, interval, limit, startPrice, volatility);
    }
    
    // Otherwise, fetch real data from Binance API
    // Map '1s' to appropriate API parameter (using '1m' as fallback)
    // Map '1M' to '1M' for monthly data
    const apiInterval = interval === '1s' ? '1m' : interval;
    
    const response = await fetch(
      `${API_BASE_URL}/klines?symbol=${symbol}&interval=${apiInterval}&limit=${limit}`
    );
    const data = await response.json();
    
    return data.map((item: any) => ({
      openTime: item[0],
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
      volume: parseFloat(item[5]),
      closeTime: item[6],
      quoteAssetVolume: parseFloat(item[7]),
      numberOfTrades: item[8],
    }));
  } catch (error) {
    console.error(`Error fetching kline data for ${symbol}:`, error);
    throw error;
  }
};

// Get 24h ticker data for a symbol
export const get24hTicker = async (symbol: string): Promise<TickerData> => {
  try {
    // For forex pairs and commodities, generate sample ticker data
    if (isForexOrCommodity(symbol)) {
      const basePrice = getPriceForSymbol(symbol);
      const changePercent = (Math.random() * 2 - 1) * 2; // Random change between -2% and +2%
      const priceChange = basePrice * (changePercent / 100);
      
      return {
        symbol,
        priceChange: priceChange.toFixed(8),
        priceChangePercent: changePercent.toFixed(2),
        weightedAvgPrice: (basePrice + priceChange * 0.5).toFixed(8),
        prevClosePrice: (basePrice - priceChange * 0.1).toFixed(8),
        lastPrice: (basePrice + priceChange).toFixed(8),
        lastQty: (Math.random() * 10 + 1).toFixed(2),
        bidPrice: (basePrice + priceChange - basePrice * 0.0001).toFixed(8),
        bidQty: (Math.random() * 5 + 1).toFixed(2),
        askPrice: (basePrice + priceChange + basePrice * 0.0001).toFixed(8),
        askQty: (Math.random() * 5 + 1).toFixed(2),
        openPrice: (basePrice - priceChange * 0.5).toFixed(8),
        highPrice: (basePrice + Math.abs(priceChange) * 1.2).toFixed(8),
        lowPrice: (basePrice - Math.abs(priceChange) * 1.2).toFixed(8),
        volume: (Math.random() * 1000 + 100).toFixed(2),
        quoteVolume: (Math.random() * 1000000 + 10000).toFixed(2),
        openTime: Date.now() - 24 * 60 * 60 * 1000,
        closeTime: Date.now(),
        firstId: 1,
        lastId: 1000,
        count: 1000
      };
    }
    
    // For real crypto assets, fetch from Binance API
    const response = await fetch(`${API_BASE_URL}/ticker/24hr?symbol=${symbol}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching 24h ticker for ${symbol}:`, error);
    throw error;
  }
};
