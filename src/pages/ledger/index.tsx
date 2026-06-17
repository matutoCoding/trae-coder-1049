import React, { useState, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import { productList, productStatusLabels } from '@/data/products';
import { customerList, customerLevelLabels } from '@/data/customers';
import { saleList, saleTypeLabels, paymentMethodLabels, paymentStatusLabels } from '@/data/sales';

const ledgerTabs = [
  { key: 'product', label: '成品档案' },
  { key: 'customer', label: '客户管理' },
  { key: 'sales', label: '销售台账' },
  { key: 'income', label: '收支结算' }
];

const productStatusStyle: Record<string, string> = {
  stock: styles.statusStock,
  sold: styles.statusSold,
  reserved: styles.statusReserved
};

const customerLevelStyle: Record<string, string> = {
  normal: styles.levelNormal,
  vip: styles.levelVip,
  svip: styles.levelSvip
};

const paymentStatusStyle: Record<string, string> = {
  paid: styles.paymentPaid,
  partial: styles.paymentPartial,
  unpaid: styles.paymentUnpaid
};

const LedgerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'product' | 'customer' | 'sales' | 'income'>('product');

  const stockCount = productList.filter(p => p.status === 'stock').length;
  const totalWeight = productList.reduce((s, p) => s + p.weight, 0);
  const totalCustomers = customerList.length;
  const vipCount = customerList.filter(c => c.level === 'vip' || c.level === 'svip').length;
  const totalSales = saleList.reduce((s, i) => s + i.amount, 0);
  const paidAmount = saleList.filter(s => s.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const unpaidAmount = saleList.filter(s => s.status !== 'paid').reduce((s, i) => s + i.amount, 0);

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>经营台账</Text>
        <Text className={styles.headerDesc}>成品档案，客户管理，收支结算</Text>
      </View>

      <View className={styles.mainTabs}>
        {ledgerTabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.mainTab, activeTab === tab.key && styles.mainTabActive)}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            <Text
              className={classnames(
                styles.mainTabText,
                activeTab === tab.key && styles.mainTabTextActive
              )}
            >
              {tab.label}
            </Text>
          </View>
        ))}
      </View>

      {activeTab === 'product' && (
        <>
          <View className={styles.statsRow}>
            <StatCard label="在库" value={stockCount} unit="件" highlight />
            <StatCard label="总克重" value={totalWeight} unit="g" />
            <StatCard label="已售" value={productList.filter(p => p.status === 'sold').length} unit="件" />
          </View>
          <View className={styles.section}>
            <SectionHeader title="成品克重档案" actionText="登记" />
            {productList.map(item => (
              <View className={styles.productCard} key={item.id}>
                <Image className={styles.productImage} src={item.image} mode="aspectFill" />
                <View className={styles.productInfo}>
                  <Text className={styles.productName}>{item.name}</Text>
                  <View className={styles.productMeta}>
                    <Text className={styles.productMetaItem}>{item.weight}g</Text>
                    <Text className={styles.productMetaItem}>{item.dimensions}</Text>
                  </View>
                  <View className={styles.productBottom}>
                    <Text className={styles.productPrice}>¥{item.price}</Text>
                    <Text className={classnames(styles.productStatus, productStatusStyle[item.status])}>
                      {productStatusLabels[item.status]}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {activeTab === 'customer' && (
        <>
          <View className={styles.statsRow}>
            <StatCard label="总客户" value={totalCustomers} unit="位" highlight />
            <StatCard label="VIP" value={vipCount} unit="位" />
            <StatCard label="总消费" value={customerList.reduce((s, c) => s + c.totalSpent, 0)} unit="元" />
          </View>
          <View className={styles.section}>
            <SectionHeader title="客户专属管理" actionText="添加" />
            {customerList.map(item => (
              <View className={styles.customerCard} key={item.id}>
                <View className={styles.customerHeader}>
                  <View className={styles.customerNameRow}>
                    <Text className={styles.customerName}>{item.name}</Text>
                    <Text className={classnames(styles.customerLevel, customerLevelStyle[item.level])}>
                      {customerLevelLabels[item.level]}
                    </Text>
                  </View>
                  <Text className={styles.customerPhone}>{item.phone}</Text>
                </View>
                <View className={styles.customerStats}>
                  <View className={styles.customerStatItem}>
                    <Text className={styles.customerStatLabel}>订单数</Text>
                    <Text className={styles.customerStatValue}>{item.totalOrders}</Text>
                  </View>
                  <View className={styles.customerStatItem}>
                    <Text className={styles.customerStatLabel}>总消费</Text>
                    <Text className={styles.customerStatValue}>¥{item.totalSpent}</Text>
                  </View>
                  <View className={styles.customerStatItem}>
                    <Text className={styles.customerStatLabel}>最近下单</Text>
                    <Text className={styles.customerStatValue}>{item.lastOrderDate.slice(5)}</Text>
                  </View>
                </View>
                <Text className={styles.customerNotes}>{item.notes}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {activeTab === 'sales' && (
        <>
          <View className={styles.statsRow}>
            <StatCard label="总销售额" value={totalSales} unit="元" highlight />
            <StatCard label="已收款" value={paidAmount} unit="元" />
            <StatCard label="待收款" value={unpaidAmount} unit="元" />
          </View>
          <View className={styles.section}>
            <SectionHeader title="批发零售记录" actionText="记账" />
            {saleList.map(item => (
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
                    <Text className={classnames(styles.saleStatus, paymentStatusStyle[item.status])}>
                      {paymentStatusLabels[item.status]}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      )}

      {activeTab === 'income' && (
        <>
          <View className={styles.statsRow}>
            <StatCard label="本月收入" value={totalSales} unit="元" highlight />
            <StatCard label="已到账" value={paidAmount} unit="元" />
            <StatCard label="应收" value={unpaidAmount} unit="元" />
          </View>
          <View className={styles.section}>
            <SectionHeader title="收支结算" />
          </View>
          <View className={styles.incomeSummary}>
            <View className={styles.incomeRow}>
              <Text className={styles.incomeLabel}>定制收入</Text>
              <Text className={classnames(styles.incomeValue, styles.incomeValuePositive)}>
                +¥{saleList.filter(s => s.type === 'custom').reduce((s, i) => s + i.amount, 0)}
              </Text>
            </View>
            <View className={styles.incomeRow}>
              <Text className={styles.incomeLabel}>零售收入</Text>
              <Text className={classnames(styles.incomeValue, styles.incomeValuePositive)}>
                +¥{saleList.filter(s => s.type === 'retail').reduce((s, i) => s + i.amount, 0)}
              </Text>
            </View>
            <View className={styles.incomeRow}>
              <Text className={styles.incomeLabel}>批发收入</Text>
              <Text className={classnames(styles.incomeValue, styles.incomeValuePositive)}>
                +¥{saleList.filter(s => s.type === 'wholesale').reduce((s, i) => s + i.amount, 0)}
              </Text>
            </View>
            <View className={styles.incomeRow}>
              <Text className={styles.incomeLabel}>铜料采购</Text>
              <Text className={classnames(styles.incomeValue, styles.incomeValueNegative)}>
                -¥{(totalSales * 0.35).toFixed(0)}
              </Text>
            </View>
            <View className={styles.incomeRow}>
              <Text className={styles.incomeLabel}>工坊开支</Text>
              <Text className={classnames(styles.incomeValue, styles.incomeValueNegative)}>
                -¥{(totalSales * 0.15).toFixed(0)}
              </Text>
            </View>
            <View className={styles.incomeRow}>
              <Text className={styles.incomeLabel}>净利润</Text>
              <Text className={classnames(styles.incomeValue, styles.incomeValuePositive)}>
                ¥{(totalSales * 0.5).toFixed(0)}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default LedgerPage;
