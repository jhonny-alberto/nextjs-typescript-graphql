import { Row } from 'antd';
import { Box, Text } from 'rebass';
import { LocationRestriction } from './LocationRestriction';
import { DslProduct, usePageData, RepositoryFactory, AppSpin, DataSrcType } from 'dsl-admin-base';
import { useMemo } from 'react';

interface Props {
  product?: DslProduct;
}

export const LocationRestrictionForm: React.FC<Props> = ({ product }) => {
  const { data, loading } = usePageData(() => {
    return RepositoryFactory.get('product').getProductPostCodeRestriction(product?.id || '0');
  });

  const adminRecords = useMemo(() => {
    return (data || [])
      .filter((o) => !o.deliveryAvailable && o.brandLocked)
      .map((o) => o.postcode.postcode)
      .join(', ');
  }, [data]);

  const brandOwnerRecords: DataSrcType[] = useMemo(() => {
    return (data || [])
      .filter((o) => !o.brandLocked)
      .map((o) => ({
        key: o.postcode.id.toString(),
        title: o.postcode.postcode,
        description: o.postcode.postcode,
      }));
  }, [data]);

  const selectedItems: string[] = useMemo(() => {
    return (data || []).filter((o) => o.id && !o.brandLocked).map((o) => o.postcode.id.toString());
  }, [data]);

  if (loading) {
    return <AppSpin />;
  }

  return (
    <Box>
      <Row justify="space-between">
        <Text fontWeight={600} fontSize={16} mb="4">
          Starstock Location Restrictions
        </Text>
        <Text>{adminRecords}</Text>
      </Row>
      <Text fontWeight={600} fontSize={16} mt="3" mb="4">
        Brand Owner Location Restrictions
      </Text>
      <LocationRestriction dataSrc={brandOwnerRecords} defaultKeys={selectedItems} />
    </Box>
  );
};
