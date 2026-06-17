import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { saleList, saleTypeLabels, paymentMethodLabels, paymentStatusLabels } from '@/data/sales';

const typeFilters = [
  { key: 'all', label: '全部' },
  { key: 'wholesale', label: '批发' },
  { key: 'retail', label: '零售' },
  { key: 'custom', label: '定制' },
  { key: 'repair', label: '修补' }
];

const paymentStyleMap: Record<string, string> = {
  paid: styles.paymentPaid,
  partial: styles.paymentPartial,
  unpaid: styles.paymentUnpaid
};

const SalesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredSales = useMemo(() => {
    if (activeFilter === 'all') return saleList;
    return saleList.filter(s => s.type === activeFilter);
  }, [activeFilter]);

  const totalSales = filteredSales.reduce((s, i) => s + i.amount, 0);
  const paidAmount = filteredSales.filter(s => s.status === 'paid').reduce((s, i) => s + i.amount, 0);

  return (
    <View className={styles.container}>
      <View className={styles.statsBar}>
        <View className={styles.statChip}>
          <Text className={styles.statChipText}>销售额<Text className={styles.statChipValue}>¥{totalSales}</Text></Text>
        </View>
        <View className={styles.statChip}>
          <Text className={styles.statChipText}>已到账<Text className={styles.statChipValue}>¥{paidAmount}</Text></Text>
        </View>
      </View>

      <View className={styles.filterRow}>
        <View className={styles.filterTabs}>
          {typeFilters.map(f => (
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

      {filteredSales.length > 0 ? (
        <View className={styles.list}>
          {filteredSales.map(item => (
            <View className={styles.saleCard} key={item.id}>
              <View className={styles.saleHeader}>
                <Text className={styles.saleProduct}>{item.productName}</Text>
                <Text className={styles.saleType}>{saleTypeLabels[item.type]}</Text>
              </View>
              <View className={styles.saleMeta}>
                <Text className={styles.saleCustomer}>{item.customerName}</Text>
                <Text className={styles.saleDate}>{item.date}</Text>
              </View>
              <View className={styles.saleFooter}>
                <Text className={styles.saleAmount}>¥{item.amount}</Text>
                <View className={styles.salePayment}>
                  <Text className={styles.saleMethod}>{paymentMethodLabels[item.paymentMethod]}</Text>
                  <Text className={classnames(styles.saleStatus, paymentStyleMap[item.status])}>
                    {paymentStatusLabels[item.status]}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyWrap}>
          <Text className={styles.emptyIcon}>💰</Text>
          <Text className={styles.emptyText}>暂无该类型销售记录</Text>
        </View>
      )}
    </View>
  );
};

export default SalesPage;
