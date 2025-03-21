
export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  circulating_supply: number;
  last_updated: string;
}

export interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface WhaleAlert {
  id: string;
  timestamp: number;
  from: string;
  to: string;
  amount: number;
  amountUsd: number;
  token: string;
  hash: string;
}

export interface PriceAlert {
  id: string;
  coinId: string;
  targetPrice: number;
  isAbove: boolean; // Alert when price is above or below target
  isActive: boolean;
  createdAt: number;
}

export interface NotificationPreferences {
  priceAlerts: boolean;
  whaleAlerts: boolean;
  emailNotifications: boolean;
  telegramNotifications: boolean;
  emailAddress?: string;
  telegramId?: string;
}
