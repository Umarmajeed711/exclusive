import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Context";
import OrderList from "./OrderList";
import api from "./api";
import { showToast } from "./types";

// const orders = [
//   { id: 1, name: "Ali", total: "$120", status: "Delivered" },
//   { id: 2, name: "Ahmed", total: "$80", status: "Pending" },
//   { id: 3, name: "Sara", total: "$200", status: "Shipped" },
// ];

const RecentOrders = () => {
  const { state } = useContext(GlobalContext);

  let isAdmin = state?.isAdmin;

  const [loading, setloading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const [Orders, setOrders] = useState([]);

  const [OrdersByPage, setOrdersByPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit, setLimit] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);

  const getOrders = async ({ filters = {}, page = 1, limit = 5 } = {}) => {
    setloading(true);

    try {
      const result = await api.get("/orders", {
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
        [page]: result?.data?.data,
      }));

      console.log("total Orders", result?.data?.totalOrders);
      console.log("total Orders", result?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const [loadingId, setLoadingId] = useState(null);

  const updateOrderStatus = async (order_id, field, value) => {
    const prevOrders = Orders;

    setLoadingId(order_id);

    setOrders((prev) =>
      prev.map((o) => (o.order_id === order_id ? { ...o, [field]: value } : o)),
    );

    try {
      await api.put(`/orders/${order_id}/status`, {
        [field]: value,
      });
    } catch (error) {
      setOrders(prevOrders);
    } finally {
      setLoadingId(null);
    }
  };

  const deleteOrder = async (id) => {
    const previousOrders = Orders;

    setLoadingId(id);

    setOrders((prev) => prev.filter((p) => p.order_id !== id));

    try {
      let res =  await api.delete(`/order/${id}`);
      
      showToast({
                icon: "success",
                title:
                  res?.data?.message ||
                  "Deleted Successfully",
              });

      
    } catch (error) {
      console.log(error);

      setOrders(previousOrders);

       showToast({
                icon: "error",
                title:
                  error?.data?.message ||
                  "Failed to delete Order",
              });

     
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      {/* <h3 className="font-semibold mb-4"></h3> */}

      <OrderList
        title="Recent Orders"
        products={Orders}
        loading={loading}
        isAdmin={isAdmin}
        loadingId={loadingId}
        updateOrderStatus={updateOrderStatus}
        deleteOrder={deleteOrder}
      />

      {/* <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>ID</th>
            <th>Name</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td>#{order.id}</td>
              <td>{order.name}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default RecentOrders;
