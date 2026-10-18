import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { optimisticDelete, rollbackQueries } from "../utils/optimisticUpdate";
import { cacheUtils } from "../queries/cacheUtils";
import { deleteOrders } from "../../api/order.api";


export const useDeleteOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrders,

    onMutate: (ids) =>
      cacheUtils.optimisticDelete({
        queryClient,
        queryKey: queryKeys.orders(),
        ids,
        matchField: "order_id",
        dataKey: "orders",
      }),

    onError: (_, __, context) => {
      cacheUtils.rollback(queryClient, context.previousQueries);
    },

    onSuccess: () => {
      cacheUtils.invalidate(queryClient, queryKeys.orders());
    },
  });
};
