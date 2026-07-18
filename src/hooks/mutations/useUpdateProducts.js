import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { cacheUtils } from "../queries/cacheUtils";
import { updateProduct } from "../../api/product.api";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onMutate: ({ product }) =>
      cacheUtils.optimisticUpdate({
        queryClient,

        queryKey: queryKeys.products(),

        updatedItem: product,

        dataKey: "products",

        matchField: "product_id",
      }),

    onError: (_, __, context) => {
      cacheUtils.rollback(
        queryClient,
        context.previousQueries
      );
    },

    onSettled: () => {
      cacheUtils.invalidate(
        queryClient,
        queryKeys.products()
      );
    },
  });
};