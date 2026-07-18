import { useEffect, useState, useRef } from "react";
import ProductCard from "../components/ProductCard";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const catalogRef = useRef(null);

    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

    useEffect(() => {
        fetch(`${BASE_URL}/api/products/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                return response.json();
            })
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [BASE_URL]);

    const scrollToCatalog = () => {
        catalogRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 px-4 flex justify-center items-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-500 font-semibold">Loading premium products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 px-4 flex justify-center items-center">
                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl max-w-md text-center">
                    <p className="text-red-700 font-bold mb-2">Error Loading Catalog</p>
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero Section */}
                <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 mt-6 border border-slate-800">
                    {/* Abstract Decorative Background elements */}
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] rounded-full bg-violet-500/20 blur-[120px] pointer-events-none"></div>
                    
                    <div className="relative px-8 py-16 md:py-24 sm:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="text-center md:text-left md:max-w-xl space-y-6">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-400/20 uppercase">
                                ✨ Elevate Your Lifestyle
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                                Premium Quality <br />
                                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Curated For You
                                </span>
                            </h1>
                            <p className="text-slate-300 text-lg leading-relaxed max-w-lg">
                                Discover our exclusive collections. Crafted with passion, delivered with care, designed to bring elegance into your everyday life.
                            </p>
                            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                                <button 
                                    onClick={scrollToCatalog}
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-950 font-bold rounded-2xl hover:bg-slate-100 transition-all duration-200 shadow-lg cursor-pointer transform hover:translate-y-[-2px]"
                                >
                                    Shop Collection 🛍️
                                </button>
                            </div>
                        </div>
                        
                        {/* Right side - Abstract premium card layout */}
                        <div className="hidden lg:flex relative items-center justify-center w-full max-w-md">
                            <div className="w-72 h-96 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm relative transform -rotate-6 shadow-2xl flex flex-col justify-between p-6">
                                <div className="flex justify-between items-start">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white">C</div>
                                    <span className="text-xs text-white/50 font-medium">Limited Edition</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 w-2/3 bg-white/20 rounded-full"></div>
                                    <div className="h-3 w-full bg-white/10 rounded-full"></div>
                                    <div className="h-3 w-4/5 bg-white/10 rounded-full"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-white">$149.00</span>
                                    <div className="px-3.5 py-1.5 bg-indigo-500 hover:bg-indigo-600 transition-colors text-white font-bold rounded-xl text-xs cursor-pointer">Buy</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section title */}
                <div ref={catalogRef} className="scroll-mt-24 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Products</h2>
                        <p className="text-gray-500 text-sm mt-1">Explore our latest arrivals and premium selections</p>
                    </div>
                    <div className="h-1 w-20 bg-indigo-600 rounded-full sm:hidden"></div>
                </div>

                {/* Product Catalog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="text-center py-20 col-span-full bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <p className="text-gray-400 font-semibold">No products available at the moment.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default ProductList;