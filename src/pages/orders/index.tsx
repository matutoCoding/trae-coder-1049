import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import TabFilter from '@/components/TabFilter';
import StatCard from '@/components/StatCard';
import OrderCard from '@/components/OrderCard';
import { orderList, orderTypeLabels } from '@/data/orders';

const orderTabs = [
  { key: 'all', label: '全部' },
  { key: 'custom', label: '定制' },
  { key: 'tradein', label: '以旧换新' },
  { key: 'repair', label: '修补翻新' }
];

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orderList;
    return orderList.filter(item => item.type === activeTab);
  }, [activeTab]);

  const pendingCount = orderList.filter(i => i.status === 'pending').length;
  const progressCount = orderList.filter(i => i.status === 'in_progress').length;
  const totalAmount = orderList.reduce((s, i) => s + i.amount, 0);

  const handleAdd = () => {
    Taro.showToast({ title: '新增订单功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>订单管理</Text>
        <Text className={styles.headerDesc}>定制订单接收，以旧换新，修补翻新</Text>
      </View>

      <View className={styles.statsRow}>
        <StatCard label="待处理" value={pendingCount} unit="单" highlight />
        <StatCard label="制作中" value={progressCount} unit="单" />
        <StatCard label="总金额" value={totalAmount} unit="元" />
      </View>

      <View className={styles.tabSection}>
        <TabFilter tabs={orderTabs} activeKey={activeTab} onChange={setActiveTab} />
      </View>

      <View className={styles.orderList}>
        {filteredOrders.map(item => (
          <OrderCard key={item.id} item={item} />
        ))}
      </View>

      <View className={styles.addBtn} onClick={handleAdd}>
        <Text className={styles.addBtnText}>+</Text>
      </View>
    </View>
  );
};

export default OrdersPage;
