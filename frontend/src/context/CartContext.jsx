import { createContext, useContext, useMemo, useState } from 'react';
import { toPriceNumber } from '../utils/formatPrice';

const CartContext = createContext(null);

function readInitialCart() {
  try {
    const saved = localStorage.getItem('meghla_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readInitialCart);

  const persist = (nextCart) => {
    setCart(nextCart);
    localStorage.setItem('meghla_cart', JSON.stringify(nextCart));
  };

  const addToCart = (product, quantity = 1) => {
    const next = [...cart];
    const existing = next.find((item) => item.id === product.id);
    if (existing) existing.quantity += quantity;
    else next.push({ ...product, quantity, image: product.images?.[0] || product.image });
    persist(next);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) return removeFromCart(id);
    persist(cart.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeFromCart = (id) => persist(cart.filter((item) => item.id !== id));
  const clearCart = () => persist([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + toPriceNumber(item.price) * item.quantity, 0);

  const value = useMemo(
    () => ({ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal }),
    [cart, cartCount, cartTotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
