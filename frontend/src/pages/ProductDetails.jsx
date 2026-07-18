import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();
   
    useEffect(() => {
        fetch(`${BASE_URL}/api/products/${id}/`)
        .then((res) => {
            if (!res.ok) {
                throw new Error("Failed to fetch product details");
            }
            return res.json();
        })
        .then((data) => {
            setProduct(data);
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, [id, BASE_URL]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
                <div className="animate-pulse space-y-4 text-center">
                    <div className="text-xl font-semibold text-gray-500">Loading details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
                <div className="text-center p-6 bg-red-50 border border-red-100 rounded-2xl max-w-md mx-auto">
                    <p className="text-red-700 font-medium">{error}</p>
                    <Link to="/" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
                <div className="text-center text-gray-500">
                    <p className="text-lg">Product not found</p>
                    <Link to="/" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        // Fix token case checking (access_token -> access_Token) and use SPA navigation
        if (!localStorage.getItem("access_Token")) {
            navigate("/login");
            return;
        }
        addToCart(product, 1);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Link */}
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Back to Products
                    </Link>
                </div>

                {/* Split grid for product layout */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-8 lg:p-12">
                        {/* Image wrapper */}
                        <div className="relative group overflow-hidden bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center p-4">
                           {product.image ? (
                               <img
                                   src={product.image.startsWith('http') ? product.image : `${BASE_URL}${product.image}`}
                                   alt={product.name}  
                                   className="max-h-[450px] w-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                               />
                           ) : (
                               <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl text-sm text-gray-400 font-bold">
                                   No Product Image
                               </div>
                           )}
                        </div>

                        {/* Details wrapper */}
                        <div className="flex flex-col justify-between space-y-6">
                            <div>
                                {product.category && (
                                    <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 rounded-full mb-4">
                                        {product.category.name || product.Category?.name}
                                    </span>
                                )}
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                                    {product.name}
                                </h1>
                                {product.brand && (
                                    <p className="text-sm text-gray-500 mb-2">By <span className="font-semibold text-gray-700">{product.brand}</span></p>
                                )}
                                <div className="h-1 w-12 bg-indigo-600 rounded-full mb-6"></div>
                                <p className="text-gray-600 leading-relaxed text-base">
                                    {product.description || "No description provided for this product."}
                                </p>
                            </div>

                            <div className="border-t border-gray-100 pt-6 space-y-6">
                                {/* Rating and Stock Info */}
                                <div className="flex flex-wrap gap-6">
                                    {product.rating > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl text-yellow-400">★</span>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Rating</p>
                                                <p className="text-lg font-bold text-gray-900">{product.rating}/5</p>
                                            </div>
                                        </div>
                                    )}
                                    {product.stock !== undefined && (
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Stock</p>
                                            <p className={`text-lg font-bold ${product.stock > 5 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                                {product.stock > 0 ? `${product.stock} Available` : 'Out of Stock'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-2">
                                    {product.discount > 0 && (
                                        <>
                                            <span className="text-xl text-gray-400 line-through font-semibold">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </span>
                                            <span className="text-sm bg-red-50 text-red-600 font-bold px-2 py-1 rounded">
                                                Save {product.discount}%
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold text-gray-900">
                                        ${product.discount ? (parseFloat(product.price) * (1 - product.discount / 100)).toFixed(2) : parseFloat(product.price).toFixed(2)}
                                    </span>
                                    <span className="text-sm text-gray-400 font-medium">USD</span>
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0}
                                    className={`w-full sm:w-auto px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white flex items-center justify-center gap-3 ${
                                        product.stock === 0
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-100 hover:translate-y-[-1px] cursor-pointer'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3.00 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Zm3 0a.625.625 0 1 1-1.25 0 .625.625 0 0 1 1.25 0Z" />
                                    </svg>
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;