import { MessageSquare, Rocket } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
    return (
        <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo - Clicks reset to 'all' */}
                    <button 
                        onClick={() => setActiveTab('all')}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                    >
                        <span className="text-2xl font-bold text-indigo-600">BizHive</span>
                    </button>

                    {/* Navigation Tabs (Desktop) */}
                    <div className="hidden md:flex items-center gap-8 h-full">
                        <button
                            onClick={() => setActiveTab('advice')}
                            className={`flex items-center gap-2 h-full border-b-2 transition-colors font-medium px-1
                                ${activeTab === 'advice' 
                                    ? 'border-indigo-600 text-indigo-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                                }`}
                        >
                            <MessageSquare size={20} />
                            The Growth Hub
                        </button>

                        <button
                            onClick={() => setActiveTab('promotion')}
                            className={`flex items-center gap-2 h-full border-b-2 transition-colors font-medium px-1
                                ${activeTab === 'promotion' 
                                    ? 'border-purple-600 text-purple-600' // Purple for Showcase
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                                }`}
                        >
                            <Rocket size={20} />
                            The Showcase
                        </button>
                    </div>

                    {/* Login Button */}
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm">
                        Login
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex flex-col gap-4 pb-4">
                    <button
                        onClick={() => setActiveTab('advice')}
                        className={`flex items-center gap-2 font-medium p-2 rounded-lg
                            ${activeTab === 'advice' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600'}`}
                    >
                        <MessageSquare size={20} />
                        The Growth Hub
                    </button>
                    <button
                        onClick={() => setActiveTab('promotion')}
                        className={`flex items-center gap-2 font-medium p-2 rounded-lg
                            ${activeTab === 'promotion' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
                    >
                        <Rocket size={20} />
                        The Showcase
                    </button>
                </div>
            </div>
        </nav>
    );
}