import { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import api from "./api";
import { GlobalContext } from "../context/Context";
import useOutsideClick from "./outSideClick";
import OrderDetailsModal from "./OrderDetailModal";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { formatText } from "./types";
import { DeliveryStatusDropdown, PaymentStatusDropdown } from "./statusOptions";
import Modal from "./modal";
import { useNavigate } from "react-router-dom";

/* ==============================
   DEFAULT COLUMNS
================================ */
const DEFAULT_COLUMNS = [
  { key: "order_id", label: "Order ID", visible: true },
  { key: "customer", label: "Customer", visible: true },
  { key: "total", label: "Total", visible: true },
  { key: "payment_method", label: "Payment Method", visible: true },
  { key: "payment_status", label: "Payment", visible: true },
  { key: "delivery_status", label: "Delivery", visible: true },
  { key: "date", label: "Date", visible: true },
  { key: "actions", label: "Actions", visible: true },
];

const STORAGE_KEY = "order_table_columns";

/* ==============================
   MAIN COMPONENT
================================ */
const OrderList = ({
  products = [],
  updateOrderStatus = () => {},
  loadingId = null,
  deleteProduct = () => {},
  loading = true,
}) => {
  let { state } = useContext(GlobalContext);

  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [open, setOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [Orders, setOrders] = useState([]);

  useEffect(() => {
    if (selectedOrder) {
      const select = products?.filter(
        (p) => p?.order_id == selectedOrder?.order_id,
      );
      setSelectedOrder(select[0]);
    }
  }, [products]);

  useEffect(() => {
    setOrders(products);
  }, [products]);

  const menuRef = useOutsideClick(() => {
    setOpen(false); // close when clicked outside
  });

  /* ==============================
     LOAD / SAVE COLUMNS
  ================================ */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setColumns(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  /* ==============================
     COLUMN CONTROL
  ================================ */
  const toggleColumn = (key) => {
    setColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c)),
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

  // const updateOrderStatus = async (order_id, field, value) => {

  //   setLoadingId(order_id);
  //   try {
  //     await api.put(`/orders/${order_id}/status`, {
  //       [field]: value,
  //     });

  //     Swal.fire({
  //       icon: "success",
  //       title: "Status updated",
  //       toast: true,
  //       position: "bottom-left",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });

  //     // 🔥 update UI instantly
  //     updateProduct({
  //       order_id,
  //       [field]: value,
  //     });
  //   } catch (error) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Failed to update",
  //       toast: true,
  //       position: "bottom-left",
  //       showConfirmButton: false,
  //       timer: 2000,
  //     });
  //   }
  // };

  /* ==============================
     CELL RENDER
  ================================ */
  const renderCell = (key, order) => {
    switch (key) {
      case "order_id":
        return <span className="font-medium">#{order.order_id}</span>;

      case "customer":
        return (
          <div>
            <p className="font-medium">{order.shipping_name}</p>
            <p className="text-xs text-gray-500">{order.shipping_phone}</p>
          </div>
        );

      case "total":
        return <span className="font-semibold">${order.total_price}</span>;

      case "payment_method":
        return (
          <div className="flex items-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border
      ${
        order.payment_method === "cod"
          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
          : "bg-blue-100 text-blue-700 border-blue-300"
      }
    `}
            >
              {order.payment_method === "cod"
                ? "💵 Cash on Delivery"
                : "💳 Online Payment"}
            </span>
          </div>
        );

      case "payment_status":
        return (
          <PaymentStatusDropdown
            order={order}
            updateOrderStatus={updateOrderStatus}
            loadingId={loadingId}
          />
        );

      case "delivery_status":
        return (
          <DeliveryStatusDropdown
            order={order}
            updateOrderStatus={updateOrderStatus}
            loadingId={loadingId}
          />
        );

      case "date":
        return new Date(order.order_date).toLocaleDateString();

      case "actions":
        return (
          <div className="flex items-center gap-2 ">
            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowDetails(true);
              }}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded"
            >
              View
            </button>

            <button title="Delete" disabled={loadingId == order?.order_id}>
              <RiDeleteBin6Fill
                className={`text-red-500 cursor-pointer text-xl sm:text-2xl hover:text-red-600 hover:scale-105 hover:animate-spin
                   duration-200 transition-all  ${loadingId === order.order_id ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  Swal.fire({
                    title: "Do you want delete this Order?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Delete",
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                      deleteProduct(order?.order_id);
                      // Swal.fire("Saved!", "", "success");
                    }
                  });
                }}
              />
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const [selectedOrders, setSelectedOrders] = useState([]);

  const toggleSelectOrder = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === Orders?.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(Orders?.map((o) => o.order_id));
    }
  };
  const [bulkUpdLoading, setBulkUpdLoading] = useState(false);
  const [bulkDelLoading, setBulkDelLoading] = useState(false);

  const handleBulkUpdate = async (id, field, value) => {
    if (selectedOrders.length === 1) {
      // single API
      await updateOrderStatus(selectedOrders[0], field, value);
    } else {
      setBulkUpdLoading(true);

      // bulk API
      const previosOrders = Orders;

      setOrders((prev) =>
        prev.map((o) =>
          selectedOrders.includes(o.order_id) ? { ...o, [field]: value } : o,
        ),
      );
      try {
        console.log("Selected Orders", selectedOrders);
        console.log("Selected Field and value", field, value);

        await api.put("/orders/bulk-status", {
          ids: selectedOrders,
          [field]: value,
        });
      } catch (error) {
        setOrders(previosOrders);
      } finally {
        setBulkUpdLoading(false);
      }

      // optimistic update
    }
    setSelectedOrders([]);
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.length === 1) {
      await deleteProduct(selectedOrders[0]);
    } else {
      setBulkDelLoading(true);

      const previousOrders = Orders;

      setOrders((prev) =>
        prev.filter((o) => !selectedOrders.includes(o.order_id)),
      );

      try {
        await api.delete("/orders/bulk-delete", {
          data: { ids: selectedOrders },
        });

        Swal.fire({
          icon: "success",
          title: "Deleted Successfully",
          toast: true,
          position: "bottom-left",
          timer: 3000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: "Something went wrong",
          toast: true,
          position: "bottom-left",
          timer: 3000,
          showConfirmButton: false,
        });
        setOrders(previousOrders);
      } finally {
        setBulkDelLoading(false);
      }
    }
    setSelectedOrders([]);
  };

  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-96">
            <div className="loading"></div>
          </div>
        ) : Orders?.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-lg font-medium">No Orders Found</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Orders</h2>

              {selectedOrders.length > 0 && (
                <div className=" bg-white border shadow-lg px-4 py-1 rounded-xl flex gap-3 items-center z-50">
                  <span className="text-sm font-medium">
                    {selectedOrders.length} selected
                  </span>

                  {/* Delivery Status */}
                  {/* <select
      onChange={(e) =>
        handleBulkUpdate("delivery_status", e.target.value)
      }
      className="border px-2 py-1 rounded text-sm"
    >
      <option value="">Delivery Status</option>
      {DELIVERY_STATUS.map((s) => (
        <option key={s} value={s}>
          {formatText(s)}
        </option>
      ))}
    </select> */}
                  <DeliveryStatusDropdown
                    order={Orders}
                    updateOrderStatus={handleBulkUpdate}
                    loadingId={loadingId}
                    isDisabled={bulkUpdLoading}
                  />

                  {/* Payment Status */}
                  {/* <select
      onChange={(e) =>
        handleBulkUpdate("payment_status", e.target.value)
      }
      className="border px-2 py-1 rounded text-sm"
    >
      <option value="">Payment Status</option>
      {PAYMENT_STATUS.map((s) => (
        <option key={s} value={s}>
          {formatText(s)}
        </option>
      ))}
    </select> */}
                  <PaymentStatusDropdown
                    order={Orders}
                    updateOrderStatus={handleBulkUpdate}
                    loadingId={loadingId}
                    isDisabled={bulkUpdLoading}
                  />

                  {/* Delete */}
                  <button
                    disabled={bulkDelLoading}
                    onClick={() => {
                      Swal.fire({
                        title: "Do you want delete this Order?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Delete",
                      }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                          handleBulkDelete();
                        }
                      });
                    }}
                    className={`text-red-500 cursor-pointer px-3 py-1 hover:text-red-600 hover:scale-105 hover:animate-spin
                   duration-200 transition-all  ${bulkDelLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Delete
                  </button>
                </div>
              )}

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="px-4 py-2 bg-gray-100 rounded"
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

            {/* TABLE */}
            <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 text-sm sticky top-0 z-20">
                  <tr>
                    <th className="p-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedOrders.length === Orders?.length &&
                          Orders?.length > 0
                        }
                        onChange={toggleSelectAll}
                      />
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
                  {Orders?.map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-b hover:bg-gray-50"
                      onClick={() => {
                        navigate(`/orders/${order.order_id}`);
                      }}
                    >
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.order_id)}
                          onChange={() => toggleSelectOrder(order.order_id)}
                        />
                      </td>
                      {columns.map(
                        (col) =>
                          col.visible && (
                            <td key={col.key} className="p-3">
                              {renderCell(col.key, order)}
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

      {showDetails && selectedOrder && (
        <Modal
          onClose={() => {
            setSelectedOrder(null);
            setShowDetails(false);
          }}
          isOpen={showDetails}
          className="!w-[95%] !md:w-[1000px] !max-h-[92vh] !max-w-[1000px] !bg-white  !flex !flex-col "
        >
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => {
              setShowDetails(false);
              setSelectedOrder({});
            }}
            isAdmin={true}
            // onStatusUpdate={updateOrderStatus}
            updateOrderStatus={updateOrderStatus}
            loadingId={loadingId}
          />
        </Modal>
      )}
    </>
  );
};

export default OrderList;
