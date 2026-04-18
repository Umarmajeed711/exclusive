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

const OrderDetailsModal = ({
  order,
  onClose,
  isAdmin,
  updateOrderStatus = () => {},
  loadingId,
}) => {
  const [zoomImg, setZoomImg] = useState(null);

  const currentIndex = STATUS_FLOW.indexOf(order.delivery_status);

  /* =========================
     STATUS UPDATE
  ========================= */
  // const updateStatus = async (field, value) => {
  //   try {
  //     await api.put(`/orders/${order.order_id}/status`, {
  //       [field]: value,
  //     });

  //     onStatusUpdate({
  //       order_id: order.order_id,
  //       [field]: value,
  //     });

  //     Swal.fire({
  //       icon: "success",
  //       toast: true,
  //       position: "bottom-left",
  //       timer: 1500,
  //       showConfirmButton: false,
  //       title: "Updated",
  //     });
  //   } catch {
  //     Swal.fire({
  //       icon: "error",
  //       toast: true,
  //       position: "bottom-left",
  //       timer: 1500,
  //       showConfirmButton: false,
  //       title: "Failed",
  //     });
  //   }
  // };

  // const COMPANY = {
  //   name: "Exclusive Store",
  //   address: "Karachi, Pakistan",
  //   phone: "+92 300 0000000",
  //   email: "support@exlusive.com",
  // };


  // const loadImageAsBase64 = (url) => {
  //   return new Promise((resolve) => {
  //     if (!url) return resolve(null);

  //     const img = new Image();
  //     img.crossOrigin = "Anonymous";

  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0);

  //       resolve(canvas.toDataURL("image/jpeg")); // universal format
  //     };

  //     img.onerror = () => resolve(null);

  //     img.src = url;
  //   });
  // };

  // const preloadImages = async (items) => {
  //   const images = [];

  //   for (let item of items) {
  //     const base64 = await loadImageAsBase64(item.image_url);
  //     images.push(base64);
  //   }

  //   return images;
  // };


  // const generateInvoice = async (order) => {
  //   const doc = new jsPDF();

  //   const images = await preloadImages(order.items);

  //   /* =========================
  //    HEADER
  // ========================= */
  //   doc.setFontSize(18);
  //   doc.setTextColor(40);
  //   doc.text("INVOICE", 14, 20);

  //   doc.setFontSize(10);
  //   doc.text(COMPANY.name, 14, 30);
  //   doc.text(COMPANY.address, 14, 35);
  //   doc.text(COMPANY.phone, 14, 40);
  //   doc.text(COMPANY.email, 14, 45);

  //   /* =========================
  //    ORDER INFO
  // ========================= */
  //   doc.text(`Invoice #: INV-${order.order_id}`, 140, 30);
  //   doc.text(
  //     `Date: ${new Date(order.order_date).toLocaleDateString()}`,
  //     140,
  //     35,
  //   );
  //   doc.text(`Payment: ${order.payment_status}`, 140, 40);

  //   /* =========================
  //    CUSTOMER INFO
  // ========================= */
  //   doc.text("Bill To:", 14, 60);
  //   doc.setFont("helvetica", "bold");
  //   doc.text(order.shipping_name || "-", 14, 66);
  //   doc.setFont("helvetica", "normal");
  //   doc.text(order.shipping_phone || "-", 14, 72);
  //   doc.text(order.shipping_address || "-", 14, 78);

  //   /* =========================
  //    PREPARE TABLE
  // ========================= */
  //   let tableRows = [];

  //   let subtotal = 0;

  //   for (let i = 0; i < order?.items?.length; i++) {
  //     const item = order.items[i];

  //     const total = item.quantity * item.price;
  //     subtotal += total;

  //     tableRows.push([
  //       i + 1,
  //       "", // image column
  //       item.product_name || "Product",
  //       item.quantity,
  //       `$${item.price}`,
  //       `$${total}`,
  //     ]);
  //   }

  //   /* =========================
  //    TABLE
  // ========================= */
  //   autoTable(doc, {
  //     startY: 90,
  //     head: [["#", "Image", "Product", "Qty", "Price", "Total"]],
  //     body: tableRows,

  //     didDrawCell: (data) => {
  //       if (data.section === "body" && data.column.index === 1) {
  //         const img = images[data.row.index];

  //         if (img) {
  //           doc.addImage(img, "JPEG", data.cell.x + 2, data.cell.y + 2, 10, 5);
  //         }
  //       }
  //     },
  //   });

  //   /* =========================
  //    TOTAL CALCULATION
  // ========================= */
  //   const finalY = doc.lastAutoTable.finalY + 10;

  //   const taxRate = 0.05; // 5%
  //   const tax = subtotal * taxRate;

  //   const discount = order.discount || 0;

  //   const grandTotal = subtotal + tax - discount;

  //   doc.setFontSize(11);

  //   doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY);
  //   doc.text(`Tax (5%): $${tax.toFixed(2)}`, 140, finalY + 6);
  //   doc.text(`Discount: $${discount}`, 140, finalY + 12);

  //   doc.setFont("helvetica", "bold");
  //   doc.text(`Total: $${grandTotal.toFixed(2)}`, 140, finalY + 20);

  //   /* =========================
  //    FOOTER
  // ========================= */
  //   doc.setFont("helvetica", "normal");
  //   doc.setFontSize(9);

  //   doc.text("Thank you for shopping with us!", 14, finalY + 30);

  //   doc.text("This is a system generated invoice.", 14, finalY + 36);

  //   /* =========================
  //    SAVE
  // ========================= */
  //   doc.save(`invoice-${order.order_id}.pdf`);
  // };

  return (
    <>
      {/* BACKDROP */}
      {/* <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1010]"> */}

      {/* MODAL */}
      {/* <div className="w-[95%] md:w-[1000px] max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"> */}

      {/* ================= HEADER ================= */}
      <div className="p-4 sm:p-5 border-b flex justify-between items-start sm:items-center gap-2 bg-white sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-semibold">Order #{order.order_id}</h2>
          <p className="text-xs text-gray-500">
            {new Date(order.order_date).toLocaleString()}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 space-y-6 custom-scrollbar">
        {/* ================= TIMELINE ================= */}

        <div className="bg-white p-4 sm:p-6 rounded-2xl border shadow-sm overflow-x-auto">
  <div className="relative min-w-[500px]">
            <div className="absolute top-5  left-10 right-10 h-[3px]">
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

        {/* ================= INFO ================= */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CUSTOMER */}
          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-semibold mb-3">Customer</h3>

            <p className="font-medium">{order.shipping_name}</p>
            <p className="text-sm text-gray-500">{order.shipping_phone}</p>
            <p className="text-sm text-gray-500">{order.shipping_address}</p>
          </div>

          {/* ORDER */}
          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-semibold mb-3">Order Info</h3>

            {/* PAYMENT */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3">
              <span>Payment</span>

              {isAdmin ? (
                
                <PaymentStatusDropdown
                  order={order}
                  updateOrderStatus={updateOrderStatus}
                  loadingId={loadingId}
                />
              ) : (
                <b>{formatText(order.payment_status)}</b>
              )}
            </div>

            {/* DELIVERY */}
           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span>Delivery</span>

              {isAdmin ? (
              
                <DeliveryStatusDropdown
                  order={order}
                  updateOrderStatus={updateOrderStatus}
                  loadingId={loadingId}
                />
              ) : (
                <b>{formatText(order?.delivery_status)}</b>
              )}
            </div>
          </div>
        </div>

        {/* ================= PRODUCTS ================= */}
        <div className="bg-white p-5 rounded-xl border">
          <h3 className="font-semibold mb-4">Products</h3>

          <div className="max-h-[260px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {order.items?.map((item) => (
             <div
  key={item.item_id}
  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 hover:bg-gray-50 rounded-lg"
>
                <img
                  src={item.image_url || "/placeholder.png"}
                  className="w-16 h-16 sm:w-14 sm:h-14 rounded object-cover cursor-pointer"
                  onClick={() => setZoomImg(item.image_url)}
                />



                <div className="flex-1">
                  <p className="font-medium">{item.product_name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>

               <p className="font-semibold sm:text-right">${item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= HIDDEN INVOICE TEMPLATE ================= */}
        <div id="invoice-box" className="p-10 bg-white hidden">
          <h1 className="text-2xl font-bold mb-4">INVOICE</h1>

          <p>Order ID: {order.order_id}</p>
          <p>Name: {order.shipping_name}</p>
          <p>Phone: {order.shipping_phone}</p>

          <hr className="my-4" />

          {order.items?.map((item) => (
            <div key={item.item_id} className="flex justify-between">
              <span>{item.product_name}</span>
              <span>
                {item.quantity} x {item.price}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <h2 className="text-lg font-bold">Total: ${order.total_price}</h2>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-5 rounded-xl border">
        <p className="text-lg font-semibold">Total: ${order.total_price}</p>

        <button
          onClick={() => {
            generateInvoice(order);
          }}
        
  className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:opacity-90"

        >
          Download Invoice PDF
        </button>
      </div>

      {/* </div> */}
      {/* </div> */}

      {/* ================= IMAGE ZOOM ================= */}
      {zoomImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomImg(null)}
        >
          <img src={zoomImg} className="max-w-[90%] max-h-[90%] rounded-xl" />
        </div>
      )}
    </>
  );
};

export default OrderDetailsModal;
