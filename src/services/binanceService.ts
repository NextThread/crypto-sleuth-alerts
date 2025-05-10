
// Interfaces for API responses
export interface CryptoSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  category: 'Crypto' | 'Forex';
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
    
    return [...cryptoSymbols, ...forexSymbols];
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
    
    // First, check for direct matches with popular crypto assets to ensure they appear
    const popularMatches = symbols.filter(symbol => 
      POPULAR_CRYPTO.includes(symbol.baseAsset) && 
      symbol.baseAsset.toLowerCase().includes(lowercaseQuery)
    );
    
    // Then get other matches
    const otherMatches = symbols.filter(symbol => 
      !POPULAR_CRYPTO.includes(symbol.baseAsset) && (
        symbol.symbol.toLowerCase().includes(lowercaseQuery) ||
        symbol.baseAsset.toLowerCase().includes(lowercaseQuery) ||
        symbol.quoteAsset.toLowerCase().includes(lowercaseQuery)
      )
    );
    
    // Combine and limit results, ensuring popular cryptos appear first
    return [...popularMatches, ...otherMatches].slice(0, 15);
  } catch (error) {
    console.error('Error searching symbols:', error);
    throw error;
  }
};

// Get OHLCV data for a symbol and interval
export const getKlineData = async (
  symbol: string,
  interval: TimeInterval,
  limit: number = 500
): Promise<KlineData[]> => {
  try {
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
    const response = await fetch(`${API_BASE_URL}/ticker/24hr?symbol=${symbol}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching 24h ticker for ${symbol}:`, error);
    throw error;
  }
};
