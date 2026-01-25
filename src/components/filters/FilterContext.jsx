import { createContext, useContext, useState } from "react";

const FilterContext = createContext(null);

export const useFilters = () => useContext(FilterContext);

export const FilterProvider = ({
  filters,
  enablePagination = false,
  enableSorting = false,
  children,
}) => {
  const [activeFilters, setActiveFilters] = useState([]);

  const addOrUpdateFilter = (filter) => {
    if (
      filter.value === undefined ||
      filter.value === null ||
      filter.value === "" ||
      (Array.isArray(filter.value) && filter.value.length === 0)
    ) {
      return;
    }

    setActiveFilters((prev) => {
      const exists = prev.find(
        (f) =>
          f.key === filter.key && f.operator === filter.operator
      );

      if (exists) {
        return prev.map((f) =>
          f.key === filter.key && f.operator === filter.operator
            ? filter
            : f
        );
      }

      return [...prev, filter];
    });
  };

  const removeFilter = (key, operator) => {
    setActiveFilters((prev) =>
      prev.filter(
        (f) => !(f.key === key && f.operator === operator)
      )
    );
  };

  const clearAllFilters = () => setActiveFilters([]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        activeFilters,
        addOrUpdateFilter,
        removeFilter,
        clearAllFilters,
        enablePagination,
        enableSorting,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
