import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { cacheUtils } from "../queries/cacheUtils";
import { updateOrder } from "../../api/order.api";

export const useUpdateOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrder,

    onSuccess: (data) => {
      cacheUtils.invalidate(
        queryClient,
        queryKeys.orders()
      );
    },
  });
};