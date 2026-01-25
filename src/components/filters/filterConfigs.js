import { FILTER_OPERATORS, INPUT_TYPES } from "../types";

export const productFilters = [
  {
    key: "name",
    label: "Product Name",
    operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
    inputType: INPUT_TYPES.TEXT,
  },
  {
    key: "price",
    label: "Price",
    operators: [
      FILTER_OPERATORS.BETWEEN,
      FILTER_OPERATORS.GTE,
      FILTER_OPERATORS.LTE,
    ],
    inputType: INPUT_TYPES.NUMBER,
  },
  {
    key: "category",
    label: "Category",
    operators: [FILTER_OPERATORS.IS, FILTER_OPERATORS.IN],
    inputType: INPUT_TYPES.SELECT,
    options: [
      { label: "Mobile", value: "mobile" },
      { label: "Laptop", value: "laptop" },
    ],
  },
];
