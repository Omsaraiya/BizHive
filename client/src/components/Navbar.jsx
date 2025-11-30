import { MessageSquare, Rocket } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <span className="text-2xl font-bold text-indigo-600">BizHive</span>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="hidden md:flex items-center gap-8">
                        <a
                            href="#"
                            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors font-medium"
                        >
                            <MessageSquare size={20} />
                            The Growth Hub
                        </a>
                        <a
                            href="#"
                            className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors font-medium"
                        >
                            <Rocket size={20} />
                            The Showcase
                        </a>
                    </div>

                    {/* Login Button */}
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-colors font-medium">
                        Login
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden flex flex-col gap-4 pb-4">
                    <a
                        href="#"
                        className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors font-medium"
                    >
                        <MessageSquare size={20} />
                        The Growth Hub
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors font-medium"
                    >
                        <Rocket size={20} />
                        The Showcase
                    </a>
                </div>
            </div>
        </nav>
    );
}
