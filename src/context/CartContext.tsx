import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (name: string, size: string) => void;
  updateQuantity: (name: string, size: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  favorites: Set<string>;
  toggleFavorite: (name: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const addItem = (item: CartItem) => {
    setItems(prev => [...prev, item]);
  };

  const removeItem = (name: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.name === name && i.size === size)));
  };

  const updateQuantity = (name: string, size: string, quantity: number) => {
    if (quantity <= 0) return removeItem(name, size);
    setItems(prev => prev.map(i =>
      i.name === name && i.size === size ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  const toggleFavorite = (name: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count, favorites, toggleFavorite }}>
      {children}
    </CartContext.Provider>
  );
};
