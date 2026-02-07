import { useState } from "react";
import Modal from "./modal";
import { buildFilterQuery } from "./types";
import { MdOutlineFilterAlt } from "react-icons/md";

const SmartFilter = ({ filters = [], onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  /* ================= HELPERS ================= */

  const isActive = (key) => activeFilters?.some((f) => f.key === key);

  const inactiveFilters = filters?.filter((f) => !isActive(f.key));

  /* ================= ADD FILTER ================= */

  // const addFilter = (filter) => {
  //   setActiveFilters((prev) => [
  //     ...prev,
  //     {
  //       key: filter.key,
  //       label: filter.label,
  //       operator: filter.operators[0],
  //       value: filter.operators[0] === "between" ? ["", ""] : "",
  //       meta: filter,
  //     },
  //   ]);
  // };

  const addFilter = (filter) => {
    const defaultValue =
      filter.inputType === "select"
        ? ""
        : filter.operators[0] === "between"
          ? ["", ""]
          : "";

    setActiveFilters((prev) => [
      ...prev,
      {
        key: filter.key,
        label: filter.label,
        operator: filter.operators[0],
        value: defaultValue,
        meta: filter,
      },
    ]);
  };

  /* ================= UPDATE ================= */

  const updateFilter = (key, changes) => {
    const updated = activeFilters?.map((f) =>
      f.key === key ? { ...f, ...changes } : f,
    );
    setActiveFilters(updated);
    // onChange?.(updated.map(({ meta, ...rest }) => rest));
  };

  /* ================= REMOVE ================= */

  const removeFilter = (key) => {
    const updated = activeFilters.filter((f) => f.key !== key);
    setActiveFilters(updated);
    // onChange?.(updated.map(({ meta, ...rest }) => rest));
  };

  const clearFilters = () => {
    setActiveFilters([]);
    onChange?.([]);
    setTimeout(() => {
      setShowModal(false);
    }, 200);
  };

  const hasInvalidFilters = activeFilters.some((f) =>
    f.operator === "between" ? !f.value[0] || !f.value[1] : !f.value,
  );

  /* ================= VALUE INPUT ================= */

  // const renderValue = (filter) => {
  //   const { meta, operator, value } = filter;

  //   if (operator === "between") {
  //     return (
  //       <div className="flex gap-2">
  //         <input
  //           type="number"
  //           placeholder="From"
  //           value={value[0]}
  //           onChange={(e) =>
  //             updateFilter(filter.key, {
  //               value: [e.target.value, value[1]],
  //             })
  //           }
  //           className="w-full rounded-md border px-3 py-1.5 text-sm"
  //         />
  //         <input
  //           type="number"
  //           placeholder="To"
  //           value={value[1]}
  //           onChange={(e) =>
  //             updateFilter(filter.key, {
  //               value: [value[0], e.target.value],
  //             })
  //           }
  //           className="w-full rounded-md border px-3 py-1.5 text-sm"
  //         />
  //       </div>
  //     );
  //   }

  //   if (meta.inputType === "select") {
  //     return (
  //       <select
  //         value={value}
  //         onChange={(e) => updateFilter(filter.key, { value: e.target.value })}
  //         className="w-full rounded-md border px-3 py-1.5 text-sm"
  //       >
  //         {meta.options.map((o) => (
  //           <option key={o.value} value={o.value}>
  //             {o.label}
  //           </option>
  //         ))}
  //       </select>
  //     );
  //   }

  //   return (
  //     <input
  //       type={meta.inputType === "number" ? "number" : "text"}
  //       value={value}
  //       placeholder="Enter value"
  //       onChange={(e) => updateFilter(filter.key, { value: e.target.value })}
  //       className="w-full rounded-md border px-3 py-1.5 text-sm"
  //     />
  //   );
  // };

  const renderValue = (filter) => {
    const { meta, operator, value, lable } = filter;

    /* ===== BETWEEN ===== */
    if (operator === "between") {
      const inputType =
        meta.inputType === "date"
          ? "date"
          : meta.inputType === "number"
            ? "number"
            : "text";

      return (
        <div className="flex gap-2">
          <input
            type={inputType}
            placeholder="From"
            value={value[0]}
            onChange={(e) =>
              updateFilter(filter.key, {
                value: [e.target.value, value[1]],
              })
            }
            className="w-full rounded-md border px-3 py-1.5 text-sm"
          />
          <input
            type={inputType}
            placeholder="To"
            value={value[1]}
            onChange={(e) =>
              updateFilter(filter.key, {
                value: [value[0], e.target.value],
              })
            }
            className="w-full rounded-md border px-3 py-1.5 text-sm"
          />
        </div>
      );
    }

    /* ===== SELECT ===== */
    if (meta.inputType === "select") {
      return (
        <select
          value={value}
          onChange={(e) => updateFilter(filter.key, { value: e.target.value })}
          className="w-full rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="" disabled>
            Select {filter.label}
          </option>
          {meta?.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    }

    /* ===== DEFAULT ===== */
    return (
      <input
        type={meta.inputType === "number" ? "number" : "text"}
        value={value}
        placeholder="Enter value"
        onChange={(e) => updateFilter(filter?.key, { value: e.target.value })}
        className="w-full rounded-md border px-3 py-1.5 text-sm"
      />
    );
  };

  const applyFilters = () => {
    const query = buildFilterQuery(activeFilters);

    onChange?.(query,activeFilters);
    setShowModal(false);
  };

  /* ================= UI ================= */

  return (
    <div>
      {/* <button
        onClick={() => setShowModal(true)}
        className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100"
      >
        🔍 Filters
      </button> */}

      <button
        className="button   text-xl h-full"
        onClick={() => {
          setShowModal(true);
        }}
      >
        <MdOutlineFilterAlt />
      </button>

      {/* ACTIVE TAGS */}
      {/* {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-xs"
            >
              {f.label}
              <button
                onClick={() => removeFilter(f.key)}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )} */}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        // className="!min-h-48 h-full"
      >
        <div className="w-full max-w-2xl rounded-lg bg-white p-4 h-full flex flex-col  justify-between">
          <h3 className="mb-4 text-lg font-semibold">Filters</h3>

          <div className="w-full h-full overflow-auto flex flex-col items-center justify-between">
            <div className="w-full h-full overflow-hidden overflow-y-auto custom-scrollbar">
              {/* ACTIVE FILTER ROWS */}
              <div className="space-y-3 ">
                {activeFilters.map((f) => (
                  <div
                    key={f.key}
                    className="flex items-center justify-between gap-3 rounded-md border bg-gray-50 p-3"
                  >
                    <div className="flex w-full flex-col gap-2">
                      <strong className="text-sm">{f.label}</strong>

                      <select
                        value={f.operator}
                        onChange={(e) =>
                          updateFilter(f.key, {
                            operator: e.target.value,
                            value: e.target.value === "between" ? ["", ""] : "",
                          })
                        }
                        className="rounded-md border px-3 py-1.5 text-sm"
                      >
                        {f.meta.operators.map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>

                      {renderValue(f)}
                    </div>

                    <button
                      onClick={() => removeFilter(f.key)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* INACTIVE FILTER TAGS */}
              {inactiveFilters?.length > 0 && (
                <div className="py-2">
                  <h4 className="mt-4 mb-2 text-sm font-medium text-gray-700">
                    Add Filters
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {inactiveFilters?.map((f) => (
                      <span
                        key={f.key}
                        onClick={() => addFilter(f)}
                        className="cursor-pointer rounded-full bg-gray-200 px-3 py-1 text-xs hover:bg-gray-300"
                      >
                        + {f.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* FOOTER */}
          {activeFilters?.length > 0 && (
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={clearFilters}
                className="rounded-md border px-4 py-1.5 text-sm hover:bg-gray-100"
              >
                Clear
              </button>
              <button
                onClick={applyFilters}
                disabled={hasInvalidFilters}
                className="rounded-md bg-black px-4 py-1.5 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SmartFilter;
