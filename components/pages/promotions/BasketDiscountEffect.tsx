import { Box, Text } from 'rebass';
import { Row, Space, Select, InputNumber } from 'antd';
import { Effect, PromotionEffectType } from 'dsl-admin-base';

const { Option } = Select;

interface Props {
  effects: Effect[];
  onChange: (effects: Effect[]) => void;
}

export const BasketDiscountEffect: React.FC<Props> = ({ effects, onChange }) => {
  const value = effects.length ? effects[0].value / 100 : 0;

  const onValueChange = (value: number) => {
    onChange([
      {
        type: PromotionEffectType.BASKET_DISCOUNT,
        id: 1,
        value: value * 100,
        name: 'basket-discount',
      },
    ]);
  };

  return (
    <Box mb="4" p="3" bg="lightGrey">
      <Row justify="space-between" align="middle">
        <Text variant="h4">Basket Discount</Text>
        <Space></Space>
      </Row>
      <Box sx={{ pt: 3 }}>
        <Space>
          <Select style={{ width: 300 }} value="fixedAmount">
            <Option value="fixedAmount">Discount by a fixed amount (ex VAT)</Option>
          </Select>
          <Text sx={{ ml: 3 }}>£</Text>
          <InputNumber
            type="number"
            defaultValue={value}
            onChange={(e) => onValueChange((e || 0) as number)}
          />
        </Space>
      </Box>
    </Box>
  );
};
