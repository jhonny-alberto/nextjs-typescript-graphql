import {
  PROMOTION_TYPES,
  DslCategory,
  Promotion,
  Condition,
  Effect,
  PromotionLimitType,
  ImageUpload,
} from 'dsl-admin-base';
import { Form, Input, Radio, Select, DatePicker, InputNumber } from 'antd';
import { Box, Text } from 'rebass';
import { Conditions } from './Conditions';
import { Effects } from './Effects';

const { Option } = Select;

export interface PromotionFormValue {
  conditions: Condition[];
  effects: Effect[];
}

interface Props {
  categories: DslCategory[];
  promotion?: Promotion;
  onChangeConditions: (value: Condition[]) => void;
  onChangeEffects: (value: Effect[]) => void;
}

export const PromotionForm: React.FC<Props> = ({
  categories,
  promotion,
  onChangeConditions,
  onChangeEffects,
}) => {
  return (
    <Box variant="formWithCapsSelect">
      <Text variant="h4" mb={2}>
        General
      </Text>
      <Box sx={{ maxWidth: 500 }}>
        <Form.Item
          name="identityCode"
          label="Promotion Reference"
          rules={[{ required: true, message: 'Code is required' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item name="shortDescription" label="Short Description">
          <Input.TextArea rows={4}></Input.TextArea>
        </Form.Item>
        <ImageUpload formItemName="image" label="Image"></ImageUpload>
        <Form.Item name="longDescription" label="Details">
          <Input.TextArea rows={4}></Input.TextArea>
        </Form.Item>
        <Form.Item name="activeFrom" label="Start Date">
          <DatePicker placeholder="SELECT"></DatePicker>
        </Form.Item>
        <Form.Item name="activeTo" label="End Date">
          <DatePicker placeholder="SELECT"></DatePicker>
        </Form.Item>
        <Form.Item
          name="type"
          label="Type Category"
          rules={[{ required: true, message: 'Type is required' }]}
        >
          <Select placeholder="Select">
            {PROMOTION_TYPES.map((type) => {
              return (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Select placeholder="Select" mode="multiple">
            {categories.map((category) => {
              return (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Promotion Limits">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Form.Item name={PromotionLimitType.PER_CUSTOMER} noStyle>
              <InputNumber style={{ width: 60 }} />
            </Form.Item>
            <Text sx={{ ml: 3 }}>Per Customer</Text>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Form.Item name={PromotionLimitType.MAX_PER_ORDER} noStyle>
              <InputNumber style={{ width: 60 }} />
            </Form.Item>
            <Text sx={{ ml: 3 }}>Per Customer Order</Text>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Form.Item name={PromotionLimitType.PER_PROMOTION} noStyle>
              <InputNumber style={{ width: 60 }} />
            </Form.Item>
            <Text sx={{ ml: 3 }}>Available</Text>
          </Box>
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Radio.Group>
            <Radio value="active">Active</Radio>
            <Radio value="hidden">Hidden</Radio>
            <Radio value="disabled">Disabled</Radio>
          </Radio.Group>
        </Form.Item>
      </Box>
      <SectionBoder />
      <Conditions conditions={promotion?.conditions || []} onChange={onChangeConditions} />
      <Effects effects={promotion?.effects || []} onChange={onChangeEffects} />
    </Box>
  );
};

const SectionBoder = () => {
  return <Box sx={{ borderBottom: '1px solid black', my: 4 }}></Box>;
};
