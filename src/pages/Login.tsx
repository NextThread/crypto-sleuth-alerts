
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-xl shadow-lg animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Crypto<span className="text-primary">Insight</span>
          </h1>
          <p className="text-muted-foreground">
            Sign in to access advanced crypto market analytics
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full flex items-center justify-center gap-2"
              onClick={signInWithGoogle}
              disabled={loading}
            >
              <FcGoogle className="h-5 w-5" />
              <span>{loading ? 'Please wait...' : 'Sign in with Google'}</span>
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-8">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
