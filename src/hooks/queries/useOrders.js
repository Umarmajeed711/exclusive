
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { getOrders } from "../../api/order.api";

export const useOrders = ({
  filters = {},
  page = 1,
  limit = 12,
  isAdmin=false
}) => {
  return useQuery({
    queryKey: queryKeys.orders({
      filters,
      page,
      limit,
      isAdmin,
    }),

    queryFn: () =>
      getOrders({
        filters,
        page,
        limit,
        isAdmin,
      }),

    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};