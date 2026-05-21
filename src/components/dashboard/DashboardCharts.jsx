// import { useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// const salesData = [
//   { name: "Jan", sales: 400, orders: 40 },
//   { name: "Feb", sales: 800, orders: 65 },
//   { name: "Mar", sales: 600, orders: 50 },
//   { name: "Apr", sales: 1200, orders: 90 },
//   { name: "May", sales: 900, orders: 70 },
// ];

// const orderStatusData = [
//   { name: "Delivered", value: 120 },
//   { name: "Pending", value: 40 },
//   { name: "Cancelled", value: 15 },
//   { name: "Shipped", value: 30 },
// ];

// const COLORS = ["#22c55e", "#facc15", "#ef4444", "#3b82f6"];

// const DashboardCharts = () => {
//   const [filter, setFilter] = useState("monthly");

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

//       {/* 🔥 SALES + ORDERS */}
//       <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-lg">Sales Analytics</h3>

//           {/* Filter */}
//           <div className="flex gap-2">
//             {["7d", "30d", "12m"].map((item) => (
//               <button
//                 key={item}
//                 onClick={() => setFilter(item)}
//                 className={`px-3 py-1 text-sm rounded-lg border ${
//                   filter === item
//                     ? "bg-black text-white"
//                     : "bg-white text-gray-600"
//                 }`}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={salesData}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />

//             {/* Revenue Line */}
//             <Line
//               type="monotone"
//               dataKey="sales"
//               stroke="#000"
//               strokeWidth={2}
//               dot={{ r: 3 }}
//             />

//             {/* Orders Line */}
//             <Line
//               type="monotone"
//               dataKey="orders"
//               stroke="#8884d8"
//               strokeWidth={2}
//               dot={{ r: 3 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* 🔥 ORDER STATUS PIE */}
//       <div className="bg-white p-5 rounded-2xl shadow-sm border">
//         <h3 className="font-semibold text-lg mb-4">Order Status</h3>

//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={orderStatusData}
//               dataKey="value"
//               nameKey="name"
//               outerRadius={100}
//               innerRadius={60}
//               paddingAngle={3}
//             >
//               {orderStatusData.map((entry, index) => (
//                 <Cell key={index} fill={COLORS[index]} />
//               ))}
//             </Pie>

//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//     </div>
//   );
// };

// export default DashboardCharts;

import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import api from "../helper/api";
import { formatStatus, Loader, showToast, TableCard } from "../helper/types";

// const salesData = [
//   { name: "Jan", sales: 400, orders: 40 },
//   { name: "Feb", sales: 800, orders: 65 },
//   { name: "Mar", sales: 600, orders: 50 },
//   { name: "Apr", sales: 1200, orders: 90 },
//   { name: "May", sales: 900, orders: 70 },
// ];

// const orderStatusData = [
//   { name: "Delivered", value: 120 },
//   { name: "Pending", value: 40 },
//   { name: "Cancelled", value: 15 },
//   { name: "Shipped", value: 30 },
// ];

const DashboardCharts = () => {
  const [filter, setFilter] = useState("30d");

  // 🔥 states
  const [salesData, setSalesData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);

  // 🔥 loading states
  const [salesLoading, setSalesLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  // 🔥 SALES API
  const getSales = async () => {
    try {
      setSalesLoading(true);

      const res = await api(`/dashboard/sales-chart?range=${filter}`);

      if (res?.data?.success) {
        setSalesData(res.data.data || []);
      } else {
        showToast({
          icon: "error",
          title: res?.data?.message || "Failed to fetch sales data",
        });
      }
    } catch (error) {
      console.error(error);

      showToast({
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Something went wrong while fetching sales chart",
      });
    } finally {
      setSalesLoading(false);
    }
  };

  // 🔥 ORDER STATUS API
  const getOrderStatus = async () => {
    try {
      setStatusLoading(true);

      const res = await api("/dashboard/order-status");

      if (res?.data?.success) {
        setOrderStatusData(res.data.data || []);
      } else {
        showToast({
          icon: "error",
          title: res?.data?.message || "Failed to fetch order status data",
        });
      }
    } catch (error) {
      console.error(error);

      showToast({
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Something went wrong while fetching order status",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const [topProducts, setTopProducts] = useState([]);
  const [profitData, setProfitData] = useState([]);

  const [loading, setLoading] = useState({
    products: false,
    profit: false,
  });

  const getTopProducts = async () => {
    try {
      setLoading((prev) => ({ ...prev, products: true }));

      const res = await api("/dashboard/top-products?limit=5");

      if (res?.data?.success) {
        setTopProducts(res.data.data || []);
      } else {
        // toast.error(res?.data?.message || "Failed to load products");
      }
    } catch (error) {
      showToast({
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Something went wrong while fetching top products",
      });
    } finally {
      setLoading((prev) => ({ ...prev, products: false }));
    }
  };

  const [revenueFilter, setRevenueFilter] = useState("30d");

  const getProfitData = async () => {
    try {
      setLoading((prev) => ({ ...prev, profit: true }));

      const res = await api(`/dashboard/profit-chart?range=${revenueFilter}`);

      if (res?.data?.success) {
        setProfitData(res.data.data || []);
      } else {
        // toast.error(res?.data?.message || "Failed to load profit data");
      }
    } catch (error) {
      showToast({
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Something went wrong while profit data",
      });
    } finally {
      setLoading((prev) => ({ ...prev, profit: false }));
    }
  };

  useEffect(() => {
    getTopProducts();
  }, []);

  useEffect(() => {
    getProfitData();
  }, [revenueFilter]);

  // 🔥 Initial Load
  useEffect(() => {
    getOrderStatus();
  }, []);

  // 🔥 Refetch when filter changes
  useEffect(() => {
    getSales();
  }, [filter]);

  // 🔥 LINE CHART (Sales + Orders)
  const lineOptions = {
    chart: {
      type: "line",
      height: 300,
      zoomType: "x",
    },
    title: { text: "" },
    xAxis: {
      categories: salesData.map((d) => d.name),
    },
    yAxis: {
      title: { text: "Value" },
    },
    tooltip: {
      shared: true,
      backgroundColor: "#111",
      style: { color: "#fff" },
    },
    legend: {
      enabled: true,
    },
    series: [
      {
        name: "Revenue",
        data: salesData.map((d) => Number(d.sales)),
      },
      {
        name: "Orders",
        data: salesData.map((d) => Number(d.orders)),
      },
    ],
    credits: { enabled: false },
  };

  // 🔥 PIE CHART (Order Status)
  const pieOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    title: { text: "" },
    tooltip: {
      pointFormat: "<b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        innerSize: "60%", // donut style 🔥
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.y}",
        },
      },
    },
    series: [
      {
        name: "Orders",
        data: orderStatusData.map((item) => ({
          name:  formatStatus(item.name),
          y: item.value,
        })),
      },
    ],
    credits: { enabled: false },
  };

  const topProductsOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    title: { text: "Top Products" },
    xAxis: {
      categories: topProducts.map((p) => p.name),
    },
    yAxis: {
      title: { text: "Units Sold" },
    },
    series: [
      {
        name: "Sold",
        data: topProducts.map((p) => Number(p.total_sold)),
      },
    ],
    credits: { enabled: false },
  };

  const profitOptions = {
    chart: {
      type: "column",
      height: 350,
    },
    title: { text: "Revenue vs Cost vs Profit" },
    xAxis: {
      categories: profitData.map((d) => d.label),
    },
    tooltip: { shared: true },
    series: [
      {
        name: "Revenue",
        data: profitData.map((d) => Number(d.revenue)),
      },
      {
        name: "Cost",
        data: profitData.map((d) => Number(d.cost)),
      },
      {
        name: "Profit",
        data: profitData.map((d) => Number(d.gross_profit)),
      },
    ],
    credits: { enabled: false },
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* 🔥 SALES + ORDERS */}
        <TableCard className="lg:col-span-2">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Sales Analytics</h3>

            {/* Filter */}
            <div className="flex gap-2">
              {["7d", "30d", "12m"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-3 py-1 text-sm rounded-lg border ${
                    filter === item
                      ? "bg-black text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {salesLoading ? (
            <Loader className="!max-h-[300px]" />
          ) : (
            <HighchartsReact highcharts={Highcharts} options={lineOptions} />
          )}
        </TableCard>

        {/* 🔥 ORDER STATUS PIE */}
        <TableCard>
          <h3 className="font-semibold text-lg mb-4">Order Status</h3>

          {statusLoading ? (
            <Loader className="!max-h-[300px]" />
          ) : (
            <HighchartsReact highcharts={Highcharts} options={pieOptions} />
          )}
        </TableCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 🔥 TOP PRODUCTS */}
        <TableCard>


          <h3 className="font-semibold text-lg">Top Products</h3>

          {loading.products ? (
            <Loader className="!max-h-[300px]" />
          ) : (
            <HighchartsReact
              highcharts={Highcharts}
              options={topProductsOptions}
            />
          )}
        </TableCard>
        

        {/* 💰 PROFIT CHART */}
        <TableCard>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">Revenue vs Cost vs Profit</h3>

            {/* Filter */}
            <div className="flex gap-2">
              {["7d", "30d", "12m"].map((item) => (
                <button
                  key={item}
                  onClick={() => setRevenueFilter(item)}
                  className={`px-3 py-1 text-sm rounded-lg border ${
                    revenueFilter === item
                      ? "bg-black text-white"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading?.profit ? (
            <Loader className="!max-h-[300px]" />
          ) : (
            <HighchartsReact highcharts={Highcharts} options={profitOptions} />
          )}
        </TableCard>
      </div>
    </>
  );
};

export default DashboardCharts;
