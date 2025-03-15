
import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { LogOut, Search, CreditCard } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { currentSubscription } = useSubscription();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <header className="w-full glass-panel backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold tracking-tight">
              Crypto<span className="text-primary">Insight</span>
            </Link>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center">
                <div className="text-sm mr-4">
                  <span className="text-muted-foreground">Searches: </span>
                  <span className={currentSubscription.searchesRemaining <= 3 ? "text-red-500 font-bold" : "font-semibold"}>
                    {currentSubscription.searchesRemaining}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img 
                    src={user.photoURL || '/placeholder.svg'} 
                    alt="User avatar" 
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="text-sm">{user.displayName || user.email}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/subscription')}
                className="flex items-center gap-1"
              >
                <CreditCard className="h-4 w-4" />
                <span className="hidden md:inline">Subscribe</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
                className="flex items-center gap-1"
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
      
      <footer className="mt-auto w-full border-t border-border py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CryptoInsight. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-muted-foreground">
              Data provided by Binance API
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
