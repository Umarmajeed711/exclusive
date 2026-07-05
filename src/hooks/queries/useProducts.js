
import { useQuery } from "@tanstack/react-query";
// import { getProducts } from "../../api/product.api";
// import { queryKeys } from "../../lib/queryKeys";

import { getProducts } from "../../api/product.api";
import { queryKeys } from "../../lib/queryKeys";

export const useProducts = ({
  filters = {},
  page = 1,
  limit = 12,
  isAdmin = false,
}) => {
  return useQuery({
    queryKey: queryKeys.products({
      filters,
      page,
      limit,
      isAdmin,
    }),

    queryFn: () =>
      getProducts({
        filters,
        page,
        limit,
        isAdmin,
      }),

    staleTime: 5 * 60 * 1000,

    gcTime: 10 * 60 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};