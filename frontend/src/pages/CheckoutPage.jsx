import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { authFetch } from "../utils/auth";

function CheckoutPage() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const { cartItems, clearCart, total } = useCart();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        paymentMethod: "cod",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: "",
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate name
        if (!form.name.trim() || form.name.trim().length < 2) {
            newErrors.name = "Please enter a valid name (at least 2 characters)";
        }

        // Validate address
        if (!form.address.trim() || form.address.trim().length < 10) {
            newErrors.address = "Please enter a complete address (at least 10 characters)";
        }

        // Validate phone
        if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        // Validate form
        if (!validateForm()) {
            setMessage({ type: "error", text: "Please fix the errors above" });
            return;
        }

        // Check if cart is empty
        if (cartItems.length === 0) {
            setMessage({ type: "error", text: "Your cart is empty. Please add items before checking out." });
            return;
        }

        setLoading(true);

        const payload = {
            name: form.name,
            address: form.address,
            phone: form.phone,
            payment_method: form.paymentMethod === "CreditCard" ? "CreditCard" : "Cash on Delivery",
        };

        try {
            const res = await authFetch(`${BASEURL}/api/orders/create/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Order placed successfully! Redirecting..." });
                clearCart();

                setTimeout(() => {
                    navigate("/orders");
                }, 2000);
            } else {
                setMessage({ 
                    type: "error", 
                    text: data.error || data.detail || "Failed to place order. Please try again." 
                });
            }
        } catch (error) {
            console.error("Checkout error:", error);
            setMessage({ type: "error", text: "An error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Checkout
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Complete your order details below
                    </p>
                </div>

                {cartItems.length === 0 && !message ? (
                    <div className="text-center p-6 bg-yellow-50 border border-yellow-100 rounded-2xl">
                        <p className="text-yellow-700 font-semibold mb-4">Your cart is empty.</p>
                        <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md">
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <>
                        {cartItems.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
                                <div className="text-2xl font-extrabold text-indigo-600">
                                    ${total.toFixed(2)}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-4 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm ${
                                        errors.name ? "border-red-500" : "border-gray-200"
                                    }`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Delivery Address *
                                </label>
                                <textarea
                                    name="address"
                                    placeholder="Enter your full address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows="3"
                                    className={`appearance-none block w-full px-4 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm resize-none ${
                                        errors.address ? "border-red-500" : "border-gray-200"
                                    }`}
                                />
                                {errors.address && (
                                    <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="1234567890"
                                    value={form.phone}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-4 py-3 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm ${
                                        errors.phone ? "border-red-500" : "border-gray-200"
                                    }`}
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Payment Method
                                </label>
                                <select
                                    name="paymentMethod"
                                    value={form.paymentMethod}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm cursor-pointer"
                                >
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="CreditCard">Credit/Debit Card</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || cartItems.length === 0}
                                className="w-full flex justify-center py-3.5 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {loading ? "Processing..." : `Place Order • $${total.toFixed(2)}`}
                            </button>

                            {message && (
                                <div className={`p-4 rounded-xl text-sm font-semibold text-center border mt-4 ${
                                    message.type === "success"
                                        ? "bg-green-50 text-green-700 border-green-100" 
                                        : "bg-red-50 text-red-700 border-red-100"
                                }`}>
                                    {message.text}
                                </div>
                            )}
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default CheckoutPage;