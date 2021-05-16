import React from 'react';
import { Col, Form, Input, Row } from 'antd';
import { DslProductFeature } from 'dsl-admin-base';
import _ from 'lodash';
interface Props {
  features: DslProductFeature[];
}

export const ProductAttributes: React.FC<Props> = ({ features }) => {
  return (
    <>
      {_.sortBy(features, (o) => o.position).map((feature) => {
        return (
          <Row align="middle" key={feature.id}>
            <Col span={4} className="mb-6">
              <label>{feature.name === 'Brand Owner' ? 'Brand' : feature.name}</label>
            </Col>
            <Col xs={8}>
              <Form.Item name={`feature_${feature.id}`}>
                <Input type="text" disabled={feature.readOnly} />
              </Form.Item>
            </Col>
          </Row>
        );
      })}
    </>
  );
};
