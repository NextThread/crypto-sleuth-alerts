
import { Button } from '@/components/ui/button';
import { BarChart2, PieChart, Sparkles, TrendingUp, CandlestickChart, LineChart, Gauge } from 'lucide-react';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] top-[-100px] left-[-200px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] bottom-[-150px] right-[-150px] animate-pulse animation-delay-300" />
        
        {/* Floating crypto icons */}
        <div className="absolute top-[20%] left-[20%] animate-float opacity-20">
          <CandlestickChart className="h-10 w-10 text-primary" />
        </div>
        <div className="absolute top-[70%] left-[75%] animate-float animation-delay-300 opacity-20">
          <LineChart className="h-8 w-8 text-primary" />
        </div>
        <div className="absolute top-[30%] left-[80%] animate-float animation-delay-600 opacity-20">
          <TrendingUp className="h-12 w-12 text-crypto-bullish" />
        </div>
        <div className="absolute top-[60%] left-[10%] animate-float animation-delay-900 opacity-20">
          <BarChart2 className="h-16 w-16 text-crypto-volume" />
        </div>
        <div className="absolute top-[15%] left-[60%] animate-float animation-delay-1200 opacity-20">
          <Gauge className="h-14 w-14 text-crypto-neutral" />
        </div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-md mx-auto">
          {/* Login card with glassmorphism effect */}
          <div className="glass-panel rounded-2xl p-8 space-y-8 shadow-[0_20px_80px_-10px_rgba(0,0,0,0.3)] animate-fade-in-up">
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                  <Sparkles className="h-12 w-12 text-primary relative z-10" />
                </div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Chart<span className="text-primary">Pulse</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xs mx-auto">
                Advanced analytics platform for crypto traders
              </p>
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

            {/* Login button with animated gradient */}
            <Button 
              variant="default" 
              size="lg" 
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all duration-500 py-6 shadow-lg relative overflow-hidden group"
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
          
          {/* Trust signals */}
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
