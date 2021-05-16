import { InfoCircleFilled } from '@ant-design/icons';
import { Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AdminOrder, AppPagination, Currency, DslOrder, useDataTable } from 'dsl-admin-base';
import { useRouter } from 'next/router';
import { Text } from 'rebass';

const outerColumns: ColumnsType<AdminOrder> = [
  {
    title: 'Order Reference',
    dataIndex: 'reference',
    key: 'reference',
    sorter: true,
    render: (d) => {
      return <Text>{d}</Text>;
    },
  },
  {
    title: 'outlet',
    dataIndex: 'outletName',
    key: 'outletName',
    sorter: true,
    render: (d) => {
      return <Text>{d}</Text>;
    },
  },
  {
    title: 'placed by',
    dataIndex: 'userName',
    key: 'userName',
    sorter: true,
    render: (d) => {
      return <Text>{d}</Text>;
    },
  },
  {
    title: 'amount paid',
    dataIndex: 'total',
    key: 'total',
    sorter: true,
    render: (d) => {
      return <Currency value={d} />;
    },
  },
];

const baseColumns: ColumnsType<DslOrder> = [
  {
    title: 'Order ID',
    dataIndex: 'id',
    key: 'id',
    render: (d) => {
      return <Text>{d}</Text>;
    },
  },
  {
    title: 'distributor',
    dataIndex: 'distributorName',
    key: 'distributorName',
    render: (d) => {
      return <Text>{d}</Text>;
    },
  },
  {
    title: 'status',
    dataIndex: ['status', 'displayName'],
    key: 'status',
    render: (d) => {
      return <Text>{d}</Text>;
    },
  },
  {
    title: 'date',
    dataIndex: 'createdOn',
    key: 'createdOn',
    render: (d) => {
      return <Text>{d.split('T')[0].split('-').reverse().join('/')}</Text>;
    },
  },
  {
    title: 'amount paid',
    dataIndex: 'total',
    key: 'total',
    render: (d) => {
      return <Currency value={d} />;
    },
  },
];

interface Props {
  loading: boolean;
  data: AdminOrder[];
  totalCount: number;
}

const calculateTotal = (total: number, next: AdminOrder) => {
  total = total + next.total;
  return total;
};

const OrdersTable: React.FC<Props> = ({ data, loading, totalCount }) => {
  const { onchange, rowSelection, selectedRowKeys, columns } = useDataTable(baseColumns);
  const router = useRouter();

  const onRowClick = (d: DslOrder) => ({
    onClick: () => router.push(`${router.pathname}/[id]`, `${router.pathname}/${d.id}`),
  });

  const expandedRow = (row: AdminOrder) => (
    <Table
      columns={columns}
      dataSource={row.distributorOrders as DslOrder[]}
      rowKey="id"
      pagination={false}
      onRow={onRowClick}
    />
  );

  const onClickBulk = async (key: string) => {
    if (key === 'print') {
      const form = document.getElementById('orders_hidden_form') as HTMLFormElement;
      if (form) {
        form.submit();
      }
    }

    if (key === 'printPDF') {
      // await OrderRepository.downloadPdf(selectedRowKeys as string[]);
    }

    if (key === 'export') {
      const page = parseInt(router.query.currentPage as string) || 1;
      // await OrderRepository.exportOrders(page, selectedRowKeys as string[]);
      router.replace({
        pathname: '/data-export',
        query: {
          type: 'orders',
          currentPage: page,
        },
      });
    }
  };

  const menu = [
    {
      label: 'Invoice bulk print (PDF)',
      value: 'printPDF',
    },
    {
      label: 'Invoice bulk print',
      value: 'print',
    },
    {
      label: 'Export selected',
      value: 'export',
    },
  ];

  return (
    <>
      <form
        style={{ display: 'none' }}
        method="POST"
        target="_blank"
        action="/api"
        id="orders_hidden_form"
      >
        <input type="text" name="dispatch[orders.bulk_print]" value="1" readOnly />
        {selectedRowKeys.map((id) => {
          return <input key={id} type="text" name="order_ids[]" value={id} readOnly />;
        })}
      </form>
      <AppPagination
        storageKey="orders"
        type="Orders"
        totalItems={totalCount}
        qtySelected={selectedRowKeys.length}
        menu={menu}
        onClickBulk={onClickBulk}
      ></AppPagination>
      <Table<AdminOrder>
        className="clickable-row"
        onChange={onchange}
        rowSelection={rowSelection}
        columns={outerColumns}
        dataSource={data}
        pagination={false}
        rowKey="reference"
        loading={loading}
        showSorterTooltip={false}
        expandable={{
          defaultExpandAllRows: true,
          expandedRowRender: expandedRow,
          expandRowByClick: true,
        }}
        summary={() => {
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={columns.length - 1}></Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text sx={{ pt: 3 }} textAlign="right" variant="heading">
                    Total (ex VAT):
                  </Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text sx={{ pt: 3 }} fontSize="14px">
                    <Currency value={data.reduce(calculateTotal, 0)}></Currency>
                    <Tooltip title="Total of all orders on the page">
                      <InfoCircleFilled
                        style={{ color: '#FE5568', marginLeft: 5 }}
                      ></InfoCircleFilled>
                    </Tooltip>
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </>
  );
};

export default OrdersTable;
