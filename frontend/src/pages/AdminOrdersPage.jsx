import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch, getAccessToken } from "../utils/auth";

function AdminOrdersPage() {
    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const navigate = useNavigate();

    const isLoggedIn = !!getAccessToken();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        fetchAllOrders();
    }, [isLoggedIn, navigate]);

    const fetchAllOrders = async () => {
        try {
            const response = await authFetch(`${BASE_URL}/api/orders/all/`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
                setError(null);
            } else if (response.status === 403) {
                setError("You don't have permission to view orders. Admin access required.");
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

    const updateOrderStatus = async (orderId, newStatus) => {
        setUpdatingOrderId(orderId);
        try {
            const response = await authFetch(`${BASE_URL}/api/orders/${orderId}/status/`, {
                method: "POST",
                body: JSON.stringify({ status: newStatus }),
            });
            if (response.ok) {
                setOrders(
                    orders.map((order) =>
                        order.id === orderId ? { ...order, order_status: newStatus } : order
                    )
                );
            } else {
                alert("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order:", error);
            alert("Error updating order");
        } finally {
            setUpdatingOrderId(null);
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

    if (error) {
        return (
            <div className="pt-24 min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Order Management
                </h1>
                <p className="text-gray-600 mb-8">Manage all customer orders</p>

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
                        <p className="text-gray-500">No orders have been placed yet.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Order Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <div className="font-medium">{order.customer_name || "-"}</div>
                                            <div className="text-xs text-gray-500">@{order.username || "-"}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.customer_email || "-"}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                                            ${parseFloat(order.total_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.order_status}
                                                onChange={(e) =>
                                                    updateOrderStatus(order.id, e.target.value)
                                                }
                                                disabled={updatingOrderId === order.id}
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer ${getStatusBadgeColor(
                                                    order.order_status
                                                )} ${updatingOrderId === order.id ? "opacity-50" : ""}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold ${getPaymentBadgeColor(
                                                    order.payment_status
                                                )}`}
                                            >
                                                {order.payment_status === "completed"
                                                    ? "Paid"
                                                    : "Pending"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(order.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminOrdersPage;
