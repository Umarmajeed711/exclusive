export const queryKeys = {
  products: (params) => params ? ["products", params] : ["products"],
  categories: (params) =>  params ? ["categories", params] : ["categories"],
  orders: (params) => params ? ["orders", params] : ["orders"],
};
