import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProducts } from "../../api/product.api";
import { queryKeys } from "../../lib/queryKeys";

export const useDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProducts,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products(),
      });
    },
  });
};