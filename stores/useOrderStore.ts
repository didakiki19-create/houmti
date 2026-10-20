import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '../types';

interface OrderState {
  orders: Order[];
  addOrders: (newOrders: Order[]) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrders: (newOrders) => set((state) => ({
        orders: [...newOrders, ...state.orders]
      })),
    }),
    { name: 'hoomty-orders-storage' }
  )
);
