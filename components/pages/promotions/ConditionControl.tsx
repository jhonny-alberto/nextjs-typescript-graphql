import { Box, Text } from 'rebass';
import { Row, Space, Table, Button, Form, Input } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined } from '@ant-design/icons';
import {
  useDataTable,
  Condition,
  usePageData,
  RepositoryFactory,
  DslProduct,
  ProductPicker,
} from 'dsl-admin-base';
import { useMemo, useState } from 'react';

interface Props {
  condition: Condition;
  onChange: (condition: Condition) => void;
}

export const ConditionControl: React.FC<Props> = ({ condition, onChange }) => {
  const [showProductPicker, setShowProductPicker] = useState(false);

  const productIds = condition?.in || [];

  const { data, loading } = usePageData(
    () => {
      return Promise.all(
        productIds.map((o) => RepositoryFactory.get('product').getProductDetail(o)),
      );
    },
    [],
    [productIds.join(',')],
  );

  const products = useMemo(() => {
    return (data || []).filter((o) => o);
  }, [data]) as DslProduct[];

  const baseColumns: ColumnsType<DslProduct> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '40%',
    },
    // {
    //   title: 'Qty',
    //   dataIndex: 'qty',
    //   key: 'qty',
    //   align: 'center',
    //   width: '30%',
    //   render: () => {
    //     return (
    //       <Box sx={{ maxWidth: 100 }} mx="auto">
    //         <Input placeholder="" type="number"></Input>
    //       </Box>
    //     );
    //   },
    // },
    {
      title: '',
      align: 'right',
      dataIndex: 'id',
      render: (id: number) => {
        return (
          <Box sx={{ fontSize: '1.25rem', cursor: 'pointer' }} onClick={() => onRemoveProduct(id)}>
            <DeleteOutlined />
          </Box>
        );
      },
    },
  ];

  const onRemoveProduct = (id: number) => {
    onChange({ ...condition, in: productIds.filter((o) => o != id) });
  };

  const { columns } = useDataTable(baseColumns);

  const onChangeSelectedProducts = (items: DslProduct[]) => {
    onChange({ ...condition, in: items.map((o) => +o.id) });
  };

  return (
    <Box mb="4" p="3" bg="lightGrey">
      <Row justify="space-between" align="middle">
        <Text variant="h4">products</Text>
        <Space>
          <Button type="primary" onClick={() => setShowProductPicker(true)}>
            Add Products
          </Button>
          <ProductPicker
            onCancel={() => setShowProductPicker(false)}
            selectedProducts={products}
            onChange={onChangeSelectedProducts}
            visible={showProductPicker}
          />
        </Space>
      </Row>
      <Box sx={{ mb: 3, mt: 3, display: 'flex' }}>
        <Text sx={{ display: 'inline-block', mr: 3, fontSize: 2, pt: 1 }}>Qty</Text>
        <Form.Item name="qty" rules={[{ required: true, message: 'Qty is required' }]}>
          <Input type="number" style={{ width: 100 }} />
        </Form.Item>
      </Box>
      <Table<DslProduct>
        className="grey-table"
        columns={columns}
        dataSource={products}
        pagination={false}
        rowKey="id"
        loading={loading}
        showSorterTooltip={false}
        expandIconColumnIndex={4}
      />
    </Box>
  );
};
