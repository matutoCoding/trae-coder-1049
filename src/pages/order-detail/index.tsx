import React, { useMemo, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import SectionHeader from '@/components/SectionHeader';
import { useAppStore } from '@/store';
import { orderTypeLabels, orderStatusLabels } from '@/data/orders';
import { processStepLabels, processStepOrder, processStatusLabels } from '@/data/processes';
import { materialTypeLabels } from '@/data/materials';
import type { OrderStatus } from '@/types';

const statusStyleMap: Record<string, string> = {
  pending: styles.statusPending,
  in_progress: styles.statusProgress,
  completed: styles.statusCompleted,
  delivered: styles.statusDelivered
};

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id || '';
  const hydrate = useAppStore((s) => s.hydrate);
  const orders = useAppStore((s) => s.orders);
  const processes = useAppStore((s) => s.processes);
  const updateOrderStatus = useAppStore((s) => s.updateOrderStatus);
  const getProcessesByOrderId = useAppStore((s) => s.getProcessesByOrderId);
  const getOrderMaterialUsed = useAppStore((s) => s.getOrderMaterialUsed);
  const getOrderProgress = useAppStore((s) => s.getOrderProgress);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const order = useMemo(() => {
    return orders.find(o => o.id === orderId);
  }, [orders, orderId]);

  const orderProcesses = useMemo(() => {
    if (!order) return [];
    const procs = getProcessesByOrderId(orderId);
    if (procs.length === 0) {
      return processStepOrder.map(step => ({
        step,
        label: processStepLabels[step],
        status: 'pending',
        operator: '',
        startTime: '',
        notes: '',
        materialUsed: 0
      }));
    }
    return procs.map(p => ({
      step: p.step,
      label: processStepLabels[p.step],
      status: p.status,
      operator: p.operator,
      startTime: p.startTime,
      notes: p.notes,
      materialUsed: p.materialUsed
    }));
  }, [order, orderId, processes, getProcessesByOrderId]);

  const totalMaterialUsed = useMemo(() => {
    return getOrderMaterialUsed(orderId);
  }, [orderId, processes, getOrderMaterialUsed]);

  const progressPercent = useMemo(() => {
    return getOrderProgress(orderId);
  }, [orderId, processes, getOrderProgress]);

  const handleStatusChange = () => {
    if (!order) return;
    const allowedNext = getAllowedNextStatus();
    if (!allowedNext) {
      Taro.showToast({ title: getStatusBlockReason(), icon: 'none' });
      return;
    }
    const result = updateOrderStatus(orderId, allowedNext);
    if (!result.success) {
      Taro.showToast({ title: result.reason || '更新失败', icon: 'none' });
      return;
    }
    Taro.showToast({ title: `状态已更新为：${orderStatusLabels[allowedNext]}`, icon: 'success' });
  };

  const getAllowedNextStatus = (): OrderStatus | null => {
    if (!order) return null;
    const completedSteps = orderProcesses.filter(p => p.status === 'completed').length;
    const totalSteps = processStepOrder.length;

    switch (order.status) {
      case 'pending':
        return completedSteps >= 1 ? 'in_progress' : null;
      case 'in_progress':
        return completedSteps >= totalSteps ? 'completed' : null;
      case 'completed':
        return 'delivered';
      case 'delivered':
      default:
        return null;
    }
  };

  const getStatusBlockReason = (): string => {
    if (!order) return '';
    const completedSteps = orderProcesses.filter(p => p.status === 'completed').length;
    const totalSteps = processStepOrder.length;

    switch (order.status) {
      case 'pending':
        return `请先推进至少1道工序（${completedSteps}/${totalSteps}）`;
      case 'in_progress':
        return `请先完成全部${totalSteps}道工序（${completedSteps}/${totalSteps}）`;
      case 'completed':
        return '';
      case 'delivered':
      default:
        return '订单已完成全部流程';
    }
  };

  const getNextButtonText = (): string => {
    const next = getAllowedNextStatus();
    if (!next) return '推进状态';
    switch (next) {
      case 'in_progress': return '标记制作中';
      case 'completed': return '标记已完成';
      case 'delivered': return '确认交付';
      default: return '推进状态';
    }
  };

  const isStatusButtonDisabled = (): boolean => {
    return getAllowedNextStatus() === null;
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
        <View className={styles.progressBar}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>完成进度</Text>
            <Text className={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View className={styles.progressTrack}>
            <View className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </View>
        </View>
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
            <Text className={`${styles.materialValue} ${styles.materialActual}`}>{totalMaterialUsed.toFixed(2)}kg</Text>
          </View>
          <View className={styles.materialRow}>
            <Text className={styles.materialLabel}>用量差异</Text>
            <Text className={classnames(
              styles.materialValue,
              (totalMaterialUsed - order.copperUsed) > 0 ? styles.materialDiffOver : styles.materialDiffUnder
            )}>
              {totalMaterialUsed - order.copperUsed > 0 ? '+' : ''}{(totalMaterialUsed - order.copperUsed).toFixed(2)}kg
            </Text>
          </View>
          <View className={styles.materialRow}>
            <Text className={styles.materialLabel}>剩余可用</Text>
            <Text className={styles.materialValue}>{Math.max(0, order.copperUsed - totalMaterialUsed).toFixed(2)}kg</Text>
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.btnSecondary} onClick={handleGoWorkshop}>
          <Text className={styles.btnSecondaryText}>工坊详情</Text>
        </View>
        <View
          className={classnames(styles.btnPrimary, isStatusButtonDisabled() && styles.btnPrimaryDisabled)}
          onClick={handleStatusChange}
        >
          <Text className={styles.btnPrimaryText}>{getNextButtonText()}</Text>
        </View>
      </View>
    </View>
  );
};

export default OrderDetailPage;
