import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, Image, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { productStatusLabels } from '@/data/products';
import { useAppStore } from '@/store';
import type { ProductItem } from '@/types';

const statusFilters = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'stock', label: '在库' },
  { key: 'sold', label: '已售' },
  { key: 'reserved', label: '预留' }
];

const statusStyleMap: Record<string, string> = {
  draft: styles.statusDraft,
  stock: styles.statusStock,
  sold: styles.statusSold,
  reserved: styles.statusReserved
};

const ProductsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState('');
  const [editDimensions, setEditDimensions] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const hydrate = useAppStore((s) => s.hydrate);
  const products = useAppStore((s) => s.products);
  const orders = useAppStore((s) => s.orders);
  const updateProduct = useAppStore((s) => s.updateProduct);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') return products;
    return products.filter(p => p.status === activeFilter);
  }, [activeFilter, products]);

  const stockCount = products.filter(p => p.status === 'stock').length;
  const draftCount = products.filter(p => p.status === 'draft').length;
  const totalWeight = products.filter(p => !p.isDraft).reduce((s, p) => s + p.weight, 0);

  const handleProductClick = (product: ProductItem) => {
    Taro.showActionSheet({
      itemList: product.isDraft
        ? ['补充信息转正', '查看来源订单']
        : (product.sourceOrderId ? ['查看来源订单'] : []),
      success: (res) => {
        if (product.isDraft) {
          if (res.tapIndex === 0) {
            setEditingId(product.id);
            setEditWeight(product.weight > 0 ? String(product.weight) : '');
            setEditDimensions(product.dimensions);
            setEditPrice(product.price > 0 ? String(product.price) : '');
          } else if (res.tapIndex === 1 && product.sourceOrderId) {
            Taro.navigateTo({ url: `/pages/order-detail/index?id=${product.sourceOrderId}` });
          }
        } else if (product.sourceOrderId) {
          if (res.tapIndex === 0) {
            Taro.navigateTo({ url: `/pages/order-detail/index?id=${product.sourceOrderId}` });
          }
        }
      }
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const weight = parseFloat(editWeight) || 0;
    const price = parseFloat(editPrice) || 0;
    updateProduct(editingId, {
      weight,
      dimensions: editDimensions,
      price,
      isDraft: false,
      status: 'stock'
    });
    setEditingId(null);
    setEditWeight('');
    setEditDimensions('');
    setEditPrice('');
    Taro.showToast({ title: '已补全信息转入成品档案', icon: 'success' });
  };

  const getOrderName = (orderId?: string) => {
    if (!orderId) return '';
    const o = orders.find(o => o.id === orderId);
    return o ? o.productName : '';
  };

  return (
    <View className={styles.container}>
      <View className={styles.statsBar}>
        <View className={styles.statChip}>
          <Text className={styles.statChipText}>草稿<Text className={styles.statChipValue}>{draftCount}件</Text></Text>
        </View>
        <View className={styles.statChip}>
          <Text className={styles.statChipText}>在库<Text className={styles.statChipValue}>{stockCount}件</Text></Text>
        </View>
        <View className={styles.statChip}>
          <Text className={styles.statChipText}>总克重<Text className={styles.statChipValue}>{totalWeight}g</Text></Text>
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
            <View key={item.id}>
              <View
                className={classnames(styles.productCard, item.isDraft && styles.productCardDraft)}
                onClick={() => editingId !== item.id && handleProductClick(item)}
              >
                {item.isDraft && <View className={styles.draftBadge}><Text className={styles.draftBadgeText}>草稿</Text></View>}
                <Image className={styles.productImage} src={item.image} mode="aspectFill" />
                <View className={styles.productInfo}>
                  <Text className={styles.productName}>{item.name}</Text>
                  {item.customerName && (
                    <View className={styles.productSource}>
                      <Text className={styles.productSourceLabel}>客户：</Text>
                      <Text className={styles.productSourceText}>{item.customerName}</Text>
                    </View>
                  )}
                  {item.actualCopperUsed > 0 && (
                    <View className={styles.productSource}>
                      <Text className={styles.productSourceLabel}>实际用铜：</Text>
                      <Text className={styles.productSourceText}>{item.actualCopperUsed}kg</Text>
                    </View>
                  )}
                  {item.completedDate && (
                    <View className={styles.productSource}>
                      <Text className={styles.productSourceLabel}>完工日期：</Text>
                      <Text className={styles.productSourceText}>{item.completedDate}</Text>
                    </View>
                  )}
                  <View className={styles.productMeta}>
                    <Text className={styles.productMetaItem}>{item.weight > 0 ? `${item.weight}g` : '待补充克重'}</Text>
                    <Text className={styles.productMetaItem}>{item.dimensions || '待补充尺寸'}</Text>
                  </View>
                  <View className={styles.productBottom}>
                    <Text className={styles.productPrice}>{item.price > 0 ? `¥${item.price}` : '待补充售价'}</Text>
                    <Text className={classnames(styles.productStatus, statusStyleMap[item.status])}>
                      {productStatusLabels[item.status]}
                    </Text>
                  </View>
                </View>
              </View>

              {editingId === item.id && (
                <View className={styles.editCard}>
                  <View className={styles.editHeader}>
                    <Text className={styles.editTitle}>补充成品档案</Text>
                    <Text className={styles.editClose} onClick={() => setEditingId(null)}>✕</Text>
                  </View>
                  <View className={styles.editRow}>
                    <Text className={styles.editLabel}>克重 (g)</Text>
                    <Input
                      className={styles.editInput}
                      type="digit"
                      placeholder="请输入成品克重"
                      value={editWeight}
                      onInput={(e) => setEditWeight(e.detail.value)}
                    />
                  </View>
                  <View className={styles.editRow}>
                    <Text className={styles.editLabel}>尺寸</Text>
                    <Input
                      className={styles.editInput}
                      placeholder="如 高10cm 口径8cm"
                      value={editDimensions}
                      onInput={(e) => setEditDimensions(e.detail.value)}
                    />
                  </View>
                  <View className={styles.editRow}>
                    <Text className={styles.editLabel}>售价 (元)</Text>
                    <Input
                      className={styles.editInput}
                      type="digit"
                      placeholder="请输入售价"
                      value={editPrice}
                      onInput={(e) => setEditPrice(e.detail.value)}
                    />
                  </View>
                  <View className={styles.editActions}>
                    <View className={styles.editBtnCancel} onClick={() => setEditingId(null)}>
                      <Text className={styles.editBtnCancelText}>取消</Text>
                    </View>
                    <View className={styles.editBtnSave} onClick={handleSaveEdit}>
                      <Text className={styles.editBtnSaveText}>保存并转正</Text>
                    </View>
                  </View>
                </View>
              )}
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
