import { useState, useEffect } from 'react';
import { Trophy, Medal } from 'lucide-react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (response.ok) {
          const data = await response.json();
          setLeaders(data); 
        }
      } catch (error) {
        // Fail silently in production, or log to error reporting service
        console.error("Leaderboard update failed", error);
      }
    };

    fetchLeaderboard();
    
    // Auto-refresh every 10 seconds to keep rankings live
    const interval = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="text-yellow-500" size={24} />
        <h2 className="font-bold text-gray-800 text-lg">Top CEOs</h2>
      </div>

      <div className="space-y-4">
        {leaders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">Loading rankings...</p>
        ) : (
          leaders.map((user, index) => (
            <div key={index} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                    index === 1 ? 'bg-gray-100 text-gray-700' : 
                    index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-600'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-600 transition">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-400">Rank #{index + 1}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 text-indigo-600 font-bold text-sm bg-indigo-50 px-2 py-1 rounded">
                <Medal size={14} />
                {user.karma}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <button className="text-sm text-indigo-600 font-medium hover:underline">
          View Full Rankings
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;