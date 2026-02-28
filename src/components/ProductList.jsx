import { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Modal from "./modal";
import AddProductForm from "./addProject";
import api from "./api";
import { GlobalContext } from "../context/Context";
import useClickOutside from "./OutsideClick";

/* ==============================
   DEFAULT COLUMN CONFIG
   (Product is NOT included here)
================================ */
const DEFAULT_COLUMNS = [
  { key: "category", label: "Category", visible: true },
  { key: "price", label: "Price", visible: true },
  { key: "discount", label: "Discount", visible: true },
  { key: "stock", label: "Stock", visible: true },
  { key: "status", label: "Status", visible: true },
  { key: "created", label: "Created", visible: true },
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
}) => {
  let { state, dispatch } = useContext(GlobalContext);
  let Admin = state?.isAdmin;
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const [projectData, setProjectData] = useState({});

  const [showModal, setShowModal] = useState(false);

  /* ==============================
     LOAD FROM LOCALSTORAGE
  ================================ */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setColumns(JSON.parse(saved));
  }, []);

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
      case "category":
        return <span className="capitalize">{product.category_name}</span>;

      case "price":
        return <span className="font-medium">${product.price}</span>;

      case "discount":
        return product.discount ? (
          <span className="text-green-600">{product.discount}%</span>
        ) : (
          "—"
        );

      case "stock":
        return product.quantity;

      case "status":
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

      case "created":
        return new Date(product.created_at).toLocaleDateString();

      case "actions":
        return (
          <div className="flex gap-2 justify-center min-w-[120px]">
            <button
              onClick={() => editProduct(product)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => deleteProduct(product?.product_id)}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded"
            >
              Delete
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
        let response = await api.delete(`/product/${id}`);

        console.log("response", response);

        // Success toast
        Swal.fire({
          icon: "success",
          title: "Product deleted successfully",
          toast: true,
          position: "bottom-left",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        delProduct(id);
      } catch (error) {
        console.log("eror", error);

        // Error toast
        Swal.fire({
          icon: "error",
          title: error?.response?.data?.message || "Something went wrong",
          toast: true,
          position: "bottom-left",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  const onSuccess = ({ position, icon, message, product }) => {
    updateProduct(product);
    setProjectData({});
    setShowModal(false);
    dynamicToast({ position, icon, message });
  };

  const OnError = ({ position, icon, message }) => {
    dynamicToast({ position, icon, message });
  };

  const dynamicToast = ({
    position = "bottom-left",
    icon = "success",
    message = "",
  }) => {
    const Toast = Swal.mixin({
      toast: true,
      position: position,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: icon,
      title: message,
    });
  };

    const menuRef = useRef(null);

  useClickOutside(menuRef, () => setOpen(false));



  // Render
  return (
    <>
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center main">
            <div className="loading"></div>
          </div>
        ) : products.length === 0 ? (
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

              {/* COLUMN OPTIONS (PRODUCT NOT INCLUDED) */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
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

            {/* TABLE */}
            <div className="overflow-x-auto w-full h-full max-h-[500px]">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-sm">
                  <tr>
                    {/* FIXED PRODUCT COLUMN */}
                    <th className="p-3 text-left sticky left-0 z-30 bg-gray-100 top-0 w-full">
                      Product
                    </th>

                    {columns
                      .filter((c) => c.visible)
                      .map((col) => (
                        <th key={col.key} className="p-3 text-left z-20 sticky top-0 bg-gray-100">
                          {col.label}
                        </th>
                      ))}
                  </tr>
                </thead>

                <tbody>
                  {products?.map((product) => (
                    <tr
                      key={product.product_id}
                      className="border-b hover:bg-gray-50"
                    >
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
            onclose={() => {
              setShowModal(false);
              setProjectData({});
            }}
            productData={projectData}
            OnSuccess={onSuccess}
            OnError={OnError}
          />
        </Modal>
      )}
    </>
  );
};

export default ProductListView;
