import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (product) => set((state) => {
        const existing = state.items.find(item => item.id === product.id);
        if (existing) {
          return {
            items: state.items.map(item => 
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),
      updateQuantity: (productId, delta) => set((state) => ({
        items: state.items.map(item => 
          item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
      })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'hoomty-cart-storage' }
  )
);
