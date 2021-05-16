import ReportsTable from '@components/pages/reports/ReportsTable';
import { Button } from 'antd';
import { RepositoryFactory, useFetchTableData } from 'dsl-admin-base';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Box, Text } from 'rebass';

const ReportsRepository = RepositoryFactory.get('reports');

const Report: React.FC = () => {
  const { loading, data } = useFetchTableData(ReportsRepository.get, 'reports', {});

  return (
    <>
      <Head>
        <title>Reports</title>
      </Head>

      <Box>
        <Box>
          <React.Fragment>
            <Text variant="pageHeading">
              Products{' '}
              <Link href="/reports" as="/products/new">
                <Button type="primary" className="text-caps">
                  Add Report
                </Button>
              </Link>
            </Text>
          </React.Fragment>
        </Box>
        <Box variant="card">
          <ReportsTable
            reports={data?.reports || []}
            totalItems={data?.total || 0}
            loading={loading}
          />
        </Box>
      </Box>
    </>
  );
};

export default Report;
