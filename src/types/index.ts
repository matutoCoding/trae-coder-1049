export type StyleCategory = 'tea' | 'incense' | 'flower' | 'wine' | 'decor' | 'utensil';

export interface StyleItem {
  id: string;
  name: string;
  category: StyleCategory;
  image: string;
  description: string;
  price: number;
  unit: string;
}

export type OrderType = 'custom' | 'tradein' | 'repair';
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'delivered';

export interface OrderItem {
  id: string;
  customerName: string;
  type: OrderType;
  productName: string;
  status: OrderStatus;
  amount: number;
  createdAt: string;
  deadline: string;
  description: string;
}

export type MaterialType = 'red_copper' | 'brass' | 'bronze';

export interface MaterialItem {
  id: string;
  type: MaterialType;
  weight: number;
  unit: string;
  source: string;
  date: string;
  remaining: number;
}

export type ProcessStep = 'forging' | 'chiseling' | 'annealing' | 'polishing' | 'patina';
export type ProcessStatus = 'pending' | 'in_progress' | 'completed';

export interface ProcessItem {
  id: string;
  orderId: string;
  productName: string;
  step: ProcessStep;
  status: ProcessStatus;
  operator: string;
  startTime: string;
  endTime: string;
  notes: string;
}

export type ProductStatus = 'stock' | 'sold' | 'reserved';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  weight: number;
  dimensions: string;
  image: string;
  createdAt: string;
  status: ProductStatus;
  price: number;
}

export type CustomerLevel = 'normal' | 'vip' | 'svip';

export interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  address: string;
  level: CustomerLevel;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  notes: string;
}

export type SaleType = 'wholesale' | 'retail' | 'custom' | 'repair';
export type PaymentMethod = 'cash' | 'transfer' | 'wechat' | 'alipay';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface SaleItem {
  id: string;
  type: SaleType;
  productName: string;
  customerName: string;
  amount: number;
  quantity: number;
  date: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
}
