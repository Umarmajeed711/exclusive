import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { cacheUtils } from "../queries/cacheUtils";
import { updateProduct } from "../../api/product.api";

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onSuccess: (data) => {
      cacheUtils.invalidate(
        queryClient,
        queryKeys.products()
      );
    },
  });
};