
import { Button } from '@/components/ui/button';
import { BarChart2, PieChart, Sparkles, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-tr from-background via-background/95 to-primary/10 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Animated orbs in background */}
      <div className="absolute w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl top-1/4 -left-32 animate-pulse opacity-60"></div>
      <div className="absolute w-[200px] h-[200px] bg-primary/20 rounded-full blur-3xl bottom-1/4 right-10 animate-pulse opacity-40 animation-delay-300"></div>

      <div className="w-full max-w-md p-8 space-y-8 bg-card/50 backdrop-blur-md rounded-xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-fade-in transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)] z-10">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Chart<span className="text-primary">Pulse</span>
          </h1>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Advanced analytics and real-time insights for crypto traders
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="flex flex-col items-center p-3 bg-card/80 rounded-lg border border-border">
              <TrendingUp className="h-5 w-5 text-crypto-bullish mb-2" />
              <span className="text-xs text-center">Price Analysis</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-card/80 rounded-lg border border-border">
              <BarChart2 className="h-5 w-5 text-crypto-volume mb-2" />
              <span className="text-xs text-center">Volume Tracking</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-card/80 rounded-lg border border-border">
              <PieChart className="h-5 w-5 text-primary mb-2" />
              <span className="text-xs text-center">Market Insights</span>
            </div>
          </div>

          <Button 
            variant="default" 
            size="lg" 
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            <FcGoogle className="h-5 w-5" />
            <span>{loading ? 'Please wait...' : 'Sign in with Google'}</span>
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-6">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center animate-fade-in animation-delay-600">
        <p className="text-muted-foreground text-sm">
          Trusted by 10000+ traders worldwide for accurate market analysis
        </p>
      </div>
    </div>
  );
};

export default Login;
