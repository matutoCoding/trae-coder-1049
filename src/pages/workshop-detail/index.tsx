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
  completed: styles.statusCompleted
};

const WorkshopDetailPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.orderId || '';
  const orders = useAppStore((s) => s.orders);

  const order = useMemo(() => {
    return orders.find(o => o.id === orderId);
  }, [orders, orderId]);

  const orderProcesses = useMemo(() => {
    return processStepOrder.map(step => {
      const found = processList.find(p => p.orderId === orderId && p.step === step);
      return {
        step,
        label: processStepLabels[step],
        status: found?.status || 'pending',
        operator: found?.operator || '',
        startTime: found?.startTime || '',
        endTime: found?.endTime || '',
        notes: found?.notes || '',
        materialUsed: found?.materialUsed || 0
      };
    });
  }, [orderId]);

  const completedSteps = orderProcesses.filter(p => p.status === 'completed').length;
  const progressPercent = Math.round((completedSteps / orderProcesses.length) * 100);

  const totalMaterialUsed = useMemo(() => {
    return processList
      .filter(p => p.orderId === orderId)
      .reduce((s, p) => s + p.materialUsed, 0);
  }, [orderId]);

  if (!order) {
    return (
      <View className={styles.container}>
        <View className={styles.emptyWrap}>
          <Text className={styles.emptyIcon}>🔨</Text>
          <Text className={styles.emptyText}>未找到工坊订单信息</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.orderCard}>
        <Text className={styles.orderName}>{order.productName}</Text>
        <View className={styles.orderInfo}>
          <View className={styles.orderInfoItem}>
            <Text className={styles.orderInfoLabel}>订单类型</Text>
            <Text className={styles.orderInfoValue}>{orderTypeLabels[order.type]}</Text>
          </View>
          <View className={styles.orderInfoItem}>
            <Text className={styles.orderInfoLabel}>订单状态</Text>
            <Text className={styles.orderInfoValue}>{orderStatusLabels[order.status]}</Text>
          </View>
          <View className={styles.orderInfoItem}>
            <Text className={styles.orderInfoLabel}>客户</Text>
            <Text className={styles.orderInfoValue}>{order.customerName}</Text>
          </View>
        </View>
      </View>

      <View className={styles.progressBar}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressLabel}>整体进度</Text>
          <Text className={styles.progressPercent}>{progressPercent}%</Text>
        </View>
        <View className={styles.progressTrack}>
          <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </View>
      </View>

      <View className={styles.section}>
        <SectionHeader title="铜料消耗" />
        <View className={styles.materialSummary}>
          <View className={styles.materialRow}>
            <Text className={styles.materialLabel}>铜料类型</Text>
            <Text className={styles.materialValue}>{materialTypeLabels[order.copperType] || order.copperType}</Text>
          </View>
          <View className={styles.materialRow}>
            <Text className={styles.materialLabel}>预计用量</Text>
            <Text className={styles.materialValue}>{order.copperUsed}kg</Text>
          </View>
          <View className={styles.materialRow}>
            <Text className={styles.materialLabel}>实际消耗</Text>
            <Text className={`${styles.materialValue} ${styles.materialHighlight}`}>{totalMaterialUsed.toFixed(2)}kg</Text>
          </View>
          <View className={styles.materialRow}>
            <Text className={styles.materialLabel}>剩余可用</Text>
            <Text className={styles.materialValue}>{(order.copperUsed - totalMaterialUsed).toFixed(2)}kg</Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <SectionHeader title="工序流程" />
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
                  <View className={styles.processNameRow}>
                    <Text className={styles.processName}>{item.label}</Text>
                    <Text className={classnames(styles.processStatusTag, statusStyleMap[item.status])}>
                      {processStatusLabels[item.status]}
                    </Text>
                  </View>
                  {item.notes ? <Text className={styles.processNotes}>{item.notes}</Text> : null}
                  <View className={styles.processMeta}>
                    {item.operator && <Text className={styles.processOperator}>{item.operator}</Text>}
                    {item.startTime && <Text className={styles.processTime}>{item.startTime}</Text>}
                    {item.materialUsed > 0 && <Text className={styles.processMaterial}>用铜{item.materialUsed}kg</Text>}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default WorkshopDetailPage;
