import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../components/api";
import { OrderTrackingPage } from "../components/OrderTracking";
import Swal from "sweetalert2";

export const OrderTrackingWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const [loadingId, setLoadingId] = useState(null);

  /* ================= FETCH ================= */
  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 403) {
        setAccessDenied(true);
      } else if (err.response?.status === 404) {
        setError("Order not found");
      } else {
        setError("Something went wrong");
        Swal.fire({
          icon: "error",
          title: "Failed to update",
          toast: true,
          position: "bottom-left",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /* ================= UPDATE ================= */
  const updateOrderStatus = async (order_id, field, value) => {
    const prevOrder = order;

    setLoadingId(order_id);

    // 🔥 optimistic update
    setOrder((prev) =>
      prev?.order_id === order_id ? { ...prev, [field]: value } : prev,
    );

    try {
      await api.put(`/orders/${order_id}/status`, {
        [field]: value,
      });
    } catch (error) {
      setOrder(prevOrder); // rollback
    } finally {
      setLoadingId(null);
    }
  };

  /* ================= UI STATES ================= */

  // 🔥 Skeleton Loader
  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4 animate-pulse mx-4 md:mx-10 lg:mx-14">
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-xl" />
          <div className="h-20 bg-gray-200 rounded-xl" />
        </div>
        <div className="h-40 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  // ❌ Access Denied
  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-semibold text-red-500 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-500 mb-4">
          You are not allowed to view this order.
        </p>

        <button
          onClick={() => navigate("/orders")}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-xl font-semibold mb-2">{error}</h2>

        <div className="flex gap-3">
          <button
            onClick={fetchOrder}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Retry
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // ❌ No Data Safety
  if (!order) return null;

  /* ================= MAIN ================= */
  return (
    <OrderTrackingPage
      order={order}
      updateOrderStatus={updateOrderStatus}
      loadingId={loadingId}
    />
  );
};
