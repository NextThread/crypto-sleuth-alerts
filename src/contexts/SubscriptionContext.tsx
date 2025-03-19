
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
  premiumFeatures: {
    candlestickCharts: boolean;
    historicalBacktesting: boolean;
    allFeatures: boolean;
  };
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
  verifyPayment: (txId: string, planId: string, paymentMethod: 'solana' | 'ethereum') => Promise<boolean>;
  isVerifyingPayment: boolean;
}

const DEFAULT_SEARCH_LIMIT = 3; // Total limit of 3 searches (not per day)
const SOLANA_RECIPIENT_ADDRESS = "HQo1gG52Ae7SUQAHND6ACJ8vFbboYHPpe49dFRP8KZuu";
const ETHEREUM_RECIPIENT_ADDRESS = "0x55D35544369F05D3E5B62c47559de3f4DAc337c6";

export const SUBSCRIPTION_PLANS: Plan[] = [
  {
    id: 'weekly',
    name: 'Weekly Pass',
    price: 1,
    duration: '1 week',
    searchLimit: 50,
    features: [
      'Unlimited Chart Access', 
      'Basic Technical Analysis', 
      'Email Support'
    ],
    premiumFeatures: {
      candlestickCharts: false,
      historicalBacktesting: false,
      allFeatures: false
    }
  },
  {
    id: 'monthly',
    name: 'Monthly Pro',
    price: 3,
    duration: '1 month',
    searchLimit: 250,
    features: [
      'All Weekly Pass Features', 
      'Advanced Technical Indicators', 
      'Priority Support',
      'Candlestick Charts',
    ],
    premiumFeatures: {
      candlestickCharts: true,
      historicalBacktesting: false,
      allFeatures: false
    }
  },
  {
    id: 'half_yearly',
    name: 'Half-Year Trader',
    price: 9,
    duration: '6 months',
    searchLimit: 2000,
    features: [
      'All Monthly Pro Features', 
      'Trading Pattern Recognition', 
      'Portfolio Tracking',
      'Historical Backtesting Data',
      'Advanced Chart Analysis'
    ],
    premiumFeatures: {
      candlestickCharts: true,
      historicalBacktesting: true,
      allFeatures: true
    }
  },
  {
    id: 'yearly',
    name: 'Annual Master',
    price: 15,
    duration: '1 year',
    searchLimit: 5000,
    features: [
      'All Half-Year Trader Features', 
      'AI Market Predictions', 
      'One-on-One Consultation',
      'Priority Feature Updates'
    ],
    premiumFeatures: {
      candlestickCharts: true,
      historicalBacktesting: true,
      allFeatures: true
    }
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

  // Helper to verify Ethereum transactions - this would be implemented with web3 in a real app
  const verifyEthereumTransaction = async (txId: string, expectedAmount: number, recipientAddress: string) => {
    // In a real implementation, this would use ethers.js or web3.js to verify the transaction
    // For demo purposes, we'll simulate a successful verification
    console.log(`Verifying Ethereum transaction: ${txId} for ${expectedAmount} ETH to ${recipientAddress}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock successful verification
    return {
      isValid: true,
      message: "Transaction verified successfully",
      txLink: `https://etherscan.io/tx/${txId}`
    };
  };

  const verifyPayment = async (txId: string, planId: string, paymentMethod: 'solana' | 'ethereum'): Promise<boolean> => {
    setIsVerifyingPayment(true);
    
    try {
      const selectedPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
      
      if (!selectedPlan) {
        throw new Error("Invalid plan selected");
      }
      
      let verification;
      
      if (paymentMethod === 'solana') {
        verification = await verifySolanaTransaction(
          txId, 
          selectedPlan.price,
          SOLANA_RECIPIENT_ADDRESS
        );
      } else {
        verification = await verifyEthereumTransaction(
          txId, 
          selectedPlan.price,
          ETHEREUM_RECIPIENT_ADDRESS
        );
      }
      
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
          console.info("View transaction:", paymentMethod === 'solana' 
            ? getSolscanTransactionLink(txId)
            : `https://etherscan.io/tx/${txId}`);
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
