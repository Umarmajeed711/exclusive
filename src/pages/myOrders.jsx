import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import { GlobalContext } from "../context/Context";
import OrderDetailsModal from "../components/OrderDetailModal";
import api from "../components/api";

const OrdersPage = () => {
  const { state } = useContext(GlobalContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders?user_id=${state?.user?.user_id}`);
      setOrders(res.data.data);
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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
    <div className="px-5 md:px-10 py-6">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="bg-white rounded-xl shadow hover:shadow-2xl transition duration-300 p-4 group hover:-translate-y-2"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-semibold text-sm">
                  Order #{order.order_id}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.order_date).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(
                  order.delivery_status
                )}`}
              >
                {order.delivery_status}
              </span>
            </div>

            {/* PRODUCTS PREVIEW */}
            <div className="flex items-center gap-2 mb-4">
              {order.items?.slice(0, 3).map((item, i) => (
                <img
                  key={i}
                  src={item.image_url}
                  alt=""
                  className="w-12 h-12 rounded object-cover border"
                />
              ))}

              {order.items?.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{order.items.length - 3} more
                </div>
              )}
            </div>

            {/* TOTAL */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 text-sm">Total</p>
              <p className="font-semibold text-lg">
                ${order.total_price}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex-1 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                View Details
              </button>

              <button
                onClick={() =>
                  Swal.fire("Coming Soon", "Invoice feature here", "info")
                }
                className="px-3 py-2 border rounded hover:bg-gray-100"
              >
                Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default OrdersPage;