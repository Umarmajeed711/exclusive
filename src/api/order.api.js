import api from "../components/helper/api";

export const getOrders = async ({
  filters = {},
  page = 1,
  limit = 12,
}) => {
  const result = await api.get("/orders", {
    params: {
      page,
      limit,
      filters: JSON.stringify(filters),
    },
  });

  return result.data;
};

export const createOrder = async (formData) => {
  const { data } = await api.post("/orders", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};
export const updateOrder = async ({ id, formData }) => {
  const { data } = await api.put(`/orders/${id}/status`, formData);

  return data;
};

export const deleteOrders = async ({ids}) => {
  const response = await api.delete(`/orders/delete`, {
    data: {
      ids,
    },
  });

  return response.data;
};
