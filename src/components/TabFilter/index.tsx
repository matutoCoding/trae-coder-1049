import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface TabItem {
  key: string;
  label: string;
}

interface TabFilterProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

const TabFilter: React.FC<TabFilterProps> = ({ tabs, activeKey, onChange }) => {
  return (
    <ScrollView scrollX className={styles.tabScroll}>
      <View className={styles.tabList}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={classnames(styles.tabItem, activeKey === tab.key && styles.tabItemActive)}
            onClick={() => onChange(tab.key)}
          >
            <Text className={classnames(styles.tabText, activeKey === tab.key && styles.tabTextActive)}>
              {tab.label}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default TabFilter;
