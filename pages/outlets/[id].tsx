import { Button, Space, Form } from 'antd';
import {
  AppBreadcrumb,
  BreadcrumbItem,
  RepositoryFactory,
  useAdminForm,
  AppSpin,
  parseNestedFormValues,
} from 'dsl-admin-base';
import { Box } from 'rebass';
import { OutletForm } from 'components/pages/outlets/OutletForm';
import { OutletBanner } from 'components/pages/outlets/OutletBanner';

const OutletRepository = RepositoryFactory.get('outlet');

const Outlet: React.FC = () => {
  const { data, loading, isAdd, formInstance } = useAdminForm(OutletRepository.getById);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Outlets',
      href: '/outlets',
    },
  ];

  if (isAdd) {
    breadcrumbs.push({ label: 'New', href: '#' });
  } else if (data) {
    breadcrumbs.push({ label: data.name, href: '#' });
  }

  const shippingAddress = data?.addressBook.addresses?.find(
    (o) => +o.id === data.addressBook.shippingId,
  );
  const billingAddress = data?.addressBook.addresses?.find(
    (o) => +o.id === data.addressBook.billingId,
  );

  const initialValues = data
    ? parseNestedFormValues(
        {
          status: data.status.id,
          companyName: data.companyName,
          dropPointDescription: data.dropPointDescription,
          legalStatus: data.legalStatus,
          style: data.style,
          charityNumber: data.charityNumber,
        },
        { shipping: shippingAddress, billing: billingAddress },
      )
    : undefined;

  return (
    <>
      <Box variant="breadcrumbHeader">
        <AppBreadcrumb items={breadcrumbs}></AppBreadcrumb>
        <Space>
          <Button type="primary" className="text-caps" disabled>
            Save
          </Button>
        </Space>
      </Box>
      {loading ? (
        <AppSpin></AppSpin>
      ) : (
        <>
          {data && <OutletBanner outlet={data} />}
          <Box variant="card" sx={{ pointerEvents: 'none' }}>
            <Form layout="vertical" initialValues={initialValues} ref={formInstance}>
              <OutletForm initialValues={initialValues} />
            </Form>
          </Box>
        </>
      )}
    </>
  );
};

export default Outlet;
