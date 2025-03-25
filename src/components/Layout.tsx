
import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Button } from '@/components/ui/button';
import { LogOut, Search, CreditCard, Sparkles, Bell, Menu, User, BarChart2, BookOpen, Shield, FileText, Info } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { currentSubscription } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 text-foreground antialiased overflow-x-hidden">
      <header className="w-full glass-panel backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold tracking-tight flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full group-hover:bg-primary/40 group-hover:scale-110 transition-all duration-500"></div>
                <Sparkles className="h-6 w-6 text-primary relative z-10 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <span>Chart<span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Pulse</span></span>
            </Link>
            
            <nav className="hidden md:flex ml-8">
              <ul className="flex gap-6">
                <li>
                  <Link 
                    to="/" 
                    className={`text-sm transition-colors hover:text-primary flex items-center gap-1.5 ${
                      location.pathname === '/' ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <BarChart2 className="h-4 w-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/blog" 
                    className={`text-sm transition-colors hover:text-primary flex items-center gap-1.5 ${
                      location.pathname.includes('/blog') ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    Blog
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about-us" 
                    className={`text-sm transition-colors hover:text-primary flex items-center gap-1.5 ${
                      location.pathname === '/about-us' ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    <Info className="h-4 w-4" />
                    About Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2.5 bg-secondary/40 hover:bg-secondary/60 rounded-full px-3.5 py-1.5 transition-colors group">
                  <Search className="w-3.5 h-3.5 text-primary group-hover:text-white transition-colors" />
                  <div className="text-sm">
                    <span className="text-muted-foreground">Searches: </span>
                    <span className={currentSubscription.searchesRemaining <= 3 ? "text-red-500 font-bold" : "font-semibold"}>
                      {currentSubscription.searchesRemaining}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 relative group">
                  <div className="absolute inset-0 bg-white/10 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img 
                    src={user.photoURL || 'https://ui-avatars.com/api/?name=' + (user.displayName || user.email)} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full ring-2 ring-white/10 group-hover:ring-primary/40 transition-all"
                  />
                  <span className="text-sm relative z-10">{user.displayName || user.email}</span>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/login')}
                className="flex items-center gap-1.5 bg-secondary/40 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
            
            {user && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/subscription')}
                  className="flex items-center gap-1.5 bg-secondary/40 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all"
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden md:inline">Subscribe</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-secondary/40 border-white/10 hover:bg-destructive/20 hover:border-destructive/30 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="mt-auto w-full border-t border-white/10 py-6 backdrop-blur-sm bg-background/30">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} <span className="text-primary font-medium">ChartPulse</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                <Shield className="h-3 w-3" />
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                <FileText className="h-3 w-3" />
                Terms & Conditions
              </Link>
              <Link to="/about-us" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                <Info className="h-3 w-3" />
                About Us
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-xs text-muted-foreground bg-secondary/40 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <BarChart2 className="h-3 w-3 text-primary" />
              Data provided by Binance API
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
