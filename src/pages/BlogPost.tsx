import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import { blogPosts } from '../data/blogPosts';
import { Calendar, User, MessageSquare, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import CommentsSection from '../components/CommentsSection';
import { ensureValidImage } from './Blog';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((post) => post.slug === slug);

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

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | ChartPulse Blog</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords} />
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
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments} Comments</span>
              </div>
            </div>
          </header>

          <div className="relative">
            <img
              src={ensureValidImage(post.imageUrl, 0)}
              alt={post.title}
              className="w-full rounded-lg object-cover aspect-video"
            />
          </div>

          <section className="space-y-4 text-muted-foreground">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>

          {post.references && post.references.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-2xl font-bold">References</h2>
              <ul className="list-disc pl-5 text-muted-foreground">
                {post.references.map((reference, index) => (
                  <li key={index}>
                    <a
                      href={reference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {reference.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <CommentsSection postId={slug} />
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;
