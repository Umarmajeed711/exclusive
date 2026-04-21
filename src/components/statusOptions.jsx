import { useState, useRef, useEffect } from "react";
import { formatText } from "./types";

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

export const PaymentStatusDropdown = ({
  order,
  updateOrderStatus,
  loadingId,
  isDisabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setOpen(false);

    // 🔥 SAME LOGIC (no change)
    updateOrderStatus(order.order_id, "payment_status", value);
  };

  return (
    <div className="relative w-36" ref={dropdownRef}>
      {/* Selected */}
      <button
        disabled={loadingId === order.order_id || isDisabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className={`w-full flex items-center justify-between px-3 py-1 border rounded text-sm 
          ${paymentStatusStyles[order.payment_status]}
          ${loadingId === order.order_id ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <span className="flex items-center gap-2">
          {paymentStatusIcons[order.payment_status ?? PAYMENT_STATUS[0]]}
          {formatText(order.payment_status ?? PAYMENT_STATUS[0])}
        </span>

        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg overflow-hidden">
          {PAYMENT_STATUS.map((opt) => (
            <div
              key={opt}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                handleSelect(opt);
              }}
              className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
                ${opt === order.payment_status ? "bg-gray-50" : ""}
              `}
            >
              <span>{paymentStatusIcons[opt]}</span>
              <span>{formatText(opt)}</span>

              {/* Selected Tick */}
              {opt === order.payment_status && (
                <span className="ml-auto text-green-600">✔</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const DeliveryStatusDropdown = ({
  order,
  updateOrderStatus,
  loadingId,
  isDisabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    setOpen(false);

    // 🔥 SAME LOGIC
    updateOrderStatus(order.order_id, "delivery_status", value);
  };

  return (
    <div className="relative w-36" ref={dropdownRef}>
      {/* Selected */}
      <button
        disabled={loadingId === order.order_id || isDisabled}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setOpen((prev) => !prev);
        }}
        className={`w-full flex items-center justify-between px-3 py-1 border rounded text-sm 
          ${statusColors[order.delivery_status]}
          ${loadingId === order.order_id ? "opacity-10 cursor-not-allowed" : ""}
        `}
      >
        <span>{formatText(order.delivery_status ?? DELIVERY_STATUS[0])}</span>
        <span className="text-xs">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg overflow-hidden">
          {DELIVERY_STATUS.map((opt) => (
            <div
              key={opt}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(opt);
              }}
              className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
                ${opt === order.delivery_status ? "bg-gray-50" : ""}
              `}
            >
              <span>{formatText(opt)}</span>

              {/* Selected Tick */}
              {opt === order.delivery_status && (
                <span className="ml-auto text-green-600">✔</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
