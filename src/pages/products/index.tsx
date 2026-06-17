import React, { useState, useMemo } from 'react';
import { View, Text, Image } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { productList, productStatusLabels } from '@/data/products';

const statusFilters = [
  { key: 'all', label: '全部' },
  { key: 'stock', label: '在库' },
  { key: 'sold', label: '已售' },
  { key: 'reserved', label: '预留' }
];

const statusStyleMap: Record<string, string> = {
  stock: styles.statusStock,
  sold: styles.statusSold,
  reserved: styles.statusReserved
};

const ProductsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return productList;
    return productList.filter(p => p.status === activeFilter);
  }, [activeFilter]);

  const stockCount = productList.filter(p => p.status === 'stock').length;
  const totalWeight = productList.reduce((s, p) => s + p.weight, 0);

  return (
    <View className={styles.container}>
      <View className={styles.statsBar}>
        <View className={styles.statChip}>
          <Text className={styles.statChipText}>在库<Text className={styles.statChipValue}>{stockCount}件</Text></Text>
        </View>
        <View className={styles.statChip}>
          <Text className={styles.statChipText}>总克重<Text className={styles.statChipValue}>{totalWeight}g</Text></Text>
        </View>
        <View className={styles.statChip}>
          <Text className={styles.statChipText}>已售<Text className={styles.statChipValue}>{productList.filter(p => p.status === 'sold').length}件</Text></Text>
        </View>
      </View>

      <View className={styles.filterRow}>
        <View className={styles.filterTabs}>
          {statusFilters.map(f => (
            <View
              key={f.key}
              className={classnames(styles.filterTab, activeFilter === f.key && styles.filterTabActive)}
              onClick={() => setActiveFilter(f.key)}
            >
              <Text className={classnames(styles.filterTabText, activeFilter === f.key && styles.filterTabTextActive)}>
                {f.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {filteredProducts.length > 0 ? (
        <View className={styles.list}>
          {filteredProducts.map(item => (
            <View className={styles.productCard} key={item.id}>
              <Image className={styles.productImage} src={item.image} mode="aspectFill" />
              <View className={styles.productInfo}>
                <Text className={styles.productName}>{item.name}</Text>
                <View className={styles.productMeta}>
                  <Text className={styles.productMetaItem}>{item.weight}g</Text>
                  <Text className={styles.productMetaItem}>{item.dimensions}</Text>
                </View>
                <View className={styles.productBottom}>
                  <Text className={styles.productPrice}>¥{item.price}</Text>
                  <Text className={classnames(styles.productStatus, statusStyleMap[item.status])}>
                    {productStatusLabels[item.status]}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyWrap}>
          <Text className={styles.emptyIcon}>🏺</Text>
          <Text className={styles.emptyText}>暂无该状态成品</Text>
        </View>
      )}
    </View>
  );
};

export default ProductsPage;
