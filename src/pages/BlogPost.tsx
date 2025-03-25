
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import { technicalAnalysisPosts, fundamentalAnalysisPosts, tradingStrategyPosts, cryptoForexPosts } from '../data/blogPosts';
import { Calendar, User, MessageSquare, Link as LinkIcon, ChevronLeft, Tag, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CommentsSection from '../components/CommentsSection';
import { ensureValidImage } from './Blog';
import { useEffect } from 'react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  // Combine all post categories to find the requested post
  const allPosts = [
    ...technicalAnalysisPosts,
    ...fundamentalAnalysisPosts,
    ...tradingStrategyPosts,
    ...cryptoForexPosts
  ];
  
  const post = allPosts.find((post) => post.slug === slug);

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

  // Convert post tags to keywords for metadata
  const keywords = post.tags ? post.tags.join(', ') : '';

  // Format the content for display (handle paragraphs)
  const formatContent = (content: string) => {
    if (!content) return null;
    
    return content.split('\n\n').map((paragraph, index) => {
      // Handle headers (lines starting with ###)
      if (paragraph.startsWith('###')) {
        return (
          <h3 key={index} className="text-xl font-bold mt-8 mb-4">
            {paragraph.replace('###', '').trim()}
          </h3>
        );
      }
      
      // Handle subheaders (lines starting with **)
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h4 key={index} className="text-lg font-semibold mt-6 mb-3">
            {paragraph.replace(/^\*\*|\*\*$/g, '').trim()}
          </h4>
        );
      }
      
      // Handle bullet points
      if (paragraph.startsWith('- ')) {
        return (
          <ul key={index} className="list-disc pl-6 mt-2 mb-4">
            {paragraph.split('\n- ').map((item, i) => (
              <li key={i} className="mb-1">{item.replace(/^- /, '')}</li>
            ))}
          </ul>
        );
      }
      
      // Regular paragraphs
      return <p key={index} className="mb-4">{paragraph}</p>;
    });
  };

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | ChartPulse Blog</title>
        <meta name="description" content={post.description} />
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
                {post.category}
              </Badge>
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="bg-secondary/10">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">{post.title}</h1>
            <p className="text-lg text-muted-foreground">
              {post.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'MMMM dd, yyyy', { locale: enUS })}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>ChartPulse Team</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 10) + 1} Comments</span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </header>

          <div className="relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-lg object-cover aspect-video shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = ensureValidImage("", Math.floor(Math.random() * 14));
              }}
            />
          </div>

          <section className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-primary">
            {post.content ? (
              formatContent(post.content)
            ) : (
              <p>{post.description}</p>
            )}
          </section>
          
          <div className="flex justify-between items-center border-t border-b border-border py-4 my-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
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
          
          <div className="mt-10 pt-6 border-t border-border">
            <h3 className="text-xl font-bold mb-4">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allPosts
                .filter(p => p.slug !== slug && p.category === post.category)
                .slice(0, 2)
                .map(relatedPost => (
                  <Link key={relatedPost.slug} to={`/blog/${relatedPost.slug}`} className="group">
                    <div className="flex gap-4 items-start">
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title} 
                        className="w-20 h-20 object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = ensureValidImage("", Math.floor(Math.random() * 14));
                        }}
                      />
                      <div>
                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {relatedPost.readingTime}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;
