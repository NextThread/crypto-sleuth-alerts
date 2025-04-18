import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Clock, Eye, Tag } from "lucide-react";
import { useSafeBlogData, ensureValidImage, BlogPost as BlogPostType } from '../utils/blogDataUtils';

const Blog = () => {
  const { hash } = useLocation();
  const { allPosts, isLoaded } = useSafeBlogData();
  
  // Categorize posts
  const technicalAnalysisPosts = allPosts.filter(post => post.category?.includes("Technical Analysis"));
  const fundamentalAnalysisPosts = allPosts.filter(post => post.category?.includes("Fundamental Analysis"));

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold">ChartPulse Blog</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover insights, strategies, and technical analysis to improve your trading decisions.
          </p>
        </div>

        {!isLoaded ? (
          // Loading state
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-8 w-1/4 bg-muted rounded mb-4"></div>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {[1, 2].map(j => (
                    <div key={j} className="border border-border rounded-lg overflow-hidden">
                      <div className="h-48 bg-muted"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-6 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-4">
              <TabsList className="bg-secondary/40">
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
                <TabsTrigger value="fundamental">Fundamental Analysis</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="space-y-8">
              <BlogSection 
                title="Technical Analysis" 
                description="Learn about chart patterns, indicators, and techniques to analyze price movements."
                id="technical"
                posts={technicalAnalysisPosts}
              />
              
              <BlogSection 
                title="Fundamental Analysis" 
                description="Discover how to evaluate assets based on financial data and economic indicators."
                id="fundamental"
                posts={fundamentalAnalysisPosts}
              />
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-8">
              <BlogSection 
                title="Technical Analysis" 
                description="Learn about chart patterns, indicators, and techniques to analyze price movements."
                id="technical"
                posts={technicalAnalysisPosts}
                showViewAll={false}
              />
            </TabsContent>
            
            <TabsContent value="fundamental" className="space-y-8">
              <BlogSection 
                title="Fundamental Analysis" 
                description="Discover how to evaluate assets based on financial data and economic indicators."
                id="fundamental"
                posts={fundamentalAnalysisPosts}
                showViewAll={false}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

interface BlogSectionProps {
  title: string;
  description: string;
  id: string;
  posts: BlogPostType[];
  showViewAll?: boolean;
}

const BlogSection = ({ title, description, id, posts, showViewAll = true }: BlogSectionProps) => {
  // Show empty state if no posts
  if (posts.length === 0) {
    return (
      <section id={id} className="space-y-6 scroll-mt-24">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {title}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="text-center py-12 border border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground">No posts available in this category</p>
        </div>
      </section>
    );
  }
  
  return (
    <section id={id} className="space-y-6 scroll-mt-24">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {title}
          </h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {showViewAll && (
          <Link to={`/blog#${id}`}>
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        )}
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};

const BlogPostCard = ({ post }: { post: BlogPostType }) => {
  // Get post data safely
  const postTitle = post.title || "Untitled Post";
  const postSlug = post.slug || "post-not-found";
  const postImage = ensureValidImage(
    post.image, 
    parseInt(postSlug.split('-')[0] || '0', 10)
  );
  const postDate = post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const postCategory = post.category || "Uncategorized";
  const postTags = Array.isArray(post.tags) ? post.tags : [];
  const postDescription = post.description || "No description available";
  const postReadingTime = post.readingTime || "5 min read";

  return (
    <Link to={`/blog/${postSlug}`} className="transition-all duration-300 hover:scale-[1.02]">
      <Card className="h-full glass-card border-secondary/30 hover:border-primary/30 transition-all overflow-hidden group">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={postImage} 
            alt={postTitle} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = ensureValidImage("", Math.floor(Math.random() * 9));
            }}
          />
          <Badge className="absolute top-4 right-4 bg-secondary/80 backdrop-blur-md">
            {postCategory}
          </Badge>
        </div>
        <CardHeader className="space-y-1">
          <CardTitle className="line-clamp-2">{postTitle}</CardTitle>
          <CardDescription className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3" />
            <span>{postReadingTime}</span>
            <span className="text-muted-foreground/40">•</span>
            <span>{postDate}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">
            {postDescription}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-secondary/30 py-3 px-6">
          <div className="flex items-center gap-1.5 text-xs">
            <Tag className="h-3 w-3 text-primary" />
            <div className="flex gap-2">
              {postTags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-muted-foreground">{tag}</span>
              ))}
              {postTags.length > 2 && <span className="text-muted-foreground">+{postTags.length - 2}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              {Math.floor(Math.random() * 500) + 100}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Bookmark className="h-3 w-3" />
              {Math.floor(Math.random() * 50) + 5}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default Blog;
