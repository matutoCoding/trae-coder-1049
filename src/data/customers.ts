import type { CustomerItem } from '@/types';

export const customerLevelLabels: Record<string, string> = {
  normal: '普通',
  vip: '贵宾',
  svip: '至尊'
};

export const customerList: CustomerItem[] = [
  {
    id: 'c001',
    name: '张先生',
    phone: '138****5678',
    address: '杭州市西湖区',
    level: 'svip',
    totalOrders: 12,
    totalSpent: 28600,
    lastOrderDate: '2026-06-10',
    notes: '茶器收藏家，偏好紫铜茶器'
  },
  {
    id: 'c002',
    name: '李女士',
    phone: '139****4321',
    address: '苏州市姑苏区',
    level: 'vip',
    totalOrders: 6,
    totalSpent: 15200,
    lastOrderDate: '2026-06-12',
    notes: '经常定制送礼用铜器'
  },
  {
    id: 'c003',
    name: '王先生',
    phone: '137****8765',
    address: '南京市鼓楼区',
    level: 'vip',
    totalOrders: 8,
    totalSpent: 19800,
    lastOrderDate: '2026-06-08',
    notes: '以旧换新老客户'
  },
  {
    id: 'c004',
    name: '陈老师',
    phone: '136****2345',
    address: '北京市朝阳区',
    level: 'svip',
    totalOrders: 15,
    totalSpent: 42300,
    lastOrderDate: '2026-05-28',
    notes: '香道爱好者，多次修补翻新老铜器'
  },
  {
    id: 'c005',
    name: '赵先生',
    phone: '135****6789',
    address: '成都市锦江区',
    level: 'normal',
    totalOrders: 3,
    totalSpent: 5280,
    lastOrderDate: '2026-05-15',
    notes: '首次定制紫铜茶仓'
  },
  {
    id: 'c006',
    name: '刘女士',
    phone: '133****1234',
    address: '上海市徐汇区',
    level: 'normal',
    totalOrders: 2,
    totalSpent: 3200,
    lastOrderDate: '2026-06-14',
    notes: '修补壶把，老客推荐'
  },
  {
    id: 'c007',
    name: '孙先生',
    phone: '131****5678',
    address: '广州市天河区',
    level: 'vip',
    totalOrders: 7,
    totalSpent: 18500,
    lastOrderDate: '2026-06-15',
    notes: '酒器收藏为主'
  },
  {
    id: 'c008',
    name: '周女士',
    phone: '130****9012',
    address: '杭州市上城区',
    level: 'svip',
    totalOrders: 10,
    totalSpent: 35600,
    lastOrderDate: '2026-06-05',
    notes: '花器定制大户，审美要求高'
  },
  {
    id: 'c009',
    name: '吴先生',
    phone: '158****3456',
    address: '无锡市滨湖区',
    level: 'normal',
    totalOrders: 4,
    totalSpent: 7800,
    lastOrderDate: '2026-06-01',
    notes: '铜壶补漏客户，后续可能定制'
  },
  {
    id: 'c010',
    name: '郑女士',
    phone: '159****7890',
    address: '苏州市吴中区',
    level: 'vip',
    totalOrders: 5,
    totalSpent: 12400,
    lastOrderDate: '2026-04-20',
    notes: '酒具套装定制，送礼需求多'
  }
];
