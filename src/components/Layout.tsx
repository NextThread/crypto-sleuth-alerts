
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { LogOut, Search, CreditCard, Sparkles, Bell, Menu } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { currentSubscription } = useSubscription();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground antialiased overflow-x-hidden">
      <header className="w-full glass-panel backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold tracking-tight flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/30 transition-all"></div>
                <Sparkles className="h-6 w-6 text-primary relative z-10 group-hover:scale-110 transition-transform" />
              </div>
              <span>Chart<span className="text-primary">Pulse</span></span>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 bg-secondary/40 rounded-full px-3 py-1.5">
                  <Search className="w-3.5 h-3.5 text-primary" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Searches: </span>
                    <span className={currentSubscription.searchesRemaining <= 3 ? "text-red-500 font-bold" : "font-semibold"}>
                      {currentSubscription.searchesRemaining}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 relative group">
                  <div className="absolute inset-0 bg-white/5 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img 
                    src={user.photoURL || '/placeholder.svg'} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full ring-2 ring-white/10 group-hover:ring-primary/30 transition-all"
                  />
                  <span className="text-sm relative z-10">{user.displayName || user.email}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/subscription')}
                className="flex items-center gap-1 bg-secondary/40 border-white/5 hover:bg-primary/20 hover:border-primary/30 transition-all"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden md:inline">Subscribe</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
                className="flex items-center gap-1 bg-secondary/40 border-white/5 hover:bg-destructive/20 hover:border-destructive/30 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="mt-auto w-full border-t border-white/5 py-6 backdrop-blur-sm bg-background/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ChartPulse. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-muted-foreground bg-secondary/30 px-3 py-1 rounded-full">
              Data provided by Binance API
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
