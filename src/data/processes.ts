import type { ProcessItem } from '@/types';

export const processStepLabels: Record<string, string> = {
  forging: '锻打',
  chiseling: '錾刻',
  annealing: '退火',
  polishing: '打磨',
  patina: '做旧'
};

export const processStatusLabels: Record<string, string> = {
  pending: '待开始',
  in_progress: '进行中',
  completed: '已完成'
};

export const processList: ProcessItem[] = [
  {
    id: 'p001',
    orderId: 'o001',
    productName: '紫铜提梁壶',
    step: 'forging',
    status: 'completed',
    operator: '王师傅',
    startTime: '2026-06-11',
    endTime: '2026-06-13',
    notes: '壶身锻打成型，壁厚均匀'
  },
  {
    id: 'p002',
    orderId: 'o001',
    productName: '紫铜提梁壶',
    step: 'annealing',
    status: 'completed',
    operator: '王师傅',
    startTime: '2026-06-14',
    endTime: '2026-06-14',
    notes: '两次退火消除内应力'
  },
  {
    id: 'p003',
    orderId: 'o001',
    productName: '紫铜提梁壶',
    step: 'chiseling',
    status: 'in_progress',
    operator: '李师傅',
    startTime: '2026-06-15',
    endTime: '',
    notes: '松竹梅纹錾刻进行中，竹纹已完成'
  },
  {
    id: 'p004',
    orderId: 'o002',
    productName: '黄铜茶盘',
    step: 'forging',
    status: 'pending',
    operator: '王师傅',
    startTime: '',
    endTime: '',
    notes: '待裁板后开始锻打锤纹'
  },
  {
    id: 'p005',
    orderId: 'o003',
    productName: '旧铜壶换新',
    step: 'polishing',
    status: 'in_progress',
    operator: '张师傅',
    startTime: '2026-06-12',
    endTime: '',
    notes: '新壶打磨抛光中'
  },
  {
    id: 'p006',
    orderId: 'o004',
    productName: '紫铜香炉修补',
    step: 'annealing',
    status: 'completed',
    operator: '王师傅',
    startTime: '2026-06-02',
    endTime: '2026-06-02',
    notes: '修补后退火消除焊接应力'
  },
  {
    id: 'p007',
    orderId: 'o004',
    productName: '紫铜香炉修补',
    step: 'patina',
    status: 'completed',
    operator: '张师傅',
    startTime: '2026-06-03',
    endTime: '2026-06-05',
    notes: '做旧处理完成，色泽自然'
  },
  {
    id: 'p008',
    orderId: 'o008',
    productName: '定制花器三件套',
    step: 'forging',
    status: 'in_progress',
    operator: '王师傅',
    startTime: '2026-06-08',
    endTime: '',
    notes: '大号花器锻打成型中'
  },
  {
    id: 'p009',
    orderId: 'o008',
    productName: '定制花器三件套',
    step: 'chiseling',
    status: 'pending',
    operator: '李师傅',
    startTime: '',
    endTime: '',
    notes: '待锻打完成后统一錾刻锤纹'
  },
  {
    id: 'p010',
    orderId: 'o010',
    productName: '黄铜酒具套装',
    step: 'patina',
    status: 'completed',
    operator: '张师傅',
    startTime: '2026-05-20',
    endTime: '2026-05-22',
    notes: '温酒壶做旧完成，色泽温润'
  }
];
