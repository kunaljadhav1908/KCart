import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div className="space-y-4 col-span-1 md:col-span-1">
                        <Link to="/" className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            🛍️ kCart
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Your premier destination for high-quality electronics, accessories, and everyday essentials. Crafted for style, comfort, and performance.
                        </p>
                    </div>

                    {/* Quick Shop Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-4">Shop</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/" className="hover:text-indigo-600 transition-colors">All Products</Link></li>
                            <li><Link to="/" className="hover:text-indigo-600 transition-colors">New Arrivals</Link></li>
                            <li><Link to="/" className="hover:text-indigo-600 transition-colors">Featured Items</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/cart" className="hover:text-indigo-600 transition-colors">View Cart</Link></li>
                            <li><Link to="/checkout" className="hover:text-indigo-600 transition-colors">Checkout</Link></li>
                            <li><Link to="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-800 tracking-wider uppercase mb-4">Contact Us</h3>
                        <p className="text-sm text-gray-500">Email: kunaljadhav192003@gmail.com</p>
                        <p className="text-sm text-gray-500">Phone: +91 9975124110</p>
                        <p className="text-sm text-gray-500">Address: 100 Innovation Way, Suite 400</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} kCart. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link to="/" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
                        <Link to="/" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
