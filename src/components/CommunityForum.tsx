
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, User, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface ForumPost {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    photoURL: string;
  };
  createdAt: Timestamp;
}

const CommunityForum = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [postName, setPostName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch posts from Firebase
  useEffect(() => {
    const postsRef = collection(db, "forumPosts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ForumPost));
      
      setPosts(fetchedPosts);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setPermissionError(true);
    });
    
    return () => unsubscribe();
  }, []);
  
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPost.trim()) return;
    
    try {
      setIsLoading(true);
      setPermissionError(false);
      
      // Using guest ID if user is not logged in
      const userId = user?.uid || 'guest-' + Math.random().toString(36).substring(2, 15);
      const displayName = postName.trim() || user?.displayName || 'Anonymous';
      
      await addDoc(collection(db, "forumPosts"), {
        text: newPost,
        author: {
          id: userId,
          name: displayName,
          photoURL: user?.photoURL || '',
        },
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Post submitted",
        description: "Your message has been posted to the community forum",
      });
      
      setNewPost("");
      setPostName("");
    } catch (error) {
      console.error("Error adding post:", error);
      setPermissionError(true);
      toast({
        title: "Error posting message",
        description: "There was a problem submitting your post. Please try again or sign in.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "forumPosts", postId));
      toast({
        title: "Post deleted",
        description: "Your post has been removed from the forum",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error deleting post",
        description: "There was a problem deleting your post",
        variant: "destructive",
      });
    }
  };
  
  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const postDate = timestamp.toDate();
    const diffMs = now.getTime() - postDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return postDate.toLocaleDateString();
  };
  
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Community Forum
        </CardTitle>
      </CardHeader>
      <CardContent>
        {permissionError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to access forum posts. Please sign in to participate in the community forum.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <form onSubmit={handleSubmitPost} className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Input 
                type="text"
                placeholder="Your name (optional)"
                value={postName}
                onChange={(e) => setPostName(e.target.value)}
                className="flex-1 bg-secondary/20 border-white/10"
              />
            </div>
            <Textarea
              placeholder="Share your thoughts, questions, or trading ideas..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
              className="w-full resize-none bg-secondary/20 border-white/10"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading || !newPost.trim()} 
                className="flex items-center gap-1.5"
              >
                <Send className="h-4 w-4" />
                Post
              </Button>
            </div>
          </form>
          
          {posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {permissionError 
                ? "Sign in to view and participate in community discussions" 
                : "Be the first to start a conversation!"}
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="p-4 border border-white/10 rounded-lg bg-secondary/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author.photoURL || undefined} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{post.author.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {post.createdAt ? formatTime(post.createdAt) : 'Just now'}
                        </div>
                      </div>
                    </div>
                    {user && (post.author.id === user.uid || user.uid === 'admin') && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeletePost(post.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{post.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityForum;
