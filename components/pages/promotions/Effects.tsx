import { Effect, PromotionEffectType } from 'dsl-admin-base';
import { Box, Text } from 'rebass';
import { Row, Menu, Dropdown, notification } from 'antd';
import { ProductEffectControl } from './ProductEffectControl';
import { BasketDiscountEffect } from './BasketDiscountEffect';
import { useState, useEffect } from 'react';

interface Props {
  effects: Effect[];
  onChange: (value: Effect[]) => void;
}

export const Effects: React.FC<Props> = ({ effects, onChange }) => {
  const [activeEffects, setActiveEffects] = useState(effects);

  const [effectType, setEffectType] = useState<PromotionEffectType | undefined>(
    effects.length ? (effects[0].type as PromotionEffectType) : undefined,
  );

  const menu = (
    <Menu onClick={(e) => addEffect(e.key as PromotionEffectType)}>
      <Menu.Item key={PromotionEffectType.FREE_STOCK}>Free Stock</Menu.Item>
      <Menu.Item key={PromotionEffectType.BASKET_DISCOUNT}>Basket Discount</Menu.Item>
    </Menu>
  );

  const addEffect = (key: PromotionEffectType) => {
    // TODO: revisit later
    if (!effectType || true) {
      setEffectType(key);

      if (key === PromotionEffectType.BASKET_DISCOUNT) {
        setActiveEffects([
          {
            type: PromotionEffectType.BASKET_DISCOUNT,
            id: 1,
            name: 'basket-discount',
            value: 0,
          },
        ]);
      }
    } else {
      notification.warn({ message: 'Can not  change reward type' });
    }
  };

  useEffect(() => {
    onChange(activeEffects);
  }, [activeEffects]);

  return (
    <Box sx={{ mt: 4, pb: 5 }}>
      <Box>
        <Text variant="h4">Reward</Text>
        <Box sx={{ my: 3 }}>
          <Row align="middle">
            <Dropdown overlay={menu} trigger={['click']}>
              <Text
                sx={{
                  textTransform: 'uppercase',
                  ml: 'auto',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Add Reward
              </Text>
            </Dropdown>
          </Row>
        </Box>
      </Box>

      {effectType === PromotionEffectType.FREE_STOCK && (
        <ProductEffectControl effects={activeEffects} onChange={setActiveEffects} />
      )}

      {effectType === PromotionEffectType.BASKET_DISCOUNT && (
        <BasketDiscountEffect effects={activeEffects} onChange={setActiveEffects} />
      )}
    </Box>
  );
};
