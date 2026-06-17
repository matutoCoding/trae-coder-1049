import type { ProductItem } from '@/types';

export const productStatusLabels: Record<string, string> = {
  stock: '在库',
  sold: '已售',
  reserved: '预留'
};

export const productList: ProductItem[] = [
  {
    id: 'pr001',
    name: '紫铜急须壶',
    category: '茶器',
    weight: 385,
    dimensions: '口径8cm 高12cm',
    image: 'https://picsum.photos/id/598/300/300',
    createdAt: '2026-05-20',
    status: 'stock',
    price: 2680
  },
  {
    id: 'pr002',
    name: '黄铜莲花香插',
    category: '香器',
    weight: 120,
    dimensions: '直径8cm 高5cm',
    image: 'https://picsum.photos/id/582/300/300',
    createdAt: '2026-05-18',
    status: 'sold',
    price: 580
  },
  {
    id: 'pr003',
    name: '紫铜花觚',
    category: '花器',
    weight: 520,
    dimensions: '口径12cm 高28cm',
    image: 'https://picsum.photos/id/230/300/300',
    createdAt: '2026-05-10',
    status: 'stock',
    price: 1580
  },
  {
    id: 'pr004',
    name: '黄铜温酒壶套装',
    category: '酒器',
    weight: 680,
    dimensions: '壶高15cm 杯口径5cm',
    image: 'https://picsum.photos/id/225/300/300',
    createdAt: '2026-04-28',
    status: 'reserved',
    price: 1280
  },
  {
    id: 'pr005',
    name: '紫铜仙鹤摆件',
    category: '摆件',
    weight: 1250,
    dimensions: '高35cm 底座15cm',
    image: 'https://picsum.photos/id/1082/300/300',
    createdAt: '2026-04-15',
    status: 'stock',
    price: 3680
  },
  {
    id: 'pr006',
    name: '黄铜茶则',
    category: '实用器',
    weight: 45,
    dimensions: '长18cm 宽5cm',
    image: 'https://picsum.photos/id/787/300/300',
    createdAt: '2026-06-01',
    status: 'stock',
    price: 280
  },
  {
    id: 'pr007',
    name: '紫铜博山炉',
    category: '香器',
    weight: 890,
    dimensions: '高22cm 底径12cm',
    image: 'https://picsum.photos/id/3/300/300',
    createdAt: '2026-03-20',
    status: 'sold',
    price: 4200
  },
  {
    id: 'pr008',
    name: '紫铜建水',
    category: '茶器',
    weight: 420,
    dimensions: '口径10cm 高9cm',
    image: 'https://picsum.photos/id/1036/300/300',
    createdAt: '2026-05-25',
    status: 'stock',
    price: 980
  },
  {
    id: 'pr009',
    name: '黄铜铜瓶',
    category: '花器',
    weight: 310,
    dimensions: '口径3cm 高20cm',
    image: 'https://picsum.photos/id/1015/300/300',
    createdAt: '2026-06-05',
    status: 'reserved',
    price: 680
  },
  {
    id: 'pr010',
    name: '紫铜茶托五枚装',
    category: '茶器',
    weight: 280,
    dimensions: '直径8cm 高1.5cm',
    image: 'https://picsum.photos/id/1018/300/300',
    createdAt: '2026-06-10',
    status: 'stock',
    price: 460
  }
];
