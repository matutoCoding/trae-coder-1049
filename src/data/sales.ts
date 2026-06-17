import type { SaleItem } from '@/types';

export const saleTypeLabels: Record<string, string> = {
  wholesale: '批发',
  retail: '零售',
  custom: '定制',
  repair: '修补'
};

export const paymentMethodLabels: Record<string, string> = {
  cash: '现金',
  transfer: '转账',
  wechat: '微信',
  alipay: '支付宝'
};

export const paymentStatusLabels: Record<string, string> = {
  paid: '已结清',
  partial: '部分付款',
  unpaid: '未付款'
};

export const saleList: SaleItem[] = [
  {
    id: 'sl001',
    type: 'custom',
    productName: '紫铜提梁壶',
    customerName: '张先生',
    amount: 3800,
    quantity: 1,
    date: '2026-06-10',
    paymentMethod: 'transfer',
    status: 'partial'
  },
  {
    id: 'sl002',
    type: 'retail',
    productName: '黄铜莲花香插',
    customerName: '散客',
    amount: 580,
    quantity: 1,
    date: '2026-06-09',
    paymentMethod: 'wechat',
    status: 'paid'
  },
  {
    id: 'sl003',
    type: 'wholesale',
    productName: '黄铜茶则',
    customerName: '茶器阁',
    amount: 5600,
    quantity: 20,
    date: '2026-06-08',
    paymentMethod: 'transfer',
    status: 'paid'
  },
  {
    id: 'sl004',
    type: 'custom',
    productName: '定制花器三件套',
    customerName: '周女士',
    amount: 4200,
    quantity: 1,
    date: '2026-06-05',
    paymentMethod: 'transfer',
    status: 'partial'
  },
  {
    id: 'sl005',
    type: 'retail',
    productName: '紫铜建水',
    customerName: '散客',
    amount: 980,
    quantity: 1,
    date: '2026-06-04',
    paymentMethod: 'alipay',
    status: 'paid'
  },
  {
    id: 'sl006',
    type: 'repair',
    productName: '紫铜香炉修补',
    customerName: '陈老师',
    amount: 450,
    quantity: 1,
    date: '2026-05-28',
    paymentMethod: 'wechat',
    status: 'paid'
  },
  {
    id: 'sl007',
    type: 'wholesale',
    productName: '紫铜茶托',
    customerName: '雅器堂',
    amount: 9200,
    quantity: 20,
    date: '2026-05-25',
    paymentMethod: 'transfer',
    status: 'paid'
  },
  {
    id: 'sl008',
    type: 'custom',
    productName: '黄铜酒具套装',
    customerName: '郑女士',
    amount: 3200,
    quantity: 1,
    date: '2026-05-20',
    paymentMethod: 'transfer',
    status: 'paid'
  },
  {
    id: 'sl009',
    type: 'retail',
    productName: '紫铜仙鹤摆件',
    customerName: '散客',
    amount: 3680,
    quantity: 1,
    date: '2026-05-15',
    paymentMethod: 'wechat',
    status: 'paid'
  },
  {
    id: 'sl010',
    type: 'custom',
    productName: '紫铜茶仓',
    customerName: '赵先生',
    amount: 1680,
    quantity: 1,
    date: '2026-05-15',
    paymentMethod: 'alipay',
    status: 'paid'
  }
];
