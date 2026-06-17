import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { OrderItem } from '@/types';
import { orderTypeLabels, orderStatusLabels } from '@/data/orders';

interface OrderCardProps {
  item: OrderItem;
  onClick?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ item, onClick }) => {
  const statusStyle = {
    pending: styles.statusPending,
    in_progress: styles.statusProgress,
    completed: styles.statusCompleted,
    delivered: styles.statusDelivered
  };

  return (
    <View className={styles.orderCard} onClick={onClick}>
      <View className={styles.orderHeader}>
        <View className={styles.orderType}>
          <Text className={styles.typeTag}>{orderTypeLabels[item.type]}</Text>
          <Text className={styles.orderName}>{item.productName}</Text>
        </View>
        <Text className={classnames(styles.statusTag, statusStyle[item.status])}>
          {orderStatusLabels[item.status]}
        </Text>
      </View>
      <View className={styles.orderBody}>
        <Text className={styles.orderCustomer}>{item.customerName}</Text>
        <Text className={styles.orderDesc}>{item.description}</Text>
      </View>
      <View className={styles.orderFooter}>
        <Text className={styles.orderDate}>截止: {item.deadline}</Text>
        <Text className={styles.orderAmount}>¥{item.amount}</Text>
      </View>
    </View>
  );
};

export default OrderCard;
