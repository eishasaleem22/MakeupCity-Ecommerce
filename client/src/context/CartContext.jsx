import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cart, setCart] = useState([]);

  // ==========================================
  // LOAD CART WHEN USER CHANGES
  // ==========================================

  useEffect(() => {
    if (!user) {
      // No logged-in user = empty cart
      setCart([]);
      return;
    }

    try {
      // Create a unique cart key for each user
      const cartKey = `makeupCityCart_${user.email}`;

      const savedCart = localStorage.getItem(cartKey);

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart([]);
    }
  }, [user]);

  // ==========================================
  // SAVE CART WHENEVER IT CHANGES
  // ==========================================

  useEffect(() => {
    if (!user) {
      return;
    }

    try {
      const cartKey = `makeupCityCart_${user.email}`;

      localStorage.setItem(
        cartKey,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cart, user]);

  // ==========================================
  // ADD PRODUCT TO CART
  // ==========================================

  const addToCart = (product) => {
    // Don't allow adding if nobody is logged in
    if (!user) {
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return prevCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          qty: 1,
        },
      ];
    });
  };

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQty = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id) {
            const newQty = item.qty + amount;

            return newQty > 0
              ? {
                  ...item,
                  qty: newQty,
                }
              : null;
          }

          return item;
        })
        .filter(Boolean)
    );
  };

  // ==========================================
  // REMOVE PRODUCT
  // ==========================================

  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => item._id !== id
      )
    );
  };

  // ==========================================
  // CLEAR ENTIRE CART
  // ==========================================

  const clearCart = () => {
    setCart([]);

    // Also immediately remove the saved cart
    // from localStorage for the current user.
    if (user) {
      try {
        const cartKey = `makeupCityCart_${user.email}`;

        localStorage.removeItem(cartKey);
      } catch (error) {
        console.error(
          "Error clearing cart from localStorage:",
          error
        );
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);