import { useState } from "react";
import { FilterModal } from "./FilterModal";

export const FilterButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>🔍 Filters</button>
      {open && <FilterModal onClose={() => setOpen(false)} />}
    </>
  );
};
