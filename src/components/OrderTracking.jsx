import { useState } from "react";
import api from "./api";
import Swal from "sweetalert2";
import Modal from "./modal";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import { formatText } from "./types";
import { DeliveryStatusDropdown, PaymentStatusDropdown } from "./statusOptions";
import { generateInvoice } from "./generateInvoice";
const STATUS_FLOW = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const statusIcons = {
  pending: "🕒",
  processing: "⚙️",
  shipped: "📦",
  out_for_delivery: "🚚",
  delivered: "✅",
};

export const OrderTrackingPage = ({
  order,
  isAdmin = false,
  updateOrderStatus,
  loadingId,
}) => {
  const currentIndex = STATUS_FLOW.indexOf(order.delivery_status);

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* ================= HEADER ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border shadow-sm flex flex-col sm:items-center sm:flex-row justify-between gap-2">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold">
              Order #{order.order_id}
            </h1>
            <p className="text-xs text-gray-500">
              {new Date(order.order_date).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-2">

          <span className="text-base font-medium">
            Payment Method:
          </span>
          <span className="px-3 py-1 h-full rounded-full text-xs font-medium border bg-gray-100">
            {formatText(order.payment_method == "online" ? "Stripe" : "Cash on Delivery")}
          </span>
          </div> 

        </div>

        {/* ================= TIMELINE ================= */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border shadow-sm overflow-x-auto">
          <div className="relative min-w-[500px]">
            <div className="absolute top-5  left-14 right-14 h-[3px]">
              {/* Base Line */}
              <div className="w-full   h-full bg-gray-200 rounded-full" />

              {/* Active Line */}
              <div
                className="h-full -mt-[2px] top-5 bg-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${(currentIndex / (STATUS_FLOW.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Steps */}
            <div className="flex justify-between relative">
              {STATUS_FLOW.map((step, i) => {
                const isCompleted = i < currentIndex || currentIndex == 4;
                const isCurrent = i === currentIndex;

                return (
                  <div key={step} className="flex flex-col items-center w-full">
                    {/* Circle */}
                    <div
                      className={`w-[42px] h-[42px] flex items-center justify-center rounded-full text-sm z-10 border transition-all duration-300
                       ${
                         isCompleted
                           ? "bg-green-500 text-white border-green-500 border-2"
                           : isCurrent
                             ? "bg-white text-green-600 border-green-500 border-2 scale-110 shadow"
                             : "bg-white text-gray-400 border-gray-300 border-2"
                       }
                     `}
                    >
                      {isCompleted ? "✔" : statusIcons[step]}
                    </div>

                    {/* Label */}
                    <p
                      className={`text-xs mt-2 text-center capitalize
                       ${
                         isCompleted || isCurrent
                           ? "text-gray-800 font-medium"
                           : "text-gray-400"
                       }
                     `}
                    >
                      {formatText(step)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= SUMMARY ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Payment */}
          <div className="bg-white p-4 rounded-xl border">
            <p className="text-xs text-gray-500 mb-1">Payment</p>

            {isAdmin ? (
              <PaymentStatusDropdown
                order={order}
                updateOrderStatus={updateOrderStatus}
                loadingId={loadingId}
              />
            ) : (
              <p className="font-medium">{formatText(order.payment_status)}</p>
            )}
          </div>

          {/* Delivery */}
          <div className="bg-white p-4 rounded-xl border">
            <p className="text-xs text-gray-500 mb-1">Delivery</p>

            {isAdmin ? (
              <DeliveryStatusDropdown
                order={order}
                updateOrderStatus={updateOrderStatus}
                loadingId={loadingId}
              />
            ) : (
              <p className="font-medium">{formatText(order.delivery_status)}</p>
            )}
          </div>

          {/* Total */}
          <div className="bg-white p-4 rounded-xl border">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="font-semibold text-lg">${order.total_price}</p>
          </div>
        </div>

        {/* ================= DELIVERY INFO ================= */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border">
          <h3 className="font-semibold mb-3">Delivery Information</h3>

          <p className="font-medium">{order.shipping_name}</p>
          <p className="text-sm text-gray-500">{order.shipping_phone}</p>
          <p className="text-sm text-gray-500">{order.shipping_address}</p>
        </div>

        {/* ================= PRODUCTS ================= */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border">
          <h3 className="font-semibold mb-4">Products</h3>

          <div className="space-y-3 !max-h-[260px] overflow-y-auto custom-scrollbar">
            {order.items?.map((item) => (
              <div
                key={item.item_id}
                className=" flex flex-row sm:flex-row sm:items-center gap-1 p-3 rounded-lg hover:bg-gray-50"
              >

                <img
                  src={item.image_url || "/placeholder.png"}
                  className="w-16 h-16 rounded object-cover"
                />

                <div className="flex flex-col sm:flex-row sm:justify-between w-full">
                <div className="flex-1">
                  <p className="font-medium text-xs sm:text-base">{item.product_name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">${item.price}</p>

                </div>

                </div>

            
            ))}
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-lg font-semibold">Total: ${order.total_price}</p>

          <button
            onClick={() => generateInvoice(order)}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
