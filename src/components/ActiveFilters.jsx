export const ActiveFilters = ({
  filters = [],
  onRemove = () => {},
  onClear = () => {},
  showFilterModal = () => {},
}) => {
  if (!filters?.length) return null;

  return (
    <div className="flex flex-wrap gap-2 border border-gray-300 rounded shadow-sm p-[2px]">
      <p className="font-medium">Seacrh By: </p>
      {filters?.map((f, index) => (
        <>
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-200 px-3 py-1  text-sm"
            onClick={() => {showFilterModal(); console.log("Touch filter")}}
          >
            <span className="font-medium">{f.label}:</span>
            {/* <span className="text-gray-600">{f.operator}</span> */}
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

      <button
        onClick={onClear}
        className="ml-2 text-sm text-blue-600 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
};
