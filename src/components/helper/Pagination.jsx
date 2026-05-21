// const Pagination = ({ currentPage, totalPages, onPageChange,isLoading,Products }) => {
//   if (totalPages < 1) return null;



//   return (
//     <div className="mt-6 flex items-center justify-between gap-2">
//       {isLoading ? (
//         <div className="h-4 w-80 rounded bg-gray-200 animate-pulse" />
//       ) : (
//         <p className="text-sm text-gray-600">
//           Showing page {currentPage} of {totalPages} ({Products}{" "}
//           products)
//         </p>
//       )}
//       <div className="flex items-center gap-2">
//         {/* Previous */}
//         <button
//           disabled={currentPage === 1}
//           onClick={() => onPageChange(currentPage - 1)}
//           className="rounded border px-3 py-1 text-sm disabled:opacity-50"
//         >
//           Prev
//         </button>

//         {/* Page Numbers */}
//         {[...Array(totalPages)].map((_, i) => {
//           const page = i + 1;
//           return (
//             <button
//               key={page}
//               onClick={() => onPageChange(page)}
//               className={`rounded px-3 py-1 text-sm ${
//                 currentPage === page
//                   ? "bg-[#03A9F4] text-white"
//                   : "border hover:bg-gray-100"
//               }`}
//             >
//               {page}
//             </button>
//           );
//         })}

//         {/* Next */}
//         <button
//           disabled={currentPage === totalPages}
//           onClick={() => onPageChange(currentPage + 1)}
//           className="rounded border px-3 py-1 text-sm disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Pagination;


  const getPaginationRange = (currentPage, totalPages, delta = 2) => {
  const range = [];
  const rangeWithDots = [];

  const start = Math.max(1, currentPage - delta);
  const end = Math.min(totalPages, currentPage + delta);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (start > 1) {
    rangeWithDots.push(1);
    if (start > 2) rangeWithDots.push("...");
  }

  rangeWithDots.push(...range);

  if (end < totalPages) {
    if (end < totalPages - 1) rangeWithDots.push("...");
    rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  pageSize,
  totalProducts,
}) => {
  if (totalPages <= 1) return null;

  const pages = getPaginationRange(currentPage, totalPages);

  const startProduct = (currentPage - 1) * pageSize + 1;
  const endProduct = Math.min(currentPage * pageSize, totalProducts);

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Product Count */}
      {isLoading ? (
        <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
      ) : (
        <p className="text-sm text-gray-600">
          Showing {startProduct}–{endProduct} of {totalProducts} products
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Prev */}
        <button
          disabled={currentPage === 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        >
          Prev
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              disabled={isLoading}
              onClick={() => onPageChange(page)}
              className={`rounded px-3 py-1 text-sm ${
                currentPage === page
                  ? "bg-[#03A9F4] text-white"
                  : "border hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          disabled={currentPage === totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
