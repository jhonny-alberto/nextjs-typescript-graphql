import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Report, ReportDataCol, ReportRow, useDataTable } from 'dsl-admin-base';

interface Props {
  loading: boolean;
  report: Report;
}

const ReportDetailTable: React.FC<Props> = ({ report, loading }) => {
  if (!report || !report.data) {
    return null;
  }

  const row = (report.data[0] as ReportRow).columns;

  const baseColumns: ColumnsType<ReportDataCol> =
    row?.map((x, idx) => ({
      title: x.name,
      key: idx,
      dataIndex: idx,
    })) || [];

  const { columns } = useDataTable(baseColumns);

  const dataSource: any = report.data.map((x, idx) => {
    const cols = x.columns?.reduce((acc, col, idx) => ({ ...acc, [idx]: col.value }), {});

    return {
      key: idx,
      ...cols,
    };
  });

  return (
    <>
      <Table<ReportRow>
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        rowKey="key"
        loading={loading}
        showSorterTooltip={false}
      />
    </>
  );
};

export default ReportDetailTable;
