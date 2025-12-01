import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import CreatePost from './components/CreatePost';

function App() {
  // 1. Create a "State" to hold the real posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to refresh feed after posting
  const refreshPosts = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  };
  
  // 2. This runs AUTOMATICALLY when the app starts
  useEffect(() => {
    fetch('http://localhost:5000/api/posts')
      .then(res => res.json())
      .then(data => {
        console.log("Data from server:", data);
        setPosts(data); 
        setLoading(false);
      })
      .catch(err => console.error("Error fetching posts:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto pt-8 px-4 pb-20">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Community Feed</h1>
          <p className="text-gray-500">See what's happening in the hive today.</p>
        </div>

        {/* INPUT FORM - Added Here */}
        <div className="mb-8">
          <CreatePost onPostCreated={refreshPosts} />
        </div>

        {/* 3. Show "Loading..." or the Feed */}
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Connecting to Hive...</p>
        ) : (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
                <p className="text-gray-500">No posts yet. Be the first to post!</p>
              </div>
            ) : (
              posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;