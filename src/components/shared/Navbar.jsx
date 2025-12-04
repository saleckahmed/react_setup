import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const { isAuthenticated } = useAuth();
    const [ isOpen, setIsOpen] = useState(false);
    const { logout, isLoading } = useLogout();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex-shrink-0">
                        <span className="text-blue-600 text-lg font-bold">MyProducts</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/home" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition">
                            Home
                        </Link>
                        <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition">
                            Products
                        </Link>
                        
                        {isAuthenticated ? (
                            <button onClick={logout} disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-medium transition">
                                {isLoading ? "Logging out..." : "Logout"}
                            </button>
                        ) : (
                            <Link to="/auth/login" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-medium transition">
                            Login
                            </Link>
                        )}
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-blue-600 p-1 rounded hover:bg-blue-50 transition"
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-2 space-y-2">
                        <Link to="/home" className="block text-blue-600 hover:text-blue-800 text-sm font-medium py-1.5 transition">
                            Home
                        </Link>
                        <Link to="/products" className="block text-blue-600 hover:text-blue-800 text-sm font-medium py-1.5 transition">
                            Products
                        </Link>
                
                        {isAuthenticated ? (
                            <button onClick={logout} disabled={isLoading} className="block text-blue-600 hover:text-blue-800 text-sm font-medium py-1.5 transition">
                                {isLoading ? "Logging out..." : "Logout"}
                            </button>
                        ) : (
                           <Link to="/auth/login" className="block text-blue-600 hover:text-blue-800 text-sm font-medium py-1.5 transition">
                           Login
                           </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}