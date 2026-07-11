
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { getCategories } from "../../api/category.api";

export const useCategories = ({
  filters = {},
  page = 1,
  limit = 12,
  isAdmin = false,
}) => {
  return useQuery({
    queryKey: queryKeys.categories({
      filters,
      page,
      limit,
      isAdmin,
    }),

    queryFn: () =>
      getCategories({
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