import React from 'react';
import { Input, Form, Button } from 'antd';
import {
  SimpleSearch,
  RepositoryFactory,
  BreadcrumbItem,
  useFetchTableData,
  AppBreadcrumb,
  OutletPicker,
} from 'dsl-admin-base';
import { OutletPricingTable } from 'components/pages/pricing/OutletPricingTable';
import { Box, Text } from 'rebass';
import { SearchOutlined } from '@ant-design/icons';
import { PAGES } from 'utils/constant';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Index() {
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();
  const { loading, data } = useFetchTableData(RepositoryFactory.get('outlet').get, PAGES.OUTLETS, {
    pricing: true,
  });

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Outlet Pricing',
      href: '/outlets',
    },
  ];

  const onSelectOutlet = (id: number) => {
    setShowPicker(false);
    router.push(`/pricing/outlets/${id}`);
  };

  return (
    <Box>
      <Box>
        <Text variant="pageHeading">
          <AppBreadcrumb items={breadcrumbs}></AppBreadcrumb>
          <Button type="primary" onClick={() => setShowPicker(true)} className="text-caps">
            Add Outlet Pricing
          </Button>
          <OutletPicker
            visible={showPicker}
            onCancel={() => setShowPicker(false)}
            onSelect={onSelectOutlet}
          />
        </Text>
      </Box>
      <SimpleSearch initialValues={{ status: '', style: '' }}>
        <Form.Item name="search" label="&nbsp;">
          <Input style={{ width: 200 }} placeholder="SEARCH" prefix={<SearchOutlined />} />
        </Form.Item>
      </SimpleSearch>
      <Box variant="card">
        <OutletPricingTable
          outlets={data?.outlets || []}
          loading={loading}
          totalItems={data?.totalCount || 0}
        />
      </Box>
    </Box>
  );
}
