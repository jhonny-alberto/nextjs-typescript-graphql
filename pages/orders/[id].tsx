import { DslOrder } from '@dsl-admin-base/graphql/generated/graphql';
import { Col, Row } from 'antd';
import { NextBack } from 'components/app/NextBack';
import { OrderItemsTable } from 'components/pages/orders/OrderItemsTable';
import { AppSpin, BreadcrumbItem, Date } from 'dsl-admin-base';
import { AppBreadcrumb } from 'dsl-admin-base/components/AppBreadcrumb';
import { Currency } from 'dsl-admin-base/components/Currency';
import { usePageData } from 'dsl-admin-base/hooks/fetch-page-data';
import { RepositoryFactory } from 'dsl-admin-base/repositories/RepositoryFactory';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Text } from 'rebass';

const OrderRepository = RepositoryFactory.get('order');
const SIMPLE_TEXT_SIZE = 14;

const OrderDetail: React.FC = () => {
  const router = useRouter();
  const { loading, data } = usePageData(() => {
    return OrderRepository.getOrderDetail(Number(router.query.id));
  }, ['id']);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Orders',
      href: '/orders',
    },
  ];

  if (data) {
    breadcrumbs.push({
      label: `${data.reference} - ${data?.outletName}`,
      href: router.pathname,
    });
  }

  const renderShippingAddress = (o: DslOrder) => {
    return (
      <Text sx={{ textAlign: 'left', fontSize: SIMPLE_TEXT_SIZE }}>
        <Text sx={{ fontWeight: 600 }}>
          {o.firstname} {o.lastname}
        </Text>
        {o.shippingLine1 && <Text>{o.shippingLine1}</Text>}
        {o.shippingLine2 && <Text>{o.shippingLine2}</Text>}
        {o.shippingCity && <Text>{o.shippingCity}</Text>}
        {(o.shippingCounty || o.shippingPostcode) && (
          <Text>
            {o.shippingCounty} {o.shippingPostcode}
          </Text>
        )}
        {o.shippingCountry && <Text>{o.shippingCountry}</Text>}
      </Text>
    );
  };

  const renderBillingAddress = (o: DslOrder) => {
    return (
      <Text sx={{ textAlign: 'left', fontSize: SIMPLE_TEXT_SIZE }}>
        <Text sx={{ fontWeight: 600 }}>
          {o.firstname} {o.lastname}
        </Text>
        {o.billingLine1 && <Text>{o.billingLine1}</Text>}
        {o.billingLine2 && <Text>{o.billingLine2}</Text>}
        {o.billingCity && <Text>{o.billingCity}</Text>}
        {(o.billingCounty || o.billingPostcode) && (
          <Text>
            {o.billingCounty} {o.billingPostcode}
          </Text>
        )}
        {o.billingCountry && <Text>{o.billingCountry}</Text>}
      </Text>
    );
  };

  return (
    <>
      <Head>
        <title>
          Order: {data?.reference} - {data?.outletName}
        </title>
      </Head>
      <div>
        <Box variant="breadcrumbHeader">
          <AppBreadcrumb items={breadcrumbs}></AppBreadcrumb>
          <NextBack basePath="/orders"></NextBack>
        </Box>
        {loading && <AppSpin />}
        {!loading && data == null && (
          <Text style={{ fontSize: 16 }}>Could not retrieve order details</Text>
        )}
        {!loading && data && (
          <Row gutter={80}>
            <Col xs={15}>
              <Box variant="card">
                <OrderItemsTable items={data.orderItems || []}></OrderItemsTable>
              </Box>
            </Col>
            <Col xs={9}>
              <Box sx={{ backgroundColor: 'lightGrey', mb: 20, mt: 3 }}>
                <Box sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'auto auto',
                      fontSize: 16,
                      gap: 10,
                      wordBreak: 'break-word',
                    }}
                  >
                    <Text sx={{ fontSize: SIMPLE_TEXT_SIZE - 2, fontWeight: 600 }}>
                      SUBTOTAL (Ex vat)
                    </Text>
                    <Text sx={{ fontSize: SIMPLE_TEXT_SIZE - 2 }} textAlign="right">
                      <Currency
                        value={data.orderItems.reduce((total, n) => {
                          total = total + n.total;
                          return total;
                        }, 0)}
                      />
                    </Text>
                    <Text sx={{ fontSize: SIMPLE_TEXT_SIZE - 2, fontWeight: 600 }}>ORDER DATE</Text>
                    <Text sx={{ fontSize: SIMPLE_TEXT_SIZE - 2 }} textAlign="right">
                      <Date format={'DD/MM/YYYY HH:mm'} value={data.createdOn} />
                    </Text>
                    <Text sx={{ fontSize: SIMPLE_TEXT_SIZE - 2, fontWeight: 600 }}>
                      ORDER MADE BY
                    </Text>
                    <Text sx={{ fontSize: SIMPLE_TEXT_SIZE - 2 }} textAlign="right">
                      {data.firstname} {data.lastname}
                    </Text>
                    <Text sx={{ fontSize: SIMPLE_TEXT_SIZE - 2, fontWeight: 600 }}>
                      CONTACT DETAILS
                    </Text>
                    <Text sx={{ fontSize: SIMPLE_TEXT_SIZE - 2 }} textAlign="right">
                      {/*data.customer.email*/}
                    </Text>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ backgroundColor: 'lightGrey', p: 3 }}>
                <Text variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
                  PROMOTIONS APPLIED
                </Text>
              </Box>
              <Box sx={{ backgroundColor: 'lightGrey', p: 3, mb: 20, mt: 3 }}>
                <Text variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
                  DELIVERY ADDRESS
                </Text>
                {renderShippingAddress(data)}
              </Box>
              <Box sx={{ backgroundColor: 'lightGrey', p: 3 }}>
                <Text variant="h5" sx={{ fontWeight: 600, mb: 4 }}>
                  BILLING ADDRESS
                </Text>
                {renderBillingAddress(data)}
              </Box>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default OrderDetail;
