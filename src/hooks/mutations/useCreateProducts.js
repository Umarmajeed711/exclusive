import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createProduct } from "../../api/product.api";
import { cacheUtils } from "../queries/cacheUtils";
import { queryKeys } from "../../lib/queryKeys";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: (data) => {
      cacheUtils.invalidate(
        queryClient,
        queryKeys.products()
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