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

const Orders = () => {
  const { state } = useContext(GlobalContext);

  let isAdmin = state?.isAdmin;

  const [loading, setloading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const [Orders, setOrders] = useState([]);

  // const orders = [
  //   {
  //     cancel_reason: null,
  //     delivery_status: "processing",
  //     items: [
  //       {
  //         colors: "black",
  //         discount: 10,
  //         image_url:
  //           "https://res.cloudinary.com/djhltc7rf/image/upload/v1755068694/test-images/oda9ftolmgydyqypbi84.png",
  //         item_id: "33",
  //         order_id: "22",
  //         price: "1044.00",
  //         product_id: "6",
  //         product_name: "AK-900 Wired Keyboard",
  //         quantity: 1,
  //         sizes: "S",
  //       },
  //     ],
  //     order_date: "2026-04-23T00:47:29.334Z",
  //     order_id: "22",
  //     payment_method: "cod",
  //     payment_status: "unpaid",
  //     shipping_address: "North Nazimabad,Karachi",
  //     shipping_name: "Umar Majeed",
  //     shipping_phone: "03125897854",
  //     total_price: "1044.00",
  //     user_id: "13",
  //   },
  //    {
  //     cancel_reason: null,
  //     delivery_status: "processing",
  //     items: [
  //       {
  //         colors: "black",
  //         discount: 10,
  //         image_url:
  //           "https://res.cloudinary.com/djhltc7rf/image/upload/v1755068694/test-images/oda9ftolmgydyqypbi84.png",
  //         item_id: "33",
  //         order_id: "22",
  //         price: "1044.00",
  //         product_id: "6",
  //         product_name: "AK-900 Wired Keyboard",
  //         quantity: 1,
  //         sizes: "S",
  //       },
  //     ],
  //     order_date: "2026-04-23T00:47:29.334Z",
  //     order_id: "22",
  //     payment_method: "cod",
  //     payment_status: "unpaid",
  //     shipping_address: "North Nazimabad,Karachi",
  //     shipping_name: "Umar Majeed",
  //     shipping_phone: "03125897854",
  //     total_price: "1044.00",
  //     user_id: "13",
  //   },
  //    {
  //     cancel_reason: null,
  //     delivery_status: "processing",
  //     items: [
  //       {
  //         colors: "black",
  //         discount: 10,
  //         image_url:
  //           "https://res.cloudinary.com/djhltc7rf/image/upload/v1755068694/test-images/oda9ftolmgydyqypbi84.png",
  //         item_id: "33",
  //         order_id: "22",
  //         price: "1044.00",
  //         product_id: "6",
  //         product_name: "AK-900 Wired Keyboard",
  //         quantity: 1,
  //         sizes: "S",
  //       },
  //     ],
  //     order_date: "2026-04-23T00:47:29.334Z",
  //     order_id: "22",
  //     payment_method: "cod",
  //     payment_status: "unpaid",
  //     shipping_address: "North Nazimabad,Karachi",
  //     shipping_name: "Umar Majeed",
  //     shipping_phone: "03125897854",
  //     total_price: "1044.00",
  //     user_id: "13",
  //   },
  //    {
  //     cancel_reason: null,
  //     delivery_status: "processing",
  //     items: [
  //       {
  //         colors: "black",
  //         discount: 10,
  //         image_url:
  //           "https://res.cloudinary.com/djhltc7rf/image/upload/v1755068694/test-images/oda9ftolmgydyqypbi84.png",
  //         item_id: "33",
  //         order_id: "22",
  //         price: "1044.00",
  //         product_id: "6",
  //         product_name: "AK-900 Wired Keyboard",
  //         quantity: 1,
  //         sizes: "S",
  //       },
  //     ],
  //     order_date: "2026-04-23T00:47:29.334Z",
  //     order_id: "22",
  //     payment_method: "cod",
  //     payment_status: "unpaid",
  //     shipping_address: "North Nazimabad,Karachi",
  //     shipping_name: "Umar Majeed",
  //     shipping_phone: "03125897854",
  //     total_price: "1044.00",
  //     user_id: "13",
  //   },
  //    {
  //     cancel_reason: null,
  //     delivery_status: "processing",
  //     items: [
  //       {
  //         colors: "black",
  //         discount: 10,
  //         image_url:
  //           "https://res.cloudinary.com/djhltc7rf/image/upload/v1755068694/test-images/oda9ftolmgydyqypbi84.png",
  //         item_id: "33",
  //         order_id: "22",
  //         price: "1044.00",
  //         product_id: "6",
  //         product_name: "AK-900 Wired Keyboard",
  //         quantity: 1,
  //         sizes: "S",
  //       },
  //     ],
  //     order_date: "2026-04-23T00:47:29.334Z",
  //     order_id: "22",
  //     payment_method: "cod",
  //     payment_status: "unpaid",
  //     shipping_address: "North Nazimabad,Karachi",
  //     shipping_name: "Umar Majeed",
  //     shipping_phone: "03125897854",
  //     total_price: "1044.00",
  //     user_id: "13",
  //   },
  //    {
  //     cancel_reason: null,
  //     delivery_status: "processing",
  //     items: [
  //       {
  //         colors: "black",
  //         discount: 10,
  //         image_url:
  //           "https://res.cloudinary.com/djhltc7rf/image/upload/v1755068694/test-images/oda9ftolmgydyqypbi84.png",
  //         item_id: "33",
  //         order_id: "22",
  //         price: "1044.00",
  //         product_id: "6",
  //         product_name: "AK-900 Wired Keyboard",
  //         quantity: 1,
  //         sizes: "S",
  //       },
  //     ],
  //     order_date: "2026-04-23T00:47:29.334Z",
  //     order_id: "22",
  //     payment_method: "cod",
  //     payment_status: "unpaid",
  //     shipping_address: "North Nazimabad,Karachi",
  //     shipping_name: "Umar Majeed",
  //     shipping_phone: "03125897854",
  //     total_price: "1044.00",
  //     user_id: "13",
  //   },
  //    {
  //     cancel_reason: null,
  //     delivery_status: "processing",
  //     items: [
  //       {
  //         colors: "black",
  //         discount: 10,
  //         image_url:
  //           "https://res.cloudinary.com/djhltc7rf/image/upload/v1755068694/test-images/oda9ftolmgydyqypbi84.png",
  //         item_id: "33",
  //         order_id: "22",
  //         price: "1044.00",
  //         product_id: "6",
  //         product_name: "AK-900 Wired Keyboard",
  //         quantity: 1,
  //         sizes: "S",
  //       },
  //     ],
  //     order_date: "2026-04-23T00:47:29.334Z",
  //     order_id: "22",
  //     payment_method: "cod",
  //     payment_status: "unpaid",
  //     shipping_address: "North Nazimabad,Karachi",
  //     shipping_name: "Umar Majeed",
  //     shipping_phone: "03125897854",
  //     total_price: "1044.00",
  //     user_id: "13",
  //   },
  //    {
  //     cancel_reason: null,
  //     delivery_status: "processing",
  //     items: [
  //       {
  //         colors: "black",
  //         discount: 10,
  //         image_url:
  //           "https://res.cloudinary.com/djhltc7rf/image/upload/v1755068694/test-images/oda9ftolmgydyqypbi84.png",
  //         item_id: "33",
  //         order_id: "22",
  //         price: "1044.00",
  //         product_id: "6",
  //         product_name: "AK-900 Wired Keyboard",
  //         quantity: 1,
  //         sizes: "S",
  //       },
  //     ],
  //     order_date: "2026-04-23T00:47:29.334Z",
  //     order_id: "22",
  //     payment_method: "cod",
  //     payment_status: "unpaid",
  //     shipping_address: "North Nazimabad,Karachi",
  //     shipping_name: "Umar Majeed",
  //     shipping_phone: "03125897854",
  //     total_price: "1044.00",
  //     user_id: "13",
  //   },
  //    {
  //     cancel_reason: null,
  //     delivery_status: "processing",
  //     items: [
  //       {
  //         colors: "black",
  //         discount: 10,
  //         image_url:
  //           "https://res.cloudinary.com/djhltc7rf/image/upload/v1755068694/test-images/oda9ftolmgydyqypbi84.png",
  //         item_id: "33",
  //         order_id: "22",
  //         price: "1044.00",
  //         product_id: "6",
  //         product_name: "AK-900 Wired Keyboard",
  //         quantity: 1,
  //         sizes: "S",
  //       },
  //     ],
  //     order_date: "2026-04-23T00:47:29.334Z",
  //     order_id: "22",
  //     payment_method: "cod",
  //     payment_status: "unpaid",
  //     shipping_address: "North Nazimabad,Karachi",
  //     shipping_name: "Umar Majeed",
  //     shipping_phone: "03125897854",
  //     total_price: "1044.00",
  //     user_id: "13",
  //   },
  // ];
  const [OrdersByPage, setOrdersByPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit, setLimit] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);

  const getOrders = async ({ filters = {}, page = 1, limit = 12 } = {}) => {
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

  const updateProduct = (updated) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.order_id === updated.order_id ? { ...o, ...updated } : o,
      ),
    );
  };

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

  const deleteProduct = async (id) => {
    const previousOrders = Orders;

    setLoadingId(id);

    setOrders((prev) => prev.filter((p) => p.order_id !== id));

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

      setOrders(previousOrders);

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
    setOrdersByPage({});
    setCurrentPage(1);
    setFilterQuery(query);
    console.log("Filters", filters);
    console.log("query", query);
    getOrders({ filters: query, page: 1, limit });
  };

  const removeFilter = (index) => {
    const updated = filters?.filter((_, i) => i !== index);
    setFilters(updated);
    // getOrders(updated);
    getOrders({ filters: updated, page: 1, limit });
  };

  const clearAllFilters = () => {
    setFilters([]);
    // getOrders([]);
    getOrders({ filters: [], page: 1, limit });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (OrdersByPage[page]) {
      setCurrentPage(page);
      setOrders(OrdersByPage[page] || []);
      return;
    }

    getOrders({
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
              {totalOrders > 100 ? (
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
                    setCurrentPage(1);

                    getOrders({
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
                    - limit Orders -
                  </option>
                  <option value={100}>100 Orders</option>
                  <option value={200}>200 Orders</option>
                  <option value={500}>500 Orders</option>
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

      <OrderList
        products={Orders}
        loading={loading}
        loadingId={loadingId}
        isAdmin={isAdmin}
        updateOrderStatus={updateOrderStatus}
        deleteProduct={deleteProduct}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalOrders / (limit || 12 ))}
        totalProducts={totalOrders}
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

export default Orders;
