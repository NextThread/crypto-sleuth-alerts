
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Mail, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/utils/blogDataUtils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface PostFAQProps {
  post: BlogPost;
}

// Generic crypto-related FAQs that can be relevant to most blog posts
const DEFAULT_FAQS = [
  {
    question: "What is cryptocurrency trading?",
    answer: "Cryptocurrency trading involves buying, selling, and exchanging digital currencies on specialized platforms called crypto exchanges. Unlike traditional markets, crypto markets operate 24/7, offering opportunities for traders around the clock."
  },
  {
    question: "How do beginners start investing in cryptocurrencies?",
    answer: "Beginners should start by educating themselves about blockchain technology and cryptocurrencies, researching reputable exchanges, setting up secure wallets, starting with small investments, diversifying their portfolio, and staying updated with market trends and news."
  },
  {
    question: "What are the risks associated with crypto investing?",
    answer: "Crypto investing carries several risks including high price volatility, regulatory uncertainties, security vulnerabilities, market manipulation, liquidity issues, and technological risks. It's important to never invest more than you can afford to lose."
  },
  {
    question: "What is blockchain technology?",
    answer: "Blockchain is a distributed digital ledger technology that records transactions across many computers so that any involved record cannot be altered retroactively. This technology underpins cryptocurrencies and provides transparency, security, and decentralization."
  },
  {
    question: "What's the difference between technical and fundamental analysis?",
    answer: "Technical analysis involves studying price charts and using statistical indicators to predict future price movements, while fundamental analysis focuses on evaluating a cryptocurrency's intrinsic value by examining its use case, team, technology, market potential, and economic factors."
  },
  {
    question: "How are crypto taxes handled?",
    answer: "Cryptocurrency taxation varies by country, but generally, crypto transactions may be subject to capital gains taxes, income taxes, or other specific regulations. It's recommended to keep detailed records of all transactions and consult with a tax professional familiar with cryptocurrency regulations."
  }
];

const PostFAQ: React.FC<PostFAQProps> = ({ post }) => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend or newsletter service
    // For now, we'll just show a toast message
    
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Thanks for subscribing!",
      description: "You'll receive our latest updates in your inbox",
    });
    setEmail('');
  };

  return (
    <div className="mt-10 border border-border rounded-lg p-6 bg-card/30 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <HelpCircle className="h-5 w-5 text-primary" />
        Frequently Asked Questions
      </h2>
      
      <Accordion type="single" collapsible className="w-full">
        {DEFAULT_FAQS.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Newsletter Subscription CTA */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Subscribe to our Newsletter
            </h3>
            <p className="text-muted-foreground">
              Get the latest crypto insights, market analysis, and trading strategies delivered to your inbox.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 min-w-[240px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              Subscribe <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostFAQ;
