import DashboardCards from "../../components/dashboard/DashboardCards";
import DashboardCharts from "../../components/dashboard/DashboardCharts";
import OrderList from "../../components/order/OrderList";
import RecentOrders from "../../components/order/RecentOrders";

const Dashboard = () => {


  return (
    <div className="flex flex-col gap-6 mx-2">
      {/* <h1 className="text-2xl font-bold"></h1> */}

      <div className="flex gap-5 items-center my-2">
        <p className="h-10 w-5 rounded bg-theme-primary"></p>
        <p className="text-theme-primary text-xl font-medium">Dashboard</p>
      </div>

      <DashboardCards />
      <DashboardCharts />
      <RecentOrders />

       
    </div>
  );
};

export default Dashboard;
