import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  DslOutlet,
  OutletAddressBook,
  useDataTable,
  TablePage,
  TableItemLink,
} from 'dsl-admin-base';
import { Text } from 'rebass';
import { PAGES } from 'utils/constant';
import _ from 'lodash';

const getShippingAddress = (addressBook: OutletAddressBook) => {
  return addressBook.addresses?.find((o) => +o.id === addressBook.shippingId);
};

const baseColumns: ColumnsType<DslOutlet> = [
  {
    title: 'outlet name',
    dataIndex: 'name',
    key: 'name',
    sorter: true,
    render: (name: string, outlet: DslOutlet) => {
      return <TableItemLink label={name} id={outlet.id} />;
    },
  },
  {
    title: 'Address',
    dataIndex: 'addressBook',
    key: 'addressBook',
    sorter: true,
    render: (addressBook: OutletAddressBook) => {
      const shippingAddress = getShippingAddress(addressBook);
      return <Text>{shippingAddress?.lineOne}</Text>;
    },
  },
  {
    title: 'City',
    dataIndex: 'addressBook',
    key: 'addressBook',
    sorter: true,
    render: (addressBook: OutletAddressBook) => {
      const shippingAddress = getShippingAddress(addressBook);
      return <Text>{shippingAddress?.city}</Text>;
    },
  },
  {
    title: 'County',
    dataIndex: 'addressBook',
    key: 'addressBook',
    sorter: true,
    render: (addressBook: OutletAddressBook) => {
      const shippingAddress = getShippingAddress(addressBook);
      return <Text>{shippingAddress?.county}</Text>;
    },
  },
  {
    title: 'postcode',
    dataIndex: 'addressBook',
    key: 'addressBook',
    sorter: true,
    render: (addressBook: OutletAddressBook) => {
      const shippingAddress = getShippingAddress(addressBook);
      return <Text>{shippingAddress?.postcode}</Text>;
    },
  },
  {
    title: 'style',
    dataIndex: 'style',
    key: 'style',
    sorter: true,
  },
  {
    title: 'Outlet status',
    dataIndex: ['status', 'displayName'],
    key: 'status',
    sorter: true,
  },
];

interface Props {
  outlets: DslOutlet[];
  totalItems: number;
  loading: boolean;
}

export const OutletsTable: React.FC<Props> = ({ outlets, totalItems, loading }) => {
  const { columns, onchange } = useDataTable(baseColumns);

  return (
    <TablePage
      pagination={{
        storageKey: PAGES.OUTLETS,
        type: 'Outlets',
        totalItems,
      }}
    >
      <Table<DslOutlet>
        onChange={onchange}
        columns={columns}
        dataSource={outlets}
        pagination={false}
        rowKey="id"
        loading={loading}
        showSorterTooltip={false}
      />
    </TablePage>
  );
};
