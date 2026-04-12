import { useState } from "react";
import api from "./api";
import Swal from "sweetalert2";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

const STATUS_FLOW = [
  "pending",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const OrderDetailsModal = ({
  order,
  onClose,
  isAdmin,
  onStatusUpdate,
}) => {
  const [zoomImg, setZoomImg] = useState(null);

  const currentIndex = STATUS_FLOW.indexOf(order.delivery_status);

  /* =========================
     STATUS UPDATE
  ========================= */
  const updateStatus = async (field, value) => {
    try {
      await api.put(`/orders/${order.order_id}/status`, {
        [field]: value,
      });

      onStatusUpdate({
        order_id: order.order_id,
        [field]: value,
      });

      Swal.fire({
        icon: "success",
        toast: true,
        position: "bottom-left",
        timer: 1500,
        showConfirmButton: false,
        title: "Updated",
      });
    } catch {
      Swal.fire({
        icon: "error",
        toast: true,
        position: "bottom-left",
        timer: 1500,
        showConfirmButton: false,
        title: "Failed",
      });
    }
  };

  /* =========================
     PDF INVOICE GENERATOR
  ========================= */
//   const generateInvoice = async () => {
//     const input = document.getElementById("invoice-box");

//     const canvas = await html2canvas(input, { scale: 2 });
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");

//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`invoice-${order.order_id}.pdf`);
//   };

  return (
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

        {/* MODAL */}
        <div className="w-[95%] md:w-[1000px] max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">

          {/* ================= HEADER ================= */}
          <div className="p-5 border-b flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-xl font-semibold">
                Order #{order.order_id}
              </h2>
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
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-6">

            {/* ================= TIMELINE ================= */}
            <div className="bg-white p-5 rounded-xl border">

              <div className="relative mb-4">
                <div className="h-[4px] bg-gray-200 rounded-full absolute top-4 w-full"></div>

                <div
                  className="h-[4px] bg-green-500 rounded-full absolute top-4 transition-all duration-500"
                  style={{
                    width: `${
                      (currentIndex / (STATUS_FLOW.length - 1)) * 100
                    }%`,
                  }}
                />

                <div className="flex justify-between relative">
                  {STATUS_FLOW.map((step, i) => {
                    const active = i <= currentIndex;

                    return (
                      <div
                        key={step}
                        className="flex flex-col items-center w-full"
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold z-10
                          ${
                            active
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {i + 1}
                        </div>

                        <p className="text-[11px] mt-2 capitalize text-gray-600 text-center">
                          {step.replaceAll("_", " ")}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= INFO ================= */}
            <div className="grid md:grid-cols-2 gap-4">

              {/* CUSTOMER */}
              <div className="bg-white p-5 rounded-xl border">
                <h3 className="font-semibold mb-3">Customer</h3>

                <p className="font-medium">{order.shipping_name}</p>
                <p className="text-sm text-gray-500">
                  {order.shipping_phone}
                </p>
                <p className="text-sm text-gray-500">
                  {order.shipping_address}
                </p>
              </div>

              {/* ORDER */}
              <div className="bg-white p-5 rounded-xl border">
                <h3 className="font-semibold mb-3">Order Info</h3>

                {/* PAYMENT */}
                <div className="flex justify-between items-center mb-3">
                  <span>Payment</span>

                  {isAdmin ? (
                    <select
                      value={order.payment_status}
                      onChange={(e) =>
                        updateStatus("payment_status", e.target.value)
                      }
                      className="border px-2 py-1 rounded text-sm"
                    >
                      <option>paid</option>
                      <option>unpaid</option>
                      <option>failed</option>
                      <option>refunded</option>
                    </select>
                  ) : (
                    <b>{order.payment_status}</b>
                  )}
                </div>

                {/* DELIVERY */}
                <div className="flex justify-between items-center">
                  <span>Delivery</span>

                  {isAdmin ? (
                    <select
                      value={order.delivery_status}
                      onChange={(e) =>
                        updateStatus("delivery_status", e.target.value)
                      }
                      className="border px-2 py-1 rounded text-sm"
                    >
                      {STATUS_FLOW.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <b>{order.delivery_status}</b>
                  )}
                </div>
              </div>
            </div>

            {/* ================= PRODUCTS ================= */}
            <div className="bg-white p-5 rounded-xl border">
              <h3 className="font-semibold mb-4">Products</h3>

              <div className="max-h-[260px] overflow-y-auto pr-2 space-y-3">
                {order.items?.map((item) => (
                  <div
                    key={item.item_id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.image_url || "/placeholder.png"}
                      className="w-14 h-14 rounded object-cover cursor-pointer"
                      onClick={() => setZoomImg(item.image_url)}
                    />

                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">${item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="flex justify-between items-center bg-white p-5 rounded-xl border">
              <p className="text-lg font-semibold">
                Total: ${order.total_price}
              </p>

              <button
                // onClick={generateInvoice}
                className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90"
              >
                Download Invoice PDF
              </button>
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

              <h2 className="text-lg font-bold">
                Total: ${order.total_price}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* ================= IMAGE ZOOM ================= */}
      {zoomImg && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomImg(null)}
        >
          <img
            src={zoomImg}
            className="max-w-[90%] max-h-[90%] rounded-xl"
          />
        </div>
      )}
    </>
  );
};

export default OrderDetailsModal;