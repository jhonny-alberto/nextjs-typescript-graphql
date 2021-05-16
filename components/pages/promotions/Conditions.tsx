import { Condition, QUALIFYING_CONTIONS } from 'dsl-admin-base';
import { Box, Text } from 'rebass';
import { Col, Select, Row, Form, Menu, Dropdown } from 'antd';
import { ConditionControl } from './ConditionControl';
import { useState, useEffect } from 'react';

const { Option } = Select;
interface Props {
  conditions: Condition[];
  onChange: (value: Condition[]) => void;
}

export const Conditions: React.FC<Props> = ({ conditions, onChange }) => {
  const [activeConditions, setActiveConditions] = useState(conditions);

  const menu = (
    <Menu onClick={() => addCondition()}>
      <Menu.Item key="products">Products</Menu.Item>
    </Menu>
  );

  const onSingleChange = (id: number, condition: Condition) => {
    const value = activeConditions.map((o) => {
      if (o.id === id) {
        return condition;
      }

      return o;
    });

    setActiveConditions(value);
  };

  const addCondition = () => {
    if (!activeConditions.find((o) => o.type === 'product')) {
      setActiveConditions([
        {
          type: 'product',
          comparator: 'in',
          in: [],
          equalOrGreater: 0,
          equalOrLess: 0,
          greaterThan: 0,
          id: new Date().valueOf(),
          lessThan: 0,
          multiplesOf: 0,
          notIn: [],
          order: 0,
          promotionId: 0,
          result: 0,
        },
      ]);
    }
  };

  useEffect(() => {
    onChange(activeConditions);
  }, [activeConditions]);

  return (
    <Box>
      <Box>
        <Text variant="h4">qualifying conditions</Text>
        <Box sx={{ my: 3 }}>
          <Row align="middle">
            <Col span={4}>
              <Box sx={{ '.ant-select': { width: '100%' } }}>
                <Form.Item name="qualifying" noStyle>
                  <Select placeholder="All">
                    {QUALIFYING_CONTIONS.map((item) => {
                      return (
                        <Option value={item.value} key={item.value}>
                          {item.label}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Box>
            </Col>
            <Text sx={{ fontSize: 2, ml: 2, textTransform: 'capitalize' }}>
              Conditions Are Applicable
            </Text>
            <Dropdown overlay={menu} trigger={['click']}>
              <Text
                sx={{
                  textTransform: 'uppercase',
                  ml: 'auto',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                Add Condition
              </Text>
            </Dropdown>
          </Row>
        </Box>
      </Box>
      {activeConditions.map((condition) => {
        if (condition.type === 'product') {
          return (
            <ConditionControl
              condition={condition}
              key={condition.id}
              onChange={(e) => onSingleChange(condition.id, e)}
            />
          );
        }
      })}
    </Box>
  );
};
