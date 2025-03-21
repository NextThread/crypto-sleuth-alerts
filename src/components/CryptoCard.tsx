
import React from 'react';
import { Cryptocurrency } from '@/lib/types';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface CryptoCardProps {
  crypto: Cryptocurrency;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ 
  crypto, 
  isFavorite = false,
  onToggleFavorite
}) => {
  const { 
    id, 
    name, 
    symbol, 
    current_price, 
    price_change_percentage_24h, 
    image 
  } = crypto;
  
  const isPriceUp = price_change_percentage_24h >= 0;
  
  const formatPrice = (price: number) => {
    return price < 1 
      ? price.toFixed(4) 
      : price.toLocaleString('en-US', { 
          minimumFractionDigits: 2,
          maximumFractionDigits: 2 
        });
  };
  
  return (
    <motion.div 
      className="glass-card rounded-xl p-4 relative overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center overflow-hidden">
            <img src={image} alt={name} className="h-8 w-8 object-contain" loading="lazy" />
          </div>
          
          <div className="text-left">
            <h3 className="font-medium">{name}</h3>
            <p className="text-xs text-muted-foreground uppercase">{symbol}</p>
          </div>
        </div>
        
        <button 
          onClick={() => onToggleFavorite?.(id)}
          className="text-muted-foreground hover:text-crypto-yellow transition-colors"
        >
          <Star 
            size={18} 
            strokeWidth={1.5} 
            fill={isFavorite ? "currentColor" : "none"} 
            className={isFavorite ? "text-crypto-yellow" : ""}
          />
        </button>
      </div>
      
      <div className="mt-4 flex justify-between items-end">
        <div>
          <p className="text-2xl font-semibold">${formatPrice(current_price)}</p>
        </div>
        
        <div className={`text-sm ${isPriceUp ? 'text-crypto-green' : 'text-crypto-red'}`}>
          <span>{isPriceUp ? '+' : ''}{price_change_percentage_24h.toFixed(2)}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CryptoCard;
