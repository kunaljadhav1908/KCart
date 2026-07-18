import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearToken, getAccessToken } from "../utils/auth.js";

function Navbar() {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    // Fix the cart count accumulator bug (total.quantity -> item.quantity)
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const isLoggedIn = !!getAccessToken();

    const handleLogout = () => {
        clearToken();
        clearCart(); // Reset cart state on logout
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo / Brand */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <span className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent group-hover:from-indigo-500 group-hover:to-violet-500 transition-all duration-300">
                                🛍️ kCart
                            </span>
                        </Link>
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-6">
                        {/* Orders Link */}
                        {isLoggedIn && (
                            <Link 
                                to="/orders" 
                                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 hidden md:inline"
                            >
                                My Orders
                            </Link>
                        )}

                        {/* Cart Link with count badge */}
                        <Link 
                            to="/cart" 
                            className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1.5 font-medium"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth="2" 
                                stroke="currentColor" 
                                className="w-6 h-6"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3.00 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Z" 
                                />
                            </svg>
                            <span className="hidden sm:inline">Cart</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5 shadow-sm border-2 border-white scale-100 hover:scale-110 transition-transform">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Login/Signup or Logout toggle */}
                        <div className="h-4 w-px bg-gray-200"></div>

                        <div className="flex items-center gap-3">
                            {isLoggedIn ? (
                                <button 
                                    onClick={handleLogout} 
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer shadow-sm"
                                >
                                    Logout
                                </button>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        to="/signup" 
                                        className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-md shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;