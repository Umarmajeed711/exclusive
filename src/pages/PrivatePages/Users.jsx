import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/Context";
import ProductListView from "../../components/ProductList";
import Pagination from "../../components/Pagination";
import OrderList from "../../components/OrderList";
import { FILTER_OPERATORS, INPUT_TYPES } from "../../components/types";
import api from "../../components/api";
import SmartFilter from "../../components/SmartFilters";
import { ActiveFilters } from "../../components/ActiveFilters";
import { MdOutlineFilterAlt } from "react-icons/md";
import Swal from "sweetalert2";
import UsersList from "../../components/UsersList";

const Users = () => {
  const { state } = useContext(GlobalContext);

  let isAdmin = state?.isAdmin;

  const [loading, setloading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const [Users, setUsers] = useState([]);

  const [UsersByPage, setUsersByPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit, setLimit] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);

  const getUsers = async ({ filters = {}, page = 1, limit = 12 } = {}) => {
    setloading(true);

    try {
      const result = await api.get("/users", {
        params: {
          page,
          limit,
          filters: JSON.stringify(filters),
        },
      });

      setUsers(result?.data?.data);
      setCurrentPage(result?.data?.currentPage);
      setTotalPages(result?.data?.totalPages);
      setTotalUsers(result?.data?.totalUsers);
      setUsersByPage((prev) => ({
        ...prev,
        [page]: result?.data?.data,
      }));

      console.log("total Users", result?.data?.totalUsers);
      console.log("total Users", result?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const updateProduct = (updated) => {
    setUsers((prev) =>
      prev.map((o) =>
        o.order_id === updated.order_id ? { ...o, ...updated } : o,
      ),
    );
  };

  const [loadingId, setLoadingId] = useState(null);

  // const updateUser = async (order_id, field, value) => {
  //   const prevOrders = Users;

  //   setLoadingId(order_id);

  //   setUsers((prev) =>
  //     prev.map((o) => (o.order_id === order_id ? { ...o, [field]: value } : o)),
  //   );

  //   try {
  //     await api.put(`/orders/${order_id}/status`, {
  //       [field]: value,
  //     });
  //   } catch (error) {
  //     setUsers(prevOrders);
  //   } finally {
  //     setLoadingId(null);
  //   }
  // };

  const updateUserStatus = async ({ userId, field, value ,user = null}) => {
    const prevOrders = Users;

   

    try {

      

      if (user.user_role === 1) {
  return res.status(403).json({
    message: "You cannot modify Super Admin",
  });
}
     

      // 🔥 CONFIRMATION (important)
      const confirm = window.confirm(
        `Are you sure you want to update ${field}?`,
      );

      if (!confirm) return;

     


      setLoadingId(userId);

      
      

      setUsers((prev) =>
        prev.map((o) => (o.user_id === userId[0] ? { ...o, [field]: value } : o)),
      );

      const res = await api.put(`/users/status`, {
        ids: userId,
        [field]: value,
      });

      console.log("Updated:", res.data);

      // toast.success("User updated successfully");

      return res.data;
    } catch (error) {
      setUsers(prevOrders);
      console.log(error);
      // toast.error(error?.response?.data?.message);
    } finally {
      setLoadingId(null);
    }
  };

  const deleteUser = async (id) => {
    const previousOrders = Users;

    setLoadingId(id);

    setUsers((prev) => prev.filter((p) => p.order_id !== id));

    try {
      await api.delete(`/order/${id}`);

      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        toast: true,
        position: "bottom-left",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);

      setUsers(previousOrders);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "Something went wrong",
        toast: true,
        position: "bottom-left",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const orderFilters = [
    // {
    //   key: "product_name",
    //   label: "Product Name",
    //   operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
    //   inputType: INPUT_TYPES.TEXT,
    // },
    {
      key: "order_id",
      label: "Order ID",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },

    {
      key: "shipping_name",
      label: "Customer Name",
      operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },
    {
      key: "payment_status",
      label: "Payment Status",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Paid", value: "paid" },
        { label: "Un Paid", value: "unpaid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      key: "delivery_status",
      label: "Delivery Status",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "shipped", value: "shipped" },
        { label: "Out Of Delivery", value: "out_for_delivery" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      key: "payment_method",
      label: "Payment Method",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Online", value: "online" },
        { label: "Cash on Delivery", value: "cod" },
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
    setUsersByPage({});
    setCurrentPage(1);
    setFilterQuery(query);
    console.log("Filters", filters);
    console.log("query", query);
    getUsers({ filters: query, page: 1, limit });
  };

  const removeFilter = (index) => {
    const updated = filters?.filter((_, i) => i !== index);
    setFilters(updated);
    // getUsers(updated);
    getUsers({ filters: updated, page: 1, limit });
  };

  const clearAllFilters = () => {
    setFilters([]);
    // getUsers([]);
    getUsers({ filters: [], page: 1, limit });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (UsersByPage[page]) {
      setCurrentPage(page);
      setUsers(UsersByPage[page] || []);
      return;
    }

    getUsers({
      filters: filterquery,
      page,
      limit,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="mx-5  md:mx-8 lg:mx-14 py-4">
      <div>
        <div className="flex flex-col  gap-5 my-5 sm:my-10">
          <div className="flex flex-row justify-between h-full md:items-center">
            <div className="flex gap-5 items-center">
              <p className="h-10 w-5 rounded bg-theme-primary"></p>
              <p className="text-theme-primary text-xl font-medium">
                Explore All Users
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

          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-2">
              {totalUsers > 100 ? (
                <select
                  defaultValue={limit == totalUsers ? "All Users" : limit || ""}
                  onChange={(e) => {
                    const newLimit =
                      e.target.value == "all"
                        ? Number(totalUsers)
                        : Number(e.target.value);
                    setLimit(newLimit);
                    setCurrentPage(1);

                    getUsers({
                      filters: filterquery,
                      page: 1,
                      limit: newLimit,
                    });
                  }}
                  disabled={loading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm
               focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30
               hover:border-gray-400 transition"
                >
                  <option value="" disabled selected>
                    - limit Users -
                  </option>
                  <option value={100}>100 Users</option>
                  <option value={200}>200 Users</option>
                  <option value={500}>500 Users</option>
                  <option value="all">All Users</option>
                </select>
              ) : null}
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
        </div>
      </div>

      <UsersList
        users={Users}
        loading={loading}
        loadingId={loadingId}
        updateUserStatus={updateUserStatus}
        deleteUser={deleteUser}
        isAdmin={isAdmin}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalUsers / (limit || 12))}
        totalProducts={totalUsers}
        pageSize={limit || 12}
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
    </div>
  );
};

export default Users;
