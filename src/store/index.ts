import { create } from 'zustand';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';
import type { OrderItem, OrderStatus, CustomerItem, ProcessItem, ProcessStep, ProcessStatus, SaleItem } from '@/types';
import { orderList as initialOrders } from '@/data/orders';
import { customerList as initialCustomers } from '@/data/customers';
import { processList as initialProcesses } from '@/data/processes';
import { saleList as initialSales } from '@/data/sales';
import { processStepOrder } from '@/data/processes';

const STORAGE_KEY = 'copper_workshop_store_v1';

interface AppStore {
  orders: OrderItem[];
  customers: CustomerItem[];
  processes: ProcessItem[];
  sales: SaleItem[];
  hydrated: boolean;

  hydrate: () => void;
  persist: () => void;

  addOrder: (order: OrderItem) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getOrderById: (id: string) => OrderItem | undefined;

  getCustomerById: (id: string) => CustomerItem | undefined;
  getCustomerByName: (name: string) => CustomerItem | undefined;
  addCustomer: (customer: Partial<CustomerItem> & { name: string }) => CustomerItem;

  getProcessesByOrderId: (orderId: string) => ProcessItem[];
  getProcessStep: (orderId: string, step: ProcessStep) => ProcessItem | undefined;
  advanceProcess: (orderId: string, step: ProcessStep, materialUsed?: number, notes?: string) => void;
  getOrderProgress: (orderId: string) => number;
  getOrderMaterialUsed: (orderId: string) => number;
  initProcessesForOrder: (order: OrderItem) => void;

  addSale: (sale: SaleItem) => void;
  getSalesByCustomerId: (customerId: string) => SaleItem[];
  createSaleFromOrder: (orderId: string) => void;

  getOrderStats: () => { total: number; pending: number; inProgress: number; completed: number; delivered: number };
  getCustomerStats: () => { total: number; vip: number; svip: number };
  getSalesStats: () => { totalIncome: number; customIncome: number; retailIncome: number; wholesaleIncome: number; repairIncome: number };
}

const genId = (prefix: string) =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const loadFromStorage = (): Partial<AppStore> | null => {
  try {
    const raw = Taro.getStorageSync(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[Store] 读取本地存储失败', e);
  }
  return null;
};

const saveToStorage = (state: Partial<AppStore>) => {
  try {
    Taro.setStorageSync(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[Store] 写入本地存储失败', e);
  }
};

export const useAppStore = create<AppStore>((set, get) => ({
  orders: [...initialOrders],
  customers: [...initialCustomers],
  processes: [...initialProcesses],
  sales: [...initialSales],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const saved = loadFromStorage();
    if (saved && saved.orders && saved.customers && saved.processes && saved.sales) {
      set({
        orders: saved.orders,
        customers: saved.customers,
        processes: saved.processes,
        sales: saved.sales,
        hydrated: true
      });
      console.info('[Store] 已从本地存储恢复数据');
    } else {
      set({ hydrated: true });
    }
  },

  persist: () => {
    const { orders, customers, processes, sales } = get();
    saveToStorage({ orders, customers, processes, sales });
  },

  addOrder: (order) => {
    const { customers, processes } = get();

    let customer = customers.find((c) => c.name === order.customerName);
    if (!customer) {
      const newCustomer: CustomerItem = {
        id: genId('c'),
        name: order.customerName,
        phone: '',
        address: '',
        level: 'normal',
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: '',
        notes: ''
      };
      customer = newCustomer;
      set((state) => ({
        customers: [newCustomer, ...state.customers]
      }));
    }

    const updatedCustomer = {
      ...customer,
      totalOrders: customer.totalOrders + 1,
      totalSpent: customer.totalSpent + order.amount,
      lastOrderDate: order.createdAt || dayjs().format('YYYY-MM-DD')
    };

    let newLevel = updatedCustomer.level;
    if (updatedCustomer.totalSpent >= 30000) newLevel = 'svip';
    else if (updatedCustomer.totalSpent >= 10000) newLevel = 'vip';
    updatedCustomer.level = newLevel;

    const newProcesses: ProcessItem[] = processStepOrder.map((step, idx) => ({
      id: genId('p'),
      orderId: order.id,
      productName: order.productName,
      step: step as ProcessStep,
      status: (idx === 0 ? 'in_progress' : 'pending') as ProcessStatus,
      operator: idx === 0 ? '王师傅' : '',
      startTime: idx === 0 ? dayjs().format('YYYY-MM-DD') : '',
      endTime: '',
      notes: '',
      materialUsed: 0
    }));

    set((state) => ({
      orders: [order, ...state.orders],
      customers: state.customers.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c)),
      processes: [...newProcesses, ...state.processes]
    }));

    get().persist();
    console.info('[Store] 订单已添加:', order.id, '客户已更新:', updatedCustomer.id);
  },

  updateOrderStatus: (id, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o))
    }));

    if (status === 'completed' || status === 'delivered') {
      const order = get().orders.find((o) => o.id === id);
      if (order) {
        const existingSale = get().sales.find((s) => s.id === `sale_${id}`);
        if (!existingSale) {
          get().createSaleFromOrder(id);
        }
      }
    }

    get().persist();
    console.info('[Store] 订单状态已更新:', id, status);
  },

  getOrderById: (id) => get().orders.find((o) => o.id === id),

  getCustomerById: (id) => get().customers.find((c) => c.id === id),

  getCustomerByName: (name) => get().customers.find((c) => c.name === name),

  addCustomer: (customer) => {
    const newCustomer: CustomerItem = {
      id: genId('c'),
      name: customer.name,
      phone: customer.phone || '',
      address: customer.address || '',
      level: customer.level || 'normal',
      totalOrders: customer.totalOrders || 0,
      totalSpent: customer.totalSpent || 0,
      lastOrderDate: customer.lastOrderDate || '',
      notes: customer.notes || ''
    };
    set((state) => ({
      customers: [newCustomer, ...state.customers]
    }));
    get().persist();
    return newCustomer;
  },

  getProcessesByOrderId: (orderId) => {
    const { processes } = get();
    return processStepOrder
      .map((step) => processes.find((p) => p.orderId === orderId && p.step === step))
      .filter(Boolean) as ProcessItem[];
  },

  getProcessStep: (orderId, step) =>
    get().processes.find((p) => p.orderId === orderId && p.step === step),

  advanceProcess: (orderId, step, materialUsed = 0, notes = '') => {
    const { processes, orders } = get();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const stepIdx = processStepOrder.indexOf(step);
    if (stepIdx < 0) return;

    const currentStep = processes.find((p) => p.orderId === orderId && p.step === step);
    if (!currentStep) return;

    const today = dayjs().format('YYYY-MM-DD');
    const updatedProcesses = processes.map((p) => {
      if (p.orderId !== orderId) return p;
      if (p.step === step) {
        return {
          ...p,
          status: 'completed' as ProcessStatus,
          endTime: today,
          materialUsed: (p.materialUsed || 0) + materialUsed,
          notes: p.notes ? `${p.notes}；${notes}` : notes
        };
      }
      const pIdx = processStepOrder.indexOf(p.step);
      if (pIdx === stepIdx + 1 && p.status === 'pending') {
        return {
          ...p,
          status: 'in_progress' as ProcessStatus,
          startTime: today
        };
      }
      return p;
    });

    const allSteps = processStepOrder.map(
      (s) => updatedProcesses.find((p) => p.orderId === orderId && p.step === s))
    );
    const completedCount = allSteps.filter(
      (p) => p && p.status === 'completed'
    ).length;

    let newStatus: OrderStatus = order.status;
    if (completedCount === processStepOrder.length) {
      newStatus = 'completed';
    } else if (completedCount > 0 && order.status === 'pending') {
      newStatus = 'in_progress';
    }

    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: newStatus } : o
    );

    if (newStatus === 'completed') {
      const existingSale = get().sales.find((s) => s.id === `sale_${orderId}`);
      if (!existingSale) {
        const customer = get().customers.find((c) => c.name === order.customerName);
        const newSale: SaleItem = {
          id: `sale_${orderId}`,
          type: order.type === 'repair' ? 'repair' : 'custom',
          productName: order.productName,
          customerId: customer?.id || '',
          customerName: order.customerName,
          amount: order.amount,
          quantity: 1,
          date: today,
          paymentMethod: 'transfer',
          status: 'unpaid'
        };
        set((state) => ({
          processes: updatedProcesses,
          orders: updatedOrders,
          sales: [newSale, ...state.sales]
        }));
      } else {
        set({ processes: updatedProcesses, orders: updatedOrders });
      }
    } else {
      set({ processes: updatedProcesses, orders: updatedOrders });
    }

    get().persist();
    console.info('[Store] 工序已推进:', orderId, step, '订单状态:', newStatus);
  },

  getOrderProgress: (orderId) => {
    const { processes } = get();
    const orderProcesses = processes.filter((p) => p.orderId === orderId);
    if (orderProcesses.length === 0) return 0;
    const completed = orderProcesses.filter((p) => p.status === 'completed').length;
    return Math.round((completed / processStepOrder.length) * 100);
  },

  getOrderMaterialUsed: (orderId) => {
    const { processes } = get();
    return processes
      .filter((p) => p.orderId === orderId)
      .reduce((sum, p) => sum + (p.materialUsed || 0), 0);
  },

  initProcessesForOrder: (order) => {
    const { processes } = get();
    const existing = processes.filter((p) => p.orderId === order.id);
    if (existing.length > 0) return;

    const newProcesses: ProcessItem[] = processStepOrder.map((step, idx) => ({
      id: genId('p'),
      orderId: order.id,
      productName: order.productName,
      step: step as ProcessStep,
      status: (order.status === 'pending' ? 'pending' : idx === 0 ? 'in_progress' : 'pending') as ProcessStatus,
      operator: idx === 0 && order.status !== 'pending' ? '王师傅' : '',
      startTime: idx === 0 && order.status !== 'pending' ? order.createdAt : '',
      endTime: '',
      notes: '',
      materialUsed: 0
    }));

    set((state) => ({
      processes: [...newProcesses, ...state.processes]
    }));
    get().persist();
  },

  addSale: (sale) => {
    set((state) => ({
      sales: [sale, ...state.sales]
    }));
    get().persist();
  },

  getSalesByCustomerId: (customerId) =>
    get().sales.filter((s) => s.customerId === customerId),

  createSaleFromOrder: (orderId) => {
    const { orders, customers, sales } = get();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const existing = sales.find((s) => s.id === `sale_${orderId}`);
    if (existing) return;

    const customer = customers.find((c) => c.name === order.customerName);
    const sale: SaleItem = {
      id: `sale_${orderId}`,
      type: order.type === 'repair' ? 'repair' : 'custom',
      productName: order.productName,
      customerId: customer?.id || '',
      customerName: order.customerName,
      amount: order.amount,
      quantity: 1,
      date: dayjs().format('YYYY-MM-DD'),
      paymentMethod: 'transfer',
      status: 'unpaid'
    };

    set((state) => ({
      sales: [sale, ...state.sales]
    }));
    get().persist();
    console.info('[Store] 已生成销售记录:', sale.id);
  },

  getOrderStats: () => {
    const { orders } = get();
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      inProgress: orders.filter((o) => o.status === 'in_progress').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      delivered: orders.filter((o) => o.status === 'delivered').length
    };
  },

  getCustomerStats: () => {
    const { customers } = get();
    return {
      total: customers.length,
      vip: customers.filter((c) => c.level === 'vip').length,
      svip: customers.filter((c) => c.level === 'svip').length
    };
  },

  getSalesStats: () => {
    const { sales } = get();
    let totalIncome = 0;
    let customIncome = 0;
    let retailIncome = 0;
    let wholesaleIncome = 0;
    let repairIncome = 0;

    sales.forEach((s) => {
      totalIncome += s.amount;
      switch (s.type) {
        case 'custom':
          customIncome += s.amount;
          break;
        case 'retail':
          retailIncome += s.amount;
          break;
        case 'wholesale':
          wholesaleIncome += s.amount;
          break;
        case 'repair':
          repairIncome += s.amount;
          break;
      }
    });

    return { totalIncome, customIncome, retailIncome, wholesaleIncome, repairIncome };
  }
}));
