import Navbar from './components/Navbar';
import PostCard from './components/PostCard';

function App() {
  // Dummy data simulating a database
  const posts = [
    {
      id: 1,
      author: "Sarah Bakery",
      content: "I'm struggling with customer retention. We get new people, but they don't come back for a second visit. Does anyone use a loyalty program that actually works?",
      type: "advice",
      upvotes: 12
    },
    {
      id: 2,
      author: "TechStart AI",
      content: "We just launched BizHive Analytics! It helps you track your most profitable customers automatically. Free trial for community members.",
      type: "promotion",
      upvotes: 45
    },
    {
      id: 3,
      author: "Mike Mechanic",
      content: "Need help with local SEO. Google Maps ranking dropped suddenly. Any experts here?",
      type: "advice",
      upvotes: 8
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="max-w-2xl mx-auto pt-8 px-4 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Community Feed</h1>
          <p className="text-gray-500">See what's happening in the hive today.</p>
        </div>

        {/* The Feed */}
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;