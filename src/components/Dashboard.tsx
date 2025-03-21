
import React, { useState, useEffect } from 'react';
import { ApiService } from '@/lib/api';
import { Cryptocurrency } from '@/lib/types';
import CryptoCard from './CryptoCard';
import PriceChart from './PriceChart';
import WhaleAlerts from './WhaleAlerts';
import Favorites from './Favorites';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [topCryptos, setTopCryptos] = useState<Cryptocurrency[]>([]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('bitcoin');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await ApiService.getTopCryptos();
        setTopCryptos(data);
        
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Failed to fetch crypto data:', error);
        toast({
          title: "Failed to load data",
          description: "Please check your connection and try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Refresh data every 30 seconds
    const intervalId = setInterval(fetchData, 30000);
    
    return () => clearInterval(intervalId);
  }, [toast]);
  
  const handleToggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    const crypto = topCryptos.find(c => c.id === id);
    if (crypto) {
      toast({
        title: favorites.includes(id) 
          ? `Removed ${crypto.name} from favorites` 
          : `Added ${crypto.name} to favorites`,
        variant: "default",
      });
    }
  };
  
  // Animations for staggered loading
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };
  
  return (
    <div className="space-y-6">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {isLoading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className="loading-shimmer h-32 rounded-xl"
            />
          ))
        ) : (
          // Actual data
          topCryptos.map(crypto => (
            <motion.div key={crypto.id} variants={item}>
              <CryptoCard 
                crypto={crypto} 
                isFavorite={favorites.includes(crypto.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            </motion.div>
          ))
        )}
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PriceChart coinId={selectedCrypto} />
        </div>
        <div>
          <WhaleAlerts />
        </div>
      </div>
      
      <Favorites 
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite} 
      />
    </div>
  );
};

export default Dashboard;
