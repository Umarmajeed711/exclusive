import api from "../components/helper/api";

export const getProducts = async ({
  filters = {},
  page = 1,
  limit = 12,
  isAdmin = false,
}) => {
  const result = await api.get(
    isAdmin ? "/admin/products" : "/products",
    {
      params: {
        page,
        limit,
        filters: JSON.stringify(filters),
      },
    }
  );

  return result.data;
};


export const createProduct = async (formData) => {
    const { data } = await api.post(
        "/products",
        formData,
        {
            headers:{
                "Content-Type":"multipart/form-data"
            }
        }
    );

    return data;
}
export const updateProduct = async ({
    id,
    formData
})=>{

    const {data}=await api.put(
        `/products/${id}`,
        formData
    )

    return data;
}

export const deleteProducts = async (ids) => {
  const response = await api.delete("/products/delete", {
    data: {
      ids,
    },
  });

  return response.data;
};