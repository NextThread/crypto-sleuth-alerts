
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Home, BellDot } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 w-full sm:top-0 sm:bottom-auto z-50 glass-panel py-2 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-1 hidden sm:flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="font-bold text-white">CS</span>
            </div>
            <span className="font-medium text-lg">CryptoSleuth</span>
          </Link>
        </div>
        
        <div className="flex-1 sm:flex-none flex justify-around sm:gap-8">
          <Link 
            to="/" 
            className={cn(
              "flex flex-col sm:flex-row items-center sm:gap-2 p-2 transition-colors",
              location.pathname === "/" 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Home size={20} strokeWidth={1.5} />
            <span className="text-xs sm:text-sm">Dashboard</span>
          </Link>
          
          <Link 
            to="/settings" 
            className={cn(
              "flex flex-col sm:flex-row items-center sm:gap-2 p-2 transition-colors",
              location.pathname === "/settings" 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Settings size={20} strokeWidth={1.5} />
            <span className="text-xs sm:text-sm">Settings</span>
          </Link>
        </div>
        
        <div className="flex-1 hidden sm:flex justify-end">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
            <BellDot size={20} strokeWidth={1.5} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-crypto-red"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
