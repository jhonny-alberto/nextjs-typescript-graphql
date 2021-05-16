import { Select, Table, Menu } from 'antd';
import { Text } from 'rebass';
import {
  RepositoryFactory,
  ShowOnHoverImage,
  SettingDropdown,
  useDataTable,
  Currency,
  TableItemLink,
  DslProduct,
  Status,
  DslCategory,
  AppPagination,
  reloadPage,
  getCurrentPrice,
  calculatePrice,
  useBulkDeleteMutation,
  BulKDeleteActions,
} from 'dsl-admin-base';
import { ColumnsType } from 'antd/es/table';

const ProductRepository = RepositoryFactory.get('product');

const { Option } = Select;

interface Props {
  loading: boolean;
  products: DslProduct[];
  totalItems: number;
}

const ProductsTable: React.FC<Props> = ({ products, loading, totalItems }) => {
  const [bulkDelete] = useBulkDeleteMutation();

  const deleteProducts = async (ids: number[]) => {
    try {
      await bulkDelete({
        variables: {
          input: {
            action: BulKDeleteActions.PRODUCTS,
            id: ids,
          },
        },
      });
    } catch (e) {}
  };

  const baseColumns: ColumnsType<DslProduct> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
    },
    {
      title: 'Image',
      dataIndex: ['mainImage', 'thumbnailPath'],
      key: 'image',
      render: (image: string) => {
        return <ShowOnHoverImage src={image} />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'product',
      sorter: true,
      render: (name: string, product: DslProduct) => {
        return <TableItemLink label={name} id={product.id} />;
      },
    },
    {
      title: 'Input Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, product: DslProduct) => {
        const currentPrice = getCurrentPrice(product);
        return <Currency value={(currentPrice?.inputPrice || 0) * 100}></Currency>;
      },
    },
    {
      title: 'Sell Out Price',
      dataIndex: 'price',
      key: 'price',
      render: (_, product: DslProduct) => {
        const currentPrice = getCurrentPrice(product);
        const price = currentPrice
          ? calculatePrice(
              currentPrice.inputPrice,
              currentPrice.starStockFee,
              currentPrice.logisticsFee,
            )
          : 0;
        return <Currency value={price * 100}></Currency>;
      },
    },
    {
      title: 'Category',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: DslCategory[] | null) => {
        const category =
          categories && categories.length ? categories[categories.length - 1].name : null;
        return <Text>{category}</Text>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: true,
      key: 'status',
      render: (status: Status, product: DslProduct) => {
        const onChange = (value: number) => {
          ProductRepository.updateStatus(product.id, value as any);
        };
        return (
          <Select
            defaultValue={status.value}
            style={{ width: 130 }}
            bordered={false}
            onChange={onChange}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Option value={0}>Active</Option>
            <Option value={1}>Disabled</Option>
          </Select>
        );
      },
    },
    {
      title: '',
      dataIndex: '',
      key: 'action',
      render(value: string, product: DslProduct) {
        value;
        const deleteProduct = async () => {
          await deleteProducts([+product.id]);
          reloadPage();
        };

        const settingMenu = (
          <Menu>
            <Menu.Item onClick={deleteProduct}>Delete</Menu.Item>
          </Menu>
        );
        return <SettingDropdown overlay={settingMenu}></SettingDropdown>;
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

  const onClickBulk = async (key: string) => {
    if (key === 'delete') {
      await deleteProducts(selectedRowKeys as number[]);
    }

    reloadPage();
  };

  return (
    <>
      <AppPagination
        storageKey="products"
        type="Products"
        totalItems={totalItems}
        menu={menu}
        qtySelected={selectedRowKeys.length}
        onClickBulk={onClickBulk}
      ></AppPagination>
      <Table<DslProduct>
        onChange={onchange}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={products}
        pagination={false}
        rowKey="id"
        loading={loading}
        showSorterTooltip={false}
      />
    </>
  );
};

export default ProductsTable;
