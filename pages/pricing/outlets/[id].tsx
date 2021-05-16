import React from 'react';
import { Button, Space, notification } from 'antd';
import {
  RepositoryFactory,
  BreadcrumbItem,
  useFetchTableData,
  AppBreadcrumb,
  usePageData,
  ProductPicker,
  useUpdateOutletProductPricingMutation,
  ProductAdminOutletPriceInput,
  DslProduct,
  reloadPage,
} from 'dsl-admin-base';
import {
  OutletProductPricingTable,
  PricingUpdate,
  ExtendedDslProduct,
} from 'components/pages/pricing/OutletProductPricingTable';
import { Box, Text } from 'rebass';
import { PAGES } from 'utils/constant';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';

export default function Index() {
  const router = useRouter();
  const id = parseInt(router.query.id as string);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<DslProduct[]>([]);
  const [upateOutletPricing, { loading: saving }] = useUpdateOutletProductPricingMutation();
  const [products, setProducts] = useState<DslProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [pricingUpdate, setPricingUpdate] = useState<PricingUpdate>({});

  const { loading, data } = useFetchTableData(
    RepositoryFactory.get('outlet').getProductPricing,
    PAGES.OUTLET_PRODUCT_PRICING,
    { outletId: id },
  );

  const { loading: loadingDetail, data: detailData } = usePageData(() =>
    RepositoryFactory.get('outlet').getById(id),
  );

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Outlet Pricing',
      href: '/pricing/outlets',
    },
  ];

  if (detailData) {
    breadcrumbs.push({
      label: detailData.name,
      href: '',
    });
  }

  const extendedProducts: ExtendedDslProduct[] = useMemo(() => {
    const items: ExtendedDslProduct[] = [];

    products.map((product) => {
      const overridePrice = data?.find((o) => o.productId === +product.id);
      const pricing = product.adminPricing?.pricing?.length
        ? product.adminPricing.pricing[0]
        : undefined;

      items.push({
        ...product,
        overridePrice: overridePrice ? overridePrice.price : pricing,
      });
    });

    return items;
  }, [products, data]);

  const onSelect = (items: DslProduct[]) => {
    setSelectedProducts(items);
  };

  const productIds: number[] = useMemo(() => {
    return [...selectedProducts.map((o) => +o.id), ...(data || []).map((o) => o.productId)];
  }, [selectedProducts, data]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const products = await Promise.all(
          productIds.map((id) => RepositoryFactory.get('product').getProductDetail(id)),
        );
        setProducts(products.filter((o) => o) as DslProduct[]);
      } catch (e) {}
      setLoadingProducts(false);
    };

    fetchProducts();
  }, [productIds]);

  const save = async () => {
    try {
      const toAddInputs: ProductAdminOutletPriceInput[] = [];

      extendedProducts.map((product) => {
        const pricing = product.overridePrice;

        if (pricing) {
          const updatedPricing = pricingUpdate[product.id];

          toAddInputs.push({
            productId: +product.id,
            inputPrice:
              typeof updatedPricing?.inputPrice !== 'undefined'
                ? updatedPricing.inputPrice
                : pricing.inputPrice,
            logisticsFee: pricing.logisticsFee,
            starStockFee: pricing.starStockFee,
            dateFrom: '',
            dateTo: '',
          });
        }
      });

      const toDeleteIds = (data || [])
        .map((o) => o.productId)
        .filter((o) => !productIds.includes(o));

      await upateOutletPricing({
        variables: {
          input: {
            outletId: id,
            pricing: [
              ...toAddInputs,
              ...toDeleteIds.map((id) => ({
                productId: id,
                inputPrice: 0,
                logisticsFee: 0,
                starStockFee: 0,
                dateFrom: '',
                dateTo: '',
                delete: true,
              })),
            ],
          },
        },
      });
      notification.success({ message: 'Save', description: 'Your change has been saved' });
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = async (ids: number[]) => {
    await upateOutletPricing({
      variables: {
        input: {
          outletId: id,
          pricing: [
            ...ids.map((id) => ({
              productId: id,
              inputPrice: 0,
              logisticsFee: 0,
              starStockFee: 0,
              dateFrom: '',
              dateTo: '',
              delete: true,
            })),
          ],
        },
      },
    });

    setProducts(products.filter((o) => !ids.includes(+o.id)));

    setSelectedProducts(selectedProducts.filter((o) => !ids.includes(+o.id)));
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    reloadPage();
  };

  return (
    <Box>
      <Box>
        <Text variant="pageHeading">
          <AppBreadcrumb items={breadcrumbs}></AppBreadcrumb>
          <Space>
            <Button type="primary" onClick={() => setShowPicker(true)} className="text-caps">
              Add Products
            </Button>
            <Button type="primary" loading={saving} onClick={save} className="text-caps">
              Save
            </Button>
            <ProductPicker
              visible={showPicker}
              onCancel={() => setShowPicker(false)}
              selectedProducts={selectedProducts}
              onChange={onSelect}
            />
          </Space>
        </Text>
      </Box>
      <Box variant="card">
        <OutletProductPricingTable
          items={extendedProducts}
          loading={loading || loadingDetail || loadingProducts}
          onChange={setPricingUpdate}
          onDelete={onDelete}
        />
      </Box>
    </Box>
  );
}
