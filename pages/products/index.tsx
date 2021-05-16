import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space } from 'antd';
import {
  SimpleSearch,
  CategoryTree,
  useEvent,
  useFetchTableData,
  RepositoryFactory,
  usePageData,
} from 'dsl-admin-base';
import ProductsTable from 'components/pages/products/ProductsTable';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Box, Text } from 'rebass';

const { Option } = Select;
const ProductRepository = RepositoryFactory.get('product');
const statusOptions = [
  {
    label: 'Status',
    value: '',
  },
];

export default function Index() {
  const router = useRouter();
  const save = useEvent('SAVE_PRICING');
  const isPricingPage = router.pathname.startsWith('/pricing');

  const { loading, data } = useFetchTableData(ProductRepository.get, 'products', {
    isPricingMode: isPricingPage,
  });

  const { data: categories } = usePageData(() => RepositoryFactory.get('category').get());

  return (
    <>
      <Head>
        <title>Products</title>
      </Head>

      <Box>
        <Box>
          {isPricingPage ? (
            <React.Fragment>
              <Text variant="pageHeading">
                Product Pricing{' '}
                <Button type="primary" onClick={save}>
                  Save
                </Button>
              </Text>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Text variant="pageHeading">
                Products{' '}
                <Link href="/products/[id]" as="/products/new">
                  <Button type="primary" className="text-caps">
                    Add product
                  </Button>
                </Link>
              </Text>
            </React.Fragment>
          )}
        </Box>
        <SimpleSearch initialValues={{ category: '', status: '' }}>
          <Form.Item name="searchText" label="&nbsp;">
            <Input style={{ width: 200 }} placeholder="Search" prefix={<SearchOutlined />} />
          </Form.Item>
          <Space size={7}>
            <Form.Item name="priceFrom" label="Price From">
              <Input placeholder="Price (£) " type="number" style={{ width: 120 }} />
            </Form.Item>
            <span>-</span>
            <Form.Item name="priceTo" label="Price To">
              <Input placeholder="Price (£) " type="number" style={{ width: 120 }} />
            </Form.Item>
          </Space>
          <Form.Item name="status" label="Status">
            <Select style={{ width: 120 }}>
              {statusOptions.map((status: any) => {
                return (
                  <Option value={status.value as string} key={status.value as string}>
                    {status.label}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <CategoryTree data={categories || []} label="Category" />
        </SimpleSearch>
        {/* <AdvancedSearch
          type="Products"
          savedSearches={data?.savedSearches}
          repository={ProductRepository}
        >
          <ProductsSearchForm></ProductsSearchForm>
        </AdvancedSearch> */}
        <Box variant="card">
          {isPricingPage ? null : ( // <PricingTable products={data?.products || []} loading={loading}></PricingTable>
            <ProductsTable
              products={data?.products || []}
              totalItems={data?.total || 0}
              loading={loading}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
