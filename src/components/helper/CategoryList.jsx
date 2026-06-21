import { useEffect, useMemo, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { X } from "lucide-react";

import { showToast } from "../helper/types";
import { exportToCSV } from "../export/exportToCSV";
import ExportDropdown from "../export/exportDrop";
import useOutsideClick from "../helper/outSideClick";

/* ==============================
   DEFAULT COLUMNS
================================ */
const DEFAULT_COLUMNS = [
  { key: "category_description", label: "Description", visible: true },
  { key: "created_at", label: "Created At", visible: true },
  { key: "category_id", label: "Category ID", visible: true },
  { key: "actions", label: "Actions", visible: true },
];

const STORAGE_KEY = "category_table_columns";

/* ==============================
   MAIN COMPONENT
================================ */
const CategoryList = ({
  categories = [],
  loading = false,
  filters = [],
  onEdit = () => {},
  onDelete = () => {},
  onBulkDelete = () => {},
}) => {
  const [categoryData, setCategoryData] = useState([]);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  useEffect(() => {
    setCategoryData(categories);
  }, [categories]);

  const menuRef = useOutsideClick(() => {
    setOpen(false);
  });

  /* ==============================
     EXPORT COLUMNS
  ================================ */
  const fixedColumns = [
    {
      key: "category_name",
      label: "Category Name",
    },
  ];

  const exportColumns = useMemo(() => {
    const visibleColumns = columns.filter((col) => col.visible);
    const finalColumns = [...fixedColumns, ...visibleColumns];
    return finalColumns.filter((col) => col.key !== "actions");
  }, [columns]);

  /* ==============================
     LOAD / SAVE COLUMNS
  ================================ */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setColumns(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  /* ==============================
     COLUMN CONTROL
  ================================ */
  const toggleColumn = (key) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const onDragStart = (index) => setDragIndex(index);
  const onDragOver = (e) => e.preventDefault();

  const onDrop = (dropIndex) => {
    if (dragIndex === null) return;

    const updated = [...columns];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);

    setColumns(updated);
    setDragIndex(null);
  };

  /* ==============================
     SELECT CATEGORY
  ================================ */
  const toggleSelectCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category.category_id)
        ? prev.filter((id) => id !== category.category_id)
        : [...prev, category.category_id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCategories.length === categoryData.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categoryData.map((cat) => cat.category_id));
    }
  };

  /* ==============================
     BULK DELETE
  ================================ */
  const handleBulkDelete = async () => {
    if (!selectedCategories.length) {
      showToast({
        icon: "warning",
        title: "Please select categories first",
      });
      return;
    }

    try {
      setBulkDeleteLoading(true);
      await onBulkDelete(selectedCategories);
      setSelectedCategories([]);
    } catch (error) {
      // parent handler toast show karega
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  /* ==============================
     EXPORT
  ================================ */
  const exportData = categoryData.filter((cat) =>
    selectedCategories.includes(cat.category_id)
  );

  const handleExportCSV = () => {
    setExportLoading(true);

    try {
      if (!selectedCategories.length) {
        showToast({
          icon: "warning",
          title: "Please select categories first",
        });
        return;
      }

      if (!categoryData.length) {
        showToast({
          icon: "warning",
          title: "No categories available to export",
        });
        return;
      }

      const date = new Date().toISOString();

      exportToCSV({
        fileName: `categories-${date}`,
        columns: exportColumns,
        data: exportData,
      });

      showToast({
        icon: "success",
        title: `${exportData.length} categories exported successfully`,
      });
    } catch (error) {
      showToast({
        icon: "error",
        title: "Failed to export categories",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const exportOptions = [
    {
      type: "current-page",
      icon: "FileSpreadsheet",
      label: "Current Page",
      description: "Visible categories only",
    },
    {
      type: "filtered-categories",
      icon: "Filter",
      label: "Filtered Categories",
      description: "Based on applied filters",
    },
    {
      type: "all-categories",
      icon: "Database",
      label: "All Categories",
      description: "Complete database export",
    },
  ];

  /* ==============================
     CELL RENDER
  ================================ */
  const renderCategoryCell = (category) => {
    return (
      <div className="flex flex-col min-w-[220px]">
        <span className="font-medium text-gray-800">
          {category.category_name || "-"}
        </span>
        <span className="text-xs text-gray-500">
          ID: #{category.category_id}
        </span>
      </div>
    );
  };

  const renderCell = (key, category) => {
    switch (key) {
      case "category_id":
        return (
          <span className="font-semibold text-gray-700">
            #{category.category_id}
          </span>
        );

      case "category_description":
        return (
          <span className="text-gray-700">
            {category.category_description || "-"}
          </span>
        );

      case "created_at":
        return (
          <span className="text-gray-500 text-sm">
            {category.created_at
              ? new Date(category.created_at).toLocaleDateString()
              : "-"}
          </span>
        );

      case "actions":
        return (
          <div className="flex items-center gap-3">
            <button
              title="Edit Category"
              onClick={() => onEdit(category)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <FiEdit2 size={16} />
            </button>

            <button
              title="Delete Category"
              onClick={() => onDelete(category.category_id, category)}
              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
            >
              <RiDeleteBin6Fill size={16} />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {loading ? (
        <div className="flex justify-center items-center h-48 sm:h-96">
          <div className="loading"></div>
        </div>
      ) : categoryData?.length === 0 ? (
        <div className="flex justify-center items-center min-h-[500px] h-[50vh]">
          <p className="text-lg font-medium">No Categories Found</p>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
            <h2 className="text-xl font-semibold">Categories</h2>

            <div className="flex items-center gap-2 flex-wrap">
              {selectedCategories.length > 0 && (
                <div className="bg-white border shadow-lg px-4 py-1 rounded-xl flex gap-4 items-center">
                  <span className="text-sm font-medium">
                    {selectedCategories.length === categoryData.length
                      ? "All"
                      : selectedCategories.length}{" "}
                    selected
                  </span>

                  {/* Export */}
                  <button
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={exportLoading}
                    onClick={handleExportCSV}
                  >
                    Export CSV
                  </button>

                  {/* Bulk Delete */}
                  <button
                    disabled={bulkDeleteLoading}
                    onClick={handleBulkDelete}
                    className={`px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded-xl
                    hover:bg-red-600 shadow-sm shadow-red-400 duration-200 transition-all
                    ${bulkDeleteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Delete
                  </button>

                  <div
                    className="text-black bg-theme-background hover:bg-gray-200 transition-all p-1 rounded cursor-pointer"
                    title="Close"
                    onClick={() => setSelectedCategories([])}
                  >
                    <X size={20} />
                  </div>
                </div>
              )}

              {/* Export dropdown */}
              <ExportDropdown
                exportOptions={exportOptions}
                paginatedUsers={categoryData}
                exportColumns={exportColumns}
                exportToCSV={exportToCSV}
                filters={filters}
              />

              {/* Columns */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Columns ⚙
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded p-3 z-30">
                    {columns.map((col, index) => (
                      <div
                        key={col.key}
                        draggable
                        onDragStart={() => onDragStart(index)}
                        onDragOver={onDragOver}
                        onDrop={() => onDrop(index)}
                        className="flex justify-between items-center py-1 px-2 hover:bg-gray-100"
                      >
                        <label className="flex gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={col.visible}
                            onChange={() => toggleColumn(col.key)}
                          />
                          {col.label}
                        </label>
                        <span>⋮⋮</span>
                      </div>
                    ))}

                    <button
                      onClick={resetColumns}
                      className="mt-2 text-red-600 text-sm"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-sm sticky top-0 z-20">
                <tr>
                  <th className="p-3 w-[50px]">
                    <input
                      type="checkbox"
                      checked={
                        selectedCategories.length === categoryData.length &&
                        categoryData.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>

                  <th className="p-3 text-left sticky left-0 z-30 bg-gray-100 top-0">
                    Category
                  </th>

                  {columns
                    .filter((col) => col.visible)
                    .map((col) => (
                      <th key={col.key} className="p-3 text-left">
                        {col.label}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {categoryData.map((category) => (
                  <tr
                    key={category.category_id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(
                          category.category_id
                        )}
                        onChange={() => toggleSelectCategory(category)}
                      />
                    </td>

                    <td className="p-3 sticky left-0 z-10 bg-white">
                      {renderCategoryCell(category)}
                    </td>

                    {columns.map(
                      (col) =>
                        col.visible && (
                          <td
                            key={col.key}
                            className="p-3 hover:bg-gray-50 transition"
                          >
                            {renderCell(col.key, category)}
                          </td>
                        )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryList;