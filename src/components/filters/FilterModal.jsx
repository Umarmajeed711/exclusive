import { useState } from "react";
import { useFilters } from "./FilterContext";
import { FilterInput } from "./FilterInput";

export const FilterModal = ({ onClose }) => {
  const { filters, addOrUpdateFilter } = useFilters();

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");

  const applyFilter = () => {
    addOrUpdateFilter({
      key: selectedFilter.key,
      operator,
      value,
    });
    onClose();
  };

  return (
    <div className="modal">
      <h3>Filters</h3>

      <select
        onChange={(e) => {
          const f = filters.find(
            (x) => x.key === e.target.value
          );
          setSelectedFilter(f);
          setOperator("");
          setValue("");
        }}
      >
        <option value="">Select filter</option>
        {filters.map((f) => (
          <option key={f.key} value={f.key}>
            {f.label}
          </option>
        ))}
      </select>

      {selectedFilter && (
        <>
          <select onChange={(e) => setOperator(e.target.value)}>
            <option value="">Select operator</option>
            {selectedFilter.operators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>

          {operator && (
            <FilterInput
              filter={selectedFilter}
              operator={operator}
              value={value}
              setValue={setValue}
            />
          )}
        </>
      )}

      <button onClick={applyFilter}>Apply</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};
