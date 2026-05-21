import { Outlet } from "react-router-dom";
import AdminSidebar from "../dashboard/adminSidebar";
import AdminTopbar from "../dashboard/adminTopbar";

const AdminLayout = () => {
  return (
    <div className="flex  min-h-screen bg-gray-100 relative">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopbar />

      <div className="p-4">
        <Outlet />
      </div>

      </div>

    </div>
  );
};

export default AdminLayout;