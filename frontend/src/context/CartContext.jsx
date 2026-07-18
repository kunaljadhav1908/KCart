import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import {authFetch, getAccessToken} from "../utils/auth";
import { authFetch, getAccessToken } from "../utils/auth";
const CartContext = createContext();

export const CartProvider = ({ children }) => {

    const BASE_URL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const applyCartData = (data) => {
        setCartItems(data.items || []);
        setTotal(Number(data.total) || 0);
    };

    // Fetch cart
    const fetchCart = useCallback(async () => {
        const token = getAccessToken();
        if (!token) {
            setCartItems([]);
            setTotal(0);
            setLoading(false);
            return;
        }

        try {
            const response = await authFetch(`${BASE_URL}/api/cart/`);
            if (response.ok) {
                const data = await response.json();
                applyCartData(data);
            } else {
                setCartItems([]);
                setTotal(0);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    }, [BASE_URL]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add item to cart
    const addToCart = async (product, quantity = 1) => {
        if (!getAccessToken()) {
            return false;
        }
        try {
            const response = await authFetch(`${BASE_URL}/api/cart/add/`, {
                method: "POST",
                body: JSON.stringify({
                    product_id: product.id,
                    quantity,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                if (data.cart) {
                    applyCartData(data.cart);
                } else {
                    await fetchCart();
                }
                return true;
            }
            console.error("Add to cart failed:", await response.text());
            return false;
        } catch (error) {
            console.error("Error adding to cart:", error);
            return false;
        }
    };

    // Remove item from cart
    const removeFromCart = async (itemId) => {
        try {
            const response = await authFetch(`${BASE_URL}/api/cart/remove/`, {
                method: "POST",
                body: JSON.stringify({ item_id: itemId }),
            });
            if (response.ok) {
                applyCartData(await response.json());
            } else {
                await fetchCart();
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    // Update cart item
    const updateCartItem = async (itemId, quantity) => {
        if (quantity <= 0) {
            await removeFromCart(itemId);
            return;
        }

        try {
            const response = await authFetch(`${BASE_URL}/api/cart/update/`, {
                method: "POST",
                body: JSON.stringify({ item_id: itemId, quantity }),
            });
            if (response.ok) {
                applyCartData(await response.json());
            } else {
                await fetchCart();
            }
        } catch (error) {
            console.error("Error updating cart item:", error);
        }
    }

    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                total,
                loading,
                addToCart,
                removeFromCart,
                updateCartItem,
                clearCart,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);