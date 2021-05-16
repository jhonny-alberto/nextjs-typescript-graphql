import React from 'react';
import { Input, Form, Row, Button } from 'antd';
import {
  RepositoryFactory,
  SimpleSearch,
  BreadcrumbItem,
  useFetchTableData,
  AppBreadcrumb,
} from 'dsl-admin-base';
import PromotionsTable from 'components/pages/promotions/PromotionsTable';
import { Box, Text } from 'rebass';
import { SearchOutlined } from '@ant-design/icons';
import { PAGES } from 'utils/constant';
import Link from 'next/link';
import { useRouter } from 'next/router';

const PromotionRepository = RepositoryFactory.get('promotion');

export default function Index() {
  const router = useRouter();
  const { loading, data } = useFetchTableData(PromotionRepository.get, PAGES.PROMOTIONS);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Promotions',
      href: `/${PAGES.PROMOTIONS}`,
    },
  ];

  return (
    <Box>
      <Box>
        <Text variant="pageHeading">
          <Row>
            <Box>
              <AppBreadcrumb items={breadcrumbs}></AppBreadcrumb>
            </Box>
          </Row>
          <Box>
            <Link href={`${router.pathname}/new`}>
              <Button type="primary" className="text-caps">
                Add NEW
              </Button>
            </Link>
          </Box>
        </Text>
      </Box>
      <SimpleSearch initialValues={{ bo: '' }}>
        <Form.Item name="searchText">
          <Box sx={{ width: 200 }}>
            <Input placeholder="Search" prefix={<SearchOutlined />} />
          </Box>
        </Form.Item>
      </SimpleSearch>
      <Box variant="card">
        <PromotionsTable promotions={data || []} loading={loading} totalItems={data?.length || 0} />
      </Box>
    </Box>
  );
}
