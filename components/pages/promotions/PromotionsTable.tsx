import { Table } from 'antd';
import { Promotion, TablePage, useDataTable, Date, TableItemLink } from 'dsl-admin-base';
import { ColumnsType } from 'antd/es/table';
import { Text } from 'rebass';
import { PAGES } from 'utils/constant';

const baseColumns: ColumnsType<Promotion> = [
  {
    title: 'Id',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    render: (name: string, item: Promotion) => {
      return <TableItemLink id={item.id} label={name} />;
    },
  },
  {
    title: 'Date Created',
    dataIndex: 'createdOn',
    align: 'center',
    render: (createdOn: string) => {
      return <Date value={createdOn} />;
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      return <Text sx={{ textTransform: 'capitalize' }}>{status}</Text>;
    },
  },
];

interface Props {
  promotions: Promotion[];
  totalItems: number;
  loading: boolean;
}

const PromotionsTable: React.FC<Props> = ({ promotions, totalItems, loading }) => {
  const { columns, onchange } = useDataTable(baseColumns);

  return (
    <TablePage
      pagination={{
        storageKey: PAGES.PROMOTIONS,
        type: 'Promotions',
        totalItems,
        noPagination: true,
      }}
    >
      <Table<Promotion>
        onChange={onchange}
        columns={columns}
        dataSource={promotions}
        pagination={false}
        rowKey="id"
        loading={loading}
        showSorterTooltip={false}
        expandIconColumnIndex={4}
      />
    </TablePage>
  );
};

export default PromotionsTable;
