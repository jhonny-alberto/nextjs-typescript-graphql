import { Table, Menu, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  useLoadingEvent,
  SettingDropdown,
  useDataTable,
  RepositoryFactory,
  AppPagination,
  DslUser,
  reloadPage,
} from 'dsl-admin-base';
import { REQUEST_NAME } from 'utils/constant';

const { Option } = Select;

const UserRepository = RepositoryFactory.get('user');

const baseColumns: ColumnsType<DslUser> = [
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'fullName',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: true,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: true,
    key: 'status',
    render: (status: string, user) => {
      const onChange = (value: string) => {
        UserRepository.updateStatus(user.id as any, { status: value, notifyUser: true });
      };
      return (
        <Select
          defaultValue={status}
          style={{ width: 110 }}
          bordered={false}
          onChange={onChange}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Option value="A">Active</Option>
          <Option value="D">Disabled</Option>
        </Select>
      );
    },
  },
  {
    title: '',
    dataIndex: '',
    key: 'action',
    render() {
      const settingMenu = (
        <Menu>
          <Menu.Item>Delete</Menu.Item>
        </Menu>
      );
      return <SettingDropdown overlay={settingMenu}></SettingDropdown>;
    },
  },
];

interface Props {
  loading: boolean;
  data?: {
    users: DslUser[];
    search: any;
  };
}

export const UsersTable: React.FC<Props> = ({ data, loading }) => {
  const { columns, rowSelection, onchange, selectedRowKeys, onRow } = useDataTable(baseColumns);
  const updating = useLoadingEvent([REQUEST_NAME.UPDATE_USER]);

  const onClickBulk = async (key: string) => {
    if (key === 'delete') {
      reloadPage();
    }
  };
  const menu = [
    {
      label: 'Delete Selected',
      value: 'delete',
    },
  ];

  return (
    <>
      <AppPagination
        storageKey="users"
        type="Administrators"
        totalItems={data?.search.totalItems}
        menu={menu}
        qtySelected={selectedRowKeys.length}
        onClickBulk={onClickBulk}
      ></AppPagination>
      <Table<DslUser>
        className="clickable-row"
        onChange={onchange}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data?.users}
        pagination={false}
        rowKey="id"
        loading={loading || updating}
        showSorterTooltip={false}
        onRow={onRow}
      />
    </>
  );
};
