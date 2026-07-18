import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch, getAccessToken } from "../utils/auth";

function OrderHistoryPage() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const isLoggedIn = !!getAccessToken();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        fetchOrders();
    }, [isLoggedIn, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await authFetch(`${BASE_URL}/api/orders/user/`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
                setError(null);
            } else {
                setError("Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Error loading orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "shipped":
                return "bg-purple-100 text-purple-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPaymentBadgeColor = (status) => {
        return status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    };

    if (!isLoggedIn) {
        return null;
    }

    if (loading) {
        return (
            <div className="pt-24 min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    My Orders
                </h1>
                <p className="text-gray-600 mb-8">View and manage your orders</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-10 h-10 text-indigo-600"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12h3.75M9 15h3.75M9 18h3.75m-3.75-6H5.25M9 5.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm9-1.5h-9a3 3 0 00-3 3v11.25a3 3 0 003 3h9a3 3 0 003-3V8.25a3 3 0 00-3-3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">You haven't placed any orders. Start shopping now!</p>
                        <button
                            onClick={() => navigate("/")}
                            className="inline-block px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h2 className="text-lg font-bold text-gray-900">
                                                Order #{order.id}
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString("en-US", {
                                                    weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                                                    order.order_status
                                                )}`}
                                            >
                                                {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                            </span>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadgeColor(
                                                    order.payment_status
                                                )}`}
                                            >
                                                {order.payment_status === "completed" ? "Paid" : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Ordered Items
                                    </h3>
                                    <div className="space-y-3">
                                        {order.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">{item.product_name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">${item.price}</p>
                                                    <p className="text-sm text-gray-500">
                                                        ${(item.price * item.quantity).toFixed(2)} total
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Footer */}
                                <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        {order.shipping_address && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                                                    Shipping Address
                                                </p>
                                                <p className="text-sm text-gray-600">{order.shipping_address}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Total Amount
                                        </p>
                                        <p className="text-2xl font-extrabold text-indigo-600">
                                            ${parseFloat(order.total_amount).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderHistoryPage;
