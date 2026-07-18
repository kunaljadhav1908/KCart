import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
    
    // Ensure image source is fully absolute
    const imageSrc = product.image && product.image.startsWith('http') 
        ? product.image 
        : product.image ? `${BASE_URL}${product.image}` : null;

    const price = parseFloat(product.price) || 0;
    const discountedPrice = product.discount ? price * (1 - product.discount / 100) : price;

    return (
        <Link to={`/product/${product.id}`} className="group block h-full">
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer transform group-hover:-translate-y-1">
                {/* Image container with discount badge */}
                <div className="relative overflow-hidden bg-gray-50 flex items-center justify-center p-4 aspect-square">
                    {product.discount > 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                            -{product.discount}%
                        </div>
                    )}
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl text-xs text-gray-400 font-bold">
                            No Image
                        </div>
                    )}
                </div>
                
                {/* Details Container */}
                <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                    <div className="space-y-1">
                        {product.Category && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                {product.Category.name || product.category?.name}
                            </span>
                        )}
                        <h2 className="text-base font-bold text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200 pt-1">
                            {product.name}
                        </h2>
                    </div>

                    {/* Rating and Stock */}
                    <div className="flex items-center justify-between text-xs gap-2">
                        {product.rating > 0 && (
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-400">★</span>
                                <span className="font-semibold text-gray-700">{product.rating}</span>
                            </div>
                        )}
                        {product.stock <= 5 && product.stock > 0 && (
                            <span className="text-orange-600 font-semibold">Only {product.stock} left</span>
                        )}
                        {product.stock === 0 && (
                            <span className="text-red-600 font-semibold">Out of Stock</span>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <div className="flex flex-col">
                            {product.discount > 0 && (
                                <span className="text-xs text-gray-400 line-through">
                                    ${price.toFixed(2)}
                                </span>
                            )}
                            <span className="text-lg font-extrabold text-gray-900">
                                ${discountedPrice.toFixed(2)}
                            </span>
                        </div>
                        
                        <span className="p-2 bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white rounded-xl transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;