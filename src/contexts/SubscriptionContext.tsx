
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  searchLimit: number;
  features: string[];
}

export interface UserSubscription {
  planId: string | null;
  expiresAt: Date | null;
  searchesRemaining: number;
}

interface SubscriptionContextType {
  plans: Plan[];
  currentSubscription: UserSubscription;
  decrementSearches: () => void;
  verifyPayment: (txId: string, planId: string) => Promise<boolean>;
  isVerifyingPayment: boolean;
}

const DEFAULT_SEARCH_LIMIT = 3;

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: 'weekly',
    name: 'Weekly Pass',
    price: 1,
    duration: '1 week',
    searchLimit: 50,
    features: ['Unlimited Chart Access', 'Basic Technical Analysis', 'Email Support']
  },
  {
    id: 'monthly',
    name: 'Monthly Pro',
    price: 3,
    duration: '1 month',
    searchLimit: 250,
    features: ['All Weekly Pass Features', 'Advanced Technical Indicators', 'Priority Support']
  },
  {
    id: 'half_yearly',
    name: 'Half-Year Trader',
    price: 9,
    duration: '6 months',
    searchLimit: 2000,
    features: ['All Monthly Pro Features', 'Trading Pattern Recognition', 'Portfolio Tracking']
  },
  {
    id: 'yearly',
    name: 'Annual Master',
    price: 15,
    duration: '1 year',
    searchLimit: 5000,
    features: ['All Half-Year Trader Features', 'AI Market Predictions', 'One-on-One Consultation']
  }
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEY = 'crypto_subscription_data';

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription>({
    planId: null,
    expiresAt: null,
    searchesRemaining: DEFAULT_SEARCH_LIMIT
  });

  // Load subscription data from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedData = localStorage.getItem(`${STORAGE_KEY}_${user.uid}`);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setCurrentSubscription({
          ...parsedData,
          expiresAt: parsedData.expiresAt ? new Date(parsedData.expiresAt) : null
        });
      } else {
        // Reset to default for new users
        setCurrentSubscription({
          planId: null,
          expiresAt: null,
          searchesRemaining: DEFAULT_SEARCH_LIMIT
        });
      }
    } else {
      // Reset when logged out
      setCurrentSubscription({
        planId: null,
        expiresAt: null,
        searchesRemaining: DEFAULT_SEARCH_LIMIT
      });
    }
  }, [user]);

  // Save subscription data to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `${STORAGE_KEY}_${user.uid}`, 
        JSON.stringify({
          ...currentSubscription,
          expiresAt: currentSubscription.expiresAt?.toISOString()
        })
      );
    }
  }, [currentSubscription, user]);

  // Check if subscription has expired
  useEffect(() => {
    if (
      currentSubscription.expiresAt && 
      new Date() > currentSubscription.expiresAt
    ) {
      setCurrentSubscription({
        planId: null,
        expiresAt: null,
        searchesRemaining: DEFAULT_SEARCH_LIMIT
      });
      
      toast({
        title: "Subscription Expired",
        description: "Your subscription has expired. Please renew to continue using premium features.",
        variant: "destructive",
      });
    }
  }, [currentSubscription.expiresAt, toast]);

  const decrementSearches = () => {
    if (currentSubscription.searchesRemaining > 0) {
      setCurrentSubscription(prev => ({
        ...prev,
        searchesRemaining: prev.searchesRemaining - 1
      }));

      if (currentSubscription.searchesRemaining === 1) {
        toast({
          title: "Search Limit Reached",
          description: "You've used your last free search. Subscribe to continue exploring more cryptocurrencies.",
          variant: "destructive",
        });
      }
    }
  };

  // Mock function to verify Solana payments
  // In a real app, you would integrate with Solana blockchain APIs
  const verifyPayment = async (txId: string, planId: string): Promise<boolean> => {
    setIsVerifyingPayment(true);
    
    try {
      // Simulate API call to verify transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll consider the payment valid if txId has more than 10 chars
      const isValid = txId.length > 10;
      
      if (isValid) {
        const selectedPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
        
        if (!selectedPlan) {
          throw new Error("Invalid plan selected");
        }
        
        // Calculate expiration date based on plan duration
        let expiresAt = new Date();
        if (planId === 'weekly') {
          expiresAt.setDate(expiresAt.getDate() + 7);
        } else if (planId === 'monthly') {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        } else if (planId === 'half_yearly') {
          expiresAt.setMonth(expiresAt.getMonth() + 6);
        } else if (planId === 'yearly') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        }
        
        // Update subscription
        setCurrentSubscription({
          planId,
          expiresAt,
          searchesRemaining: selectedPlan.searchLimit
        });
        
        toast({
          title: "Payment Successful!",
          description: `You've subscribed to the ${selectedPlan.name} plan. Enjoy your new features!`,
        });
        
        return true;
      } else {
        toast({
          title: "Payment Verification Failed",
          description: "We couldn't verify your transaction. Please try again or contact support.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast({
        title: "Payment Processing Error",
        description: "An error occurred while processing your payment. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  return (
    <SubscriptionContext.Provider 
      value={{ 
        plans: SUBSCRIPTION_PLANS, 
        currentSubscription,
        decrementSearches,
        verifyPayment,
        isVerifyingPayment
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
