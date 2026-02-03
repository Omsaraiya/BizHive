import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

const PostCard = ({ post, currentUser }) => {
  // 1. Check if the current user has ALREADY liked this specific post
  // We look at the list of 'Likers' inside the post data
  const isOriginallyLiked = post.Likers?.some(liker => liker.id === currentUser.id);

  // 2. Set up local state for this card
  const [liked, setLiked] = useState(isOriginallyLiked);
  const [likeCount, setLikeCount] = useState(post.Likers?.length || 0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLike = async () => {
    // Prevent liking if not logged in
    if (!currentUser || !currentUser.id) {
        alert("Please login to like posts!");
        return;
    }

    // ⭐ UI OPTIMISM: Turn red IMMEDIATELY (makes it feel fast)
    const previousState = liked;
    const previousCount = likeCount;

    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    setIsAnimating(true);

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });

      if (!response.ok) {
        // If server fails, revert the change
        throw new Error('Server rejected like');
      }
      
      // Stop the "pop" animation after 300ms
      setTimeout(() => setIsAnimating(false), 300);

    } catch (error) {
      console.error("Like failed:", error);
      // Revert UI if network fails
      setLiked(previousState);
      setLikeCount(previousCount);
      alert("Failed to like post. Check your connection.");
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {post.User?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{post.User?.username || 'Unknown User'}</h3>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()} • 
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                post.category === 'growth' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {post.category === 'growth' ? 'Growth' : 'Showcase'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
      <p className="text-gray-600 leading-relaxed mb-4">{post.content}</p>

      <div className="flex items-center gap-6 border-t border-gray-100 pt-4">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-2 transition ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart 
            size={20} 
            fill={liked ? "currentColor" : "none"} 
            className={`transition-transform ${isAnimating ? 'scale-125' : 'scale-100'}`}
          />
          <span className="font-medium">{likeCount}</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition">
          <MessageCircle size={20} />
          <span className="font-medium">Comment</span>
        </button>

        <button className="flex items-center gap-2 text-gray-400 hover:text-indigo-600 transition ml-auto">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;