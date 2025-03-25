
import { useState, useEffect } from 'react';
import { User, Send, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, collection, addDoc, query, orderBy, onSnapshot, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Comment {
  id: string;
  text: string;
  postId?: string;
  author: {
    id: string;
    name: string;
    photoURL: string;
  };
  createdAt: Timestamp;
}

interface CommentsProps {
  postId: string | undefined;
}

const CommentsSection = ({ postId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!postId) return;
    
    const commentsRef = collection(db, "blogComments");
    const q = query(
      commentsRef,
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Comment))
        .filter(comment => comment.postId === postId);
      
      setComments(fetchedComments);
    }, (error) => {
      console.error("Error fetching comments:", error);
      setErrorMsg("Failed to load comments. Please try again later.");
    });
    
    return () => unsubscribe();
  }, [postId]);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to comment on posts",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    try {
      setIsLoading(true);
      
      await addDoc(collection(db, "blogComments"), {
        text: newComment,
        postId: postId,
        author: {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          photoURL: user.photoURL || '',
        },
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
      
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error posting comment",
        description: "There was a problem submitting your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, "blogComments", commentId));
      toast({
        title: "Comment deleted",
        description: "Your comment has been removed",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error deleting comment",
        description: "There was a problem deleting your comment",
        variant: "destructive",
      });
    }
  };
  
  const formatTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const commentDate = timestamp.toDate();
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return commentDate.toLocaleDateString();
  };
  
  if (!user) {
    return (
      <Alert className="mt-6 border-primary/30 bg-primary/5">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <AlertDescription className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>Sign in to join the discussion and comment on this post.</p>
          <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
            Sign In to Comment
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>
      
      {errorMsg && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full resize-none bg-secondary/20 border-white/10"
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading || !newComment.trim()} 
            className="flex items-center gap-1.5"
          >
            <Send className="h-4 w-4" />
            Post Comment
          </Button>
        </div>
      </form>
      
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 border border-white/10 rounded-lg bg-secondary/10">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author.photoURL || undefined} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{comment.author.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {comment.createdAt ? formatTime(comment.createdAt) : 'Just now'}
                    </div>
                  </div>
                </div>
                {user && (comment.author.id === user.uid) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDeleteComment(comment.id)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
