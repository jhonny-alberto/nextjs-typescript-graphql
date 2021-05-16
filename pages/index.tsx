import { Card, Col, List, Row, Select, Statistic, Timeline } from 'antd';
import Meta from 'antd/lib/card/Meta';
import {
  usePageData,
  RepositoryFactory,
  getQuery,
  BrandOwnerOrderWeeklyStats,
} from 'dsl-admin-base';
import moment from 'moment';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, BoxProps, Image, Text } from 'rebass';

const chartData = (weekData: BrandOwnerOrderWeeklyStats[] = []) => {
  const labels = Array(7)
    .fill(0)
    .map((_, idx) => moment().subtract({ d: idx }).format('ddd'))
    .reverse();
  const data = labels.reduce<number[]>((arr, next) => {
    const currentWeekData = weekData.find((wd) => {
      const [, month, day] = wd.dateTime.split('-');
      const orderDate = moment(wd.dateTime)
        .date(parseInt(day))
        .month(parseInt(month) - 1);
      return orderDate.format('ddd').toLocaleLowerCase() == next.toLocaleLowerCase();
    });

    arr = arr.concat([currentWeekData?.ordersCount || 0]);
    return arr;
  }, []);
  return {
    labels,
    datasets: [
      {
        label: 'Number of Orders',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: '#FE5568',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#FE5568',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#FE5568',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data,
      },
    ],
  };
};

const TimeLineDot: React.FC<BoxProps> = ({ sx }) => (
  <Box
    sx={{
      ...sx,
      height: 18,
      width: 18,
      borderRadius: '50%',
      backgroundColor: 'primary',
    }}
  />
);

const LineSeparator = () => (
  <Box width={40} mx={2}>
    <hr style={{ borderTop: '1px solid #fe5568' }} />
  </Box>
);

const TextLine: React.FC<{ date: string; title: string }> = ({ date, title, children }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', py: 2, cursor: 'pointer' }}>
    <Text width={60}>{date}</Text>
    <TimeLineDot sx={{ mx: 2 }} />
    <Text sx={{ fontWeight: 600, textTransform: 'uppercase' }}>{title}</Text>
    <LineSeparator />
    <Text>{children}</Text>
  </Box>
);

const { Option } = Select;

const UseDashboardParamTracker = () => {
  const router = useRouter();

  return {
    setDayFor: (forVal: 'OVERVIEW' | 'TOP_PRODUCT') => (val: number) => {
      const query: any = {
        overviewDay: router.query.overviewDay || 0,
        topProductDay: router.query.topProductDay || 0,
      };
      if (forVal == 'OVERVIEW') {
        query.overviewDay = val;
      }
      if (forVal == 'TOP_PRODUCT') {
        query.topProductDay = val;
      }

      router.push({ pathname: router.pathname, query });
    },
  };
};

const Dashboard: React.FC = () => {
  const { setDayFor } = UseDashboardParamTracker();
  const params = getQuery();
  const { data: overViewData } = usePageData(
    () => {
      return RepositoryFactory.get('bo').getBrandOwnerOverview({ days: params.overviewDay || 0 });
    },
    [],
    [params.overviewDay],
  );

  const { data: topProductData } = usePageData(
    () => {
      return RepositoryFactory.get('product').getTopProduct({ days: params.topProductDay || 0 });
    },
    [],
    [params.topProductDay],
  );

  const { data: orderWeeklyData } = usePageData(() => {
    return RepositoryFactory.get('order').getBrandOwnerOrdersWeeklyStats();
  });

  const today = moment().format('D MMM');

  const rectCardStyle = {
    color: '#fff',
    minHeight: 140,
  };

  const squareCardStyle = {
    minHeight: 140,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Box
        sx={{
          pt: 4,
          '.ant-col': { padding: '4px !important' },
          '.ant-statistic-content-suffix': { fontSize: '16px', display: 'block' },
        }}
      >
        <Row gutter={[64, 64]} align="top">
          <Col xs={24} xl={14}>
            <Row>
              <Col xs={24}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                  }}
                >
                  <Box>{today}, TODAY</Box>
                  <Select
                    onChange={setDayFor('OVERVIEW')}
                    defaultValue={0}
                    style={{ width: 120 }}
                    size="small"
                  >
                    <Option value={0}>TODAY</Option>
                    <Option value={1}>YESTERDAY</Option>
                  </Select>
                </Box>
              </Col>

              <Col xs={24} style={{ minHeight: '100%' }}>
                <Row gutter={8}>
                  <Col span={12}>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Card
                          bordered={false}
                          bodyStyle={{ ...rectCardStyle, backgroundColor: '#1b2638' }}
                        >
                          <Statistic
                            value={overViewData?.totalOrders || 0}
                            valueStyle={{ color: '#fff' }}
                            title={<Text color="#fff">Number of Orders</Text>}
                          />
                        </Card>
                      </Col>
                    </Row>
                    <Row gutter={[8, 8]}>
                      <Col span={24}>
                        <Card
                          bordered={false}
                          bodyStyle={{ ...rectCardStyle, backgroundColor: '#333c4c' }}
                        >
                          <Statistic
                            value={overViewData?.ordersValue || 0}
                            formatter={(v) => (parseInt(v.toString()) / 100).toFixed(2)}
                            prefix={'£'}
                            valueStyle={{ color: '#fff' }}
                            title={<Text color="#fff">Value of Orders</Text>}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <Card
                          bordered={false}
                          bodyStyle={{ ...squareCardStyle, backgroundColor: '#1c2638' }}
                        >
                          <Statistic
                            value={overViewData?.activeProducts || 0}
                            valueStyle={{ color: '#fff' }}
                            suffix="Active Products"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card
                          bordered={false}
                          bodyStyle={{ ...squareCardStyle, backgroundColor: '#606774' }}
                        >
                          <Statistic
                            value={overViewData?.orderingAccounts || 0}
                            valueStyle={{ color: '#fff' }}
                            suffix="Ordering Accounts"
                          />
                        </Card>
                      </Col>
                    </Row>
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <Card
                          bordered={false}
                          bodyStyle={{ ...squareCardStyle, backgroundColor: '#333c4c' }}
                        >
                          <Statistic
                            value={overViewData?.activePromotions || 0}
                            valueStyle={{ color: '#fff' }}
                            suffix="Active Promotions"
                          />
                        </Card>
                      </Col>
                      <Col span={12}>
                        <Card
                          bordered={false}
                          bodyStyle={{ ...squareCardStyle, backgroundColor: '#495160' }}
                        >
                          <Statistic
                            value={((overViewData?.productsVolume || 0) / 1000).toFixed(3)}
                            valueStyle={{ color: '#fff', fontSize: 18 }}
                            suffix="Volume (L)"
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col xs={24} xl={10} style={{ paddingBottom: 8 }}>
            <Card bordered={false} bodyStyle={{ padding: 0 }}>
              <Meta title="Top Products" style={{ textTransform: 'uppercase' }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 2,
                }}
              >
                <Box>{today}, TODAY</Box>
                <Box>
                  <Select
                    onChange={setDayFor('TOP_PRODUCT')}
                    defaultValue={0}
                    style={{ width: 120 }}
                    size="small"
                  >
                    <Option value={0}>TODAY</Option>
                    <Option value={1}>YESTERDAY</Option>
                  </Select>
                </Box>
              </Box>

              <List
                className="top-skus"
                itemLayout="horizontal"
                size="small"
                dataSource={topProductData}
                renderItem={(item, idx) => (
                  <Box
                    sx={{
                      display: 'flex',
                      borderBottom:
                        idx < (topProductData?.length || 0) - 1 ? '1px solid #EFEFEF' : '',
                      py: 2,
                      alignItems: 'center',
                    }}
                  >
                    <Image
                      sx={{
                        height: 48,
                        width: 48,
                        p: '2px',
                        border: '1px solid #EFEFEF',
                        objectFit: 'cover',
                      }}
                      src={item.thumbnailPath}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2, width: '100%' }}>
                      <Text sx={{ fontWeight: 500, textTransform: 'uppercase', mb: 1 }}>
                        {item.name}
                      </Text>
                      <Text sx={{ fontSize: 10, fontWeight: 500, color: 'midGrey' }}>
                        CODE: {item.code}
                      </Text>
                    </Box>
                  </Box>
                )}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card style={{ height: 300 }}>
              <Box sx={{ height: 250 }}>
                <Line data={chartData(orderWeeklyData)} options={{ maintainAspectRatio: false }} />
              </Box>
            </Card>
          </Col>

          <Col xs={24} xl={12}>
            <Card style={{ height: 300 }}>
              <Meta title="Rankings" style={{ textTransform: 'uppercase' }} />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  my: 2,
                }}
              >
                <Box sx={{ textTransform: 'uppercase' }}>Top 5 Promotions</Box>

                <Select defaultValue="PROMOTIONS" style={{ width: 130 }} size="small">
                  <Option value="PROMOTIONS">PROMOTIONS</Option>
                  <Option value="PRODUCTS">PRODUCTS</Option>
                </Select>
              </Box>

              <Box mt={4}>
                <Timeline style={{ padding: 0 }}>
                  <Timeline.Item key={1} dot={<TimeLineDot />}>
                    <Text sx={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 500 }}>
                      BUY ANY 2 CASES OF SMIRNOFF FLAVOURED AND GET £10 DISCOUNT
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item key={2} dot={<TimeLineDot />}>
                    <Text sx={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 500 }}>
                      BUY 3 STELLA GET 1 FREE
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item key={3} dot={<TimeLineDot />}>
                    <Text sx={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 500 }}>
                      COCA-COLA GIVE YOU ZERO
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item key={4} dot={<TimeLineDot />}>
                    <Text sx={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 500 }}>
                      FREE SCHWEPPES TONIC WHEN YOU BUY 6
                    </Text>
                  </Timeline.Item>
                  <Timeline.Item key={5} dot={<TimeLineDot />}>
                    <Text sx={{ textTransform: 'uppercase', fontSize: 10, fontWeight: 500 }}>
                      FREE SCHWEPPES TONIC WHEN YOU BUY 6
                    </Text>
                  </Timeline.Item>
                </Timeline>
              </Box>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card>
              <Meta title="Recommendations" style={{ textTransform: 'uppercase' }} />

              <Box sx={{ mt: 3 }}>
                <TextLine date="7th Jan" title="Add Images">
                  Add product images to SKU 123456
                </TextLine>
              </Box>

              <TextLine date="9th Jan" title="Add Allergens">
                Add allergens to SKU 123456
              </TextLine>

              <TextLine date="11th Jan" title="Add Description">
                Add product description to SKU 123456
              </TextLine>

              <TextLine date="12th Jan" title="Add Images">
                Add product images to SKU 123456
              </TextLine>
            </Card>
          </Col>

          <Col xs={24} xl={12}>
            <Card>
              <Meta title="Updates" style={{ textTransform: 'uppercase' }} />

              <Box sx={{ mt: 3 }}>
                <TextLine date="7th Jan" title="Product Approval">
                  Add product images to SKU 123456
                </TextLine>
              </Box>

              <TextLine date="9th Jan" title="Set Up Promotions">
                Add allergens to SKU 123456
              </TextLine>

              <TextLine date="11th Jan" title="New Product Report">
                Add product description to SKU 123456
              </TextLine>

              <TextLine date="12th Jan" title="Advanced Search">
                New advanced search added
              </TextLine>
            </Card>
          </Col>
        </Row>
      </Box>
    </>
  );
};

export default Dashboard;
