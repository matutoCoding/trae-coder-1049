import { create } from 'zustand';
import type { OrderItem, OrderStatus } from '@/types';
import { orderList as initialOrders } from '@/data/orders';

interface AppStore {
  orders: OrderItem[];
  addOrder: (order: OrderItem) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getOrderById: (id: string) => OrderItem | undefined;
}

export const useAppStore = create<AppStore>((set, get) => ({
  orders: [...initialOrders],

  addOrder: (order) => {
    set((state) => ({
      orders: [order, ...state.orders]
    }));
    console.info('[Store] 订单已添加:', order.id);
  },

  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o))
    }));
    console.info('[Store] 订单状态已更新:', id, status);
  },

  getOrderById: (id) => {
    return get().orders.find((o) => o.id === id);
  }
}));
