import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import { productList } from '@/data/products';
import { customerList } from '@/data/customers';
import { saleList } from '@/data/sales';
import { useAppStore } from '@/store';

const LedgerPage: React.FC = () => {
  const orders = useAppStore((s) => s.orders);

  const totalSales = saleList.reduce((s, i) => s + i.amount, 0);
  const paidAmount = saleList.filter(s => s.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const stockCount = productList.filter(p => p.status === 'stock').length;
  const vipCount = customerList.filter(c => c.level === 'vip' || c.level === 'svip').length;
  const netProfit = Math.round(totalSales * 0.5);

  const modules = [
    {
      icon: '🏺',
      title: '成品档案',
      desc: '克重档案，在库管理',
      stats: `${stockCount}件在库`,
      path: '/pages/products/index'
    },
    {
      icon: '👤',
      title: '客户管理',
      desc: '专属定制，VIP等级',
      stats: `${vipCount}位VIP`,
      path: '/pages/customers/index'
    },
    {
      icon: '💰',
      title: '销售台账',
      desc: '批发零售，结算跟踪',
      stats: `¥${totalSales.toLocaleString()}`,
      path: '/pages/sales/index'
    },
    {
      icon: '📊',
      title: '收支结算',
      desc: '收入支出，净利润',
      stats: `净利¥${netProfit}`,
      path: '/pages/income/index'
    }
  ];

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>经营台账</Text>
        <Text className={styles.headerDesc}>成品档案，客户管理，收支结算</Text>
      </View>

      <View className={styles.statsRow}>
        <StatCard label="总销售" value={totalSales} unit="元" highlight />
        <StatCard label="已到账" value={paidAmount} unit="元" />
        <StatCard label="净利润" value={netProfit} unit="元" />
      </View>

      <View className={styles.moduleGrid}>
        {modules.map(mod => (
          <View
            className={styles.moduleCard}
            key={mod.path}
            onClick={() => Taro.navigateTo({ url: mod.path })}
          >
            <View className={styles.moduleIcon}>
              <Text className={styles.moduleIconText}>{mod.icon}</Text>
            </View>
            <View className={styles.moduleInfo}>
              <Text className={styles.moduleTitle}>{mod.title}</Text>
              <Text className={styles.moduleDesc}>{mod.desc}</Text>
            </View>
            <View className={styles.moduleStats}>
              <Text className={styles.moduleStatsText}>{mod.stats}</Text>
            </View>
            <Text className={styles.moduleArrow}>›</Text>
          </View>
        ))}
      </View>

      <View className={styles.recentSection}>
        <Text className={styles.recentTitle}>最近订单</Text>
        {orders.slice(0, 3).map(order => (
          <View
            className={styles.recentOrder}
            key={order.id}
            onClick={() => Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` })}
          >
            <View className={styles.recentOrderInfo}>
              <Text className={styles.recentOrderName}>{order.productName}</Text>
              <Text className={styles.recentOrderCustomer}>{order.customerName}</Text>
            </View>
            <Text className={styles.recentOrderAmount}>¥{order.amount}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default LedgerPage;
