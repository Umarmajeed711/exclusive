import { useEffect, useState, useContext, useMemo } from "react";
import Swal from "sweetalert2";
import { GlobalContext } from "../context/Context";
import OrderDetailsModal from "../components/OrderDetailModal";
import api from "../components/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ActiveFilters } from "../components/ActiveFilters";
import { MdOutlineFilterAlt } from "react-icons/md";
import Pagination from "../components/Pagination";
import SmartFilter from "../components/SmartFilters";
import { FILTER_OPERATORS, INPUT_TYPES } from "../components/types";

const OrdersPage = () => {
  const { state, dispatch } = useContext(GlobalContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showFilter, setShowFilter] = useState(false);
  const [productsByPage, setProductsByPage] = useState({});

  const [OrdersByPage, setOrdersByPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit, setLimit] = useState(12);
  const [totalOrders, setTotalOrders] = useState(0);

  // const fetOrders = async () => {
  //   try {
  //     const res = await api.get(`/orders?user_id=${state?.user?.user_id}`);
  //     setOrders(res.data.data);
  //   } catch (err) {
  //     console.log(err);
  //     Swal.fire("Error", "Failed to load orders", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getOrders = async ({ filters = {}, page = 1, limit = 12 } = {}) => {
    setLoading(true);

    try {
      const result = await api.get("/orders?user_id=${state?.user?.user_id}", {
        params: {
          page,
          limit,
          filters: JSON.stringify(filters),
        },
      });

      setOrders(result?.data?.data);
      setCurrentPage(result?.data?.currentPage);
      setTotalPages(result?.data?.totalPages);
      setTotalOrders(result?.data?.totalOrders);
      setOrdersByPage((prev) => ({
        ...prev,
        [page]: result?.data,
      }));
    } catch (error) {
      Swal.fire("Error", "Failed to load orders", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-purple-100 text-purple-700";
      case "shipped":
        return "bg-indigo-100 text-indigo-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const [activeTab, setActiveTab] = useState("active");

  const counts = useMemo(() => {
    return {
      active: orders.filter((o) =>
        ["pending", "processing", "shipped"].includes(o.delivery_status),
      ).length,
      completed: orders.filter((o) => o.delivery_status === "delivered").length,
      cancelled: orders.filter((o) => o.delivery_status === "cancelled").length,
    };
  }, [orders]);

  const filterOrders = () => {
    if (activeTab === "active") {
      return orders.filter((o) =>
        ["pending", "processing", "shipped"].includes(o.delivery_status),
      );
    }

    if (activeTab === "completed") {
      return orders.filter((o) => o.delivery_status === "delivered");
    }

    if (activeTab === "cancelled") {
      return orders.filter((o) => o.delivery_status === "cancelled");
    }

    return orders;
  };

  const filteredOrders = filterOrders();

  const handleReorder = async (order) => {
    try {
      for (let item of order?.items) {
        console.log("item", item);

        await api.post("/add-cart", {
          productId: item.product_id,
          productName: item?.product_name,
          productPrice: item.price,
          productDiscount: item.discount,
          productImage: item?.image_url,
          productSize: item?.sizes,
          productColor: item?.colors,
          quantity: item?.quantity,
          user_id: state?.user?.user_id,
        });
      }

      dispatch({ type: "TOGGLE_CART" });

      Swal.fire({
        icon: "success",
        title: "Items added to cart",
        toast: true,
        position: "bottom-left",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const COMPANY = {
    name: "Exclusive Store",
    address: "Karachi, Pakistan",
    phone: "+92 300 0000000",
    email: "support@exlusive.com",
  };

  const loadImageAsBase64 = (url) => {
    return new Promise((resolve) => {
      if (!url) return resolve(null);

      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL("image/jpeg")); // universal format
      };

      img.onerror = () => resolve(null);

      img.src = url;
    });
  };

  const preloadImages = async (items) => {
    const images = [];

    for (let item of items) {
      const base64 = await loadImageAsBase64(item.image_url);
      images.push(base64);
    }

    return images;
  };

  const generateInvoice = async (order) => {
    const doc = new jsPDF();

    const images = await preloadImages(order.items);

    /* =========================
       HEADER
    ========================= */
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("INVOICE", 14, 20);

    doc.setFontSize(10);
    doc.text(COMPANY.name, 14, 30);
    doc.text(COMPANY.address, 14, 35);
    doc.text(COMPANY.phone, 14, 40);
    doc.text(COMPANY.email, 14, 45);

    /* =========================
       ORDER INFO
    ========================= */
    doc.text(`Invoice #: INV-${order.order_id}`, 140, 30);
    doc.text(
      `Date: ${new Date(order.order_date).toLocaleDateString()}`,
      140,
      35,
    );
    doc.text(`Payment: ${order.payment_status}`, 140, 40);

    /* =========================
       CUSTOMER INFO
    ========================= */
    doc.text("Bill To:", 14, 60);
    doc.setFont("helvetica", "bold");
    doc.text(order.shipping_name || "-", 14, 66);
    doc.setFont("helvetica", "normal");
    doc.text(order.shipping_phone || "-", 14, 72);
    doc.text(order.shipping_address || "-", 14, 78);

    /* =========================
       PREPARE TABLE
    ========================= */
    let tableRows = [];

    let subtotal = 0;

    for (let i = 0; i < order?.items?.length; i++) {
      const item = order.items[i];

      const total = item.quantity * item.price;
      subtotal += total;

      tableRows.push([
        i + 1,
        "", // image column
        item.product_name || "Product",
        item.quantity,
        `$${item.price}`,
        `$${total}`,
      ]);
    }

    /* =========================
       TABLE
    ========================= */
    autoTable(doc, {
      startY: 90,
      head: [["#", "Image", "Product", "Qty", "Price", "Total"]],
      body: tableRows,

      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          const img = images[data.row.index];

          if (img) {
            doc.addImage(img, "JPEG", data.cell.x + 2, data.cell.y + 2, 10, 5);
          }
        }
      },
    });

    /* =========================
       TOTAL CALCULATION
    ========================= */
    const finalY = doc.lastAutoTable.finalY + 10;

    const taxRate = 0.05; // 5%
    const tax = subtotal * taxRate;

    const discount = order.discount || 0;

    const grandTotal = subtotal + tax - discount;

    doc.setFontSize(11);

    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, finalY);
    doc.text(`Tax (5%): $${tax.toFixed(2)}`, 140, finalY + 6);
    doc.text(`Discount: $${discount}`, 140, finalY + 12);

    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${grandTotal.toFixed(2)}`, 140, finalY + 20);

    /* =========================
       FOOTER
    ========================= */
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    doc.text("Thank you for shopping with us!", 14, finalY + 30);

    doc.text("This is a system generated invoice.", 14, finalY + 36);

    /* =========================
       SAVE
    ========================= */
    doc.save(`invoice-${order.order_id}.pdf`);
  };

  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedCancelOrder, setSelectedCancelOrder] = useState(null);

  const openCancelModal = (order) => {
    setSelectedCancelOrder(order);
    setCancelModal(true);
  };

  const handleCancel = async () => {
    console.log("selectedCancelOrder", selectedCancelOrder);

    try {
      await api.put(`/orders/${selectedCancelOrder?.order_id}/cancel`, {
        reason: cancelReason,
      });

      Swal.fire({
        icon: "success",
        title: "Order Cancelled",
        toast: true,
        position: "bottom-left",
        timer: 3000,
        showConfirmButton: false,
      });

      getOrders(); // reload
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err?.response?.data?.message || "Error",
        toast: true,
        position: "bottom-left",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setCancelModal(false);
      setCancelReason("");
    }
  };

  const orderFilters = [
    {
      key: "product_name",
      label: "Product Name",
      operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },
    {
      key: "order_id",
      label: "Order ID",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },

    {
      key: "payment_status",
      label: "Payment Status",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Paid", value: "paid" },
        { label: "pending", value: "pending" },
      ],
    },
    {
      key: "order_date",
      label: "Order Date",
      operators: [FILTER_OPERATORS.BETWEEN],
      inputType: INPUT_TYPES.DATE,
    },
  ];

  const [filters, setFilters] = useState([]);
  const [filterquery, setFilterQuery] = useState([]);

  const handleFilterApply = (query, activeFilters) => {
    setFilters(activeFilters);
    setProductsByPage({});
    setCurrentPage(1);
    setFilterQuery(query);
    getOrders({ filters: query, page: 1, limit });
  };

  const removeFilter = (index) => {
    const updated = filters?.filter((_, i) => i !== index);
    setFilters(updated);
    // getProducts(updated);
    getOrders({ filters: updated, page: 1, limit });
  };

  const clearAllFilters = () => {
    setFilters([]);
    // getProducts([]);
    getOrders({ filters: [], page: 1, limit });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (productsByPage[page]) {
      setCurrentPage(page);
      setOrders(productsByPage[page] || []);
      return;
    }

    getOrders({
      filters: filterquery,
      page,
      limit,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="loading"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-xl">
        No Orders Found
      </div>
    );
  }

  return (
    <div className="mx-5  md:mx-8 lg:mx-14 py-4 min-h-screen">
      {/* <h2 className="text-3xl font-bold mb-8 tracking-tight">My Orders</h2> */}
      <div className="flex flex-col  gap-5 my-5 sm:my-10">
        <div className="flex flex-row justify-between h-full md:items-center">
          <div className="flex gap-5 items-center">
            <p className="h-10 w-5 rounded bg-theme-primary"></p>
            <p className="text-theme-primary text-xl font-medium py-1">
              My Orders
            </p>
          </div>

          <div className="flex justify-center cursor-pointer">
            <button
              className={`button !p-[5px]  text-xl ${filters?.length > 0 ? "active" : ""}`}
              onClick={() => {
                setShowFilter(!showFilter);
              }}
            >
              <MdOutlineFilterAlt />
            </button>
          </div>
        </div>
        <ActiveFilters
          filters={filters}
          onRemove={removeFilter}
          onClear={clearAllFilters}
          showFilterModal={() => {
            setShowFilter(true);
          }}
        />
      </div>

      <div className="sticky top-0 z-40 backdrop-blur bg-gray-50/80 py-3 mb-2">
        <div className="flex flex-wrap gap-3  bg-white p-2 rounded-xl shadow-sm w-fit">
          {[
            { key: "active", label: "Active", count: counts?.active },
            { key: "completed", label: "Completed", count: counts?.completed },
            { key: "cancelled", label: "Cancelled", count: counts?.cancelled },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex  items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-black text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}

              {/* 🔥 COUNT BADGE */}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-white text-black"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
          <p className="text-lg">No {activeTab} orders</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredOrders.map((order) => {
            const isActive = ["pending", "processing", "shipped"].includes(
              order.delivery_status,
            );
            const isCompleted = order.delivery_status === "delivered";
            const isCancelled = order.delivery_status === "cancelled";
            return (
              <div
                key={order?.order_id}
                className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-2xl transition duration-500 hover:-translate-y-2 group"
              >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-base">
                      Order #{order?.order_id}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order?.order_date).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${getStatusStyle(
                      order?.delivery_status,
                    )}`}
                  >
                    {order?.delivery_status}
                  </span>
                </div>

                {/* PRODUCTS */}
                <div className="flex items-center mb-5">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <img
                      key={i}
                      src={item?.image_url}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                      style={{
                        marginLeft: i === 0 ? 0 : -10,
                      }}
                    />
                  ))}

                  {order?.items?.length > 4 && (
                    <div className="ml-2 text-xs text-gray-500 font-medium">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between items-center mb-5">
                  <p className="text-gray-500 text-sm">Total Amount</p>
                  <p className="font-bold text-lg text-theme-primary">
                    ${order?.total_price}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                  >
                    View
                  </button>

                  <button
                    onClick={() => generateInvoice(order)}
                    className="px-3 py-2 border rounded-lg hover:bg-gray-100 transition"
                  >
                    Invoice
                  </button>
                </div>

                {/* REORDER 🔥 */}
                {(isCompleted || isCancelled) && (
                  <button
                    onClick={() => handleReorder(order)}
                    className="mt-3 w-full py-2 text-sm text-green-700 border border-green-200 bg-green-100 rounded-lg hover:bg-green-200 transition"
                  >
                    Reorder
                  </button>
                )}

                {isActive &&
                  ["pending", "processing"].includes(
                    order?.delivery_status,
                  ) && (
                    <button
                      onClick={() => openCancelModal(order)}
                      className="mt-3 w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            );
          })}

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalOrders / limit)}
            totalProducts={totalOrders}
            pageSize={limit}
            isLoading={loading}
            onPageChange={handlePageChange}
          />

          {showFilter && (
            <SmartFilter
              showFilterModal={showFilter}
              filters={orderFilters}
              onChange={handleFilterApply}
              value={filters}
              onClose={() => {
                setShowFilter(false);
              }}
            />
          )}

          {/* ORDER DETAILS MODAL */}
          {selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}

          {/* CANCEL MODAL (UPGRADED) */}
          {cancelModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[1010]">
              <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-2xl animate-fadeIn">
                <h2 className="text-xl font-semibold mb-2">Cancel Order</h2>

                <p className="text-sm text-gray-500 mb-4">
                  Please tell us why you're cancelling this order
                </p>

                <textarea
                  placeholder="Enter reason..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border rounded-lg p-3 !h-28 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
                  rows={4}
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setCancelModal(false)}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>

                  <button
                    onClick={() => handleCancel()}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default OrdersPage;

{
  /* {orders?.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
      <p className="text-xl">No orders yet</p>
      <p className="text-sm">Start shopping to see your orders here</p>
    </div>
  ) : (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {orders?.map((order) => {
        return (
          <div
            key={order?.order_id}
            className="relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-2xl transition duration-500 hover:-translate-y-2 group"
          >
           
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-base">
                  Order #{order?.order_id}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order?.order_date).toLocaleDateString()}
                </p>
              </div>

             
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${getStatusStyle(
                  order?.delivery_status
                )}`}
              >
                {order?.delivery_status}
              </span>
            </div>

            
            <div className="flex items-center mb-5">
              {order.items?.slice(0, 4).map((item, i) => (
                <img
                  key={i}
                  src={item?.image_url}
                  alt=""
                  className={`w-12 h-12 rounded-full object-cover border-2 border-white shadow -ml-${
                    i === 0 ? "0" : "3"
                  }`}
                  style={{ marginLeft: i === 0 ? 0 : -10 }}
                />
              ))}

              {order?.items?.length > 4 && (
                <div className="ml-2 text-xs text-gray-500 font-medium">
                  +{order.items.length - 4}
                </div>
              )}
            </div>

            
            <div className="flex justify-between items-center mb-5">
              <p className="text-gray-500 text-sm">Total Amount</p>
              <p className="font-bold text-lg text-theme-primary">
                ${order?.total_price}
              </p>
            </div>

            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex-1 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
              >
                View
              </button>

              <button
                onClick={() => generateInvoice(order)}
                className="px-3 py-2.5 border rounded-lg hover:bg-gray-100 transition"
              >
                PDF
              </button>
            </div>

           
            {["pending", "processing"].includes(
              order?.delivery_status
            ) && (
              <button
                onClick={() => openCancelModal(order)}
                className="mt-3 w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                Cancel Order
              </button>
            )}
          </div>
        );
      })}
    </div>
  )} */
}
