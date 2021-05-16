import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { AppPagination, Date, Report, TableItemLink, useDataTable } from 'dsl-admin-base';

interface Props {
  loading: boolean;
  reports: Report[];
  totalItems: number;
}

const ReportsTable: React.FC<Props> = ({ reports, loading, totalItems }) => {
  const baseColumns: ColumnsType<Report> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (name: string, report: Report) => {
        return <TableItemLink label={name} id={report.id} />;
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string, report: Report) => {
        return <TableItemLink label={type} id={report.id} />;
      },
    },
    {
      title: 'Created',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: (createdOn: string, _: Report) => {
        return <Date value={createdOn} />;
      },
    },
  ];

  const { columns, selectedRowKeys, rowSelection, onchange } = useDataTable(baseColumns);

  const menu = [
    {
      label: 'Delete Selected',
      value: 'delete',
    },
  ];

  return (
    <>
      <AppPagination
        storageKey="products"
        type="Products"
        totalItems={totalItems}
        menu={menu}
        qtySelected={selectedRowKeys.length}
      ></AppPagination>
      <Table<Report>
        onChange={onchange}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={reports}
        pagination={false}
        rowKey="id"
        loading={loading}
        showSorterTooltip={false}
      />
    </>
  );
};

export default ReportsTable;
