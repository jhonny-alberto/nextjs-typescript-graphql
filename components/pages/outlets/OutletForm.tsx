import React, { useState } from 'react';
import { Col, Select, Form, Input, Row } from 'antd';
import { Text } from 'rebass';
import { LegalStatus, OutletStyles } from 'dsl-admin-base';

interface OutletFormProps {
  initialValues: any;
}

const GeneralAddress: React.FC<{ prefix?: string }> = (props) => {
  const { prefix = '' } = props;

  return (
    <>
      <Col span={14}>
        <Form.Item name={`${prefix}title`} label="Title">
          <Select>
            <Select.Option value="Mr">MR</Select.Option>
            <Select.Option value="Ms">MS</Select.Option>
          </Select>
        </Form.Item>
      </Col>
      <Form.Item name={`${prefix}firstName`} label="First Name">
        <Input type="text" placeholder="First name" />
      </Form.Item>
      <Form.Item name={`${prefix}lastName`} label="Last Name">
        <Input type="text" placeholder="Last name" />
      </Form.Item>
      <Form.Item name={`${prefix}lineOne`} label="Address 1">
        <Input type="text" placeholder="Address" />
      </Form.Item>
      <Form.Item name={`${prefix}lineTwo`} label="Address 2">
        <Input type="text" placeholder="Address" />
      </Form.Item>
      <Form.Item name={`${prefix}city`} label="City">
        <Input type="text" placeholder="City" />
      </Form.Item>
      <Form.Item name={`${prefix}county`} label="County">
        <Input type="text" placeholder="Country" />
      </Form.Item>
      <Form.Item name={`${prefix}postcode`} label="Postcode">
        <Input type="text" placeholder="Postcode" />
      </Form.Item>
    </>
  );
};

const DeliveryForm: React.FC = () => (
  <>
    <Text fontWeight="bold" fontSize={16}>
      Delivery Address
    </Text>
    <GeneralAddress prefix="shipping_" />
    <Form.Item name="dropPointDescription" label="Description of Drop Point">
      <Input.TextArea rows={4} />
    </Form.Item>
  </>
);

const BillingForm: React.FC = () => (
  <>
    <Text fontWeight="bold" fontSize={16}>
      Billing Address
    </Text>
    <GeneralAddress prefix="billing_" />
  </>
);

const TailForm: React.FC<OutletFormProps> = ({ initialValues }) => {
  const [legalStatus, setLegalStatus] = useState(
    initialValues ? initialValues.legalStatus : undefined,
  );

  return (
    <>
      <Row>
        <Col span={8}>
          <Form.Item name="style" label="Outlet Style">
            <Select>
              {OutletStyles.map((style) => (
                <Select.Option key={style.value} value={style.value}>
                  {style.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={8}>
          <Form.Item name="legalStatus" label="Legal Status">
            <Select onChange={(e) => setLegalStatus(e)}>
              {LegalStatus.map((status) => (
                <Select.Option key={status.value} value={status.value}>
                  {status.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} offset={1}>
          {legalStatus === 'Ltd Company' && (
            <Form.Item name="companyName" label="Company Name">
              <Input placeholder="Company name" />
            </Form.Item>
          )}
          {legalStatus === 'Charity' && (
            <Form.Item name="charityNumber" label="Charity Number">
              <Input placeholder="Charity Number" />
            </Form.Item>
          )}
        </Col>
      </Row>
    </>
  );
};

export const OutletForm: React.FC<OutletFormProps> = (props) => {
  return (
    <>
      <Row>
        <Col xs={24} lg={12} style={{ paddingRight: 16 }}>
          <DeliveryForm />
        </Col>
        <Col xs={24} lg={12} style={{ paddingLeft: 16 }}>
          <BillingForm />
        </Col>
      </Row>
      <TailForm {...props} />
    </>
  );
};
