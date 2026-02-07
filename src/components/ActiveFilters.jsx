export const ActiveFilters = ({ filters, onRemove, onClear }) => {
  if (!filters.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {filters.map((f, index) => (
        <div
          key={index}
          className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm"
        >
          <span className="font-medium">{f.label}</span>
          <span className="text-gray-600">{f.operator}</span>
          <span>
            {Array.isArray(f.value)
              ? `${f.value[0]} - ${f.value[1]}`
              : String(f.value)}
          </span>

          <button
            onClick={() => onRemove(index)}
            className="text-gray-600 hover:text-red-500"
          >
            ✕
          </button>
        </div>
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
