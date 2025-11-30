import { ThumbsUp, MessageSquare, Megaphone } from 'lucide-react';

export default function PostCard({ post }) {
  // Determine style based on post type
  const isPromo = post.type === 'promotion';
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${isPromo ? 'bg-purple-600' : 'bg-emerald-500'}`}>
            {post.author[0]}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author}</h3>
            <span className="text-xs text-gray-500">2 hours ago</span>
          </div>
        </div>
        
        {/* The Badge */}
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
          ${isPromo ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {isPromo ? <Megaphone size={12} /> : <MessageSquare size={12} />}
          {isPromo ? 'Showcase' : 'Advice Needed'}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        {post.content}
      </p>

      {/* Footer / Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
        <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group">
          <div className="p-2 rounded-full group-hover:bg-indigo-50">
            <ThumbsUp size={18} />
          </div>
          <span className="font-medium">{post.upvotes}</span>
        </button>
        
        <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <span className="font-medium">Comment</span>
        </button>
      </div>
    </div>
  );
}