import type { MaterialItem } from '@/types';

export const materialTypeLabels: Record<string, string> = {
  red_copper: '紫铜',
  brass: '黄铜',
  bronze: '青铜'
};

export const materialList: MaterialItem[] = [
  {
    id: 'm001',
    type: 'red_copper',
    weight: 50,
    unit: 'kg',
    source: '云南铜厂直供',
    date: '2026-06-01',
    remaining: 32.5
  },
  {
    id: 'm002',
    type: 'brass',
    weight: 30,
    unit: 'kg',
    source: '本地铜材市场',
    date: '2026-06-03',
    remaining: 18.2
  },
  {
    id: 'm003',
    type: 'red_copper',
    weight: 20,
    unit: 'kg',
    source: '旧铜回收熔炼',
    date: '2026-05-20',
    remaining: 8.7
  },
  {
    id: 'm004',
    type: 'bronze',
    weight: 15,
    unit: 'kg',
    source: '合金铜材定制',
    date: '2026-05-25',
    remaining: 11.3
  },
  {
    id: 'm005',
    type: 'brass',
    weight: 25,
    unit: 'kg',
    source: '云南铜厂直供',
    date: '2026-06-08',
    remaining: 22.1
  },
  {
    id: 'm006',
    type: 'red_copper',
    weight: 10,
    unit: 'kg',
    source: '本地铜材市场',
    date: '2026-06-12',
    remaining: 6.4
  }
];
