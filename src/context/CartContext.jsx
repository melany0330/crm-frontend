import React, { createContext, useReducer, useEffect, useState, useContext } from "react";
import { DiscountContext } from "./DiscountContext";

export const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem("cart") || "[]");

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        return state.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [...state, action.payload];
    }

    case "REMOVE_ITEM":
      return state.filter(item => item.productId !== action.payload);

    case "UPDATE_QUANTITY":
      return state.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const { discounts } = useContext(DiscountContext);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const showCart = () => setIsCartVisible(true);
  const hideCart = () => setIsCartVisible(false);

  const addItem = (product, quantity = 1) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.idProduct,
        name: product.name,
        price: product.salePrice ?? product.price,
        quantity,
        imageUrl: product.image,
        stock: product.stock ?? null,
      },
    });
  };

  const removeItem = (productId) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  
  const getDiscountForItem = (productId, quantity) => {
    if (!Array.isArray(discounts)) return 0;

    const discount = discounts.find(d =>
      d.idProducto === productId &&
      d.estado === true &&
      quantity >= d.cantidadMin
    );

    if (!discount) return 0;

    return discount.porcentaje; 
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const discountPercent = getDiscountForItem(item.productId, item.quantity);
    const priceAfterDiscount = item.price * (1 - discountPercent / 100);
    return sum + priceAfterDiscount * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartVisible,
        showCart,
        hideCart,
        getDiscountForItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
