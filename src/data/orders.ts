import type { OrderItem } from '@/types';

export const orderTypeLabels: Record<string, string> = {
  custom: '定制',
  tradein: '以旧换新',
  repair: '修补翻新'
};

export const orderStatusLabels: Record<string, string> = {
  pending: '待处理',
  in_progress: '制作中',
  completed: '已完成',
  delivered: '已交付'
};

export const orderList: OrderItem[] = [
  {
    id: 'o001',
    customerName: '张先生',
    type: 'custom',
    productName: '紫铜提梁壶',
    styleId: 's001',
    status: 'in_progress',
    amount: 3800,
    createdAt: '2026-06-10',
    deadline: '2026-07-15',
    description: '按图纸定制提梁壶，壶身錾刻松竹梅纹',
    copperUsed: 1.2,
    copperType: 'red_copper'
  },
  {
    id: 'o002',
    customerName: '李女士',
    type: 'custom',
    productName: '黄铜茶盘',
    styleId: 's006',
    status: 'pending',
    amount: 2600,
    createdAt: '2026-06-12',
    deadline: '2026-07-20',
    description: '定制黄铜锤纹茶盘，尺寸60x40cm',
    copperUsed: 3.5,
    copperType: 'brass'
  },
  {
    id: 'o003',
    customerName: '王先生',
    type: 'tradein',
    productName: '旧铜壶换新',
    styleId: 's001',
    status: 'in_progress',
    amount: 1200,
    createdAt: '2026-06-08',
    deadline: '2026-06-30',
    description: '旧铜壶折价600，补差价换新壶',
    copperUsed: 0.8,
    copperType: 'red_copper'
  },
  {
    id: 'o004',
    customerName: '陈老师',
    type: 'repair',
    productName: '紫铜香炉修补',
    styleId: 's007',
    status: 'completed',
    amount: 450,
    createdAt: '2026-05-28',
    deadline: '2026-06-15',
    description: '香炉盖口开裂修补，重新做旧处理',
    copperUsed: 0.15,
    copperType: 'red_copper'
  },
  {
    id: 'o005',
    customerName: '赵先生',
    type: 'custom',
    productName: '紫铜茶仓',
    styleId: 's001',
    status: 'delivered',
    amount: 1680,
    createdAt: '2026-05-15',
    deadline: '2026-06-10',
    description: '定制紫铜茶叶罐，锡口密封，容量500g',
    copperUsed: 0.6,
    copperType: 'red_copper'
  },
  {
    id: 'o006',
    customerName: '刘女士',
    type: 'repair',
    productName: '黄铜壶把焊接',
    styleId: 's004',
    status: 'pending',
    amount: 320,
    createdAt: '2026-06-14',
    deadline: '2026-06-25',
    description: '壶把脱落重新焊接加固',
    copperUsed: 0.1,
    copperType: 'brass'
  },
  {
    id: 'o007',
    customerName: '孙先生',
    type: 'tradein',
    productName: '旧香器换新',
    styleId: 's002',
    status: 'pending',
    amount: 880,
    createdAt: '2026-06-15',
    deadline: '2026-07-05',
    description: '旧黄铜香插折价换紫铜博山炉',
    copperUsed: 0.9,
    copperType: 'red_copper'
  },
  {
    id: 'o008',
    customerName: '周女士',
    type: 'custom',
    productName: '定制花器三件套',
    styleId: 's003',
    status: 'in_progress',
    amount: 4200,
    createdAt: '2026-06-05',
    deadline: '2026-07-25',
    description: '紫铜花器大中小三件，器型渐变，锤纹统一',
    copperUsed: 2.1,
    copperType: 'red_copper'
  },
  {
    id: 'o009',
    customerName: '吴先生',
    type: 'repair',
    productName: '铜壶补漏',
    styleId: 's001',
    status: 'completed',
    amount: 280,
    createdAt: '2026-06-01',
    deadline: '2026-06-12',
    description: '紫铜壶底部砂眼补漏，退火整型',
    copperUsed: 0.05,
    copperType: 'red_copper'
  },
  {
    id: 'o010',
    customerName: '郑女士',
    type: 'custom',
    productName: '黄铜酒具套装',
    styleId: 's004',
    status: 'delivered',
    amount: 3200,
    createdAt: '2026-04-20',
    deadline: '2026-05-30',
    description: '温酒壶一只配酒杯六只，壶身錾刻牡丹',
    copperUsed: 2.8,
    copperType: 'brass'
  }
];
