import { Row, Button, Space, Form } from 'antd';
import { Box, Text } from 'rebass';
import {
  AppBreadcrumb,
  BreadcrumbItem,
  useAdminForm,
  RepositoryFactory,
  AppSpin,
  usePageData,
  Condition,
  Effect,
  useUpdatePromotionMutation,
  UpdatePromotionInput,
  LimitInput,
  PromotionLimitType,
  Limit,
} from 'dsl-admin-base';
import { PromotionForm } from 'components/pages/promotions';
import moment from 'moment';
import { useState } from 'react';
import { Store } from 'antd/lib/form/interface';

interface PromotionForm {
  conditions: Condition[];
  effects: Effect[];
}

export default function PromotionDetail() {
  const {
    isAdd,
    formInstance,
    submitForm,
    data,
    loading,
    id,
    showErrorMessage,
    showSuccessMessage,
    router,
  } = useAdminForm(RepositoryFactory.get('promotion').getById);

  const { loading: loadingCategories, data: categories } = usePageData(() =>
    RepositoryFactory.get('category').get(),
  );

  const [updatePromotion, { loading: saving }] = useUpdatePromotionMutation();

  const [conditions, setConditions] = useState<Condition[]>([]);
  const [effects, setEffects] = useState<Effect[]>([]);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: 'Promotions',
      href: `/promotions`,
    },
  ];

  if (isAdd) {
    breadcrumbs.push({
      label: 'New',
      href: '#',
    });
  } else if (data) {
    breadcrumbs.push({
      label: data.name,
      href: '#',
    });
  }

  const qty = data?.conditions.find((o) => o.type === 'productQty')?.multiplesOf;

  const getInititalLimitValues = (limits: Limit[]) => {
    const values: any = {};

    for (let limit of limits) {
      values[limit.type] = limit.value;
    }

    return values;
  };

  const initialValues =
    data && categories
      ? {
          ...data,
          activeFrom: data.activeFrom ? moment(data.activeFrom) : undefined,
          activeTo: data.activeTo ? moment(data.activeTo) : undefined,
          image: data.imagePath
            ? [
                {
                  uid: data.id,
                  name: data.id,
                  status: 'done',
                  url: data.imagePath,
                  size: 0,
                  type: '',
                },
              ]
            : undefined,
          type: data.type.name,
          qty,
          category: categories
            .filter((o) => data.categoriesInPromotion?.includes(+o.id))
            .map((o) => ({ value: o.id, label: o.name })),
          qualifying: 'all',
          ...getInititalLimitValues(data.limits || []),
        }
      : { status: 'active', activeFrom: moment() };

  const getLimits = (values: Store): LimitInput[] => {
    const limits: LimitInput[] = [];

    Object.values(PromotionLimitType).forEach((key, i) => {
      if (values[key]) {
        limits.push({
          order: i,
          type: key,
          value: values[key],
        });
      }
    });

    return limits;
  };

  const onFinish = async (values: Store) => {
    const image = values.image && values.image.length ? values.image[0] : undefined;

    const formData: UpdatePromotionInput = {
      image: image?.originFileObj,
      promotion: {
        id: isAdd ? undefined : id,
        activeFrom: values.activeFrom,
        activeTo: values.activeTo,
        name: values.name,
        longDescription: values.longDescription || '',
        shortDescription: values.shortDescription || '',
        status: values.status,
        conditions: [
          ...conditions
            .map((o) => ({
              type: o.type,
              comparator: o.comparator,
              order: 0,
              values: o.in,
            }))
            .filter((o) => o.type !== 'productQty'),
          { type: 'productQty', comparator: 'multiplesOf', value: values.qty, order: 1 },
        ],
        effects: effects.map((o) => ({
          name: o.name,
          type: o.type,
          freeStock: o.freeStock
            ? { entityId: o.freeStock.entityId, qty: o.freeStock.qty }
            : undefined,
          value: o.value,
        })),
        limits: getLimits(values),
        type: values.type,
        identityCode: values.identityCode,
        priority: 0,
        slug: data?.slug || values.identityCode,
        imagePath: data?.imagePath || '',
        terms: data?.terms || '',
      },
    };

    try {
      const data = await updatePromotion({
        variables: {
          input: formData,
        },
      });

      showSuccessMessage();

      if (isAdd) {
        router.push(`/promotions/${data.data?.updatePromotion.promotion.id}`);
      }
    } catch (e) {
      showErrorMessage();
    }
  };

  return (
    <Box>
      <Text variant="pageHeading">
        <Row>
          <Box>
            <AppBreadcrumb items={breadcrumbs}></AppBreadcrumb>
          </Box>
        </Row>
        <Box>
          <Space>
            <Button className="text-caps">Cancel</Button>
            <Button type="primary" className="text-caps" onClick={submitForm} loading={saving}>
              Save
            </Button>
          </Space>
        </Box>
      </Text>
      {loading || loadingCategories ? (
        <AppSpin />
      ) : (
        <Box mt="4">
          <Form
            layout="vertical"
            ref={formInstance}
            initialValues={initialValues}
            onFinish={onFinish}
          >
            <PromotionForm
              categories={categories || []}
              promotion={data || undefined}
              onChangeConditions={setConditions}
              onChangeEffects={setEffects}
            />
          </Form>
        </Box>
      )}
    </Box>
  );
}
