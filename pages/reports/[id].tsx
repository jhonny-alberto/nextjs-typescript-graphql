import ReportDetailTable from '@components/pages/reports/ReportDetailTable';
import {
  AppBreadcrumb,
  AppSpin,
  BreadcrumbItem,
  Report,
  RepositoryFactory,
  useAdminForm,
} from 'dsl-admin-base';
import React from 'react';
import { Box } from 'rebass';

const ReportsRepository = RepositoryFactory.get('reports');

const ReportDetail: React.FC = () => {
  const { loading: loadingReport, data: report } = useAdminForm(ReportsRepository.getReportDetail);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Reports',
      href: '/reports',
    },
    {
      label: report?.name || 'Report Detail',
      href: '',
    },
  ];

  const loading = loadingReport;

  return (
    <div>
      <Box variant="breadcrumbHeader">
        <AppBreadcrumb items={breadcrumbs}></AppBreadcrumb>
      </Box>
      {loading ? (
        <AppSpin></AppSpin>
      ) : (
        <Box variant="card" sx={{}}>
          <ReportDetailTable report={report as Report} loading={loadingReport} />
        </Box>
      )}
    </div>
  );
};

export default ReportDetail;
