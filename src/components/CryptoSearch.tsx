import { useState, useEffect, useRef } from 'react';
import { Search, X, Lock } from 'lucide-react';
import { CryptoSymbol, searchSymbols } from '../services/binanceService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CryptoSearchProps {
  onSymbolSelect: (symbol: string) => void;
  selectedSymbol: string;
}

const CryptoSearch = ({ onSymbolSelect, selectedSymbol }: CryptoSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<CryptoSymbol[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { currentSubscription } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user has an active subscription
  const hasSubscription = !!currentSubscription.planId;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (!user) return; // Skip search if not authenticated
    
    if (searchQuery.length > 1) {
      const delayDebounceFn = setTimeout(async () => {
        setIsLoading(true);
        try {
          const searchResults = await searchSymbols(searchQuery);
          setResults(searchResults);
          setIsOpen(true);
        } catch (error) {
          console.error('Error searching symbols:', error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
      
      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [searchQuery, user]);
  
  const handleSelectSymbol = (symbol: string, category: string) => {
    // Check if it's a premium category (Forex/Commodities) and user doesn't have subscription
    if ((category === 'Forex' || category === 'Commodities') && !hasSubscription) {
      toast({
        title: "Premium Feature",
        description: "Forex and Commodities trading requires a subscription plan",
        variant: "destructive",
      });
      return;
    }
    
    onSymbolSelect(symbol);
    setSearchQuery('');
    setIsOpen(false);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setIsOpen(false);
  };
  
  const handleSearchFocus = () => {
    if (!user) {
      navigate('/login');
    }
  };
  
  // Function to get color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crypto':
        return 'bg-blue-500/20 text-blue-500';
      case 'Forex':
        return 'bg-green-500/20 text-green-500';
      case 'Commodities':
        return 'bg-yellow-500/20 text-yellow-500';
      default:
        return 'bg-secondary/50';
    }
  };

  // Function to get asset name or display special names for commodities
  const getAssetName = (result: CryptoSymbol) => {
    if (result.category === 'Commodities' && (result as any).name) {
      return (result as any).name;
    }
    return result.baseAsset;
  };
  
  return (
    <div className="relative w-full md:w-72" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {user ? (
            <Search className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleSearchFocus}
          placeholder={user ? "Search crypto, forex & commodities..." : "Sign in to search markets"}
          className={`w-full pl-10 pr-10 py-2 h-10 bg-secondary/50 text-foreground border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-200 ${!user ? 'cursor-pointer hover:bg-secondary/70' : ''}`}
          disabled={!user}
        />
        {searchQuery && user && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
      
      {isOpen && results.length > 0 && (
        <TooltipProvider>
          <div className="absolute z-10 mt-1 w-full overflow-hidden glass-panel rounded-lg shadow-lg animate-fade-in divide-y divide-border">
            {results.map((result) => {
              const isPremiumCategory = result.category === 'Forex' || result.category === 'Commodities';
              const isDisabled = isPremiumCategory && !hasSubscription;
              
              const resultButton = (
                <button
                  key={result.symbol}
                  onClick={() => handleSelectSymbol(result.symbol, result.category)}
                  className={`w-full px-4 py-2 text-left transition-colors duration-150 flex items-center justify-between
                    ${isDisabled 
                      ? 'cursor-not-allowed bg-secondary/20 opacity-70' 
                      : 'hover:bg-primary/10'}`}
                  disabled={isDisabled}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{getAssetName(result)}</span>
                    <span className="text-xs text-muted-foreground ml-2">{result.quoteAsset}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ml-2 ${getCategoryColor(result.category)}`}>
                      {result.category}
                    </span>
                    
                    {/* Show lock icon for premium categories when user has no subscription */}
                    {isDisabled && (
                      <Lock className="h-3 w-3 ml-2 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{result.symbol}</span>
                </button>
              );
              
              if (isDisabled) {
                return (
                  <Tooltip key={result.symbol}>
                    <TooltipTrigger asChild>
                      {resultButton}
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-popover border border-border text-sm">
                      <p>Available only for premium plan users</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }
              
              return resultButton;
            })}
          </div>
        </TooltipProvider>
      )}
      
      {isLoading && (
        <div className="absolute z-10 mt-1 w-full glass-panel rounded-lg shadow-lg p-4 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Searching...</div>
        </div>
      )}
      
      {isOpen && searchQuery.length > 1 && results.length === 0 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full glass-panel rounded-lg shadow-lg p-4 flex items-center justify-center">
          <div className="text-muted-foreground">No results found</div>
        </div>
      )}
    </div>
  );
};

export default CryptoSearch;
