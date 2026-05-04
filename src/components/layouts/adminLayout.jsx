import { Outlet } from "react-router-dom";
import AdminSidebar from "../adminSidebar";
import AdminTopbar from "../adminTopbar";

const AdminLayout = () => {
  return (
    <div className="flex  min-h-screen bg-gray-100">
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