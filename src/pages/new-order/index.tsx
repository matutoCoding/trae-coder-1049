import React, { useState, useEffect } from 'react';
import { View, Text, Input, Image, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { styleList } from '@/data/styles';
import { useAppStore } from '@/store';
import type { OrderType } from '@/types';

const orderTypes: { key: OrderType; label: string }[] = [
  { key: 'custom', label: '定制' },
  { key: 'tradein', label: '以旧换新' },
  { key: 'repair', label: '修补翻新' }
];

const NewOrderPage: React.FC = () => {
  const router = useRouter();
  const styleId = router.params.styleId || '';
  const hydrate = useAppStore((s) => s.hydrate);
  const addOrder = useAppStore((s) => s.addOrder);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const styleItem = styleList.find(s => s.id === styleId);

  const [customerName, setCustomerName] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('custom');
  const [amount, setAmount] = useState(styleItem ? String(styleItem.price) : '');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [copperUsed, setCopperUsed] = useState('0.5');

  const handleSubmit = () => {
    if (!customerName.trim()) {
      Taro.showToast({ title: '请填写客户姓名', icon: 'none' });
      return;
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const orderId = `o${Date.now()}`;

    addOrder({
      id: orderId,
      customerName: customerName.trim(),
      type: orderType,
      productName: styleItem ? styleItem.name : '自定义铜器',
      styleId: styleId,
      status: 'pending',
      amount: Number(amount) || 0,
      createdAt: dateStr,
      deadline: deadline || dateStr,
      description: description || (styleItem ? styleItem.description : ''),
      copperUsed: Number(copperUsed) || 0,
      copperType: orderType === 'repair' ? 'red_copper' : 'red_copper'
    });

    console.info('[NewOrder] 订单已创建:', orderId);
    Taro.showToast({ title: '订单创建成功', icon: 'success' });
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/orders/index' });
    }, 1500);
  };

  return (
    <View className={styles.container}>
      <View className={styles.formCard}>
        <Text className={styles.formTitle}>定制订单</Text>

        {styleItem && (
          <View className={styles.styleInfo}>
            <Image className={styles.styleImage} src={styleItem.image} mode="aspectFill" />
            <View className={styles.styleDetail}>
              <Text className={styles.styleName}>{styleItem.name}</Text>
              <Text className={styles.stylePrice}>参考价: ¥{styleItem.price}/{styleItem.unit}</Text>
            </View>
          </View>
        )}

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>客户姓名</Text>
          <Input
            className={styles.formInput}
            placeholder="请输入客户姓名"
            value={customerName}
            onInput={(e) => setCustomerName(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>订单类型</Text>
          <View className={styles.typeRow}>
            {orderTypes.map(t => (
              <View
                key={t.key}
                className={classnames(styles.typeBtn, orderType === t.key && styles.typeBtnActive)}
                onClick={() => setOrderType(t.key)}
              >
                <Text className={classnames(styles.typeBtnText, orderType === t.key && styles.typeBtnTextActive)}>
                  {t.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>订单金额</Text>
          <Input
            className={styles.formInput}
            type="digit"
            placeholder="请输入金额"
            value={amount}
            onInput={(e) => setAmount(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>截止日期</Text>
          <Input
            className={styles.formInput}
            placeholder="如 2026-07-30"
            value={deadline}
            onInput={(e) => setDeadline(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>预计用铜 (kg)</Text>
          <Input
            className={styles.formInput}
            type="digit"
            placeholder="预计铜料消耗"
            value={copperUsed}
            onInput={(e) => setCopperUsed(e.detail.value)}
          />
        </View>

        <View className={styles.formGroup}>
          <Text className={styles.formLabel}>备注说明</Text>
          <Textarea
            className={styles.formTextarea}
            placeholder="请输入定制需求说明"
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
          />
        </View>
      </View>

      <View className={styles.bottomBar}>
        <View className={styles.submitBtn} onClick={handleSubmit}>
          <Text className={styles.submitBtnText}>确认下单</Text>
        </View>
      </View>
    </View>
  );
};

export default NewOrderPage;
