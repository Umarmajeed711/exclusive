import { AlertCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

export const TableLayout = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow p-4 ${className || ""}`}>
      {children}
    </div>
  );
};

export const TableSkeleton = ({
  rows = 8,
  columns = 6,
  showHeader = true,
  showToolbar = true,
}) => {
  return (
    <div className="animate-pulse">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex justify-between items-center mb-5">
          <div className="h-8 w-40 bg-gray-200 rounded-lg" />

          <div className="flex gap-2">
            <div className="h-10 w-28 bg-gray-200 rounded-lg" />
            <div className="h-10 w-28 bg-gray-200 rounded-lg" />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="w-full border-collapse">
          {showHeader && (
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4">
                  <div className="h-4 w-20 bg-gray-300 rounded" />
                </th>
                {Array.from({ length: columns }).map((_, index) => (
                  <th key={index} className="p-4">
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {Array.from({ length: rows }).map((_, row) => (
              <tr key={row} className="border-b last:border-b-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-100 rounded" />
                    </div>
                  </div>
                </td>
                {Array.from({ length: columns }).map((_, col) => (
                  <td key={col} className="p-4">
                    <div className="h-4 w-full bg-gray-200 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DataNotFound = ({
  icon = <AlertCircle />,
  title = "Data Not Found",
  message = "no data found in this filter",
  showShop = false,
  className = "",
}) => {
  return (
    <div
      className={`flex justify-center items-center flex-col h-[50vh] gap-3 ${className || ""} `}
    >
      <div className="bg-gray-200 p-2 rounded-md text-2xl">{icon ?? ""}</div>
      <div className="text-2xl font-semibold leading-5 capitalize">{title}</div>
      <div className="text-sm text-gray-500 font-semibold leading-5 capitalize">
        {message}
      </div>

      {showShop && (
        <Link
          to="/shop"
          className="mt-3 bg-theme-primary text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all"
        >
          Shop Now
        </Link>
      )}
    </div>
  );
};
