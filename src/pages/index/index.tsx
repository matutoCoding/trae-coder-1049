import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import TabFilter from '@/components/TabFilter';
import SectionHeader from '@/components/SectionHeader';
import StyleCard from '@/components/StyleCard';
import StatCard from '@/components/StatCard';
import { styleList, styleCategories } from '@/data/styles';

const StylesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('tea');

  const filteredStyles = useMemo(() => {
    return styleList.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const tabs = useMemo(() => {
    return styleCategories.map(c => ({ key: c.key, label: c.label }));
  }, []);

  const totalCount = styleList.length;
  const avgPrice = Math.round(styleList.reduce((s, i) => s + i.price, 0) / totalCount);
  const teaCount = styleList.filter(i => i.category === 'tea').length;
  const incenseCount = styleList.filter(i => i.category === 'incense').length;

  const handleCustom = () => {
    Taro.switchTab({ url: '/pages/orders/index' });
  };

  const handleTradeIn = () => {
    Taro.switchTab({ url: '/pages/orders/index' });
  };

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>铜器款式库</Text>
        <Text className={styles.headerDesc}>百年锻打技艺，器物皆有温度</Text>
      </View>

      <View className={styles.statsRow}>
        <StatCard label="全部款式" value={totalCount} unit="款" highlight />
        <StatCard label="均价" value={avgPrice} unit="元" />
        <StatCard label="茶器" value={teaCount} unit="款" />
        <StatCard label="香器" value={incenseCount} unit="款" />
      </View>

      <View className={styles.quickEntry}>
        <View className={styles.entryGrid}>
          <View className={styles.entryItem} onClick={handleCustom}>
            <Text className={styles.entryIcon}>🔨</Text>
            <Text className={styles.entryLabel}>茶器香器定制</Text>
          </View>
          <View className={styles.entryItem} onClick={handleTradeIn}>
            <Text className={styles.entryIcon}>♻️</Text>
            <Text className={styles.entryLabel}>以旧换新</Text>
          </View>
          <View className={styles.entryItem} onClick={() => Taro.switchTab({ url: '/pages/ledger/index' })}>
            <Text className={styles.entryIcon}>📖</Text>
            <Text className={styles.entryLabel}>作品展示</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabSection}>
        <TabFilter tabs={tabs} activeKey={activeCategory} onChange={setActiveCategory} />
      </View>

      <View className={styles.gridSection}>
        <SectionHeader title="作品展示" actionText="查看全部" />
        {filteredStyles.length > 0 ? (
          <View className={styles.styleGrid}>
            {filteredStyles.map(item => (
              <StyleCard key={item.id} item={item} />
            ))}
          </View>
        ) : (
          <View className={styles.emptyTip}>
            <Text className={styles.emptyText}>暂无该分类款式</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default StylesPage;
