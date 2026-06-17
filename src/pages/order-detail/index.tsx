import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import SectionHeader from '@/components/SectionHeader';
import { useAppStore } from '@/store';
import { orderTypeLabels, orderStatusLabels } from '@/data/orders';
import { processList, processStepLabels, processStepOrder, processStatusLabels } from '@/data/processes';
import { materialTypeLabels } from '@/data/materials';

const statusStyleMap: Record<string, string> = {
  pending: styles.statusPending,
  in_progress: styles.statusProgress,
  completed: styles.statusCompleted,
  delivered: styles.statusDelivered
};

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id || '';
  const orders = useAppStore((s) => s.orders);
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus);

  const order = useMemo(() => {
    return orders.find(o => o.id === orderId);
  }, [orders, orderId]);

  const orderProcesses = useMemo(() => {
    if (!order) return [];
    return processStepOrder.map(step => {
      const found = processList.find(p => p.orderId === orderId && p.step === step);
      return {
        step,
        label: processStepLabels[step],
        status: found?.status || 'pending',
        operator: found?.operator || '',
        startTime: found?.startTime || '',
        notes: found?.notes || '',
        materialUsed: found?.materialUsed || 0
      };
    });
  }, [order, orderId]);

  const totalMaterialUsed = useMemo(() => {
    return processList
      .filter(p => p.orderId === orderId)
      .reduce((s, p) => s + p.materialUsed, 0);
  }, [orderId]);

  const handleStatusChange = () => {
    if (!order) return;
    const statusFlow = ['pending', 'in_progress', 'completed', 'delivered'] as const;
    const currentIdx = statusFlow.indexOf(order.status);
    if (currentIdx < statusFlow.length - 1) {
      const nextStatus = statusFlow[currentIdx + 1];
      updateOrderStatus(orderId, nextStatus);
      Taro.showToast({ title: `状态已更新为：${orderStatusLabels[nextStatus]}`, icon: 'none' });
    } else {
      Taro.showToast({ title: '订单已完成全部流程', icon: 'none' });
    }
  };

  const handleGoWorkshop = () => {
    Taro.navigateTo({ url: `/pages/workshop-detail/index?orderId=${orderId}` });
  };

  if (!order) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyWrap}>
          <Text className={styles.emptyIcon}>📋</Text>
          <Text className={styles.emptyText}>未找到订单信息</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.mainCard}>
        <Text className={styles.orderTitle}>{order.productName}</Text>
        <View className={styles.orderMetaRow}>
          <Text className={styles.typeTag}>{orderTypeLabels[order.type]}</Text>
          <Text className={classnames(styles.statusTag, statusStyleMap[order.status])}>
            {orderStatusLabels[order.status]}
          </Text>
        </View>
        <View className={styles.infoList}>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>客户</Text>
            <Text className={styles.infoValue}>{order.customerName}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>下单日期</Text>
            <Text className={styles.infoValue}>{order.createdAt}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>截止日期</Text>
            <Text className={styles.infoValue}>{order.deadline}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>订单金额</Text>
            <Text className={styles.infoValuePrice}>¥{order.amount}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>铜料类型</Text>
            <Text className={styles.infoValue}>{materialTypeLabels[order.copperType] || order.copperType}</Text>
          </View>
          <View className={styles.infoRow}>
            <Text className={styles.infoLabel}>预计用铜</Text>
            <Text className={styles.infoValue}>{order.copperUsed}kg</Text>
          </View>
        </View>
        <Text className={styles.descText}>{order.description}</Text>
      </View>

      <View className={styles.section}>
        <SectionHeader title="工序进度" actionText="查看工坊" onAction={handleGoWorkshop} />
        <View className={styles.processTimeline}>
          {orderProcesses.map((item, idx) => {
            const dotClass = item.status === 'completed'
              ? styles.processDotDone
              : item.status === 'in_progress'
              ? styles.processDotActive
              : '';
            const connectorClass = item.status === 'completed' ? styles.processConnectorDone : '';
            const isLast = idx === orderProcesses.length - 1;
            return (
              <View className={styles.processItem} key={item.step}>
                <View className={styles.processLine}>
                  <View className={`${styles.processDot} ${dotClass}`} />
                  {!isLast && <View className={`${styles.processConnector} ${connectorClass}`} />}
                </View>
                <View className={styles.processContent}>
                  <Text className={styles.processName}>{item.label}</Text>
                  <Text className={styles.processStatus}>{processStatusLabels[item.status]}</Text>
                  {item.notes ? <Text className={styles.processNotes}>{item.notes}</Text> : null}
                  {(item.operator || item.startTime) && (
                    <View className={styles.processMeta}>
                      {item.operator && <Text className={styles.processOperator}>{item.operator}</Text>}
                      {item.startTime && <Text className={styles.processTime}>{item.startTime}</Text>}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View className={styles.section}>
        <SectionHeader title="材料消耗" />
        <View className={styles.materialCard}>
          <View className={styles.materialRow}>
            <Text className={styles.materialLabel}>铜料类型</Text>
            <Text className={styles.materialValue}>{materialTypeLabels[order.copperType] || order.copperType}</Text>
          </View>
          <View className={styles.materialRow}>
            <Text className={styles.materialLabel}>预计用铜</Text>
            <Text className={styles.materialValue}>{order.copperUsed}kg</Text>
          </View>
          <View className={styles.materialRow}>
            <Text className={styles.materialLabel}>实际消耗</Text>
            <Text className={styles.materialValue}>{totalMaterialUsed.toFixed(2)}kg</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={handleGoWorkshop}>
          <Text className={styles.btnSecondaryText}>工坊详情</Text>
        </View>
        <View className={styles.btnPrimary} onClick={handleStatusChange}>
          <Text className={styles.btnPrimaryText}>推进状态</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderDetailPage;
