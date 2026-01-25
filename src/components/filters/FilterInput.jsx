export const FilterInput = ({
  filter,
  operator,
  value,
  setValue,
}) => {
  if (operator === "between") {
    return (
      <>
        <input
          type={filter.inputType}
          placeholder="From"
          onChange={(e) =>
            setValue([e.target.value, value?.[1]])
          }
        />
        <input
          type={filter.inputType}
          placeholder="To"
          onChange={(e) =>
            setValue([value?.[0], e.target.value])
          }
        />
      </>
    );
  }

  if (filter.inputType === "select") {
    return (
      <select onChange={(e) => setValue(e.target.value)}>
        <option value="">Select</option>
        {filter.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={filter.inputType}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
