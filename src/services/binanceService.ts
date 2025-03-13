
// Interfaces for API responses
export interface CryptoSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
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

export type TimeInterval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

const API_BASE_URL = 'https://api.binance.com/api/v3';

// Get all available symbols
export const getSymbols = async (): Promise<CryptoSymbol[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/exchangeInfo`);
    const data = await response.json();
    return data.symbols.filter((symbol: CryptoSymbol) => symbol.status === 'TRADING');
  } catch (error) {
    console.error('Error fetching symbols:', error);
    throw error;
  }
};

// Search for symbols
export const searchSymbols = async (query: string): Promise<CryptoSymbol[]> => {
  try {
    const symbols = await getSymbols();
    return symbols.filter((symbol) => 
      symbol.symbol.toLowerCase().includes(query.toLowerCase()) ||
      symbol.baseAsset.toLowerCase().includes(query.toLowerCase())
    );
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
    const response = await fetch(
      `${API_BASE_URL}/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
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
