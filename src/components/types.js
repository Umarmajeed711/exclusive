export const FILTER_OPERATORS = {
  IS: "is",
  CONTAINS: "contains",
  BETWEEN: "between",
  GTE: "gte",
  LTE: "lte",
  IN: "in",
};

export const INPUT_TYPES = {
  TEXT: "text",
  NUMBER: "number",
  SELECT: "select",
  DATE: "date",
  DATE_RANGE: "dateRange",
};

const normalizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map((v) => normalizeValue(v));
  }

  if (value === "true") return true;
  if (value === "false") return false;

  return value;
};



export const buildFilterQuery = (filters = []) => {
  const query = {};

  filters?.forEach(({ key, operator, value }) => {
    if (!key || value === "" || value == null) return;

    if (!query[key]) {
      query[key] = {};
    }

    query[key][operator] = normalizeValue(value);
  });

  return query;
};


