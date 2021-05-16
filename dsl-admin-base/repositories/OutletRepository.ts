import {
  DslOutlet,
  GetOutletsQuery,
  GetOutletsQueryVariables,
  GetOutletByIdQuery,
  GetOutletByIdQueryVariables,
  OutletsResponse,
  ProductAdminOverridePrice,
  GetOutletProductPricingQuery,
  GetOutletProductPricingQueryVariables,
} from '../graphql/generated/graphql';

import getOutletsQuery from '../graphql/queries/outlets.graphql';
import getOutletByIdQuery from '../graphql/queries/outlet-by-id.graphql';

import getOutletProductPricingQuery from '../graphql/queries/outlet-product-pricing.graphql';

import Repository from './Repository';
import { ParsedUrlQuery } from 'querystring';
import { getListingQuery } from '../utils/helper';

export default {
  async get(query: ParsedUrlQuery): Promise<OutletsResponse | null> {
    const params = getListingQuery(query);
    const { data } = await Repository.query<GetOutletsQuery, GetOutletsQueryVariables>({
      query: getOutletsQuery,
      variables: {
        params: {
          pagination: params.pagination,
          search: params.search,
          accountNumber: params.accountNumber,
          postCode: params.postCode,
          filters: {
            statusValue: params.status,
            productsCount: { min: null, max: null },
            style: params.style,
          },
        },
      },
    });

    return data.getAdminOutlets as OutletsResponse;
  },

  async getById(id: number): Promise<DslOutlet | null> {
    const { data } = await Repository.query<GetOutletByIdQuery, GetOutletByIdQueryVariables>({
      query: getOutletByIdQuery,
      variables: {
        id,
      },
    });

    return data.getAdminOutletByID as DslOutlet;
  },

  async getProductPricing(query: ParsedUrlQuery): Promise<ProductAdminOverridePrice[]> {
    const params = getListingQuery(query);
    const { data } = await Repository.query<
      GetOutletProductPricingQuery,
      GetOutletProductPricingQueryVariables
    >({
      query: getOutletProductPricingQuery,
      variables: {
        params: {
          outletId: params.outletId,
        },
      },
    });

    return data.getOutletProductPricing.pricing as ProductAdminOverridePrice[];
  },
};
