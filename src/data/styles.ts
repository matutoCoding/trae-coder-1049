import type { StyleItem } from '@/types';

export const styleCategories = [
  { key: 'tea', label: '茶器' },
  { key: 'incense', label: '香器' },
  { key: 'flower', label: '花器' },
  { key: 'wine', label: '酒器' },
  { key: 'decor', label: '摆件' },
  { key: 'utensil', label: '实用器' }
] as const;

export const styleList: StyleItem[] = [
  {
    id: 's001',
    name: '紫铜急须壶',
    category: 'tea',
    image: 'https://picsum.photos/id/598/300/300',
    description: '手工锻打紫铜急须壶，经典侧把造型，铜壁厚实保温持久',
    price: 2680,
    unit: '把'
  },
  {
    id: 's002',
    name: '黄铜莲花香插',
    category: 'incense',
    image: 'https://picsum.photos/id/582/300/300',
    description: '黄铜錾刻莲花香插，瓣叶分明，线香卧香皆宜',
    price: 580,
    unit: '件'
  },
  {
    id: 's003',
    name: '紫铜花觚',
    category: 'flower',
    image: 'https://picsum.photos/id/230/300/300',
    description: '仿古铜花觚，紫铜锻打成型，适用于茶席插花',
    price: 1580,
    unit: '件'
  },
  {
    id: 's004',
    name: '黄铜温酒壶',
    category: 'wine',
    image: 'https://picsum.photos/id/225/300/300',
    description: '黄铜锤纹温酒壶，配酒杯四只，冬日温酒佳品',
    price: 1280,
    unit: '套'
  },
  {
    id: 's005',
    name: '紫铜仙鹤摆件',
    category: 'decor',
    image: 'https://picsum.photos/id/1082/300/300',
    description: '紫铜锻打仙鹤摆件，寓意吉祥，书房案头雅器',
    price: 3680,
    unit: '件'
  },
  {
    id: 's006',
    name: '黄铜茶则',
    category: 'utensil',
    image: 'https://picsum.photos/id/787/300/300',
    description: '黄铜锤纹茶则，量茶利器，手工锻打纹理独特',
    price: 280,
    unit: '件'
  },
  {
    id: 's007',
    name: '紫铜博山炉',
    category: 'incense',
    image: 'https://picsum.photos/id/3/300/300',
    description: '仿汉博山炉，紫铜铸锻结合，山峦叠嶂，香烟缭绕',
    price: 4200,
    unit: '件'
  },
  {
    id: 's008',
    name: '紫铜建水',
    category: 'tea',
    image: 'https://picsum.photos/id/1036/300/300',
    description: '紫铜锤纹建水，茶席必备，器型饱满端庄',
    price: 980,
    unit: '件'
  },
  {
    id: 's009',
    name: '黄铜铜瓶',
    category: 'flower',
    image: 'https://picsum.photos/id/1015/300/300',
    description: '黄铜细颈铜瓶，简约素雅，适合单枝花材',
    price: 680,
    unit: '件'
  },
  {
    id: 's010',
    name: '紫铜茶托',
    category: 'tea',
    image: 'https://picsum.photos/id/1018/300/300',
    description: '紫铜锤纹茶托五枚装，边缘微翘，防烫手设计',
    price: 460,
    unit: '套'
  }
];
