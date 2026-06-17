import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatCard from '@/components/StatCard';
import SectionHeader from '@/components/SectionHeader';
import { materialList, materialTypeLabels } from '@/data/materials';
import { processList, processStepLabels, processStatusLabels } from '@/data/processes';

const stepStyleMap: Record<string, string> = {
  forging: styles.stepForging,
  chiseling: styles.stepChiseling,
  annealing: styles.stepAnnealing,
  polishing: styles.stepPolishing,
  patina: styles.stepPatina
};

const statusStyleMap: Record<string, string> = {
  pending: styles.statusPending,
  in_progress: styles.statusProgress,
  completed: styles.statusCompleted
};

const WorkshopPage: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'material' | 'process'>('material');

  const totalRedCopper = materialList
    .filter(m => m.type === 'red_copper')
    .reduce((s, m) => s + m.remaining, 0);
  const totalBrass = materialList
    .filter(m => m.type === 'brass')
    .reduce((s, m) => s + m.remaining, 0);
  const totalBronze = materialList
    .filter(m => m.type === 'bronze')
    .reduce((s, m) => s + m.remaining, 0);

  const inProgressProcesses = processList.filter(p => p.status === 'in_progress');
  const completedToday = processList.filter(p => p.status === 'completed').length;

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
          <Text
            className={classnames(
              styles.mainTabText,
              activeMainTab === 'material' && styles.mainTabTextActive
            )}
          >
            铜料管理
          </Text>
        </View>
        <View
          className={classnames(styles.mainTab, activeMainTab === 'process' && styles.mainTabActive)}
          onClick={() => setActiveMainTab('process')}
        >
          <Text
            className={classnames(
              styles.mainTabText,
              activeMainTab === 'process' && styles.mainTabTextActive
            )}
          >
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
                      <Text className={styles.materialName}>
                        {materialTypeLabels[item.type]}
                      </Text>
                    </View>
                    <Text className={styles.materialWeight}>
                      {item.remaining}
                      {item.unit}
                    </Text>
                  </View>
                  <View className={styles.materialInfo}>
                    <View className={styles.materialInfoItem}>
                      <Text className={styles.materialInfoLabel}>来源</Text>
                      <Text className={styles.materialInfoValue}>{item.source}</Text>
                    </View>
                    <View className={styles.materialInfoItem}>
                      <Text className={styles.materialInfoLabel}>入库日期</Text>
                      <Text className={styles.materialInfoValue}>{item.date}</Text>
                    </View>
                    <View className={styles.materialInfoItem}>
                      <Text className={styles.materialInfoLabel}>已用</Text>
                      <Text className={styles.materialInfoValue}>{usagePercent}%</Text>
                    </View>
                  </View>
                  <View className={styles.progressBar}>
                    <View
                      className={styles.progressFill}
                      style={{ width: `${usagePercent}%` }}
                    />
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
            <StatCard label="已完成" value={completedToday} unit="项" />
            <StatCard label="待开始" value={processList.filter(p => p.status === 'pending').length} unit="项" />
          </View>

          <View className={styles.section}>
            <SectionHeader title="工序跟踪" actionText="记录" />
            {processList.map(item => (
              <View className={styles.processCard} key={item.id}>
                <View className={styles.processHeader}>
                  <Text className={styles.processProduct}>{item.productName}</Text>
                  <Text className={classnames(styles.stepTag, stepStyleMap[item.step])}>
                    {processStepLabels[item.step]}
                  </Text>
                </View>
                <View className={styles.processMeta}>
                  <Text className={styles.processOperator}>{item.operator}</Text>
                  <Text className={styles.processTime}>
                    {item.startTime || '待定'}
                  </Text>
                  <Text className={classnames(styles.statusBadge, statusStyleMap[item.status])}>
                    {processStatusLabels[item.status]}
                  </Text>
                </View>
                <Text className={styles.processNotes}>{item.notes}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default WorkshopPage;
