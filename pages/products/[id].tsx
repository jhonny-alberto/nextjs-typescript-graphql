import { Button, Form, Space, Tabs } from 'antd';
import { Store } from 'antd/lib/form/interface';
import { UploadFile } from 'antd/lib/upload/interface';
import { LocationRestrictionForm } from 'components/pages/products/LocationRestrictionForm';
import { ProductAttributes } from 'components/pages/products/ProductAttributes';
import { ProductGeneral } from 'components/pages/products/ProductGeneral';
import {
  AppBreadcrumb,
  AppSpin,
  BreadcrumbItem,
  DslProductFeature,
  DslProductFeatureInput,
  DslProductImage,
  DslProductImageInput,
  InsertProductInput,
  RepositoryFactory,
  StatusValue,
  UpdateProductInput,
  useAdminForm,
  useCreateProductMutation,
  usePageData,
  useUpdateProductMutation,
  useUpdateProductPostcodeRestrictionMutation,
} from 'dsl-admin-base';
import { useMemo, useState } from 'react';
import { Box } from 'rebass';
import { mockFeatures } from 'utils/constant';

const { TabPane } = Tabs;

const ProductRepository = RepositoryFactory.get('product');

const ProductDetail: React.FC = () => {
  const {
    loading: loadingProduct,
    data: productData,
    isAdd,
    id,
    formInstance,
    showErrorMessage,
    showSuccessMessage,
    router,
    submitForm,
  } = useAdminForm(ProductRepository.getProductDetail);

  const [logFee, setLogFee] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const { loading: loadingCategories, data: categories } = usePageData(() =>
    RepositoryFactory.get('category').get(),
  );
  const { loading: loadingLogisticFee, data: logisticsFees } = usePageData(() =>
    RepositoryFactory.get('logisticFee').get({ page: '1', perPage: '100' }),
  );
  const { loading: loadingTaxcodes, data: taxCodes } = usePageData(() =>
    RepositoryFactory.get('taxCode').get({ page: '1', perPage: '100' }),
  );
  const { loading: loadingDistributors, data: distributors } = usePageData(() =>
    RepositoryFactory.get('product').distributors(),
  );

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [updatePostcodeRestriction] = useUpdateProductPostcodeRestrictionMutation();

  const product = productData;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Products',
      href: '/products',
    },
  ];

  if (isAdd) {
    breadcrumbs.push({
      label: 'Add Product ',
      href: '',
    });
  } else if (product) {
    breadcrumbs.push({
      label: product.name,
      href: '',
    });
  }

  const getImageInput = (
    productImages: DslProductImage[],
    uploadedImages: UploadFile[],
    singleImage = false,
  ): DslProductImageInput[] => {
    const toBeDelete: DslProductImageInput[] = productImages
      .filter((o) => !uploadedImages.find((image) => image.uid === o.id))
      .map((o) => ({ delete: true, id: +o.id, key: o.key, url: '' }));

    const toBeCreate: DslProductImageInput[] = uploadedImages
      .filter((o) => o.originFileObj)
      .map((o) => ({ upload: o.originFileObj, id: 0, key: '', url: '', delete: false }));

    if (singleImage && toBeCreate.length && toBeDelete.length) {
      // this is the case of updating image
      return [
        {
          id: toBeDelete[0].id,
          key: toBeCreate[0].key,
          url: '',
          delete: false,
          upload: toBeCreate[0].upload,
        },
      ];
    }

    return [...toBeDelete, ...toBeCreate];
  };

  const getFormData = (values: Store): UpdateProductInput | InsertProductInput => {
    const categories = Array.isArray(values.category) ? values.category.map((o) => o.value) : [];
    const categoryId = categories[categories.length - 1];

    const features: DslProductFeatureInput[] = (
      product?.features || (mockFeatures as DslProductFeature[])
    ).map((feature) => {
      feature.value = values[`feature_${feature.id}`];
      return {
        id: parseInt(feature.id),
        value: values[`feature_${feature.id}`] || '',
        description: feature.description,
        featured: feature.featured,
        filterable: feature.filterable,
        name: feature.name,
        position: feature.position,
      };
    });

    const input: UpdateProductInput | InsertProductInput = {
      categoryId,
      taxCodeId: values.taxCodeId,
      vendorId: isAdd ? 7 : product?.associations?.vendor?.id, // hardcode for demo
      distributorId: values.distributorId,
      statusValue: values.statusValue,
      product: {
        boxHeight: 0,
        boxWidth: 0,
        weight: 0,
        boxLength: 0,
        mrrp: 0,
        code: values.code,
        featured: false,
        name: values.name,
        shortDescription: values.name,
        longDescription: values.longDescription,
        popularity: 0,
        searchWords: values.searchWords || '',
        seoTitle: values.name,
        seoDescription: values.longDescription,
        seoKeywords: values.name,
        seoSlug: '',
        features,
        options: values.options?.map((name: string, i: number) => ({
          id: i,
          name,
          description: '',
          icon: '',
        })),
        volume: +values.volume || 0,
        mainImage: getImageInput(
          product?.mainImage ? [product.mainImage] : [],
          values.mainImage || [],
          true,
        )[0],
        additionalImages: getImageInput(
          product?.additionalImages || [],
          values.additionalImages || [],
        ),
        adminPricing: {
          pricing: [
            {
              logisticsFee: logFee,
              starStockFee: parseFloat(values.starStockFee),
              inputPrice: parseFloat(values.price),
              logisticsFeeID: values.logisticsFee,
              dateFrom: '',
              dateTo: '',
            },
          ],
        },
      },
    };

    return input;
  };

  const onFinish = async (values: Store) => {
    const input = getFormData(values);

    setSaving(true);
    try {
      let productId: number | undefined;

      // Add/Update product
      if (isAdd) {
        const data = await createProduct({
          variables: {
            input: {
              ...input,
              categoryId: input.categoryId as number,
            },
          },
        });

        const newProductId = data.data?.insertProduct.product.id;

        if (newProductId) {
          productId = +newProductId;
        }
      } else {
        await updateProduct({
          variables: {
            input: {
              ...input,
              id: String(id),
            },
          },
        });

        productId = id;
      }

      // Save postcode restrictions
      if (productId) {
        await savePostcodeRestriction(productId, values.postcodeRestriction);
        if (isAdd) {
          router.push(`/products/${productId}`);
        }
      }

      showSuccessMessage();
    } catch (e) {
      showErrorMessage();
    }
    setSaving(false);
  };

  const savePostcodeRestriction = async (productId: number, postcodes?: string[]) => {
    if (!postcodes) {
      return;
    }
    await updatePostcodeRestriction({
      variables: {
        input: {
          productIds: [productId],
          postcodeIds: postcodes.length ? postcodes.map((o) => parseInt(o)) : null, // pass null to clear all postcode
          brandId: 7, // hardcode for demo
          brandLocked: false,
          replace: true,
        },
      },
    });
  };

  const formatInitalImageUpload = (images: DslProductImage[]) => {
    return images.map((image) => ({
      uid: image.id,
      name: image.key,
      status: 'done',
      url: image.fullSizePath,
      size: 0,
      type: '',
    }));
  };

  const initialValues = useMemo(() => {
    const values: any = product
      ? {
          name: product.name,
          statusValue: product.status.value,
          code: product.code,
          longDescription: product.longDescription,
          // TODO: assume product has only 1 taxCode assigned, change later
          taxCodeId: product?.adminPricing?.pricing?.length
            ? product.adminPricing.pricing[0].taxCodeId
            : undefined,
          distributorId: product?.associations?.distributor?.id,
          category: product.categories?.map((o) => ({ value: o.id, label: o.name })) || [],
          mainImage: formatInitalImageUpload(product.mainImage ? [product.mainImage] : []),
          additionalImages: formatInitalImageUpload(product.additionalImages || []),
          searchWords: product.searchWords,
          options: product.options?.map((o) => o.name),
        }
      : { statusValue: StatusValue.ACTIVE };

    if (product) {
      for (let feature of product?.features || (mockFeatures as DslProductFeature[])) {
        values[`feature_${feature.id}`] = feature.value;
      }
    }

    return values;
  }, [product]);

  const loading =
    loadingProduct ||
    loadingCategories ||
    loadingLogisticFee ||
    loadingTaxcodes ||
    loadingDistributors;

  return (
    <div>
      <Box variant="breadcrumbHeader">
        <AppBreadcrumb items={breadcrumbs}></AppBreadcrumb>
        <Space>
          <Button type="primary" onClick={submitForm} loading={saving}>
            SAVE
          </Button>
        </Space>
      </Box>
      {loading ? (
        <AppSpin></AppSpin>
      ) : (
        <Box variant="card" sx={{}}>
          <Form
            layout="vertical"
            ref={formInstance}
            onFinish={onFinish}
            initialValues={initialValues}
            onValuesChange={() => console.log('change')}
          >
            <Tabs defaultActiveKey="1">
              <TabPane tab="general" key="1" forceRender>
                <ProductGeneral
                  product={product}
                  onChangeLogFee={setLogFee}
                  categories={categories || []}
                  taxCodes={taxCodes?.taxCodes || []}
                  logisticsFees={logisticsFees?.fees || []}
                  distributors={distributors || []}
                ></ProductGeneral>
              </TabPane>
              <TabPane tab="attributes" key="2" forceRender>
                <ProductAttributes
                  features={product?.features || (mockFeatures as DslProductFeature[])}
                />
              </TabPane>
              <TabPane tab="location restrictions" key="3">
                <LocationRestrictionForm product={product || undefined} />
              </TabPane>
            </Tabs>
          </Form>
        </Box>
      )}
    </div>
  );
};

export default ProductDetail;
