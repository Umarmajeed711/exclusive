export const ActiveFilters = ({
  filters = [],
  onRemove = () => {},
  onClear = () => {},
  showFilterModal = () => {},
}) => {
  if (!filters?.length) return null;

  return (
    <>
      {/* <div className="flex flex-wrap gap-2 border border-gray-300 rounded shadow-sm p-[2px]">
        <p className="font-medium">Seacrh By: </p>
        {filters?.map((f, index) => (
          <>
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-200 px-3 py-1  text-sm"
              onClick={() => {
                showFilterModal();
                console.log("Touch filter");
              }}
            >
              <span className="font-medium">{f.label}:</span>
              
              <span>
                {Array.isArray(f.value)
                  ? `${f.value[0]} - ${f.value[1]}`
                  : String(f.value)}
              </span>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  onRemove(index);
                }}
                className="text-gray-600 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          </>
        ))}

        <button onClick={onClear} className="text-base button">
          Clear all
        </button>
      </div> */}

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        {/* Label */}
        <span className="text-sm font-semibold text-gray-700">Search by:</span>

        {/* Active Filters */}
        {filters?.map((f, index) => (
          <div
            key={index}
            onClick={() => {
              showFilterModal();
              console.log("Touch filter");
            }}
            className="group flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-sm text-gray-800 transition hover:border-blue-400 hover:bg-blue-50"
          >
            <span className="font-medium text-gray-700">{f.label}:</span>
             {/* <span className="text-gray-600">{f.operator}</span> */}
            <span className="text-gray-600">
              {Array.isArray(f.value)
                ? `${f.value[0]} – ${f.value[1]}`
                : String(f.value)}
            </span>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(index);
              }}
              className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-100 hover:text-red-600"
              aria-label="Remove filter"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Divider */}
        {filters?.length > 0 && <span className="mx-1 h-5 w-px bg-gray-300" />}

        {/* Clear All */}
        <button
          onClick={onClear}
          className="text-sm font-medium text-red-600 transition hover:text-red-700 hover:underline"
        >
          Clear all
        </button>
      </div>
    </>
  );
};
