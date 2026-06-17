import { create } from 'zustand';
import Taro from '@tarojs/taro';
import dayjs from 'dayjs';
import type {
  OrderItem, OrderStatus, CustomerItem, ProcessItem, ProcessStep, ProcessStatus,
  SaleItem, MaterialItem, ProductItem, ProductStatus
} from '@/types';
import { orderList as initialOrders } from '@/data/orders';
import { customerList as initialCustomers } from '@/data/customers';
import { processList as initialProcesses } from '@/data/processes';
import { saleList as initialSales } from '@/data/sales';
import { materialList as initialMaterials } from '@/data/materials';
import { productList as initialProducts } from '@/data/products';
import { processStepOrder, processStepLabels } from '@/data/processes';
import { materialTypeLabels } from '@/data/materials';
import { styleList } from '@/data/styles';

const STORAGE_KEY = 'copper_workshop_store_v2';

export const operatorForStep: Record<ProcessStep, string> = {
  forging: '王大锤',
  chiseling: '李錾花',
  annealing: '赵火工',
  polishing: '孙打磨',
  patina: '周做旧'
};

export const materialForStep: Record<ProcessStep, boolean> = {
  forging: true,
  chiseling: false,
  annealing: false,
  polishing: false,
  patina: false
};

interface ProcessAdvanceResult {
  success: boolean;
  reason?: string;
}

interface AppStore {
  orders: OrderItem[];
  customers: CustomerItem[];
  processes: ProcessItem[];
  sales: SaleItem[];
  materials: MaterialItem[];
  products: ProductItem[];
  hydrated: boolean;

  hydrate: () => void;
  persist: () => void;
  resetData: () => void;

  addOrder: (order: OrderItem) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => ProcessAdvanceResult;
  getOrderById: (id: string) => OrderItem | undefined;

  getCustomerById: (id: string) => CustomerItem | undefined;
  getCustomerByName: (name: string) => CustomerItem | undefined;
  addCustomer: (customer: Partial<CustomerItem> & { name: string }) => CustomerItem;

  getProcessesByOrderId: (orderId: string) => ProcessItem[];
  getProcessStep: (orderId: string, step: ProcessStep) => ProcessItem | undefined;
  advanceProcess: (orderId: string, step: ProcessStep, materialUsed?: number, notes?: string) => ProcessAdvanceResult;
  getOrderProgress: (orderId: string) => number;
  getOrderMaterialUsed: (orderId: string) => number;
  getPendingTasksByOperator: () => Record<string, Array<ProcessItem & { order: OrderItem }>>;
  initProcessesForOrder: (order: OrderItem) => void;

  getMaterialsByType: (type: string) => MaterialItem[];
  getTotalMaterialRemaining: (type: string) => number;
  consumeMaterial: (type: string, weight: number) => ProcessAdvanceResult;

  addProduct: (product: ProductItem) => void;
  updateProduct: (id: string, patch: Partial<ProductItem>) => void;
  getProductByOrderId: (orderId: string) => ProductItem | undefined;
  getProductsByStatus: (status?: ProductStatus) => ProductItem[];
  createProductDraftFromOrder: (orderId: string) => ProductItem | null;

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
  materials: [...initialMaterials],
  products: [...initialProducts],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const saved = loadFromStorage();
    if (saved && saved.orders && saved.customers && saved.processes && saved.sales && saved.materials && saved.products) {
      set({
        orders: saved.orders,
        customers: saved.customers,
        processes: saved.processes,
        sales: saved.sales,
        materials: saved.materials,
        products: saved.products,
        hydrated: true
      });
      console.info('[Store] 已从本地存储恢复数据');
    } else {
      set({ hydrated: true });
    }
  },

  persist: () => {
    const { orders, customers, processes, sales, materials, products } = get();
    saveToStorage({ orders, customers, processes, sales, materials, products });
  },

  resetData: () => {
    set({
      orders: [...initialOrders],
      customers: [...initialCustomers],
      processes: [...initialProcesses],
      sales: [...initialSales],
      materials: [...initialMaterials],
      products: [...initialProducts]
    });
    try {
      Taro.removeStorageSync(STORAGE_KEY);
    } catch (e) {}
  },

  addOrder: (order) => {
    const { customers } = get();

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

    const newProcesses: ProcessItem[] = processStepOrder.map((step) => ({
      id: genId('p'),
      orderId: order.id,
      productName: order.productName,
      step: step as ProcessStep,
      status: 'pending' as ProcessStatus,
      operator: operatorForStep[step as ProcessStep],
      startTime: '',
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
    const { orders, processes } = get();
    const order = orders.find((o) => o.id === id);
    if (!order) return { success: false, reason: '订单不存在' };

    if (status === 'delivered' || status === 'completed') {
      const orderProcesses = processStepOrder
        .map((step) => processes.find((p) => p.orderId === id && p.step === step))
        .filter(Boolean) as ProcessItem[];
      const totalCompleted = orderProcesses.filter((p) => p.status === 'completed').length;
      if (totalCompleted < processStepOrder.length) {
        const reason = `工序未全部完成（${totalCompleted}/${processStepOrder.length}），请先完成所有工坊工序`;
        console.warn('[Store] 状态推进被阻止:', id, status, reason);
        return { success: false, reason };
      }
    }

    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o))
    }));

    if (status === 'completed' || status === 'delivered') {
      const existingSale = get().sales.find((s) => s.id === `sale_${id}`);
      if (!existingSale) {
        get().createSaleFromOrder(id);
      }
      const existingProduct = get().products.find((p) => p.orderId === id);
      if (!existingProduct) {
        get().createProductDraftFromOrder(id);
      }
    }

    get().persist();
    console.info('[Store] 订单状态已更新:', id, status);
    return { success: true };
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
    const { processes, orders, products } = get();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false, reason: '订单不存在' };

    const stepIdx = processStepOrder.indexOf(step);
    if (stepIdx < 0) return { success: false, reason: '工序不存在' };

    const currentStep = processes.find((p) => p.orderId === orderId && p.step === step);
    if (!currentStep) return { success: false, reason: '该订单未初始化工序' };
    if (currentStep.status === 'completed') return { success: false, reason: '该工序已完成' };

    if (stepIdx > 0) {
      const prevStepKey = processStepOrder[stepIdx - 1];
      const prevStepProc = processes.find((p) => p.orderId === orderId && p.step === prevStepKey);
      if (prevStepProc && prevStepProc.status !== 'completed') {
        return { success: false, reason: `请先完成「${processStepLabels[prevStepKey]}」工序` };
      }
    }

    if (materialForStep[step] && materialUsed > 0) {
      const consumeResult = get().consumeMaterial(order.copperType, materialUsed);
      if (!consumeResult.success) {
        return consumeResult;
      }
    }

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
          startTime: today,
          operator: operatorForStep[p.step as ProcessStep]
        };
      }
      return p;
    });

    const allSteps = processStepOrder.map(
      (s) => updatedProcesses.find((p) => p.orderId === orderId && p.step === s)
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
      const existingProduct = products.find((p) => p.orderId === orderId);

      const stateUpdates: any = {
        processes: updatedProcesses,
        orders: updatedOrders
      };

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
        stateUpdates.sales = [newSale, ...get().sales];
      }

      if (!existingProduct) {
        const totalMaterialUsed = updatedProcesses
          .filter((p) => p.orderId === orderId)
          .reduce((s, p) => s + (p.materialUsed || 0), 0);
        const draft: ProductItem = {
          id: genId('pr'),
          name: order.productName,
          category: styleList.find((s) => s.id === order.styleId)?.category === 'tea' ? '茶器'
            : styleList.find((s) => s.id === order.styleId)?.category === 'incense' ? '香器'
            : styleList.find((s) => s.id === order.styleId)?.category === 'flower' ? '花器'
            : styleList.find((s) => s.id === order.styleId)?.category === 'wine' ? '酒器'
            : styleList.find((s) => s.id === order.styleId)?.category === 'decor' ? '摆件' : '实用器',
          weight: Math.round(totalMaterialUsed * 1000),
          dimensions: '',
          image: '',
          createdAt: order.createdAt,
          completedDate: today,
          status: 'draft' as ProductStatus,
          price: order.amount,
          orderId: order.id,
          customerName: order.customerName,
          actualCopperUsed: totalMaterialUsed,
          isDraft: true
        };
        stateUpdates.products = [draft, ...get().products];
      }

      set(stateUpdates);
    } else {
      set({ processes: updatedProcesses, orders: updatedOrders });
    }

    get().persist();
    console.info('[Store] 工序已推进:', orderId, step, '订单状态:', newStatus);
    return { success: true };
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

  getPendingTasksByOperator: () => {
    const { processes, orders } = get();
    const result: Record<string, Array<ProcessItem & { order: OrderItem }>> = {};

    const activeProcesses = processes.filter((p) => p.status === 'in_progress' || p.status === 'pending');
    activeProcesses.forEach((proc) => {
      const order = orders.find((o) => o.id === proc.orderId);
      if (!order || order.status === 'delivered') return;

      const idx = processStepOrder.indexOf(proc.step);
      if (idx > 0) {
        const prevKey = processStepOrder[idx - 1];
        const prevProc = processes.find((p) => p.orderId === proc.orderId && p.step === prevKey);
        if (prevProc && prevProc.status !== 'completed') return;
      }

      const operator = proc.operator || '未分配';
      if (!result[operator]) result[operator] = [];
      result[operator].push({ ...proc, order });
    });

    Object.keys(result).forEach((op) => {
      result[op].sort((a, b) => {
        const aOrder = a.order;
        const bOrder = b.order;
        if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
        if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
        return aOrder.deadline.localeCompare(bOrder.deadline);
      });
    });

    return result;
  },

  initProcessesForOrder: (order) => {
    const { processes } = get();
    const existing = processes.filter((p) => p.orderId === order.id);
    if (existing.length > 0) return;

    const newProcesses: ProcessItem[] = processStepOrder.map((step) => ({
      id: genId('p'),
      orderId: order.id,
      productName: order.productName,
      step: step as ProcessStep,
      status: 'pending' as ProcessStatus,
      operator: operatorForStep[step as ProcessStep],
      startTime: '',
      endTime: '',
      notes: '',
      materialUsed: 0
    }));

    set((state) => ({
      processes: [...newProcesses, ...state.processes]
    }));
    get().persist();
  },

  getMaterialsByType: (type) =>
    get().materials.filter((m) => m.type === type),

  getTotalMaterialRemaining: (type) => {
    const { materials } = get();
    return materials
      .filter((m) => m.type === type)
      .reduce((s, m) => s + m.remaining, 0);
  },

  consumeMaterial: (type, weight) => {
    if (weight <= 0) return { success: true };
    const { materials } = get();
    const totalRemaining = materials
      .filter((m) => m.type === type)
      .reduce((s, m) => s + m.remaining, 0);

    if (totalRemaining < weight) {
      const label = materialTypeLabels[type] || type;
      return {
        success: false,
        reason: `${label}库存不足：剩余${totalRemaining.toFixed(2)}kg，本次需${weight}kg，请先补货`
      };
    }

    let needDeduct = weight;
    const updatedMaterials = [...materials];
    updatedMaterials
      .filter((m) => m.type === type && m.remaining > 0)
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((m) => {
        if (needDeduct <= 0) return;
        const deduct = Math.min(m.remaining, needDeduct);
        const idx = updatedMaterials.findIndex((x) => x.id === m.id);
        if (idx >= 0) {
          updatedMaterials[idx] = {
            ...updatedMaterials[idx],
            remaining: Number((updatedMaterials[idx].remaining - deduct).toFixed(2))
          };
        }
        needDeduct = Number((needDeduct - deduct).toFixed(2));
      });

    set({ materials: updatedMaterials });
    console.info(`[Store] 扣减库存 ${materialTypeLabels[type] || type}: -${weight}kg`);
    return { success: true };
  },

  addProduct: (product) => {
    set((state) => ({
      products: [product, ...state.products]
    }));
    get().persist();
  },

  updateProduct: (id, patch) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? {
          ...p,
          ...patch,
          isDraft: patch.isDraft !== undefined ? patch.isDraft : false,
          status: patch.status || (p.status === 'draft' ? 'stock' : p.status)
        } : p
      )
    }));
    get().persist();
  },

  getProductByOrderId: (orderId) =>
    get().products.find((p) => p.orderId === orderId),

  getProductsByStatus: (status) => {
    const { products } = get();
    if (!status) return products;
    return products.filter((p) => p.status === status);
  },

  createProductDraftFromOrder: (orderId) => {
    const { orders, processes, products } = get();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    const existing = products.find((p) => p.orderId === orderId);
    if (existing) return existing;

    const totalMaterialUsed = processes
      .filter((p) => p.orderId === orderId)
      .reduce((s, p) => s + (p.materialUsed || 0), 0);

    const style = styleList.find((s) => s.id === order.styleId);
    const categoryMap: Record<string, string> = {
      tea: '茶器', incense: '香器', flower: '花器', wine: '酒器', decor: '摆件', utensil: '实用器'
    };

    const draft: ProductItem = {
      id: genId('pr'),
      name: order.productName,
      category: (style && categoryMap[style.category]) || '实用器',
      weight: Math.round(totalMaterialUsed * 1000),
      dimensions: '',
      image: '',
      createdAt: order.createdAt,
      completedDate: dayjs().format('YYYY-MM-DD'),
      status: 'draft',
      price: order.amount,
      orderId: order.id,
      customerName: order.customerName,
      actualCopperUsed: totalMaterialUsed,
      isDraft: true
    };

    set((state) => ({
      products: [draft, ...state.products]
    }));
    get().persist();
    console.info('[Store] 已生成成品档案草稿:', draft.id, '来自订单:', orderId);
    return draft;
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
