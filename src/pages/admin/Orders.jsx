import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/Context";
import Pagination from "../../components/helper/Pagination";
import OrderList from "../../components/order/OrderList";
import {
  FILTER_OPERATORS,
  INPUT_TYPES,
  showToast,
} from "../../components/helper/types";
import SmartFilter from "../../components/helper/SmartFilters";
import { ActiveFilters } from "../../components/Product/ActiveFilters";
import { MdOutlineFilterAlt } from "react-icons/md";
import { TableLayout } from "../../components/helper/table";
import { useQueryClient } from "@tanstack/react-query";
import { useOrders } from "../../hooks/queries/useOrders";
import { useUpdateOrders } from "../../hooks/mutations/useUpdateOrder";
import { useDeleteOrders } from "../../hooks/mutations/useDeleteOrder";
import Swal from "sweetalert2";

const Orders = () => {
  const { state } = useContext(GlobalContext);

  let isAdmin = state?.isAdmin;

  const [showFilter, setShowFilter] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  // const [Orders, setOrders] = useState([]);
  // const [OrdersByPage, setOrdersByPage] = useState({});
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [loading, setloading] = useState(false);

  // const [totalOrders, setTotalOrders] = useState(0);

  // const getOrders = async ({ filters = {}, page = 1, limit = 12 } = {}) => {
  //   setloading(true);

  //   try {
  //     const result = await api.get("/orders", {
  //       params: {
  //         page,
  //         limit,
  //         filters: JSON.stringify(filters),
  //       },
  //     });

  //     setOrders(result?.data?.data);
  //     setCurrentPage(result?.data?.currentPage);
  //     setTotalPages(result?.data?.totalPages);
  //     setTotalOrders(result?.data?.totalOrders);
  //     setOrdersByPage((prev) => ({
  //       ...prev,
  //       [page]: result?.data?.data,
  //     }));
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setloading(false);
  //   }
  // };

  // useEffect(() => {
  //   getOrders();
  // }, []);

  const queryClient = useQueryClient();
  const [filters, setFilters] = useState([]);

  const { data, isLoading, isFetching, error } = useOrders({
    filters,
    page,
    limit,
  });

  const orders = data?.data ?? [];

  const totalPages = data?.totalPages;
  const totalOrders = data?.totalOrders;

  const updateProduct = (updated) => {
    // setOrders((prev) =>
    //   prev.map((o) =>
    //     o.order_id === updated.order_id ? { ...o, ...updated } : o,
    //   ),
    // );
  };

  const [loadingId, setLoadingId] = useState(null);

  const updateMutation = useUpdateOrders();

  const updateOrderStatus = async (order_id, field, value) => {
    setLoadingId(order_id);

      updateMutation.mutate(
        {
          id:order_id,
          formData:{
            [field]: value
          },
        },
        {
          onSuccess: () => {
            showToast({
              icon: "success",
              title: "Update Successfully",
            });
          },

          onError: (error) => {
            showToast({
              icon: "error",
              title: error?.response?.data?.message || "Something went wrong",
            });
          },
        },
      );
   
  };
  const updateOrderStatusold = async (order_id, field, value) => {
    // const prevOrders = orders;
    // setLoadingId(order_id);
    // setOrders((prev) =>
    //   prev.map((o) => (o.order_id === order_id ? { ...o, [field]: value } : o)),
    // );
    // try {
    //   await api.put(`/orders/${order_id}/status`, {
    //     [field]: value,
    //   });
    //   showToast({
    //     icon: "success",
    //     title: "Update Successfully",
    //   });
    // } catch (error) {
    //   showToast({
    //     icon: "error",
    //     title: error?.response?.data?.message || "Something went wrong",
    //   });
    //   setOrders(prevOrders);
    // } finally {
    //   setLoadingId(null);
    // }
  };

  const deleteOdr = useDeleteOrders();

  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      title: "Are You Sure?",
      text: "Do you want to delete this Order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (result?.isConfirmed) {
      // const previousOrders = orders;
      // setLoadingId(id);
      // setOrders((prev) => prev.filter((p) => p.order_id !== id));

        deleteOdr.mutate(
        {
          ids:id
        },
        {
          onSuccess: () => {
            showToast({
              icon: "success",
              title: "Delete Successfully",
            });
          },

          onError: (error) => {
            showToast({
              icon: "error",
              title: error?.response?.data?.message || "Something went wrong",
            });
          },
        },
      );
      // try {
      //   await api.delete(`/order/${id}`);
      //   showToast({
      //     icon: "success",
      //     title: "Deleted Successfully",
      //   });
      // } catch (error) {
      //   setOrders(previousOrders);
      //   showToast({
      //     icon: "error",
      //     title: error?.response?.data?.message || "Something went wrong",
      //   });
      // }
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
    {
      key: "city",
      label: "City",
      operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },
  ];

  const [filterquery, setFilterQuery] = useState([]);

  const handleFilterApply = (query, activeFilters) => {
    setFilters(activeFilters);
    setPage(1);
    // setOrdersByPage({});
    // setCurrentPage(1);
    setFilterQuery(query);
    // getOrders({ filters: query, page: 1, limit });
  };

  const removeFilter = (index) => {
    const updated = filters?.filter((_, i) => i !== index);
    setFilters(updated);
    setPage(1);
    // getOrders(updated);
    // getOrders({ filters: updated, page: 1, limit });
  };

  const clearAllFilters = () => {
    setFilters([]);
    setPage(1);
    // getOrders([]);
    // getOrders({ filters: [], page: 1, limit });
  };

  const handlePageChange = (page) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="mx-2">
      <div>
        <div className="flex flex-col  gap-5 my-2">
          <div className="flex flex-row justify-between h-full md:items-center">
            <div className="flex gap-5 items-center">
              <p className="h-10 w-5 rounded bg-theme-primary"></p>
              <p className="text-theme-primary text-xl font-medium">
                Explore All Orders
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
              {totalOrders > 50 ? (
                <select
                  defaultValue={
                    limit == totalOrders ? "All Orders" : limit || ""
                  }
                  onChange={(e) => {
                    const newLimit =
                      e.target.value == "all"
                        ? Number(totalOrders)
                        : Number(e.target.value);
                    setLimit(newLimit);
                    setPage(1);
                    // setCurrentPage(1);

                    // getOrders({
                    //   filters: filterquery,
                    //   page: 1,
                    //   limit: newLimit,
                    // });
                  }}
                  disabled={isLoading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm
               focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30
               hover:border-gray-400 transition"
                >
                  <option value="" disabled selected>
                    - limit Orders -
                  </option>
                  <option value={50}>50 Orders</option>
                  <option value={75}>75 Orders</option>
                  <option value={100}>100 Orders</option>
                  <option value="all">All Orders</option>
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

      <TableLayout>
        <OrderList
          orders={orders}
          loading={isLoading}
          loadingId={updateMutation?.isPending || deleteOdr?.isPending}
          isAdmin={isAdmin}
          updateOrderStatus={updateOrderStatus}
          deleteOrder={deleteOrder}
          filters={filters}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalProducts={totalOrders}
          pageSize={limit || 12}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </TableLayout>

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

export default Orders;
