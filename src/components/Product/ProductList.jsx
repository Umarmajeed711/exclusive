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
  updateProduct,
  delProduct,
  loading = true,
  filters = [],
  onBulkUpdate = () => {}
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
          // <div className="flex gap-2 justify-center min-w-[120px]">
          //   <button
          //     onClick={() => editProduct(product)}
          //     className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded"
          //   >
          //     Edit
          //   </button>
          //   <button
          //     onClick={() => deleteProduct(product?.product_id)}
          //     className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded"
          //   >
          //     Delete
          //   </button>
          // </div>

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
              onClick={() => deleteProduct(product?.product_id)}
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

  

  const deleteProduct = async (id) => {
    // 🔥 Show confirmation alert first
    const result = await Swal.fire({
      title: "Are You Sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    // ✅ If user confirms
    if (result?.isConfirmed) {
      try {
        let response = await api.delete(`/products/delete`, {
          data: {
            ids: [id],
          },
        });

        // Success toast
        showToast({
          icon: "success",
          title: response?.data?.message || "Product deleted successfully",
        });
        delProduct(id);
      } catch (error) {

        showToast({
          icon: "error",
          title: error?.response?.data?.message || "Something went wrong",
        });
      }
    }
  };

  const [bulkDelLoading, setBulkDelLoading] = useState(false);

  const handleBulkDelete = async () => {
    const result = await Swal.fire({
      title: "Are You Sure?",
      text: "Do you want to delete All this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result?.isConfirmed) {
      setBulkDelLoading(true);

      const previousOrders = Products;

      setProducts((prev) =>
        prev.filter((o) => !selectedProducts.includes(o.product_id)),
      );   

      try {
        await api.delete("/products/delete", {
          data: { ids: selectedProducts },
        });

        showToast({
          icon: "success",
          title: "Deleted Successfully",
        });
      } catch (error) {
        showToast({
          icon: "error",
          title: error?.response?.data?.message || "Something went wrong",
        });
        setProducts(previousOrders);
      } finally {
        setBulkDelLoading(false);
      }
    }

    setSelectedProducts([]);
  };

  const onSuccess = ({ position, icon, message, product }) => {
    updateProduct(product);
    setProjectData({});
    setShowModal(false);
    setShowBulkModal(false);
    setSelectedProducts([]);
    showToast({
      icon: icon,
      title: message,
    });
  };

  const onBulkSuccess = ({ position, icon, message }) => {
    onBulkUpdate();

    setShowBulkModal(false);
    setSelectedProducts([]);
    showToast({
      icon: icon,
      title: message,
    });
  };

  

  const OnError = ({ position, icon, message }) => {
    showToast({
      icon: icon,
      title: message,
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
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <Loader />
        ) : Products.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="text-md sm:text-xl font-medium  drop-shadow">
              No products found
            </div>
          </div>
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
               <FiEdit2 size={14} />  Bulk Update
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
                    disabled={bulkDelLoading}
                    onClick={() => {
                      handleBulkDelete();
                    }}
                    className={` cursor-pointer px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg
                                     hover:bg-red-600 shadow-sm shadow-red-400 hover:scale-105 hover:animate-spin
                                 duration-200 transition-all  
                                 ${bulkDelLoading ? "opacity-50 cursor-not-allowed" : ""
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
                <thead className="bg-gray-100 text-sm">
                  <tr>
                    {/* FIXED PRODUCT COLUMN */}
                    <th className="p-3 sticky left-0 z-20 ">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts?.length === Products?.length &&
                          Products?.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>

                    <th className="p-3 text-left sticky left-0 z-30 bg-gray-100 top-0 w-full">
                      Product
                    </th>

                    {columns
                      .filter((c) => c.visible)
                      .map((col) => (
                        <th
                          key={col.key}
                          className="p-3 text-left z-20 sticky top-0 bg-gray-100"
                        >
                          {col.label}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {Products?.map((product) => (
                    <tr
                      key={product.product_id}
                      className="border-b hover:bg-gray-50 transition-all"
                    >
                      <td className="p-3 sticky left-0 z-10 bg-white cursor-pointer">
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
                      <td className="p-3 sticky left-0 z-10 bg-white">
                        {renderProductCell(product)}
                      </td>

                      {columns.map(
                        (col) =>
                          col.visible && (
                            <td key={col.key} className="p-3">
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
