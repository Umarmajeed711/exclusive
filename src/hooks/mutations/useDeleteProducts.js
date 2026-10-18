import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProducts } from "../../api/product.api";
import { queryKeys } from "../../lib/queryKeys";
import { cacheUtils } from "../queries/cacheUtils";

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProducts,

    onMutate: (ids) =>
      cacheUtils.optimisticDelete({
        queryClient,
        queryKey: queryKeys.products(),
        ids,
        matchField: "product_id",
        dataKey: "products",
      }),

    onError: (_, __, context) => {
      cacheUtils.rollback(queryClient, context.previousQueries);
    },

    onSuccess: () => {
      cacheUtils.invalidate(queryClient, queryKeys.products());
    },
  });

  // return useMutation({
  //   mutationFn: deleteProducts,

  //   onMutate: (ids) =>
  //     optimisticDelete({
  // queryClient,
  // queryKey: queryKeys.products(),
  // ids,
  // matchField: "product_id",
  // dataKey: "products",
  //     }),

  //   onError: (err, ids, context) => {
  //     rollbackQueries(
  //       queryClient,
  //       context.previousQueries
  //     );
  //   },

  //   onSettled: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: queryKeys.products(),
  //     });
  //   },
  // });
};
