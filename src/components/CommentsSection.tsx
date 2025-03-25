
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Clock, MessageSquare, AlertTriangle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    name: string;
    photoURL: string;
  };
  createdAt: Timestamp;
}

interface CommentsSectionProps {
  postId: string | undefined;
}

const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginRequired, setLoginRequired] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!postId) return;

    const commentsRef = collection(db, "blogComments");
    const q = query(
      commentsRef, 
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Comment));
      
      setComments(fetchedComments);
    }, (error) => {
      console.error("Error fetching comments:", error);
    });
    
    return () => unsubscribe();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setLoginRequired(true);
      toast({
        title: "Login required",
        description: "Please log in to post a comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      setIsLoading(true);
      
      await addDoc(collection(db, "blogComments"), {
        text: newComment,
        author: {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          photoURL: user.photoURL || '',
        },
        postId: postId,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Comment posted",
        description: "Your comment has been added to the discussion",
      });
      
      setNewComment("");
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

  return (
    <Card className="border-secondary/30">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Comments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loginRequired && !user && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please log in to post comments. Creating an account allows you to participate in discussions.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder={user ? "Share your thoughts on this article..." : "Please log in to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user}
            className="w-full resize-none focus:border-primary"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading || !newComment.trim() || !user}
              className="flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              Post Comment
            </Button>
          </div>
        </form>

        <div className="space-y-4 pt-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border-t border-secondary/20 pt-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author.photoURL || undefined} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium text-sm">{comment.author.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {comment.createdAt ? formatTime(comment.createdAt) : 'Just now'}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground border-t border-secondary/20">
              No comments yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentsSection;
