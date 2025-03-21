
import { Cryptocurrency, ChartData, WhaleAlert } from './types';

// Mock data for development
const mockCryptoData: Cryptocurrency[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 51362.48,
    price_change_percentage_24h: 2.34,
    market_cap: 1012304959481,
    volume_24h: 29384756321,
    circulating_supply: 19712981,
    last_updated: new Date().toISOString()
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2428.76,
    price_change_percentage_24h: -1.23,
    market_cap: 291762489135,
    volume_24h: 14289675432,
    circulating_supply: 120293841,
    last_updated: new Date().toISOString()
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 569.32,
    price_change_percentage_24h: 0.87,
    market_cap: 87294561234,
    volume_24h: 2134587609,
    circulating_supply: 153853081,
    last_updated: new Date().toISOString()
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 147.92,
    price_change_percentage_24h: 3.56,
    market_cap: 64853214789,
    volume_24h: 3214569873,
    circulating_supply: 438721561,
    last_updated: new Date().toISOString()
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    current_price: 0.5681,
    price_change_percentage_24h: -0.42,
    market_cap: 31234567890,
    volume_24h: 987654321,
    circulating_supply: 54876543210,
    last_updated: new Date().toISOString()
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    current_price: 0.3812,
    price_change_percentage_24h: 1.24,
    market_cap: 13456789012,
    volume_24h: 523456789,
    circulating_supply: 35230123456,
    last_updated: new Date().toISOString()
  }
];

// Mock Bitcoin price chart data
const generateMockChartData = (days: number = 30): ChartData[] => {
  const now = new Date();
  const data: ChartData[] = [];
  
  let basePrice = 50000 + Math.random() * 5000;
  
  for (let i = days; i >= 0; i--) {
    const time = new Date(now);
    time.setDate(time.getDate() - i);
    
    // Introduce some randomness to simulate market volatility
    const volatility = Math.random() * 0.03; // 0-3% volatility
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    basePrice = basePrice * (1 + direction * volatility);
    
    const open = basePrice;
    const close = basePrice * (1 + (Math.random() * 0.02 - 0.01)); // +/- 1%
    const high = Math.max(open, close) * (1 + Math.random() * 0.01); // Up to 1% higher
    const low = Math.min(open, close) * (1 - Math.random() * 0.01); // Up to 1% lower
    const volume = Math.random() * 10000000000; // Random volume
    
    data.push({
      time: time.getTime(),
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return data;
};

// Mock Whale Alerts
const mockWhaleAlerts: WhaleAlert[] = [
  {
    id: '1',
    timestamp: Date.now() - 1200000, // 20 minutes ago
    from: '0xB329e47610e8FD19c8c604c596205D9c5c841351',
    to: '0x28C6c06298d514Db089934071355E5743bf21d60',
    amount: 1250,
    amountUsd: 64203125,
    token: 'BTC',
    hash: '0x8a142fc4d5dea96c6a69c2496cd22c456e97fb55b0e4102b9ba8cca0dc2a1ec9'
  },
  {
    id: '2',
    timestamp: Date.now() - 3600000, // 1 hour ago
    from: '0x3FCe5449C7449983E31F1E30157F6A5eF4105293',
    to: '0x7BeA39867e4169DBe237d55C8242a8f2fcDcc387',
    amount: 15000,
    amountUsd: 36431400,
    token: 'ETH',
    hash: '0x6d9fe8d8c5d621b1f740486ed747c7d7c7a16fcbf26a87d17e28b88218b277c1'
  },
  {
    id: '3',
    timestamp: Date.now() - 7200000, // 2 hours ago
    from: '0x1D3cB0E7E3b0067Fa8C1d00c0Da22dBe33C6C346',
    to: '0xBinance_1',
    amount: 5000000,
    amountUsd: 2840500,
    token: 'XRP',
    hash: '0x2c91738a1e0d247b96f7119c1e47e7e0c5b18bdb699802d95c40a348ef0f0ee1'
  },
  {
    id: '4',
    timestamp: Date.now() - 14400000, // 4 hours ago
    from: '0xCoinbase_3',
    to: '0x78231D86c9A8c9DF996cCe7496E058A214A5BF10',
    amount: 42000,
    amountUsd: 23909040,
    token: 'SOL',
    hash: '0xf17ee54526d4ab66af98c782a75b60e9f25d1080ec58a0d562c9e40bc1f1c0f5'
  }
];

// API Service
export const ApiService = {
  // Get top cryptocurrencies
  getTopCryptos: async (): Promise<Cryptocurrency[]> => {
    // In a real app, this would fetch from CoinGecko or similar
    // Example: const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockCryptoData);
      }, 500); // Simulate network delay
    });
  },
  
  // Get crypto price chart data
  getCryptoChartData: async (coinId: string, days: number = 30): Promise<ChartData[]> => {
    // In a real app, this would fetch historical data from an API
    // Example: const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(generateMockChartData(days));
      }, 800); // Simulate network delay
    });
  },
  
  // Get whale alerts
  getWhaleAlerts: async (): Promise<WhaleAlert[]> => {
    // In a real app, this would fetch from Etherscan or a specialized API
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockWhaleAlerts);
      }, 600); // Simulate network delay
    });
  },
  
  // Get a specific cryptocurrency by ID
  getCryptoById: async (id: string): Promise<Cryptocurrency | undefined> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockCryptoData.find(crypto => crypto.id === id));
      }, 300);
    });
  }
};
