import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import SectionHeader from '@/components/SectionHeader';
import { saleList } from '@/data/sales';

const IncomePage: React.FC = () => {
  const totalSales = saleList.reduce((s, i) => s + i.amount, 0);
  const paidAmount = saleList.filter(s => s.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const unpaidAmount = totalSales - paidAmount;

  const customIncome = saleList.filter(s => s.type === 'custom').reduce((s, i) => s + i.amount, 0);
  const retailIncome = saleList.filter(s => s.type === 'retail').reduce((s, i) => s + i.amount, 0);
  const wholesaleIncome = saleList.filter(s => s.type === 'wholesale').reduce((s, i) => s + i.amount, 0);
  const repairIncome = saleList.filter(s => s.type === 'repair').reduce((s, i) => s + i.amount, 0);

  const materialCost = Math.round(totalSales * 0.35);
  const workshopCost = Math.round(totalSales * 0.15);
  const netProfit = totalSales - materialCost - workshopCost;

  return (
    <View className={styles.container}>
      <View className={styles.overview}>
        <Text className={styles.overviewTitle}>本月总收入</Text>
        <Text className={styles.overviewAmount}>¥{totalSales.toLocaleString()}</Text>
        <View className={styles.overviewRow}>
          <View className={styles.overviewItem}>
            <Text className={styles.overviewLabel}>已到账</Text>
            <Text className={styles.overviewValue}>¥{paidAmount.toLocaleString()}</Text>
          </View>
          <View className={styles.overviewItem}>
            <Text className={styles.overviewLabel}>待收款</Text>
            <Text className={styles.overviewValue}>¥{unpaidAmount.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <SectionHeader title="收入明细" />
        <View className={styles.incomeCard}>
          <View className={styles.incomeRow}>
            <Text className={styles.incomeLabel}>定制收入</Text>
            <Text className={`${styles.incomeValue} ${styles.incomePositive}`}>+¥{customIncome.toLocaleString()}</Text>
          </View>
          <View className={styles.incomeRow}>
            <Text className={styles.incomeLabel}>零售收入</Text>
            <Text className={`${styles.incomeValue} ${styles.incomePositive}`}>+¥{retailIncome.toLocaleString()}</Text>
          </View>
          <View className={styles.incomeRow}>
            <Text className={styles.incomeLabel}>批发收入</Text>
            <Text className={`${styles.incomeValue} ${styles.incomePositive}`}>+¥{wholesaleIncome.toLocaleString()}</Text>
          </View>
          <View className={styles.incomeRow}>
            <Text className={styles.incomeLabel}>修补收入</Text>
            <Text className={`${styles.incomeValue} ${styles.incomePositive}`}>+¥{repairIncome.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <SectionHeader title="支出明细" />
        <View className={styles.incomeCard}>
          <View className={styles.incomeRow}>
            <Text className={styles.incomeLabel}>铜料采购</Text>
            <Text className={`${styles.incomeValue} ${styles.incomeNegative}`}>-¥{materialCost.toLocaleString()}</Text>
          </View>
          <View className={styles.incomeRow}>
            <Text className={styles.incomeLabel}>工坊开支</Text>
            <Text className={`${styles.incomeValue} ${styles.incomeNegative}`}>-¥{workshopCost.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <View className={styles.totalRow}>
          <Text className={styles.totalLabel}>净利润</Text>
          <Text className={styles.totalValue}>¥{netProfit.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

export default IncomePage;
