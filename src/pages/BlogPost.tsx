
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import { Calendar, User, MessageSquare, ChevronLeft, Tag, Share2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CommentsSection from '../components/CommentsSection';
import { useEffect, useState } from 'react';
import { useSafeBlogData, ensureValidImage, formatDate, BlogPost as BlogPostType } from '../utils/blogDataUtils';

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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const { allPosts, isLoaded, loadError } = useSafeBlogData();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    
    if (!isLoaded) {
      return; // Wait for blog data to load
    }
    
    if (loadError) {
      setError(loadError);
      setLoading(false);
      return;
    }
    
    try {
      if (!slug) {
        throw new Error("No slug provided");
      }
      
      // Find the post with the matching slug
      const foundPost = allPosts.find((p) => p?.slug === slug);
      
      if (!foundPost) {
        throw new Error("Post not found");
      }
      
      setPost(foundPost);
      
      // Find related posts (same category, different slug)
      const related = allPosts
        .filter(p => p && p.slug !== slug && p.category === foundPost.category)
        .slice(0, 2);
      
      setRelatedPosts(related);
    } catch (err: any) {
      console.error("Error loading blog post:", err);
      setError(err.message || "Failed to load blog post");
    } finally {
      setLoading(false);
    }
  }, [slug, allPosts, isLoaded, loadError]);

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-1/4 bg-muted rounded"></div>
            <div className="h-10 w-3/4 bg-muted rounded"></div>
            <div className="h-6 w-2/4 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 w-5/6 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link to="/blog">
              <Button variant="outline" className="mt-2">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p>Sorry, the post you are looking for does not exist.</p>
          <Link to="/blog">
            <Button variant="outline" className="mt-4">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Get post metadata safely
  const postTitle = post.title || "Untitled Post";
  const postDescription = post.description || "No description available";
  const postCategory = post.category || "Uncategorized";
  const postImage = ensureValidImage(post.image, parseInt(post.slug?.split('-')[0] || '0', 10));
  const postDate = post.date || new Date();
  const postReadingTime = post.readingTime || "5 min read";
  const postTags = Array.isArray(post.tags) ? post.tags : [];
  const keywords = postTags.join(', ');

  return (
    <Layout>
      <Helmet>
        <title>{postTitle} | ChartPulse Blog</title>
        <meta name="description" content={postDescription} />
        <meta name="keywords" content={keywords} />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to all articles
        </Link>
        
        <article className="space-y-6">
          <header className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                {postCategory}
              </Badge>
              {postTags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="bg-secondary/10">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">{postTitle}</h1>
            <p className="text-lg text-muted-foreground">
              {postDescription}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={String(postDate)}>
                  {formatDate(postDate)}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.author || "ChartPulse Team"}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 10) + 1} Comments</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>{postReadingTime}</span>
              </div>
            </div>
          </header>

          <div className="relative">
            <img
              src={postImage}
              alt={postTitle}
              className="w-full rounded-lg object-cover aspect-video shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = ensureValidImage("", Math.floor(Math.random() * 9));
              }}
            />
          </div>

          <section className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-primary">
            {post.content ? (
              formatContent(post.content)
            ) : (
              <p className="text-muted-foreground">{postDescription}</p>
            )}
          </section>
          
          <div className="flex justify-between items-center border-t border-b border-border py-4 my-8">
            <div className="flex flex-wrap gap-2">
              {postTags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-secondary/10">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          <CommentsSection postId={slug || ""} />
          
          {relatedPosts.length > 0 && (
            <div className="mt-10 pt-6 border-t border-border">
              <h3 className="text-xl font-bold mb-4">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map(relatedPost => {
                  if (!relatedPost) return null;
                  
                  const relatedPostImage = ensureValidImage(
                    relatedPost.image, 
                    parseInt(relatedPost.slug?.split('-')[0] || '0', 10)
                  );
                  
                  return (
                    <Link key={relatedPost.slug} to={`/blog/${relatedPost.slug}`} className="group">
                      <div className="flex gap-4 items-start">
                        <img 
                          src={relatedPostImage} 
                          alt={relatedPost.title} 
                          className="w-20 h-20 object-cover rounded-md"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = ensureValidImage("", Math.floor(Math.random() * 9));
                          }}
                        />
                        <div>
                          <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                            {relatedPost.title || "Untitled Post"}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {relatedPost.readingTime || "5 min read"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;
