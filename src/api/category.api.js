import api from "../components/helper/api";

export const getCategories = async ({
  filters = {},
  page = 1,
  limit = 10,
  isAdmin = false,
}) => {
  const result = await api.get("/categories", {
    params: {
      page,
      limit,
      filters: JSON.stringify(filters),
    },
  });

  return result.data;
};
