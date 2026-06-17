import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, highlight }) => {
  return (
    <View className={`${styles.statCard} ${highlight ? styles.highlight : ''}`}>
      <Text className={styles.statValue}>
        {value}
        {unit && <Text className={styles.statUnit}>{unit}</Text>}
      </Text>
      <Text className={styles.statLabel}>{label}</Text>
    </View>
  );
};

export default StatCard;
