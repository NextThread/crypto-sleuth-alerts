
import { useEffect, useState } from "react";
import { BlogPost } from "@/utils/blogDataUtils";

interface PostContentProps {
  post: BlogPost;
}

// Enhanced formatContent function with highlight support for SEO terms
const formatContent = (content: string) => {
  if (!content) return null;
  
  // Define key SEO terms for trading/finance to highlight
  const seoHighlightTerms = [
    'technical analysis', 'trend', 'support level', 'resistance level', 
    'moving average', 'MACD', 'RSI', 'volume', 'candlestick', 'breakout',
    'momentum', 'volatility', 'bullish', 'bearish', 'divergence',
    'fundamentals', 'market cap', 'P/E ratio', 'EPS', 'trading strategy',
    'risk management', 'portfolio', 'diversification', 'stop-loss',
    'cryptocurrency', 'blockchain', 'forex', 'signal', 'indicator',
    'chart pattern', 'price action', 'market sentiment', 'overbought',
    'oversold', 'consolidation', 'fibonacci', 'trading psychology',
    'liquidity', 'hedge', 'leverage', 'margin', 'swing trading',
    'day trading', 'position trading', 'scalping', 'trend following',
    'fibonacci retracement', 'relative strength', 'divergence', 'consolidation',
    'breakout strategy', 'pivot points', 'head and shoulders pattern',
    'double top', 'double bottom', 'cup and handle', 'flag pattern',
    'pennant pattern', 'wedge pattern', 'triangle pattern', 'harmonic pattern',
    'elliot wave theory', 'wyckoff method', 'orderbook analysis', 'liquidity',
    'smart money', 'institutional trading', 'accumulation', 'distribution',
    'gap trading', 'opening range breakout', 'options trading', 'derivatives'
  ];
  
  // Create a regex pattern for all terms (case insensitive)
  const pattern = new RegExp(`\\b(${seoHighlightTerms.join('|')})\\b`, 'gi');
  
  // Safe parsing of content
  try {
    return content.split('\n\n').map((paragraph, index) => {
      // Handle headers (lines starting with ###)
      if (paragraph.startsWith('###')) {
        const headerText = paragraph.replace('###', '').trim();
        // Add subtle highlighting to headers
        return (
          <h3 key={index} className="text-xl font-bold mt-8 mb-4 text-primary/90">
            {headerText}
          </h3>
        );
      }
      
      // Handle subheaders (lines starting with **)
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const subheaderText = paragraph.replace(/^\*\*|\*\*$/g, '').trim();
        return (
          <h4 key={index} className="text-lg font-semibold mt-6 mb-3 text-primary/80">
            {subheaderText}
          </h4>
        );
      }
      
      // Handle bullet points
      if (paragraph.startsWith('- ')) {
        return (
          <ul key={index} className="list-disc pl-6 mt-2 mb-4">
            {paragraph.split('\n- ').map((item, i) => {
              const bulletText = item.replace(/^- /, '');
              // Highlight SEO terms in bullet points
              const highlightedBullet = bulletText.replace(pattern, match => 
                `<span class="font-medium text-primary">${match}</span>`
              );
              return (
                <li 
                  key={i} 
                  className="mb-1" 
                  dangerouslySetInnerHTML={{ __html: highlightedBullet }}
                />
              );
            })}
          </ul>
        );
      }
      
      // Regular paragraphs with SEO term highlighting
      const highlightedParagraph = paragraph.replace(pattern, match => 
        `<span class="font-medium text-primary">${match}</span>`
      );
      
      return (
        <p 
          key={index} 
          className="mb-4" 
          dangerouslySetInnerHTML={{ __html: highlightedParagraph }}
        />
      );
    });
  } catch (err) {
    console.error("Error formatting content:", err);
    return <p className="text-muted-foreground">Content could not be displayed properly.</p>;
  }
};

const PostContent = ({ post }: PostContentProps) => {
  const postDescription = post.description || "No description available";

  return (
    <section className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-primary">
      {post.content ? (
        formatContent(post.content)
      ) : (
        <p className="text-muted-foreground">{postDescription}</p>
      )}
    </section>
  );
};

export default PostContent;
