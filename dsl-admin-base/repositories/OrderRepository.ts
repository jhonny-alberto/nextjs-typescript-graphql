import {
  AdminOrder,
  BrandOwnerOrderWeeklyStats,
  DslOrder,
  DslOrderItem,
  GetBrandOwnerOrdersWeeklyStatsQuery,
  GetBrandOwnerOrdersWeeklyStatsQueryVariables,
  GetOrderDetailsQuery,
  GetOrderDetailsQueryVariables,
  GetOrdersQuery,
  GetOrdersQueryVariables,
} from '../graphql/generated/graphql';
import getBrandOwnerOrdersWeeklyStats from '../graphql/queries/get-brand-owner-orders-weekly-stats.graphql';
import GetOrderDetails from '../graphql/queries/order-details.graphql';
import getOrdersQuery from '../graphql/queries/orders.graphql';
import Repository from './Repository';

interface OrderResult {
  totalCount: number;
  adminOrders: AdminOrder[];
}

export default {
  async get(
    params: GetOrdersQueryVariables & { brandOwnerId: number },
  ): Promise<OrderResult | null> {
    try {
      const variables: GetOrdersQueryVariables = {
        searchText: params.searchText || '',
        sortOrder: 'desc',
        sortBy: 'id',
        bo: params.brandOwnerId || null,
      };
      if (params.status && params.status != 0) variables.status = params.status;
      if (params.bo && params.bo != 0) variables.bo = params.bo;
      if (params.dateTo && params.dateTo != '' && params.dateFrom && params.dateFrom != '') {
        variables.dateTo = params.dateTo;
        variables.dateFrom = params.dateFrom;
      }
      if (params.totalFrom && params.totalTo) {
        variables.totalFrom = parseInt(params.totalFrom.toString()) * 100;
        variables.totalTo = parseInt(params.totalTo.toString()) * 100;
      }

      if (params.perPage) variables.perPage = params.perPage;
      if (params.currentPage) variables.currentPage = params.currentPage;

      if (params.sortBy) variables.sortBy = params.sortBy;
      if (params.sortOrder) {
        if (params.sortOrder == 'descend') variables.sortOrder = 'desc';
        if (params.sortOrder == 'ascend') variables.sortOrder = 'asc';
      }

      const { data } = await Repository.query<GetOrdersQuery, GetOrdersQueryVariables>({
        query: getOrdersQuery,
        variables: variables,
      });

      return data.getAdminOrders
        ? {
            totalCount: data.getAdminOrders.totalCount,
            adminOrders: (data.getAdminOrders.adminOrders as AdminOrder[]) || [],
          }
        : { totalCount: 0, adminOrders: [] };
    } catch (e) {
      console.log(e);
      // Mock data
      return [1, 2, 3, 5].map((o) => ({ id: o })) as any;
    }
  },

  async getOrderDetail(id: number): Promise<DslOrder | null> {
    const { data } = await Repository.query<GetOrderDetailsQuery, GetOrderDetailsQueryVariables>({
      query: GetOrderDetails,
      variables: { id },
    });

    return data.getAdminOrderById as DslOrder;
  },

  async updateOrder(_: DslOrder): Promise<boolean> {
    return Promise.resolve(true);
  },

  async getOrderItems(id: number): Promise<DslOrderItem[]> {
    const { data } = await Repository.query<GetOrderDetailsQuery, GetOrderDetailsQueryVariables>({
      query: GetOrderDetails,
      variables: { id },
    });

    return data.getAdminOrderById.orderItems as DslOrderItem[];
  },

  async getBrandOwnerOrdersWeeklyStats(): Promise<BrandOwnerOrderWeeklyStats[]> {
    const { data } = await Repository.query<
      GetBrandOwnerOrdersWeeklyStatsQuery,
      GetBrandOwnerOrdersWeeklyStatsQueryVariables
    >({
      query: getBrandOwnerOrdersWeeklyStats,
    });

    return data.getBrandOwnerOrdersWeeklyStats as BrandOwnerOrderWeeklyStats[];
  },
};
