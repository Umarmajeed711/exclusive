import { useFilters } from "./FilterContext";

export const ActiveFilters = () => {
  const { activeFilters, removeFilter, clearAllFilters } =
    useFilters();

  if (activeFilters.length === 0) return null;

  return (
    <div>
      {activeFilters.map((f) => (
        <span key={`${f.key}-${f.operator}`}>
          {f.key} {f.operator} {JSON.stringify(f.value)}
          <button
            onClick={() =>
              removeFilter(f.key, f.operator)
            }
          >
            ❌
          </button>
        </span>
      ))}

      <button onClick={clearAllFilters}>Clear All</button>
    </div>
  );
};
