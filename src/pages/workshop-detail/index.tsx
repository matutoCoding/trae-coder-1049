import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import SectionHeader from '@/components/SectionHeader';
import { useAppStore } from '@/store';
import { orderTypeLabels, orderStatusLabels } from '@/data/orders';
import { processStepLabels, processStepOrder, processStatusLabels } from '@/data/processes';
import { materialTypeLabels } from '@/data/materials';
import type { ProcessStep } from '@/types';

const statusStyleMap: Record<string, string> = {
  pending: styles.statusPending,
  in_progress: styles.statusProgress,
  completed: styles.statusCompleted
};

const WorkshopDetailPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.orderId || '';
  const hydrate = useAppStore((s) => s.hydrate);
  const orders = useAppStore((s) => s.orders);
  const processes = useAppStore((s) => s.processes);
  const advanceProcess = useAppStore((s) => s.advanceProcess);
  const getOrderProgress = useAppStore((s) => s.getOrderProgress);
  const getOrderMaterialUsed = useAppStore((s) => s.getOrderMaterialUsed);
  const getProcessesByOrderId = useAppStore((s) => s.getProcessesByOrderId);

  const [showAdvance, setShowAdvance] = useState(false);
  const [selectedStep, setSelectedStep] = useState<ProcessStep | null>(null);
  const [materialInput, setMaterialInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const order = useMemo(() => {
    return orders.find(o => o.id === orderId);
  }, [orders, orderId]);

  const orderProcesses = useMemo(() => {
    const procs = getProcessesByOrderId(orderId);
    if (procs.length === 0 && order) {
      return processStepOrder.map((step) => ({
        step,
        label: processStepLabels[step],
        status: 'pending',
        operator: '',
        startTime: '',
        endTime: '',
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
      endTime: p.endTime,
      notes: p.notes,
      materialUsed: p.materialUsed
    }));
  }, [processes, orderId, getProcessesByOrderId, order]);

  const progressPercent = getOrderProgress(orderId);
  const totalMaterialUsed = getOrderMaterialUsed(orderId);

  const currentStep = useMemo(() => {
    const inProgress = orderProcesses.find(p => p.status === 'in_progress');
    if (inProgress) return inProgress.step as ProcessStep;
    return null;
  }, [orderProcesses]);

  const handleOpenAdvance = (step: ProcessStep) => {
    const stepInfo = orderProcesses.find(p => p.step === step);
    if (stepInfo && stepInfo.status !== 'in_progress') {
      Taro.showToast({ title: '该工序未在进行中', icon: 'none' });
      return;
    }
    setSelectedStep(step);
    setMaterialInput('');
    setNotesInput('');
    setShowAdvance(true);
  };

  const handleConfirmAdvance = () => {
    if (!selectedStep) return;
    const materialUsed = parseFloat(materialInput) || 0;
    advanceProcess(orderId, selectedStep, materialUsed, notesInput);
    setShowAdvance(false);
    setSelectedStep(null);
    Taro.showToast({ title: '工序已推进', icon: 'success' });
  };

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
            <Text className={styles.materialValue}>{Math.max(0, order.copperUsed - totalMaterialUsed).toFixed(2)}kg</Text>
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
            const canAdvance = item.status === 'in_progress';
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
                  {canAdvance && (
                    <View className={styles.advanceBtn} onClick={() => handleOpenAdvance(item.step as ProcessStep)}>
                      <Text className={styles.advanceBtnText}>完成此工序</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {showAdvance && selectedStep && (
        <View className={styles.modalOverlay} onClick={() => setShowAdvance(false)}>
          <View className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Text className={styles.modalTitle}>完成「{processStepLabels[selectedStep]}」工序</Text>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>材料消耗(kg)</Text>
              <Input
                className={styles.formInput}
                type="digit"
                placeholder="请输入本次消耗铜料重量"
                value={materialInput}
                onInput={(e) => setMaterialInput(e.detail.value)}
              />
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>工序备注</Text>
              <Input
                className={styles.formInput}
                placeholder="请输入备注信息"
                value={notesInput}
                onInput={(e) => setNotesInput(e.detail.value)}
              />
            </View>
            <View className={styles.modalActions}>
              <View className={styles.modalCancel} onClick={() => setShowAdvance(false)}>
                <Text className={styles.modalCancelText}>取消</Text>
              </View>
              <View className={styles.modalConfirm} onClick={handleConfirmAdvance}>
                <Text className={styles.modalConfirmText}>确认完成</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default WorkshopDetailPage;
