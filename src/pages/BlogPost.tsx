
import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import { technicalAnalysisPosts, fundamentalAnalysisPosts, tradingStrategyPosts, cryptoForexPosts } from '../data/blogPosts';
import { Calendar, User, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import CommentsSection from '../components/CommentsSection';
import { ensureValidImage } from './Blog';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
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
        </div>
      </Layout>
    );
  }

  // Convert post tags to keywords for metadata
  const keywords = post.tags ? post.tags.join(', ') : '';

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | ChartPulse Blog</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={keywords} />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <article className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), 'MMMM dd, yyyy', { locale: enUS })}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{post.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 10) + 1} Comments</span>
              </div>
            </div>
          </header>

          <div className="relative">
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-lg object-cover aspect-video"
            />
          </div>

          <section className="space-y-4 text-muted-foreground">
            {post.content ? (
              post.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>{post.description}</p>
            )}
          </section>

          <CommentsSection postId={slug} />
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;
