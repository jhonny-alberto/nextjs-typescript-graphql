import { Table, InputNumber, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import {
  useDataTable,
  DslProduct,
  Currency,
  ProductAdminPricing,
  RepositoryFactory,
  usePageData,
  calculatePrice,
  ProductAdminPrice,
  TablePage,
} from 'dsl-admin-base';
import { Text } from 'rebass';
import { useContext, useEffect, useState } from 'react';
import { AppContextComponent } from 'dsl-admin-base/lib/context';
import _ from 'lodash';

const { Option } = Select;

export interface ExtendedDslProduct extends DslProduct {
  overridePrice?: ProductAdminPrice;
}

interface Props {
  items: ExtendedDslProduct[];
  loading: boolean;
  onChange: (values: PricingUpdate) => void;
  onDelete: (ids: number[]) => void;
}

export interface PricingUpdate {
  [key: string]: {
    inputPrice?: number;
    logisticFeeId?: number;
  };
}

export const OutletProductPricingTable: React.FC<Props> = ({
  items,
  loading,
  onChange,
  onDelete,
}) => {
  const { state } = useContext(AppContextComponent);
  const [pricingUpdate, setPricingUpdate] = useState<PricingUpdate>({});

  const { loading: loadingLogisticFee, data: logisticsFees } = usePageData(() =>
    RepositoryFactory.get('logisticFee').get({ page: '1', perPage: '100' }),
  );

  const { loading: loadingTaxcodes, data: taxCodes } = usePageData(() =>
    RepositoryFactory.get('taxCode').get({ page: '1', perPage: '100' }),
  );

  const getPricing = (pricing: ProductAdminPricing) => {
    return pricing.pricing?.length ? pricing.pricing[0] : undefined;
  };

  const updateInputPrice = (id: number, value: number) => {
    const price = pricingUpdate[id] || {};
    setPricingUpdate({
      ...pricingUpdate,
      [id]: {
        ...price,
        inputPrice: value,
      },
    });
  };

  const updateLogFeeId = (id: number, value: number) => {
    const price = pricingUpdate[id] || {};
    setPricingUpdate({
      ...pricingUpdate,
      [id]: {
        ...price,
        logisticFeeId: value,
      },
    });
  };

  const baseColumns: ColumnsType<ExtendedDslProduct> = [
    {
      title: 'code',
      dataIndex: 'code',
      key: 'code',
      sorter: true,
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'code',
      sorter: true,
    },
    {
      title: 'Input Price',
      dataIndex: 'adminPricing',
      key: 'adminPricing',
      sorter: true,
      render: (_, product: ExtendedDslProduct) => {
        const pricing = product.overridePrice;
        const updatedPrice = pricingUpdate[product.id];
        const inputPrice =
          typeof updatedPrice?.inputPrice !== 'undefined'
            ? updatedPrice.inputPrice
            : pricing?.inputPrice;

        return (
          <InputNumber
            value={inputPrice}
            onChange={(e) => updateInputPrice(+product.id, e ? +e : 0)}
          />
        );
      },
    },
    {
      title: 'Fee',
      dataIndex: 'overridePrice',
      key: 'fee',
      render: (overridePrice: ProductAdminPrice) => {
        return <Text>{overridePrice?.starStockFee}%</Text>;
      },
    },
    {
      title: 'log charge type',
      dataIndex: 'adminPricing',
      key: 'logType',
      render: (adminPricing: ProductAdminPricing, product: DslProduct) => {
        const pricing = getPricing(adminPricing);
        return (
          <Select
            disabled
            defaultValue={pricing?.logisticsFeeId || undefined}
            style={{ width: 120 }}
            onChange={(e) => updateLogFeeId(+product.id, e)}
          >
            {logisticsFees?.fees.map((fee) => {
              return (
                <Option key={fee.id} value={fee.id}>
                  {fee.name}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: 'logistic charge',
      dataIndex: 'overridePrice',
      key: 'logistic',
      render: (overridePrice: ProductAdminPrice) => {
        return <Currency value={(overridePrice?.logisticsFee || 0) * 100}></Currency>;
      },
    },
    {
      title: 'Sell Out Price',
      dataIndex: 'adminPricing',
      key: 'price',
      sorter: true,
      render: (adminPricing: ProductAdminPricing, product: ExtendedDslProduct) => {
        const pricing = getPricing(adminPricing);
        const updatedPricing = pricingUpdate[product.id];

        const inputPrice =
          typeof updatedPricing?.inputPrice !== 'undefined'
            ? updatedPricing.inputPrice
            : product.overridePrice?.inputPrice;

        const starStockFee = pricing ? pricing.starStockFee : state.fee;

        const logisticFeeAmount = product.overridePrice?.logisticsFee || 0;

        const sellOutPrice = calculatePrice(inputPrice || 0, starStockFee, logisticFeeAmount);

        return <Currency value={sellOutPrice * 100} />;
      },
    },
    {
      title: 'Vat',
      dataIndex: 'adminPricing',
      key: 'vat',
      render: (adminPricing: ProductAdminPricing) => {
        const pricing = getPricing(adminPricing);
        const tax = taxCodes?.taxCodes?.find((o) => o.id === pricing?.taxCodeId);

        return <Text>{tax?.rate || 0}%</Text>;
      },
    },
  ];

  useEffect(() => {
    onChange(pricingUpdate);
  }, [pricingUpdate]);

  const { columns, selectedRowKeys, rowSelection, onchange } = useDataTable(baseColumns);

  const onClickBulk = async (key: string) => {
    if (key === 'delete') {
      onDelete(selectedRowKeys as number[]);
    }
  };

  const menu = [
    {
      label: 'Delete Selected',
      value: 'delete',
    },
  ];

  return (
    <TablePage
      pagination={{
        storageKey: '',
        type: '',
        totalItems: 0,
        menu,
        qtySelected: selectedRowKeys.length,
        noPagination: true,
        onClickBulk,
      }}
    >
      <Table<ExtendedDslProduct>
        onChange={onchange}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={items}
        pagination={false}
        rowKey="id"
        loading={loading || loadingLogisticFee || loadingTaxcodes}
        showSorterTooltip={false}
      />
    </TablePage>
  );
};
