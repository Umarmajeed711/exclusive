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
import api from "./api";

const salesData = [
  { name: "Jan", sales: 400, orders: 40 },
  { name: "Feb", sales: 800, orders: 65 },
  { name: "Mar", sales: 600, orders: 50 },
  { name: "Apr", sales: 1200, orders: 90 },
  { name: "May", sales: 900, orders: 70 },
];

const orderStatusData = [
  { name: "Delivered", value: 120 },
  { name: "Pending", value: 40 },
  { name: "Cancelled", value: 15 },
  { name: "Shipped", value: 30 },
];

const DashboardCharts = () => {
  const [filter, setFilter] = useState("30d");


  const getOrderStatus = async () => {
    try {
      let res = await api("/dashboard/order-status");

      console.log("res",res?.data);
      
      
    } catch (error) {
      
    }
  }

   const getSales = async () => {
    try {
      let res = await api("/dashboard/sales-chart");

      console.log("res",res?.data);
      
      
    } catch (error) {
      
    }
  }

  useEffect(() => {

    getOrderStatus();
    getSales()

  },[])


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
        data: salesData.map((d) => d.sales),
      },
      {
        name: "Orders",
        data: salesData.map((d) => d.orders),
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
          name: item.name,
          y: item.value,
        })),
      },
    ],
    credits: { enabled: false },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* 🔥 SALES + ORDERS */}
      <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-sm border">
        
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

        <HighchartsReact highcharts={Highcharts} options={lineOptions} />
      </div>

      {/* 🔥 ORDER STATUS PIE */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border">
        <h3 className="font-semibold text-lg mb-4">Order Status</h3>

        <HighchartsReact highcharts={Highcharts} options={pieOptions} />
      </div>

    </div>
  );
};

export default DashboardCharts;