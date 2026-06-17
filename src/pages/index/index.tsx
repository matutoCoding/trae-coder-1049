import React, { useState, useMemo, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import TabFilter from '@/components/TabFilter';
import SectionHeader from '@/components/SectionHeader';
import StyleCard from '@/components/StyleCard';
import StatCard from '@/components/StatCard';
import { styleList, styleCategories } from '@/data/styles';
import { useAppStore } from '@/store';

const StylesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('tea');
  const hydrate = useAppStore((s) => s.hydrate);
  const orders = useAppStore((s) => s.orders);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filteredStyles = useMemo(() => {
    return styleList.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const tabs = useMemo(() => {
    return styleCategories.map(c => ({ key: c.key, label: c.label }));
  }, []);

  const totalCount = styleList.length;
  const avgPrice = Math.round(styleList.reduce((s, i) => s + i.price, 0) / totalCount);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const handleCustom = (styleId: string) => {
    Taro.navigateTo({ url: `/pages/new-order/index?styleId=${styleId}` });
  };

  const handleQuickCustom = () => {
    Taro.navigateTo({ url: '/pages/new-order/index' });
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
        <StatCard label="待处理" value={pendingOrders} unit="单" />
      </View>

      <View className={styles.quickEntry}>
        <View className={styles.entryGrid}>
          <View className={styles.entryItem} onClick={handleQuickCustom}>
            <Text className={styles.entryIcon}>🔨</Text>
            <Text className={styles.entryLabel}>茶器定制</Text>
          </View>
          <View className={styles.entryItem} onClick={() => Taro.switchTab({ url: '/pages/orders/index' })}>
            <Text className={styles.entryIcon}>♻️</Text>
            <Text className={styles.entryLabel}>以旧换新</Text>
          </View>
          <View className={styles.entryItem} onClick={() => Taro.navigateTo({ url: '/pages/products/index' })}>
            <Text className={styles.entryIcon}>📖</Text>
            <Text className={styles.entryLabel}>作品展示</Text>
          </View>
        </View>
      </View>

      <View className={styles.tabSection}>
        <TabFilter tabs={tabs} activeKey={activeCategory} onChange={setActiveCategory} />
      </View>

      <View className={styles.gridSection}>
        <SectionHeader title="作品展示" actionText="查看全部" onAction={() => Taro.navigateTo({ url: '/pages/products/index' })} />
        {filteredStyles.length > 0 ? (
          <View className={styles.styleGrid}>
            {filteredStyles.map(item => (
              <StyleCard key={item.id} item={item} onCustom={handleCustom} />
            ))}
          </View>
        ) : (
          <View className={styles.emptyTip}>
            <Text className={styles.emptyIcon}>🏺</Text>
            <Text className={styles.emptyText}>暂无该分类款式</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default StylesPage;
