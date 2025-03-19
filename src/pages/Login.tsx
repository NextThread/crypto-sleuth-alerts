
import { Button } from '@/components/ui/button';
import { BarChart2, PieChart, Sparkles, TrendingUp, CandlestickChart, LineChart, Gauge, AreaChart, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [animationFinished, setAnimationFinished] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
    
    // Trigger animation completion after 1.5 seconds
    const timer = setTimeout(() => {
      setAnimationFinished(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [user, loading, navigate]);

  // Function to generate random y position for floating elements
  const getRandomY = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px] top-[-150px] left-[-250px] animate-pulse" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-[130px] bottom-[-200px] right-[-200px] animate-pulse animation-delay-300" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] top-[10%] right-[20%] animate-pulse animation-delay-700" />
        
        {/* Dynamic market data visualization in background */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-16 flex items-end overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={`bar-${i}`} 
                className={`w-1.5 mx-0.5 rounded-t-sm ${i % 3 === 0 ? 'bg-crypto-bearish' : 'bg-crypto-bullish'}`}
                style={{ 
                  height: `${(Math.sin(i * 0.3) + 1) * 25 + Math.random() * 15}px`,
                  animationDelay: `${i * 50}ms`,
                  animation: 'pulse 3s infinite'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Floating crypto icons with enhanced animations */}
        <div className="absolute top-[15%] left-[15%] animate-float opacity-20">
          <CandlestickChart className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute top-[75%] left-[70%] animate-float animation-delay-300 opacity-20">
          <LineChart className="h-8 w-8 text-primary" />
        </div>
        <div className="absolute top-[25%] left-[78%] animate-float animation-delay-600 opacity-20">
          <TrendingUp className="h-12 w-12 text-crypto-bullish" />
        </div>
        <div className="absolute top-[60%] left-[8%] animate-float animation-delay-900 opacity-20">
          <BarChart2 className="h-16 w-16 text-crypto-volume" />
        </div>
        <div className="absolute top-[20%] left-[50%] animate-float animation-delay-1200 opacity-20">
          <Gauge className="h-14 w-14 text-crypto-neutral" />
        </div>
        <div className="absolute top-[45%] left-[85%] animate-float animation-delay-1500 opacity-20">
          <AreaChart className="h-12 w-12 text-blue-400" />
        </div>
        <div className="absolute top-[80%] left-[30%] animate-float animation-delay-1800 opacity-20">
          <ArrowUpDown className="h-10 w-10 text-yellow-400" />
        </div>
        
        {/* Price ticker animation */}
        <div className="absolute bottom-8 left-0 right-0 overflow-hidden h-6 opacity-20">
          <div className="flex gap-8 animate-[slide_30s_linear_infinite]">
            {[
              { symbol: "BTC", price: "$70,250", change: "+2.3%", up: true },
              { symbol: "ETH", price: "$3,850", change: "+1.7%", up: true },
              { symbol: "SOL", price: "$146", change: "-0.8%", up: false },
              { symbol: "BNB", price: "$605", change: "+3.1%", up: true },
              { symbol: "ADA", price: "$0.45", change: "-1.2%", up: false },
              { symbol: "XRP", price: "$0.56", change: "+0.5%", up: true },
              { symbol: "AVAX", price: "$35.8", change: "+5.2%", up: true },
              { symbol: "DOGE", price: "$0.17", change: "-2.1%", up: false },
              { symbol: "DOT", price: "$7.25", change: "+0.9%", up: true },
              { symbol: "SHIB", price: "$0.000021", change: "-0.7%", up: false },
            ].map((crypto, i) => (
              <div key={`ticker-${i}`} className="flex items-center gap-2 whitespace-nowrap">
                <span className="font-bold">{crypto.symbol}</span>
                <span className="font-mono">{crypto.price}</span>
                <span className={crypto.up ? "text-crypto-bullish flex items-center" : "text-crypto-bearish flex items-center"}>
                  {crypto.up ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {crypto.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-md mx-auto">
          {/* Login card with enhanced glassmorphism effect */}
          <div className="glass-panel rounded-2xl p-8 space-y-8 shadow-[0_20px_80px_-10px_rgba(0,0,0,0.3)] animate-fade-in-up backdrop-blur-md border border-white/10">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse"></div>
                  <div className="relative z-10 p-3 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 backdrop-blur-sm border border-white/10">
                    <Sparkles className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Chart<span className="text-primary">Pulse</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xs mx-auto">
                Advanced analytics platform for crypto traders
              </p>
              
              {/* Animated underlining effect */}
              <div className="relative mt-1 mx-auto w-32 h-0.5 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent" 
                  style={{ 
                    transform: animationFinished ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 1s ease-out'
                  }}
                />
              </div>
            </div>

            {/* Feature highlights with animated hover */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex flex-col items-center p-4 glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg group">
                <TrendingUp className="h-6 w-6 text-crypto-bullish mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-center">Price Trends</span>
              </div>
              <div className="flex flex-col items-center p-4 glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg group">
                <BarChart2 className="h-6 w-6 text-crypto-volume mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-center">Volume Analysis</span>
              </div>
              <div className="flex flex-col items-center p-4 glass-card rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg group">
                <PieChart className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-center">Market Share</span>
              </div>
            </div>

            {/* Stats display */}
            <div className="flex justify-between text-xs text-muted-foreground px-2">
              <span className="flex items-center gap-1">
                <BarChart2 className="h-3 w-3" />
                <span>10M+ Data Points</span>
              </span>
              <span className="flex items-center gap-1">
                <CandlestickChart className="h-3 w-3" />
                <span>Real-time Analysis</span>
              </span>
            </div>

            {/* Login button with enhanced animated gradient */}
            <Button 
              variant="default" 
              size="lg" 
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-500 py-6 shadow-xl relative overflow-hidden group"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              <FcGoogle className="h-5 w-5" />
              <span className="font-medium">{loading ? 'Connecting...' : 'Sign in with Google'}</span>
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
          
          {/* Trust signals with enhanced design */}
          <div className="mt-10 text-center animate-fade-in animation-delay-600">
            <p className="text-muted-foreground text-sm flex flex-wrap justify-center items-center gap-2">
              <span>Trusted by 10,000+ traders worldwide</span>
              <span className="inline-flex gap-1 items-center bg-secondary/30 rounded-full px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-crypto-bullish animate-pulse"></span>
                Live market data
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
