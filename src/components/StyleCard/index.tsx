import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import type { StyleItem } from '@/types';

interface StyleCardProps {
  item: StyleItem;
  onCustom?: (id: string) => void;
}

const StyleCard: React.FC<StyleCardProps> = ({ item, onCustom }) => {
  const handleCustom = (e: any) => {
    e.stopPropagation();
    onCustom?.(item.id);
  };

  return (
    <View className={styles.styleCard}>
      <Image className={styles.styleImage} src={item.image} mode="aspectFill" />
      <View className={styles.styleInfo}>
        <Text className={styles.styleName}>{item.name}</Text>
        <Text className={styles.styleDesc}>{item.description}</Text>
        <View className={styles.styleBottom}>
          <View className={styles.priceWrap}>
            <Text className={styles.stylePrice}>¥{item.price}</Text>
            <Text className={styles.styleUnit}>/{item.unit}</Text>
          </View>
          <View className={styles.customBtn} onClick={handleCustom}>
            <Text className={styles.customBtnText}>定制</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StyleCard;
