import {
  Promotion,
  GetPromotionsQuery,
  GetPromotionsQueryVariables,
} from '../graphql/generated/graphql';
import getPromotionsQuery from '../graphql/queries/promotions.graphql';
import Repository from './Repository';
import { ParsedUrlQuery } from 'querystring';
import { getListingQuery } from '../utils/helper';

const promotion = {
  async get(query: ParsedUrlQuery): Promise<Promotion[]> {
    const params = getListingQuery(query);
    const { data } = await Repository.query<GetPromotionsQuery, GetPromotionsQueryVariables>({
      query: getPromotionsQuery,
      variables: {
        params: {
          activeOnly: false,
          expiredOnly: false,
          statusValue: params.status,
        },
      },
    });

    return data.getAdminPromotions as Promotion[];
  },

  async getById(id: number): Promise<Promotion | null> {
    const data = await promotion.get({});
    return data.find((o) => o.id === id) || null;
  },
};

export default promotion;
