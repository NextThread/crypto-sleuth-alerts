import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSafeBlogData, BlogPost as BlogPostType } from '../utils/blogDataUtils';

// Import our new components
import PostHeader from '../components/blog/PostHeader';
import PostImage from '../components/blog/PostImage';
import PostContent from '../components/blog/PostContent';
import PostTags from '../components/blog/PostTags';
import RelatedPosts from '../components/blog/RelatedPosts';
import PostError from '../components/blog/PostError';
import PostLoading from '../components/blog/PostLoading';
import PostNotFound from '../components/blog/PostNotFound';
import PostFAQ from '../components/blog/PostFAQ';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);
  const { allPosts, isLoaded, hasError } = useSafeBlogData();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    
    if (!isLoaded) {
      return; // Wait for blog data to load
    }
    
    if (hasError) {
      setError("Failed to load blog data");
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
  }, [slug, allPosts, isLoaded, hasError]);

  // Show loading state
  if (loading) {
    return (
      <Layout>
        <PostLoading />
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <PostError error={error} />
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <PostNotFound />
      </Layout>
    );
  }

  // Get post metadata for SEO
  const postTitle = post.title || "Untitled Post";
  const postDescription = post.description || "No description available";
  const postTags = Array.isArray(post.tags) ? post.tags : [];
  const keywords = postTags.join(', ');

  return (
    <Layout>
      <Helmet>
        <title>{postTitle} | ChartPulse Blog</title>
        <meta name="description" content={postDescription} />
        <meta name="keywords" content={keywords} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is cryptocurrency trading?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Cryptocurrency trading involves buying, selling, and exchanging digital currencies on specialized platforms called crypto exchanges. Unlike traditional markets, crypto markets operate 24/7, offering opportunities for traders around the clock."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do beginners start investing in cryptocurrencies?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Beginners should start by educating themselves about blockchain technology and cryptocurrencies, researching reputable exchanges, setting up secure wallets, starting with small investments, diversifying their portfolio, and staying updated with market trends and news."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the risks associated with crypto investing?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Crypto investing carries several risks including high price volatility, regulatory uncertainties, security vulnerabilities, market manipulation, liquidity issues, and technological risks. It's important to never invest more than you can afford to lose."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to all articles
        </Link>
        
        <article className="space-y-6">
          <PostHeader post={post} />
          <PostImage post={post} />
          <PostContent post={post} />
          <PostTags post={post} />
          <PostFAQ post={post} />
          <RelatedPosts posts={relatedPosts} />
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;
