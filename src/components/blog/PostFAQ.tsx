
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';
import { BlogPost } from '@/utils/blogDataUtils';

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
  // Use post.category to potentially filter or customize FAQs in the future
  // For now, we'll just use our default FAQs
  
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
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Have more questions? Join our <a href="/community" className="text-primary hover:underline">community forum</a> or <a href="/contact" className="text-primary hover:underline">contact our support team</a>.</p>
      </div>
    </div>
  );
};

export default PostFAQ;
