
import React, { useState, useEffect } from 'react';
import { Cryptocurrency } from '@/lib/types';
import CryptoCard from './CryptoCard';
import { ApiService } from '@/lib/api';
import { PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FavoritesProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ favorites, onToggleFavorite }) => {
  const [favoriteCryptos, setFavoriteCryptos] = useState<Cryptocurrency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      if (favorites.length === 0) {
        setFavoriteCryptos([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // In a real app, we would fetch only the favorites
        // For our mock setup, we'll filter from all cryptos
        const allCryptos = await ApiService.getTopCryptos();
        const filtered = allCryptos.filter(crypto => favorites.includes(crypto.id));
        setFavoriteCryptos(filtered);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [favorites]);
  
  return (
    <div className="glass-card rounded-xl p-4 sm:p-6">
      <h2 className="text-lg font-medium mb-4">Your Favorites</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="loading-shimmer h-32 rounded-lg"></div>
          ))}
        </div>
      ) : favoriteCryptos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoriteCryptos.map(crypto => (
            <CryptoCard 
              key={crypto.id} 
              crypto={crypto} 
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <motion.div 
          className="bg-secondary/30 rounded-lg p-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <PlusCircle className="mx-auto mb-3 text-muted-foreground" size={32} />
          <p className="text-muted-foreground">No favorites yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add cryptocurrencies to your favorites for quick access.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;
