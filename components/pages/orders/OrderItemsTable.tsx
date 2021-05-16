import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Currency, DslOrderItem } from 'dsl-admin-base';
import { Image, Text } from 'rebass';

interface Props {
  items: DslOrderItem[];
}

const columns: ColumnsType<DslOrderItem> = [
  {
    title: 'code',
    dataIndex: 'code',
    key: 'code',
    sorter: true,
    render: (code) => <Text variant="caps">{code}</Text>,
  },
  {
    title: 'Image',
    dataIndex: 'mainImage',
    key: 'mainImage',
    render: (mainImage) => <Image variant="orderItemImage" src={mainImage} alt="order-item-img" />,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (value: number) => {
      return <Text sx={{ fontSize: 12 }}>{value}</Text>;
    },
  },
  {
    title: 'Qty',
    dataIndex: 'qty',
    key: 'qty',
    render: (value: number) => {
      return <Text sx={{ fontWeight: 600, fontSize: 16 }}>{value}</Text>;
    },
  },
  {
    title: 'Unit Price',
    dataIndex: 'price',
    key: 'price',
    render: (value: number) => {
      return (
        <Text sx={{ fontWeight: 600, fontSize: 16 }}>
          <Currency value={value}></Currency>
        </Text>
      );
    },
  },
  {
    title: 'Total (Ex VAT)',
    dataIndex: 'total',
    key: 'subTotal',
    render: (total: number) => {
      return (
        <Text sx={{ fontWeight: 600, fontSize: 16 }}>
          <Currency value={total}></Currency>
        </Text>
      );
    },
  },
];

export const OrderItemsTable: React.FC<Props> = ({ items }) => {
  return (
    <Table
      columns={columns}
      dataSource={items}
      pagination={false}
      rowKey="id"
      className="order-items-table"
    />
  );
};
