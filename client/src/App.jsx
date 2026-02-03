import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import Login from './components/Login';
import Signup from './components/Signup';
import Leaderboard from './components/Leaderboard';
import { Briefcase, TrendingUp, Award, Image as ImageIcon, X } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);
  const [activeTab, setActiveTab] = useState('growth');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  
  // ⭐ NEW: State for the file
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'growth'
  });
  const [toastMessage, setToastMessage] = useState('');

  // Safe Loading Logic
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id && parsedUser.token) {
           setUser(parsedUser);
        } else {
           localStorage.removeItem('user');
        }
      }
    } catch (error) {
      localStorage.removeItem('user');
      setUser(null);
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ⭐ NEW: Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        // Create a fake URL just to show a preview before uploading
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
      setImageFile(null);
      setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert('You must be logged in to post!');

    if (!user.id) {
        alert("CRITICAL ERROR: Account incomplete. Please Logout and Login.");
        return;
    }

    try {
      // ⭐ BIG CHANGE: Use FormData instead of JSON
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      formData.append('category', newPost.category);
      formData.append('userId', user.id);
      
      if (imageFile) {
          formData.append('image', imageFile);
      }

      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        // Note: We do NOT set 'Content-Type': 'application/json' here.
        // The browser sets the correct boundary automatically for FormData.
        body: formData 
      });

      if (response.ok) {
        const updatedUser = { ...user, karma: (user.karma || 0) + 10 };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        setToastMessage('Post created! +10 Karma');
        setTimeout(() => setToastMessage(''), 3000);
        
        // Reset everything
        setIsModalOpen(false);
        setNewPost({ title: '', content: '', category: 'growth' });
        setImageFile(null);
        setImagePreview(null);
        
        fetchPosts();
      } else {
        const errorText = await response.text();
        alert(`SERVER REJECTED POST: ${errorText}`);
      }
    } catch (error) {
      alert(`NETWORK ERROR: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-indigo-600 flex items-center justify-center gap-2">
            <Briefcase size={40} /> BizHive
          </h1>
          <p className="text-gray-600 mt-2">The Professional Community Marketplace</p>
        </div>
        {isLoginView ? (
          <Login 
            onLogin={(userData) => {
                const validUser = { ...userData, token: 'dummy-token' }; 
                setUser(validUser);
                localStorage.setItem('user', JSON.stringify(validUser));
            }} 
            onSwitch={() => setIsLoginView(false)} 
          />
        ) : (
          <Signup onSwitch={() => setIsLoginView(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <Briefcase /> BizHive
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold border border-yellow-200">
                <Award size={16} />
                <span>{user.karma || 0} Karma</span>
            </div>
            <span className="text-gray-600 hidden sm:block">Hello, <b>{user.username}</b></span>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Community Feed</h1>
                <p className="text-gray-500">Connect, Grow, and Showcase.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition shadow-lg flex items-center gap-2"
              >
                + New Post
              </button>
            </div>

            <div className="flex bg-white rounded-lg p-1 shadow-sm mb-6 w-fit">
              <button onClick={() => setActiveTab('growth')} className={`flex items-center gap-2 px-6 py-2 rounded-md transition ${activeTab === 'growth' ? 'bg-green-100 text-green-700 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                <TrendingUp size={18} /> The Growth Hub
              </button>
              <button onClick={() => setActiveTab('showcase')} className={`flex items-center gap-2 px-6 py-2 rounded-md transition ${activeTab === 'showcase' ? 'bg-purple-100 text-purple-700 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                <Briefcase size={18} /> The Showcase
              </button>
            </div>

            <div className="grid gap-6">
              {posts.filter(post => post.category === activeTab).map(post => (
                  <PostCard key={post.id} post={post} currentUser={user} />
              ))}
              {posts.filter(post => post.category === activeTab).length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-dashed border-gray-300">
                  <p>No posts here yet. Be the first!</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
             <Leaderboard />
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Create New Post</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-gray-200">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setNewPost({...newPost, category: 'growth'})} className={`p-2 rounded border text-center ${newPost.category === 'growth' ? 'bg-green-100 border-green-500 text-green-700 font-bold' : 'border-gray-200 text-gray-500'}`}>Growth (Advice)</button>
                  <button type="button" onClick={() => setNewPost({...newPost, category: 'showcase'})} className={`p-2 rounded border text-center ${newPost.category === 'showcase' ? 'bg-purple-100 border-purple-500 text-purple-700 font-bold' : 'border-gray-200 text-gray-500'}`}>Showcase (Promote)</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="e.g. My New Project" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea className="w-full border border-gray-300 rounded p-2 h-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Share your thoughts..." value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} required ></textarea>
              </div>

              {/* ⭐ NEW: Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Image (Optional)</label>
                
                {!imagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition cursor-pointer relative">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <ImageIcon className="mx-auto text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm">Click to upload an image</span>
                    </div>
                ) : (
                    <div className="relative mt-2">
                        <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                        <button 
                            type="button" 
                            onClick={removeImage}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition">Post to Community</button>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;