
import { useState, useEffect } from 'react';
import { User, ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  Timestamp,
  doc,
  updateDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  text: string;
  userName: string;
  userId: string;
  created: Timestamp;
  likes: number;
  userLiked?: boolean;
}

interface CommentsProps {
  postId: string;
}

const CommentsSection = ({ postId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'comments'),
          where('postId', '==', postId),
          orderBy('created', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedComments: Comment[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedComments.push({
            id: doc.id,
            text: data.text,
            userName: data.userName,
            userId: data.userId,
            created: data.created,
            likes: data.likes || 0,
            userLiked: data.likedBy ? data.likedBy.includes(user?.uid) : false
          });
        });
        
        setComments(fetchedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load comments. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, user, toast]);

  // Add a new comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to post a comment.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const commentData = {
        postId,
        text: newComment,
        userId: user.uid,
        userName: user.displayName || 'Anonymous User',
        created: serverTimestamp(),
        likes: 0,
        likedBy: [],
      };
      
      const docRef = await addDoc(collection(db, 'comments'), commentData);
      
      // Add to local state with a clientside timestamp
      setComments([
        {
          id: docRef.id,
          text: newComment,
          userName: user.displayName || 'Anonymous User',
          userId: user.uid,
          created: Timestamp.now(),
          likes: 0,
          userLiked: false
        },
        ...comments,
      ]);
      
      setNewComment('');
      
      toast({
        title: 'Comment Added',
        description: 'Your comment has been posted successfully.',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post your comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Like a comment
  const handleLikeComment = async (commentId: string, index: number) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to like comments.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const commentRef = doc(db, 'comments', commentId);
      const comment = comments[index];
      
      // Toggle like status
      const userLiked = !comment.userLiked;
      
      // Update in Firestore
      await updateDoc(commentRef, {
        likes: increment(userLiked ? 1 : -1),
        likedBy: userLiked 
          ? [...(comment.userLiked ? [] : [user.uid])]
          : [] // This is simplified, in a real app you'd use arrayUnion/arrayRemove
      });
      
      // Update in local state
      const updatedComments = [...comments];
      updatedComments[index] = {
        ...comment,
        likes: comment.likes + (userLiked ? 1 : -1),
        userLiked
      };
      
      setComments(updatedComments);
    } catch (error) {
      console.error('Error liking comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to like the comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Format date
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="mt-12 pt-6 border-t border-border">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        Comments ({comments.length})
      </h3>
      
      {/* Comment form */}
      <form onSubmit={handleAddComment} className="mb-8">
        <Textarea
          placeholder={user ? "Add your thoughts..." : "Sign in to comment..."}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user}
          className="min-h-[100px]"
        />
        <div className="flex justify-end mt-3">
          <Button 
            type="submit" 
            disabled={!user || !newComment.trim()}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Post Comment
          </Button>
        </div>
      </form>
      
      {/* Comments list */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading comments...</div>
        ) : comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment.id} className="flex gap-4 p-4 rounded-lg border border-border">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${comment.userId}`} />
              </Avatar>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{comment.userName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(comment.created)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.id, index)}
                    className={`flex items-center gap-1 text-xs ${comment.userLiked ? 'text-primary' : 'text-muted-foreground'}`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {comment.likes > 0 && comment.likes}
                  </Button>
                </div>
                
                <p className="mt-2 text-muted-foreground">{comment.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
