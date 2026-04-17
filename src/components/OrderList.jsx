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
   STATUS OPTIONS
================================ */
const DELIVERY_STATUS = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];
const statusColors = {
  pending: "bg-gray-100 text-gray-700 border-gray-300",

  processing: "bg-blue-100 text-blue-700 border-blue-300",

  shipped: "bg-indigo-100 text-indigo-700 border-indigo-300",

  out_for_delivery: "bg-purple-100 text-purple-700 border-purple-300",

  delivered: "bg-green-100 text-green-700 border-green-300",

  cancelled: "bg-red-100 text-red-700 border-red-300",
};

const PAYMENT_STATUS = ["unpaid", "paid", "failed", "refunded"];

const paymentStatusIcons = {
  unpaid: "⏳",
  paid: "✅",
  failed: "❌",
  refunded: "↩️",
};

const paymentStatusStyles = {
  unpaid: "bg-yellow-100 text-yellow-700 border-yellow-300",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",

  paid: "bg-green-100 text-green-700 border-green-300",

  failed: "bg-red-100 text-red-700 border-red-300",

  refunded: "bg-gray-100 text-gray-700 border-gray-300",
};

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

  useEffect(() => {
    if(selectedOrder){
      const select = products?.filter((p) => p?.order_id  == selectedOrder?.order_id);
      setSelectedOrder(select[0])
    }
  },[products])
  

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
          <div className="flex items-center ">
            <span className="font-semibold bg-slate-300 px-2  rounded">
              {order.payment_method == "cod" ? "Cash" : "Online"}
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
          //         <select
          //           value={order.payment_status}
          //           onChange={(e) =>
          //             updateOrderStatus(
          //               order.order_id,
          //               "payment_status",
          //               e.target.value,
          //             )
          //           }
          //           disabled={loadingId === order.order_id}
          //           className={`border rounded px-2 py-1 text-sm  ${paymentStatusStyles[order.payment_status] || ""}
          //   ${loadingId === order.order_id ? "opacity-50 cursor-not-allowed" : ""}
          // `}
          //         >
          //           {PAYMENT_STATUS.map((opt) => (
          //             <option key={opt} value={opt}>
          //               {paymentStatusIcons[opt]}
          //               {formatText(opt)}
          //             </option>
          //           ))}
          //         </select>
        );

      case "delivery_status":
        return (
          <DeliveryStatusDropdown
            order={order}
            updateOrderStatus={updateOrderStatus}
            loadingId={loadingId}
          />
          //         <select
          //           value={order.delivery_status}
          //           onChange={(e) =>
          //             updateOrderStatus(
          //               order.order_id,
          //               "delivery_status",
          //               e.target.value,
          //             )
          //           }
          //           className={`border rounded px-2 py-1 text-sm  ${statusColors[order.delivery_status] || ""}
          //   ${loadingId === order.order_id ? "opacity-50 cursor-not-allowed" : ""}
          // `}
          //         >
          //           {DELIVERY_STATUS.map((opt) => (
          //             <option key={opt} value={opt}>
          //               {formatText(opt)}
          //             </option>
          //           ))}
          //         </select>
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
                onClick={() => {
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

  /* ==============================
     RENDER
  ================================ */
  return (
    <>
      <div className="bg-white rounded-xl shadow p-4">
        {loading ? (
          <div className="flex justify-center items-center h-48 sm:h-96">
            <div className="loading"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-lg font-medium">No Orders Found</p>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Orders</h2>

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
                  {products?.map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-b hover:bg-gray-50"
                    >
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
