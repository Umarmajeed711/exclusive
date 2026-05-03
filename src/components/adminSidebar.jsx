import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  PackagePlus,
  Boxes,
} from "lucide-react";

const AdminSidebar = () => {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition";

  const activeClass = "bg-black text-white";

  return (
    <div className="w-64 bg-white shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      <nav className="flex flex-col gap-2">

        <NavLink to="/admin" end
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/admin/users"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }>
          <Users size={20} />
          Users
        </NavLink>

        <NavLink to="/admin/orders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }>
          <ShoppingCart size={20} />
          Orders
        </NavLink>

        <NavLink to="/admin/products"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }>
          <Boxes size={20} />
          Products
        </NavLink>

        <NavLink to="/admin/add-product"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }>
          <PackagePlus size={20} />
          Add Product
        </NavLink>

      </nav>
    </div>
  );
};

export default AdminSidebar;