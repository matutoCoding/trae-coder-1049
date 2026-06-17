import React, { useMemo, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import SectionHeader from '@/components/SectionHeader';
import { customerLevelLabels } from '@/data/customers';
import { useAppStore } from '@/store';
import { orderTypeLabels, orderStatusLabels } from '@/data/orders';
import { paymentStatusLabels } from '@/data/sales';

const levelStyleMap: Record<string, string> = {
  normal: styles.levelNormal,
  vip: styles.levelVip,
  svip: styles.levelSvip
};

const statusStyleMap: Record<string, string> = {
  pending: styles.statusPending,
  in_progress: styles.statusProgress,
  completed: styles.statusCompleted,
  delivered: styles.statusDelivered
};

const CustomerDetailPage: React.FC = () => {
  const router = useRouter();
  const customerId = router.params.id || '';
  const hydrate = useAppStore((s) => s.hydrate);
  const customers = useAppStore((s) => s.customers);
  const orders = useAppStore((s) => s.orders);
  const sales = useAppStore((s) => s.sales);
  const getSalesByCustomerId = useAppStore((s) => s.getSalesByCustomerId);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const customer = useMemo(() => {
    return customers.find(c => c.id === customerId);
  }, [customers, customerId]);

  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return orders.filter(o => o.customerName === customer.name).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }, [customer, orders]);

  const customerSales = useMemo(() => {
    if (!customer) return [];
    return getSalesByCustomerId(customer.id);
  }, [customer, getSalesByCustomerId]);

  if (!customer) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyWrap}>
          <Text className={styles.emptyIcon}>👤</Text>
          <Text className={styles.emptyText}>未找到客户信息</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.profileCard}>
        <View className={styles.profileHeader}>
          <View className={styles.nameRow}>
            <Text className={styles.nameText}>{customer.name}</Text>
            <Text className={classnames(styles.levelTag, levelStyleMap[customer.level])}>
              {customerLevelLabels[customer.level]}
            </Text>
          </View>
          <Text className={styles.phoneText}>{customer.phone}</Text>
        </View>
        <View className={styles.infoGrid}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>地址</Text>
            <Text className={styles.infoValue}>{customer.address}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>订单数</Text>
            <Text className={styles.infoValue}>{customer.totalOrders}单</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>总消费</Text>
            <Text className={styles.infoValue}>¥{customer.totalSpent}</Text>
          </View>
        </View>
        <Text className={styles.notesText}>{customer.notes}</Text>
      </View>

      <View className={styles.section}>
        <SectionHeader title="最近订单" />
        {customerOrders.length > 0 ? (
          customerOrders.map(order => (
            <View
              className={styles.orderCard}
              key={order.id}
              onClick={() => Taro.navigateTo({ url: `/pages/order-detail/index?id=${order.id}` })}
            >
              <View className={styles.orderHeader}>
                <Text className={styles.orderProduct}>{order.productName}</Text>
                <Text className={styles.orderType}>{orderTypeLabels[order.type]}</Text>
              </View>
              <View className={styles.orderMeta}>
                <Text className={styles.orderDate}>{order.createdAt}</Text>
                <Text className={styles.orderAmount}>¥{order.amount}</Text>
                <Text className={classnames(styles.orderStatus, statusStyleMap[order.status])}>
                  {orderStatusLabels[order.status]}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无订单记录</Text>
          </View>
        )}
      </View>

      <View className={styles.section}>
        <SectionHeader title="结算情况" />
        {customerSales.length > 0 ? (
          customerSales.map(sale => (
            <View className={styles.saleCard} key={sale.id}>
              <Text className={styles.saleProduct}>{sale.productName}</Text>
              <View className={styles.saleRow}>
                <Text className={styles.saleAmount}>¥{sale.amount}</Text>
                <Text className={classnames(styles.saleStatus, sale.status === 'paid' ? styles.paymentPaid : styles.paymentPartial)}>
                  {paymentStatusLabels[sale.status]}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyIcon}>💰</Text>
            <Text className={styles.emptyText}>暂无结算记录</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CustomerDetailPage;
