import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { getAccessToken } from "../utils/auth";

function Cartpage() {
    const { cartItems, total, loading, removeFromCart, updateCartItem, fetchCart } = useCart();
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
    const isLoggedIn = !!getAccessToken();

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) {
        return (
            <div className="pt-24 min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="pt-24 min-h-screen bg-gray-50 pb-16 px-4 flex justify-center items-center">
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Sign in to view your cart</h2>
                    <p className="text-gray-500 mb-6">Your saved items appear here after you log in.</p>
                    <Link to="/login" className="inline-block px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
                    Shopping Cart
                </h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-indigo-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3.00 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet.</p>
                        <Link to="/" className="inline-block px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => {
                                const imageSrc = item.product_image 
                                    ? (item.product_image.startsWith('http') ? item.product_image : `${BASE_URL}${item.product_image}`)
                                    : null;

                                return (
                                    <div
                                        key={item.id}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-5 w-full sm:w-auto">
                                            {imageSrc ? (
                                                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center p-1.5">
                                                    <img
                                                        src={imageSrc}
                                                        alt={item.product_name}
                                                        className="w-full h-full object-contain rounded-lg"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-xs text-gray-400 font-bold flex-shrink-0">
                                                    No Image
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                                                    {item.product_name}
                                                </h2>
                                                <p className="text-indigo-600 font-bold">
                                                    ${item.product_price}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Quantity & Delete Controls */}
                                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl p-1 bg-gray-50/50">
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 transition-colors font-bold cursor-pointer"
                                                    onClick={() => updateCartItem(item.id, item.quantity - 1)}
                                                >
                                                    —
                                                </button>

                                                <span className="w-10 text-center text-sm font-bold text-gray-800">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 transition-colors font-bold cursor-pointer"
                                                    onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                                onClick={() => removeFromCart(item.id)}
                                                title="Remove Item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6.8m-.02 0-.34-6.8M9.45 8l.34 6.8M10.45 8l.34 6.8m-1.39-2.22m1.96-6.42a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V8h6V6.18ZM3.75 8h16.5M12 21.75c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Column */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 pb-4 border-b border-gray-100">
                                Order Summary
                            </h2>

                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900 font-bold">${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-bold">Free</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-extrabold text-gray-900">
                                    <span>Total</span>
                                    <span className="text-xl text-indigo-600 font-extrabold">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                to="/checkout"
                                className="w-full text-center block bg-indigo-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 cursor-pointer hover:translate-y-[-1px]"
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cartpage;