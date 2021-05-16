import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DslOutlet, reloadPage, useDataTable, TablePage, TableItemLink } from 'dsl-admin-base';
import { PAGES } from 'utils/constant';
import _ from 'lodash';

const baseColumns: ColumnsType<DslOutlet> = [
  {
    title: 'account no',
    dataIndex: 'companyNumber',
    key: 'companyNumber',
    sorter: true,
  },
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
    title: 'Product',
    dataIndex: 'productsWithPricingCount',
    key: 'productsWithPricingCount',
    sorter: true,
    render: () => {
      return null;
    },
  },
];

interface Props {
  outlets: DslOutlet[];
  totalItems: number;
  loading: boolean;
}

export const OutletPricingTable: React.FC<Props> = ({ outlets, totalItems, loading }) => {
  const { columns, selectedRowKeys, rowSelection, onchange } = useDataTable(baseColumns);

  const onClickBulk = async (key: string) => {
    if (key === 'delete') {
      //
    }

    reloadPage();
  };

  const menu = [
    {
      label: 'Delete Selected',
      value: 'delete',
    },
    {
      label: 'Edit Seleteced',
      value: 'edit',
    },
  ];

  return (
    <TablePage
      pagination={{
        storageKey: PAGES.OUTLETS,
        type: 'Outlets',
        totalItems,
        menu,
        qtySelected: selectedRowKeys.length,
        onClickBulk,
      }}
    >
      <Table<DslOutlet>
        onChange={onchange}
        rowSelection={rowSelection}
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
