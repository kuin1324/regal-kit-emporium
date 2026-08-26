import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  price: number;
  /** Artikelcode zodat identieke namen uit elkaar te houden zijn. */
  sku?: string;
  customName?: string;
  customNumber?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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

const storageKey = (userId: string | null) => `hofs-cart-${userId ?? "guest"}`;

const readStore = (key: string): { items: CartItem[]; favorites: string[] } | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [items, setItems] = useState<CartItem[]>(() => readStore(storageKey(null))?.items ?? []);
  const [favorites, setFavorites] = useState<Set<string>>(
    () => new Set(readStore(storageKey(null))?.favorites ?? [])
  );

  // Bij inloggen: gastwinkelwagen samenvoegen met opgeslagen account-winkelwagen.
  useEffect(() => {
    if (!userId) return;
    const stored = readStore(storageKey(userId));
    if (!stored) return;
    setItems((prev) => {
      const ids = new Set(prev.map((i) => i.id));
      return [...prev, ...stored.items.filter((i) => !ids.has(i.id))];
    });
    setFavorites((prev) => new Set([...prev, ...stored.favorites]));
  }, [userId]);

  // Verwijder favorieten die niet meer bij een bestaand shirt horen (anders toont
  // de teller een hartje terwijl de favorietenpagina leeg is).
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [{ allProducts }, { productIdentity }] = await Promise.all([
        import("@/components/ProductDetailModal"),
        import("@/lib/productIdentity"),
      ]);
      if (cancelled) return;
      const valid = new Set<string>();
      for (const p of allProducts) {
        valid.add(productIdentity(p));
        valid.add(p.name);
      }
      setFavorites((prev) => {
        const next = new Set([...prev].filter((f) => valid.has(f)));
        return next.size === prev.size ? prev : next;
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, items.length]);

  // Opslaan per gebruiker (of als gast) zodat alles behouden blijft.
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey(userId),
        JSON.stringify({ items, favorites: Array.from(favorites) })
      );
    } catch {
      /* opslag niet beschikbaar */
    }
  }, [items, favorites, userId]);

  const addItem = (item: Omit<CartItem, "id">) => {
    setItems(prev => [...prev, { ...item, id: crypto.randomUUID() }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity } : i)));
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
