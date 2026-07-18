import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../helper/modal";
import AddProductForm from "./addProduct";
import api from "../helper/api";
import { GlobalContext } from "../../context/Context";
import useOutsideClick from "../helper/outSideClick";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { Loader, showToast } from "../helper/types";
import { exportToCSV } from "../export/exportToCSV";
import ExportDropdown from "../export/exportDrop";
import { X } from "lucide-react";
import { ProductDetailSkeleton } from "./productCardSkeleton";
import BulkUpdateProductForm from "./updateBulkProduct";
import { DataNotFound, TableSkeleton } from "../helper/table";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProducts } from "../../hooks/mutations/useDeleteProducts";
import { queryKeys } from "../../lib/queryKeys";
// import useClickOutside from "./OutsideClick";

/* ==============================
   DEFAULT COLUMN CONFIG
   (Product is NOT included here)
================================ */
const DEFAULT_COLUMNS = [
  { key: "category_name", label: "Category", visible: true },
  { key: "cost_price", label: "CT Price", visible: true },
  { key: "price", label: "Price", visible: true },
  { key: "discount", label: "Discount", visible: true },
  { key: "quantity", label: "Stock", visible: true },
  { key: "is_available", label: "Status", visible: true },
  { key: "created_at", label: "Created", visible: true },
  { key: "actions", label: "Actions", visible: true },
];

const STORAGE_KEY = "product_table_columns";

/* ==============================
   MAIN COMPONENT
================================ */
const ProductListView = ({
  products = [],
  loading = true,
  filters = [],
}) => {
  let { state, dispatch } = useContext(GlobalContext);
  let isAdmin = state?.isAdmin;
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [Products, setProducts] = useState([]);

  const [projectData, setProjectData] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  /* ==============================
     LOAD FROM LOCALSTORAGE
  ================================ */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setColumns(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setProducts(products);
  }, [products]);

  /* ==============================
     SAVE TO LOCALSTORAGE
  ================================ */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  /* ==============================
     TOGGLE COLUMN
  ================================ */
  const toggleColumn = (key) => {
    setColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)),
    );
  };

  /* ==============================
     RESET
  ================================ */
  const resetColumns = () => {
    setColumns(DEFAULT_COLUMNS);
    localStorage.removeItem(STORAGE_KEY);
  };

  /* ==============================
     DRAG & DROP
  ================================ */
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
     CELL RENDERER
  ================================ */
  const renderProductCell = (product) => (
    <div className="flex items-center gap-3 min-w-[240px]">
      <img
        src={
          product.main_image || product.image_urls?.[0] || "/placeholder.png"
        }
        alt={product.name}
        className="w-10 h-10 rounded object-cover border"
      />
      <div>
        <p className="font-medium">{product.name}</p>
        <p className="text-xs text-gray-500">ID: {product.product_id}</p>
      </div>
    </div>
  );

  const renderCell = (key, product) => {
    switch (key) {
      case "category_name":
        return <span className="capitalize">{product.category_name}</span>;

      case "cost_price":
        return <span className="font-medium">${product?.cost_price}</span>;
      case "price":
        return <span className="font-medium">${product.price}</span>;

      case "discount":
        return product.discount ? (
          <span className="text-green-600">{product.discount}%</span>
        ) : (
          "—"
        );

      case "quantity":
        return product.quantity;

      case "is_available":
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.is_available
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.is_available ? "Available" : "Out"}
          </span>
        );

      case "created_at":
        return new Date(product.created_at).toLocaleDateString();

      case "actions":
        return (
          <div className="flex items-center gap-3">
            {/* Edit Icon */}
            <button
              title="Edit Product"
              onClick={() => editProduct(product)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
            >
              <FiEdit2 size={16} />
            </button>

            {/* Delete */}
            <button
              title="Delete"
              // disabled={loadingId === user.user_id}
              className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50"
              onClick={() => handleDelete(product?.product_id)}
            >
              <RiDeleteBin6Fill size={16} />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const editProduct = (product) => {
    setProjectData(product);
    setShowModal(true);
  };

  const { mutate: deleteProducts, isPending } = useDeleteProducts();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    deleteProducts([id], {
      onSuccess: (data) => {
        showToast({
          icon: "success",
          title: data.message,
        });
      },

      onError: (error) => {
        showToast({
          icon: "error",
          title: error?.response?.data?.message || "Something went wrong",
        });
      },
    });
  };

  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Products?",
      text: "Do you want to delete selected products?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    deleteProducts(selectedProducts, {
      onSuccess: (data) => {
        setSelectedProducts([]);

        showToast({
          icon: "success",
          title: data.message,
        });
      },

      onError: (error) => {
        showToast({
          icon: "error",
          title: error?.response?.data?.message || "Something went wrong",
        });
      },
    });
  };

  const onSuccess = ({ position, icon, title, product }) => {
    setProjectData({});
    setShowModal(false);
    setShowBulkModal(false);
    setSelectedProducts([]);
    showToast({
      icon: icon,
      title: title,
    });
  };

  const queryClient = useQueryClient();

  const onBulkSuccess = ({ position, icon, title }) => {
    setShowBulkModal(false);
    setSelectedProducts([]);
    showToast({
      icon: icon,
      title: title,
    });
  };

  const OnError = ({ position, icon, title }) => {
    showToast({
      icon: icon,
      title: title,
    });
  };

  const menuRef = useOutsideClick(() => {
    setOpen(false); // close when clicked outside
  });

  const fixedColumns = [
    {
      key: "product_id",
      label: "Product ID",
    },
    {
      key: "name",
      label: "Name",
    },
    // {
    //   key: "sizes",
    //   label: "Sizes",
    // },
    // {
    //   key: "description",
    //   label: "Description",
    // },
  ];

  const [selectedProducts, setSelectedProducts] = useState([]);

  const toggleSelectOrder = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts?.length === Products?.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(Products?.map((o) => o?.product_id));
    }
  };

  const exportColumns = useMemo(() => {
    const visibleColumns = columns?.filter((col) => col.visible);

    const finalColumns = [...fixedColumns, ...visibleColumns];

    return finalColumns
      ?.filter((col) => col.key !== "actions")
      ?.filter((col) => col.key !== "customer");
  }, [columns, fixedColumns]);

  const exportData = Products?.filter((product) =>
    selectedProducts?.includes(product?.product_id),
  );

  const [exportLoading, setExportLoading] = useState(false);

  const handleExportCSV = () => {
    setExportLoading(true);

    try {
      if (!selectedProducts?.length) {
        showToast({
          icon: "warning",
          title: "please select ther product first",
        });
        return;
      }

      if (!Products?.length) {
        showToast({
          icon: "warning",
          title: "No products available to export",
        });

        return;
      }

      const date = new Date().toISOString();

      exportToCSV({
        fileName: `products-${date}`,
        columns: exportColumns,
        data: exportData,
      });

      showToast({
        icon: "success",
        title: `${Products?.length} products exported successfully`,
      });
    } catch (error) {
      showToast({
        icon: "error",
        title: "Failed to export products",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const exportOptions = [
    {
      type: "current-page-products",
      icon: "FileSpreadsheet",
      label: "Current Page",
      description: "Visible products only",
    },
    {
      type: "filtered-products",
      icon: "Filter",
      label: "Filtered Products",
      description: "Based on applied filters",
    },
    {
      type: "all-products",
      icon: "Database",
      label: "All Products",
      description: "Complete database export",
    },
  ];

  // Render
  return (
    <>
      <div>
        {loading ? (
          <TableSkeleton
            rows={5}
            columns={columns.filter((c) => c.visible).length} // checkbox + user
          />
        ) : Products.length === 0 ? (
          <DataNotFound
            icon="🛒"
            title="No Product"
            message="Curretly No products found"
            className="h-[50vh]"
          />
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Products</h2>

              {selectedProducts.length > 0 && isAdmin && (
                <div className=" bg-white border shadow-lg px-4 py-1 rounded-xl flex gap-3 items-center z-50">
                  <span className="text-sm font-medium">
                    {selectedProducts.length == Products?.length
                      ? "All"
                      : selectedProducts?.length}{" "}
                    selected
                  </span>

                  <button
                    title="update Bulk Product"
                    onClick={() => setShowBulkModal(true)}
                    className="flex gap-1 items-center px-4 py-1.5 text-sm font-medium  
              rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-[1.02] transition"
                  >
                    <FiEdit2 size={14} /> Bulk Update
                  </button>

                  {/* Export  */}

                  <button
                    className="
                        flex items-center gap-2
                        rounded-lg
                        bg-emerald-600
                        px-4 py-1.5
                        text-sm font-medium text-white
                        shadow-lg shadow-emerald-500/20
                        transition-all
                        hover:scale-[1.02]
                        hover:bg-emerald-700
                      "
                    isLoading={exportLoading}
                    disabled={exportLoading}
                    onClick={handleExportCSV}
                  >
                    Export CSV
                  </button>

                  {/* Delete */}
                  <button
                    disabled={isPending}
                    onClick={() => {
                      handleBulkDelete();
                    }}
                    className={` cursor-pointer px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg
                                     hover:bg-red-600 shadow-sm shadow-red-400 hover:scale-105 hover:animate-spin
                                 duration-200 transition-all  
                                 ${
                                   isPending
                                     ? "opacity-50 cursor-not-allowed"
                                     : ""
                                 }`}
                  >
                    Delete
                  </button>

                  <div
                    className="text-black bg-theme-background p-1 rounded cursor-pointer hover:bg-gray-200 transition-all"
                    onClick={() => {
                      setSelectedProducts("");
                    }}
                  >
                    <X size={20} />
                  </div>
                </div>
              )}

              <div className="flex gap-1">
                <div>
                  <ExportDropdown
                    exportOptions={exportOptions}
                    paginatedUsers={Products}
                    exportColumns={exportColumns}
                    exportToCSV={exportToCSV}
                    filters={filters}
                  />
                </div>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setOpen(!open)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 "
                  >
                    Columns ⚙
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded p-3 z-30">
                      <p className="text-xs text-gray-500 mb-2">
                        Drag to reorder columns
                      </p>

                      {columns.map((col, index) => (
                        <div
                          key={col.key}
                          draggable
                          onDragStart={() => onDragStart(index)}
                          onDragOver={onDragOver}
                          onDrop={() => onDrop(index)}
                          className="flex items-center justify-between gap-2 py-1 px-2 rounded cursor-move hover:bg-gray-100"
                        >
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={col.visible}
                              onChange={() => toggleColumn(col.key)}
                            />
                            {col.label}
                          </label>
                          <span className="text-gray-400">⋮⋮</span>
                        </div>
                      ))}

                      <button
                        onClick={resetColumns}
                        className="mt-3 w-full text-sm text-red-600 hover:underline"
                      >
                        Reset to Default
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto w-full h-full max-h-[500px] custom-scrollbar">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-sm sticky top-0 z-20">
                  <tr>
                    {/* FIXED PRODUCT COLUMN */}
                    <th className="p-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts?.length === Products?.length &&
                          Products?.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>

                    <th className="p-3 text-left sticky left-0 z-30 bg-gray-100 top-0">
                      Product
                    </th>

                    {columns
                      .filter((c) => c.visible)
                      .map((col) => (
                        <th key={col.key} className="p-3 text-left">
                          {col.label}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {Products?.map((product) => (
                    <tr
                      key={product.product_id}
                      className="border-b last:border-b-0 group hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="p-3 sticky left-0 z-10 bg-white cursor-pointer group-hover:bg-gray-50 ">
                        <input
                          type="checkbox"
                          checked={selectedProducts?.includes(
                            product?.product_id,
                          )}
                          onChange={(e) => {
                            toggleSelectOrder(product?.product_id);
                          }}
                        />
                      </td>
                      {/* FIXED PRODUCT CELL */}
                      <td className="p-3 sticky left-0 z-10 bg-white group-hover:bg-gray-50">
                        {renderProductCell(product)}
                      </td>

                      {columns.map(
                        (col) =>
                          col.visible && (
                            <td
                              key={col.key}
                              className="p-3 group-hover:bg-gray-50"
                            >
                              {renderCell(col.key, product)}
                            </td>
                          ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setProjectData({});
          }}
          isOpen={showModal}
        >
          <AddProductForm
            onClose={() => {
              setShowModal(false);
              setProjectData({});
            }}
            productData={projectData}
            OnSuccess={onSuccess}
            OnError={OnError}
          />
        </Modal>
      )}

      {showBulkModal && (
        <Modal
          onClose={() => {
            setShowBulkModal(false);
            setSelectedProducts([]);
          }}
          isOpen={showBulkModal}
        >
          <BulkUpdateProductForm
            onclose={() => {
              setShowBulkModal(false);
              setSelectedProducts({});
            }}
            selectedProducts={selectedProducts}
            OnSuccess={onBulkSuccess}
            OnError={OnError}
          />
        </Modal>
      )}
    </>
  );
};

export default ProductListView;
