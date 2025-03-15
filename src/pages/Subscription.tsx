
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription, Plan } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import Layout from '../components/Layout';

const Subscription = () => {
  const { plans, verifyPayment, isVerifyingPayment, currentSubscription } = useSubscription();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPaymentForm(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select a subscription plan first",
        variant: "destructive",
      });
      return;
    }
    
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter your Solana transaction ID",
        variant: "destructive",
      });
      return;
    }
    
    const success = await verifyPayment(transactionId, selectedPlan.id);
    
    if (success) {
      setShowPaymentForm(false);
      setTransactionId('');
      navigate('/');
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto text-center py-10">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="mb-4">You need to be signed in to access subscription plans.</p>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  // Calculate days remaining if user has a subscription
  const daysRemaining = currentSubscription.expiresAt 
    ? Math.max(0, Math.ceil((currentSubscription.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Subscription Plans</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upgrade your crypto analysis with one of our premium plans and unlock powerful features
          </p>

          {currentSubscription.planId && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg inline-block">
              <p>
                <span className="font-semibold">Current Plan:</span> {plans.find(p => p.id === currentSubscription.planId)?.name}
              </p>
              <p>
                <span className="font-semibold">Searches Remaining:</span> {currentSubscription.searchesRemaining}
              </p>
              <p>
                <span className="font-semibold">Expires In:</span> {daysRemaining} days
              </p>
            </div>
          )}
        </div>

        {!showPaymentForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`rounded-lg p-6 h-full flex flex-col transition-all duration-200 
                  ${currentSubscription.planId === plan.id 
                    ? "border-2 border-primary bg-primary/5" 
                    : "border border-border hover:border-primary/50 hover:shadow-md"}`}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-extrabold">${plan.price}</span>
                    <span className="ml-2 text-muted-foreground">/ {plan.duration}</span>
                  </div>
                </div>

                <ul className="mb-6 flex-grow space-y-2">
                  <li className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    <span>{plan.searchLimit} Crypto Searches</span>
                  </li>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={currentSubscription.planId === plan.id ? "secondary" : "default"}
                  className="w-full"
                  onClick={() => handleSelectPlan(plan)}
                  disabled={currentSubscription.planId === plan.id}
                >
                  {currentSubscription.planId === plan.id ? "Current Plan" : "Subscribe"}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="p-6 border rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-4">Complete Your Purchase</h2>
              <div className="mb-6">
                <h3 className="font-medium">Selected Plan: <span className="text-primary">{selectedPlan?.name}</span></h3>
                <p className="text-xl font-bold mt-2">${selectedPlan?.price}</p>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-medium">Payment Instructions:</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Open your Phantom wallet app</li>
                  <li>Send <span className="font-bold">${selectedPlan?.price} worth of SOL</span> to this address:</li>
                  <div className="bg-muted p-2 rounded text-sm font-mono my-2 break-all">
                    HQo1gG52Ae7SUQAHND6ACJ8vFbboYHPpe49dFRP8KZuu
                  </div>
                  <li>Copy the transaction ID from your wallet</li>
                  <li>Paste it below and click "Verify Payment"</li>
                </ol>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-id">Solana Transaction ID</Label>
                  <Input
                    id="transaction-id"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter your transaction ID"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isVerifyingPayment}
                  >
                    {isVerifyingPayment ? "Verifying..." : "Verify Payment"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowPaymentForm(false);
                      setSelectedPlan(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Subscription;
