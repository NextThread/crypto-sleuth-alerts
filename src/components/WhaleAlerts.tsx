
import React, { useState, useEffect } from 'react';
import { ApiService } from '@/lib/api';
import { WhaleAlert } from '@/lib/types';
import { ExternalLink } from 'lucide-react';
import { Chip } from './ui/chip';

const WhaleAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<WhaleAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getWhaleAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to fetch whale alerts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlerts();
    
    // Refresh every 5 minutes
    const intervalId = setInterval(fetchAlerts, 300000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const formatAddress = (address: string) => {
    if (address.startsWith('0x')) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    return address;
  };
  
  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 60) {
      return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    }
    
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  };
  
  const formatAmount = (amount: number) => {
    return amount >= 1000000 
      ? `${(amount / 1000000).toFixed(2)}M` 
      : amount >= 1000 
        ? `${(amount / 1000).toFixed(2)}K` 
        : amount.toFixed(2);
  };
  
  const formatCurrency = (amount: number) => {
    return amount >= 1000000000 
      ? `$${(amount / 1000000000).toFixed(2)}B` 
      : amount >= 1000000 
        ? `$${(amount / 1000000).toFixed(2)}M` 
        : `$${amount.toLocaleString()}`;
  };
  
  return (
    <div className="glass-card rounded-xl p-4 sm:p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Whale Transactions</h2>
          <Chip variant="info">Live</Chip>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="loading-shimmer h-20 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className="bg-secondary/30 rounded-lg p-3 animate-slide-in"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatAmount(alert.amount)} {alert.token}</span>
                    <span className="text-muted-foreground">({formatCurrency(alert.amountUsd)})</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {formatTimestamp(alert.timestamp)}
                  </div>
                </div>
                
                <a 
                  href={`https://etherscan.io/tx/${alert.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              
              <div className="flex justify-between text-sm">
                <div>
                  <div className="text-muted-foreground text-xs">From</div>
                  <div className="font-mono">{formatAddress(alert.from)}</div>
                </div>
                
                <div className="text-center">→</div>
                
                <div className="text-right">
                  <div className="text-muted-foreground text-xs">To</div>
                  <div className="font-mono">{formatAddress(alert.to)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhaleAlerts;
