import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createProduct } from "../../api/product.api";
import { cacheUtils } from "../queries/cacheUtils";
import { queryKeys } from "../../lib/queryKeys";
import { createOrder } from "../../api/order.api";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,

    onSuccess: (data) => {
      cacheUtils.invalidate(
        queryClient,
        queryKeys.orders()
      );
    },

    onError: (_, __, context) => {
  cacheUtils.rollback(
    queryClient,
    context?.previousQueries
  );
},
  });
};