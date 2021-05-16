import { Form, Input, Row, Space } from 'antd';
import MagnifierIcon from 'assets/icons/magnifier.svg';
import { OrdersSearchForm } from 'components/pages/orders/OrdersSearchForm';
import OrdersTable from 'components/pages/orders/OrdersTable';
import { AdminOrder, AppSpin } from 'dsl-admin-base';
import { AdvancedSearch } from 'dsl-admin-base/components/AdvancedSearch';
import { SimpleSearch } from 'dsl-admin-base/components/SimpleSearch';
import { useFetchTableData } from 'dsl-admin-base/hooks/fetch-table-data';
import { RepositoryFactory } from 'dsl-admin-base/repositories/RepositoryFactory';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Box, Text } from 'rebass';

const OrderRepository = RepositoryFactory.get('order');

const Index: React.FC = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const { loading, data } = useFetchTableData(OrderRepository.get, 'orders', {});

  useEffect(() => {
    if (loading == true) {
      setOrders([]);
    } else {
      setOrders(data ? data.adminOrders : []);
    }
  }, [data, loading]);

  if (loading) return <AppSpin />;

  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>

      <Box>
        <Row justify="space-between">
          <Text variant="pageHeading">Orders</Text>
          <span></span>
        </Row>
        <SimpleSearch>
          <Form.Item name="outlet" label="&nbsp;">
            <Input
              style={{ width: 200, height: 40 }}
              placeholder="Search"
              prefix={<MagnifierIcon style={{ marginRight: 10 }} />}
            />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input style={{ width: 200 }} placeholder="Email" />
          </Form.Item>
          <Space size={7}>
            <Form.Item name="totalFrom" label="Total From">
              <Input placeholder="Total (£) " type="number" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="totalTo" label="Total To">
              <Input placeholder="Total (£) " type="number" style={{ width: 120 }} />
            </Form.Item>
          </Space>
        </SimpleSearch>
        <AdvancedSearch
          type="Orders"
          repository={{
            createSavedSearch: () => Promise.resolve(''),
            deleteSavedSearch: () => Promise.resolve(),
          }}
        >
          <OrdersSearchForm></OrdersSearchForm>
        </AdvancedSearch>
        <Box variant="card">
          <OrdersTable totalCount={data?.totalCount || 0} data={orders} loading={loading} />
        </Box>
      </Box>
    </>
  );
};

export default Index;
