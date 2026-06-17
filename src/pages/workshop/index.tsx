import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import { useAppStore } from '@/store';
import { materialList, materialTypeLabels } from '@/data/materials';
import { processStepLabels, processStepOrder, processStatusLabels } from '@/data/processes';
import { orderTypeLabels, orderStatusLabels } from '@/data/orders';

const WorkshopPage: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'material' | 'process'>('process');
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const hydrate = useAppStore((s) => s.hydrate);
  const orders = useAppStore((s) => s.orders);
  const processes = useAppStore((s) => s.processes);
  const getProcessesByOrderId = useAppStore((s) => s.getProcessesByOrderId);
  const getOrderProgress = useAppStore((s) => s.getOrderProgress);
  const getOrderMaterialUsed = useAppStore((s) => s.getOrderMaterialUsed);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status === 'pending' || o.status === 'in_progress');
  }, [orders]);

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return activeOrders[0] || null;
    return orders.find(o => o.id === selectedOrderId) || null;
  }, [selectedOrderId, activeOrders, orders]);

  const orderProcesses = useMemo(() => {
    if (!selectedOrder) return [];
    const procs = getProcessesByOrderId(selectedOrder.id);
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
  }, [selectedOrder, getProcessesByOrderId]);

  const progressPercent = useMemo(() => {
    if (!selectedOrder) return 0;
    return getOrderProgress(selectedOrder.id);
  }, [selectedOrder, getOrderProgress]);

  const totalRedCopper = materialList.filter(m => m.type === 'red_copper').reduce((s, m) => s + m.remaining, 0);
  const totalBrass = materialList.filter(m => m.type === 'brass').reduce((s, m) => s + m.remaining, 0);
  const totalBronze = materialList.filter(m => m.type === 'bronze').reduce((s, m) => s + m.remaining, 0);

  const inProgressProcesses = processes.filter(p => p.status === 'in_progress');

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>工坊管理</Text>
        <Text className={styles.headerDesc}>铜料登记，锻打工序跟踪</Text>
      </View>

      <View className={styles.mainTabs}>
        <View
          className={classnames(styles.mainTab, activeMainTab === 'material' && styles.mainTabActive)}
          onClick={() => setActiveMainTab('material')}
        >
          <Text className={classnames(styles.mainTabText, activeMainTab === 'material' && styles.mainTabTextActive)}>
            铜料管理
          </Text>
        </View>
        <View
          className={classnames(styles.mainTab, activeMainTab === 'process' && styles.mainTabActive)}
          onClick={() => setActiveMainTab('process')}
        >
          <Text className={classnames(styles.mainTabText, activeMainTab === 'process' && styles.mainTabTextActive)}>
            锻打工序
          </Text>
        </View>
      </View>

      {activeMainTab === 'material' ? (
        <>
          <View className={styles.statsRow}>
            <StatCard label="紫铜" value={totalRedCopper.toFixed(1)} unit="kg" highlight />
            <StatCard label="黄铜" value={totalBrass.toFixed(1)} unit="kg" />
            <StatCard label="青铜" value={totalBronze.toFixed(1)} unit="kg" />
          </View>
          <View className={styles.section}>
            <SectionHeader title="铜料库存" actionText="登记" />
            {materialList.map(item => {
              const dotStyle =
                item.type === 'red_copper'
                  ? styles.typeDotRed
                  : item.type === 'brass'
                  ? styles.typeDotBrass
                  : styles.typeDotBronze;
              const usagePercent = Math.round(((item.weight - item.remaining) / item.weight) * 100);
              return (
                <View className={styles.materialCard} key={item.id}>
                  <View className={styles.materialHeader}>
                    <View className={styles.materialType}>
                      <View className={`${styles.typeDot} ${dotStyle}`} />
                      <Text className={styles.materialName}>{materialTypeLabels[item.type]}</Text>
                    </View>
                    <Text className={styles.materialWeight}>{item.remaining}{item.unit}</Text>
                  </View>
                  <View className={styles.materialInfo}>
                    <View className={styles.materialInfoItem}>
                      <Text className={styles.materialInfoLabel}>来源</Text>
                      <Text className={styles.materialInfoValue}>{item.source}</Text>
                    </View>
                    <View className={styles.materialInfoItem}>
                      <Text className={styles.materialInfoLabel}>入库</Text>
                      <Text className={styles.materialInfoValue}>{item.date}</Text>
                    </View>
                    <View className={styles.materialInfoItem}>
                      <Text className={styles.materialInfoLabel}>已用</Text>
                      <Text className={styles.materialInfoValue}>{usagePercent}%</Text>
                    </View>
                  </View>
                  <View className={styles.progressBar}>
                    <View className={styles.progressFill} style={{ width: `${usagePercent}%` }} />
                  </View>
                </View>
              );
            })}
          </View>
        </>
      ) : (
        <>
          <View className={styles.statsRow}>
            <StatCard label="进行中" value={inProgressProcesses.length} unit="项" highlight />
            <StatCard label="活跃订单" value={activeOrders.length} unit="单" />
            <StatCard label="进度" value={progressPercent} unit="%" />
          </View>

          <View className={styles.section}>
            <SectionHeader title="选择订单" />
            <View className={styles.orderSelector}>
              <ScrollView scrollX className={styles.orderScroll}>
                <View className={styles.orderTabs}>
                  {activeOrders.map(order => (
                    <View
                      key={order.id}
                      className={classnames(styles.orderTab, selectedOrder?.id === order.id && styles.orderTabActive)}
                      onClick={() => setSelectedOrderId(order.id)}
                    >
                      <Text className={classnames(styles.orderTabText, selectedOrder?.id === order.id && styles.orderTabTextActive)}>
                        {order.productName}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>

          {selectedOrder ? (
            <>
              <View className={styles.orderProgress}>
                <View className={styles.progressHeader}>
                  <Text className={styles.progressTitle}>{selectedOrder.productName}</Text>
                  <Text className={styles.progressPercent}>{progressPercent}%</Text>
                </View>
                <View className={styles.progressTrack}>
                  <View className={styles.progressFillBar} style={{ width: `${progressPercent}%` }} />
                </View>
              </View>

              <View className={styles.section}>
                <SectionHeader
                  title="工序流程"
                  actionText="详情"
                  onAction={() => Taro.navigateTo({ url: `/pages/workshop-detail/index?orderId=${selectedOrder.id}` })}
                />
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
                            <Text className={classnames(
                              styles.processStatusTag,
                              item.status === 'pending' && styles.statusPending,
                              item.status === 'in_progress' && styles.statusProgress,
                              item.status === 'completed' && styles.statusCompleted
                            )}>
                              {processStatusLabels[item.status]}
                            </Text>
                          </View>
                          {item.notes ? <Text className={styles.processNotes}>{item.notes}</Text> : null}
                          <View className={styles.processMeta}>
                            {item.operator && <Text className={styles.processMetaText}>{item.operator}</Text>}
                            {item.startTime && <Text className={styles.processMetaText}>{item.startTime}</Text>}
                            {item.materialUsed > 0 && <Text className={styles.processMaterial}>用铜{item.materialUsed}kg</Text>}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>

              <View className={styles.materialSection}>
                <SectionHeader title="材料消耗" />
                <View className={styles.materialSummary}>
                  <View className={styles.materialRow}>
                    <Text className={styles.materialRowLabel}>铜料</Text>
                    <Text className={styles.materialRowValue}>{materialTypeLabels[selectedOrder.copperType] || selectedOrder.copperType}</Text>
                  </View>
                  <View className={styles.materialRow}>
                    <Text className={styles.materialRowLabel}>预计</Text>
                    <Text className={styles.materialRowValue}>{selectedOrder.copperUsed}kg</Text>
                  </View>
                  <View className={styles.materialRow}>
                    <Text className={styles.materialRowLabel}>已消耗</Text>
                    <Text className={`${styles.materialRowValue} ${styles.materialHighlight}`}>
                      {getOrderMaterialUsed(selectedOrder.id).toFixed(2)}kg
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <View className={styles.emptyWrap}>
              <Text className={styles.emptyIcon}>🔨</Text>
              <Text className={styles.emptyText}>暂无活跃订单</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default WorkshopPage;
