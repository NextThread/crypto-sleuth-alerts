import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { verifySolanaTransaction, getSolscanTransactionLink } from '../utils/solanaUtils';

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
const SOLANA_RECIPIENT_ADDRESS = "HQo1gG52Ae7SUQAHND6ACJ8vFbboYHPpe49dFRP8KZuu";

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
        setCurrentSubscription({
          planId: null,
          expiresAt: null,
          searchesRemaining: DEFAULT_SEARCH_LIMIT
        });
      }
    } else {
      setCurrentSubscription({
        planId: null,
        expiresAt: null,
        searchesRemaining: DEFAULT_SEARCH_LIMIT
      });
    }
  }, [user]);

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

  const verifyPayment = async (txId: string, planId: string): Promise<boolean> => {
    setIsVerifyingPayment(true);
    
    try {
      const selectedPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
      
      if (!selectedPlan) {
        throw new Error("Invalid plan selected");
      }
      
      const verification = await verifySolanaTransaction(
        txId, 
        selectedPlan.price,
        SOLANA_RECIPIENT_ADDRESS
      );
      
      if (verification.isValid) {
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
        
        setCurrentSubscription({
          planId,
          expiresAt,
          searchesRemaining: selectedPlan.searchLimit
        });
        
        toast({
          title: "Payment Verified!",
          description: `Your transaction has been confirmed. You've subscribed to the ${selectedPlan.name} plan!`,
        });
        
        return true;
      } else {
        toast({
          title: "Payment Verification Failed",
          description: verification.message,
          variant: "destructive",
        });
        
        if (txId.length > 20) {
          console.info("View transaction on Solscan:", getSolscanTransactionLink(txId));
        }
        
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
