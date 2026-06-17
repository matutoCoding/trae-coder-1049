import React, { useState, useMemo, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { customerLevelLabels } from '@/data/customers';
import { useAppStore } from '@/store';

const levelFilters = [
  { key: 'all', label: '全部' },
  { key: 'svip', label: '至尊' },
  { key: 'vip', label: '贵宾' },
  { key: 'normal', label: '普通' }
];

const levelStyleMap: Record<string, string> = {
  normal: styles.levelNormal,
  vip: styles.levelVip,
  svip: styles.levelSvip
};

const CustomersPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const hydrate = useAppStore((s) => s.hydrate);
  const customers = useAppStore((s) => s.customers);
  const getCustomerStats = useAppStore((s) => s.getCustomerStats);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filteredCustomers = useMemo(() => {
    if (activeFilter === 'all') return customers;
    return customers.filter(c => c.level === activeFilter);
  }, [activeFilter, customers]);

  const stats = getCustomerStats();

  return (
    <View className={styles.container}>
      <View className={styles.filterRow}>
        <View className={styles.filterTabs}>
          {levelFilters.map(f => (
            <View
              key={f.key}
              className={classnames(styles.filterTab, activeFilter === f.key && styles.filterTabActive)}
              onClick={() => setActiveFilter(f.key)}
            >
              <Text className={classnames(styles.filterTabText, activeFilter === f.key && styles.filterTabTextActive)}>
                {f.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {filteredCustomers.length > 0 ? (
        <View className={styles.list}>
          {filteredCustomers.map(item => (
            <View
              className={styles.customerCard}
              key={item.id}
              onClick={() => Taro.navigateTo({ url: `/pages/customer-detail/index?id=${item.id}` })}
            >
              <View className={styles.customerHeader}>
                <View className={styles.customerNameRow}>
                  <Text className={styles.customerName}>{item.name}</Text>
                  <Text className={classnames(styles.customerLevel, levelStyleMap[item.level])}>
                    {customerLevelLabels[item.level]}
                  </Text>
                </View>
                <Text className={styles.customerPhone}>{item.phone}</Text>
              </View>
              <View className={styles.customerStats}>
                <View className={styles.customerStatItem}>
                  <Text className={styles.customerStatLabel}>订单</Text>
                  <Text className={styles.customerStatValue}>{item.totalOrders}单</Text>
                </View>
                <View className={styles.customerStatItem}>
                  <Text className={styles.customerStatLabel}>总消费</Text>
                  <Text className={styles.customerStatValue}>¥{item.totalSpent}</Text>
                </View>
                <View className={styles.customerStatItem}>
                  <Text className={styles.customerStatLabel}>最近</Text>
                  <Text className={styles.customerStatValue}>{item.lastOrderDate.slice(5)}</Text>
                </View>
              </View>
              <Text className={styles.customerNotes}>{item.notes}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyWrap}>
          <Text className={styles.emptyIcon}>👤</Text>
          <Text className={styles.emptyText}>暂无该等级客户</Text>
        </View>
      )}
    </View>
  );
};

export default CustomersPage;
