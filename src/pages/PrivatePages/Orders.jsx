import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/Context";
import ProductListView from "../../components/ProductList";
import Pagination from "../../components/Pagination";
import OrderList from "../../components/OrderList";
import { FILTER_OPERATORS, INPUT_TYPES } from "../../components/types";
import api from "../../components/api";
import SmartFilter from "../../components/SmartFilters";
import { ActiveFilters } from "../../components/ActiveFilters";

const Orders = () => {
  const { state } = useContext(GlobalContext);

  let isAdmin = state?.isAdmin;

  const [loading, setloading] = useState(false);

  const [showFilter, setShowFilter] = useState(false);

  const [Orders, setOrders] = useState([]);
  const [OrdersByPage, setOrdersByPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit, setLimit] = useState(12);
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
          [page]: result?.data,
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
      o.order_id === updated.order_id ? { ...o, ...updated } : o
    )
  );
};

  const handleProductUpdate = (product) => {
    setOrders((prev) => {
      const exists = prev?.some((p) => p?.product_id == product?.product_id);

      if (exists) {
        // UPDATE
        return prev?.map((p) =>
          p.product_id === product.product_id ? product : p,
        );
      }

      // ADD
      return [product, ...prev];
    });
  };

  const handleProductDelete = (id) => {
    setOrders((prev) => prev.filter((p) => p.product_id !== id));
  };

  const orderFilters = [
    {
      key: "product_name",
      label: "Product Name",
      operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },
    {
      key: "customer_name",
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
        { label: "pending", value: "pending" },
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
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      key: "payment_methoad",
      label: "Payment Method",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Online", value: "online" },
        { label: "Cash on Delivery", value: "cod" },
      ],
    },
    {
      key: "created_at",
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
    <div className="mx-5  md:mx-8 lg:mx-14">
      <div>
        <div className="flex flex-col  gap-5 my-5 sm:my-10">
          <div className="flex flex-col gap-2 md:flex-row justify-between h-full md:items-center">
            <div className="flex gap-5 items-center">
              <p className="h-10 w-5 rounded bg-theme-primary"></p>
              <p className="text-theme-primary text-xl font-medium">
                Explore All Orders
              </p>
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

          <div className="flex justify-between items-center h-full">
            <div className="flex items-center gap-2">
              {totalOrders > 100 ? (
                <select
                  defaultValue={limit == totalOrders ? "All Orders" : limit}
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
                  <option value={100}>100 Orders</option>
                  <option value={200}>200 Orders</option>
                  <option value={500}>500 Orders</option>
                  <option value="all">All Orders</option>
                </select>
              ) : (
                <div className="text-xl sm:text-4xl font-medium py-1">
                  Explore All Orders
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <OrderList
        products={Orders}
        loading={loading}
        updateProduct={updateProduct}
        // updateProduct={handleProductUpdate}
        // delProduct={handleProductDelete}
      />

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
    </div>
  );
};

export default Orders;
