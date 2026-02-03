import { useState } from 'react';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';

const PostCard = ({ post, currentUser }) => {
  const isOriginallyLiked = post.Likers?.some(liker => liker.id === currentUser?.id);
  const [liked, setLiked] = useState(isOriginallyLiked);
  const [likeCount, setLikeCount] = useState(post.Likers?.length || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // ⭐ Comment State
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.Comments || []);
  const [newComment, setNewComment] = useState("");

  const handleLike = async () => {
    if (!currentUser?.id) return alert("Please login to like!");
    const previousLiked = liked;
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setIsAnimating(true);
    
    try {
        const res = await fetch(`http://localhost:5000/api/posts/${post.id}/like`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId: currentUser.id })
        });
        if(!res.ok) throw new Error();
        setTimeout(() => setIsAnimating(false), 300);
    } catch (e) {
        setLiked(previousLiked); // Revert
    }
  };

  const handleCommentSubmit = async (e) => {
      e.preventDefault();
      if (!currentUser?.id) return alert("Please login to comment!");
      if (!newComment.trim()) return;

      try {
          const response = await fetch(`http://localhost:5000/api/posts/${post.id}/comments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: currentUser.id, content: newComment })
          });

          if (response.ok) {
              const savedComment = await response.json();
              setComments([...comments, savedComment]); // Add to list instantly
              setNewComment(""); // Clear box
          }
      } catch (error) {
          console.error("Comment failed", error);
      }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {post.User?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{post.User?.username || 'Unknown'}</h3>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()} • {post.category}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-600 leading-relaxed mb-4">{post.content}</p>

      {post.imageUrl && (
          <img src={`http://localhost:5000${post.imageUrl}`} alt="Post" className="w-full h-auto max-h-96 object-cover rounded-lg mb-4" />
      )}

      <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
        <button onClick={handleLike} className={`flex items-center gap-2 transition ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}>
          <Heart size={20} fill={liked ? "currentColor" : "none"} className={isAnimating ? 'scale-125' : ''} />
          <span className="font-medium">{likeCount}</span>
        </button>

        <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 transition ${showComments ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'}`}
        >
          <MessageCircle size={20} />
          <span className="font-medium">{comments.length} Comments</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition ml-auto">
          <Share2 size={20} />
        </button>
      </div>

      {/* ⭐ Comment Section */}
      {showComments && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4 animate-fade-in">
              {/* List Comments */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {comments.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center">No comments yet. Be the first!</p>
                  ) : (
                      comments.map((comment, index) => (
                          <div key={index} className="flex gap-2 text-sm">
                              <span className="font-bold text-gray-800">{comment.User?.username}:</span>
                              <span className="text-gray-600">{comment.content}</span>
                          </div>
                      ))
                  )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                  <input 
                      type="text" 
                      placeholder="Write a reply..." 
                      className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit" className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
                      <Send size={16} />
                  </button>
              </form>
          </div>
      )}
    </div>
  );
};

export default PostCard;