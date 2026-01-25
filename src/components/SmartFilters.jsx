import { useState } from "react";
import FilterModal from "./FilterModal";
// import { FilterModal } from "./filters/filterModal";

export default function SmartFilter({
  filters = [],
  enablePagination = false,
  enableSorting = false,
  onChange,
}) {
  const [activeFilters, setActiveFilters] = useState([]);

  const addFilter = (filter) => {
    // ❌ ignore empty values
    if (
      filter.value === "" ||
      filter.value === null ||
      filter.value === undefined ||
      (Array.isArray(filter.value) && filter.value.every(v => !v))
    ) {
      return;
    }

    setActiveFilters((prev) => {
      const index = prev.findIndex(
        f => f.key === filter.key && f.operator === filter.operator
      );

      if (index !== -1) {
        const copy = [...prev];
        copy[index] = filter;
        return copy;
      }

      return [...prev, filter];
    });
  };

  const removeFilter = (key, operator) => {
    setActiveFilters((prev) =>
      prev.filter(
        f => !(f.key === key && f.operator === operator)
      )
    );
  };

  const clearAll = () => setActiveFilters([]);

  // 🔔 notify page (later API call)
  const notifyChange = (filters) => {
    onChange?.({
      filters,
      pagination: enablePagination ? {} : null,
      sorting: enableSorting ? {} : null,
    });
  };

  return (
    <div>
      <h3>Filters</h3>

      {/* Active filters */}
      <div>
        {activeFilters.map((f) => (
          <span key={`${f.key}-${f.operator}`}>
            {f.key} {f.operator} {JSON.stringify(f.value)}
            <button onClick={() => {
              removeFilter(f.key, f.operator);
              notifyChange(activeFilters);
            }}>
              ✕
            </button>
          </span>
        ))}
      </div>

      <FilterModal
        filters={filters}
        onApply={(filter) => {
          addFilter(filter);
          notifyChange([...activeFilters, filter]);
        }}
      />

      {activeFilters.length > 0 && (
        <button onClick={clearAll}>Clear All</button>
      )}
    </div>
  );
}
