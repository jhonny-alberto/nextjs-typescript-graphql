import { GetBrandOwnerQuery, GetBrandOwnerQueryVariables } from '../graphql/generated/graphql';
import getOrdersQuery from '../graphql/queries/brand-owners.graphql';
import Repository from './Repository';

export default {
  async get(): Promise<GetBrandOwnerQuery['getBrandOwner'] | null> {
    try {
      const { data } = await Repository.query<GetBrandOwnerQuery, GetBrandOwnerQueryVariables>({
        query: getOrdersQuery,
      });

      return (data.getBrandOwner || []) as any;
    } catch (e) {
      console.log(e);
      // Mock data
      return [1, 2, 3, 5].map((o) => ({ id: o })) as any;
    }
  },
};
