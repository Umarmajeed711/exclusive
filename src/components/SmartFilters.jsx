import { useState } from "react";
import Modal from "./modal";

const SmartFilter = ({ filters = [], onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  // modal state
  const [field, setField] = useState(null);
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");

  /* ================= RESET ================= */

  const resetModal = () => {
    setField(null);
    setOperator("");
    setValue("");
  };

  /* ================= VALIDATION ================= */

  const isValidValue = () => {
    if (operator === "between") {
      return Array.isArray(value) && value[0] !== "" && value[1] !== "";
    }
    return value !== "" && value !== null && value !== undefined;
  };

  /* ================= APPLY ================= */

  const applyFilter = () => {
    if (!field || !operator || !isValidValue()) return;

    const newFilter = {
      key: field.key,
      operator,
      value,
    };

    setActiveFilters((prev) => {
      const existsIndex = prev.findIndex(
        (f) => f.key === newFilter.key && f.operator === newFilter.operator
      );

      let updated;
      if (existsIndex !== -1) {
        updated = [...prev];
        updated[existsIndex] = newFilter;
      } else {
        updated = [...prev, newFilter];
      }

      onChange?.(updated);
      return updated;
    });

    resetModal();
    setShowModal(false);
  };

  /* ================= REMOVE ================= */

  const removeFilter = (key, operator) => {
    setActiveFilters((prev) => {
      const updated = prev.filter(
        (f) => !(f.key === key && f.operator === operator)
      );
      onChange?.(updated);
      return updated;
    });
  };

  /* ================= UI ================= */

  return (
    <div className="smartFilter">

      {/* BUTTON */}
      <button onClick={() => setShowModal(true)}>🔍 Filters</button>

      {/* ACTIVE FILTERS */}
      {activeFilters.length > 0 && (
        <div className="activeFilters">
          {activeFilters.map((f) => (
            <span key={`${f.key}-${f.operator}`} className="filterChip">
              {f.key} {f.operator} {JSON.stringify(f.value)}
              <button onClick={() => removeFilter(f.key, f.operator)}>
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* MODAL */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>Add Filter</h3>

        {/* FIELD */}
        <select
          value={field?.key || ""}
          onChange={(e) => {
            const selected = filters.find(
              (f) => f.key === e.target.value
            );
            setField(selected);
            setOperator("");
            setValue("");
          }}
        >
          <option value="">Select field</option>
          {filters.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>

        {/* OPERATOR */}
        {field && (
          <select
            value={operator}
            onChange={(e) => {
              setOperator(e.target.value);
              setValue("");
            }}
          >
            <option value="">Select operator</option>
            {field.operators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        )}

        {/* VALUE */}
        {field && operator && (
          <>
            {operator === "between" ? (
              <div className="between">
                <input
                  type={field.inputType}
                  placeholder="From"
                  value={value?.[0] || ""}
                  onChange={(e) =>
                    setValue([e.target.value, value?.[1] || ""])
                  }
                />
                <input
                  type={field.inputType}
                  placeholder="To"
                  value={value?.[1] || ""}
                  onChange={(e) =>
                    setValue([value?.[0] || "", e.target.value])
                  }
                />
              </div>
            ) : field.inputType === "select" ? (
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="">Select</option>
                {field.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.inputType}
                placeholder="Enter value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            )}
          </>
        )}

        {/* ACTIONS */}
        <div className="actions">
          <button onClick={applyFilter}>Apply</button>
          <button
            onClick={() => {
              resetModal();
              setShowModal(false);
            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SmartFilter;
