import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import styles from './index.module.scss';
import type { StyleItem } from '@/types';

interface StyleCardProps {
  item: StyleItem;
  onClick?: () => void;
}

const StyleCard: React.FC<StyleCardProps> = ({ item, onClick }) => {
  return (
    <View className={styles.styleCard} onClick={onClick}>
      <Image className={styles.styleImage} src={item.image} mode="aspectFill" />
      <View className={styles.styleInfo}>
        <Text className={styles.styleName}>{item.name}</Text>
        <Text className={styles.styleDesc}>{item.description}</Text>
        <View className={styles.styleBottom}>
          <Text className={styles.stylePrice}>¥{item.price}</Text>
          <Text className={styles.styleUnit}>/{item.unit}</Text>
        </View>
      </View>
    </View>
  );
};

export default StyleCard;
