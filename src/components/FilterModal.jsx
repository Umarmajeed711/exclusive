import { useEffect, useState } from "react";
import Modal from "./modal";

const FilterModal = ({ filters, onApply, isOpen, onClose }) => {
  const [field, setField] = useState(null);
  const [operator, setOperator] = useState("");
  const [value, setValue] = useState("");

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setField(null);
      setOperator("");
      setValue("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    // ignore if no value
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    // between must have two values
    if (operator === "between") {
      if (!value[0] || !value[1]) return;
    }

    onApply({
      key: field.key,
      operator,
      value,
    });

    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen={true}>
      <div className="modalHeader">
        <h3>Filters</h3>
      </div>

      <div className="modalBody">
        {/* 1) SELECT FILTER */}
        <select
          className="filterSelect"
          onChange={(e) => {
            const f = filters.find((x) => x.key === e.target.value);
            setField(f);
            setOperator("");
            setValue("");
          }}
        >
          <option value="">Select Filter</option>
          {filters.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>

        {/* 2) SELECT OPERATOR */}
        {field && (
          <select
            className="filterSelect"
            onChange={(e) => {
              setOperator(e.target.value);
              setValue("");
            }}
          >
            <option value="">Select Operator</option>
            {field.operators.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        )}

        {/* 3) INPUT */}
        {field && operator && (
          <>
            {operator === "between" ? (
              <div className="betweenInputs">
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
                className="filterSelect"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="">Select</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.inputType}
                value={value}
                placeholder="Enter value"
                onChange={(e) => setValue(e.target.value)}
              />
            )}
          </>
        )}

        {/* VALIDATION */}
        {field && operator && (
          <p className="hintText">
            Selected: {field.label} {operator}
          </p>
        )
        }
      </div>

      <div className="modalFooter">
        <button className="btn" onClick={handleApply}>
          Apply
        </button>
        <button className="btn btnCancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default FilterModal;
