import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  PackagePlus,
  Boxes,
  Home,
  Menu,
} from "lucide-react";



const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
    // { name: "Products", path: "/admin/products", icon: Boxes },
    { name: "Products", path: "/admin/add-product", icon: PackagePlus },

    // ✅ IMPORTANT (back to website)
    { name: "View Store", path: "/", icon: Home , nextTab:true},
  ];

  return (
    <div
      className={`h-screen bg-white top-0 sticky shadow-lg  transition-all duration-300 ${
        collapsed ? "w-16" : "min-w-52"
      }`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h2 className="text-xl font-bold">Admin</h2>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-200"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 p-2">
        {links.map((link, i) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={i}
              to={link.path}
              end={link.path === "/admin"}
              target={link?.nextTab ? "_blank": "_self"}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-3 rounded-lg transition
                 ${isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              {/* Icon */}
              <Icon size={20} />

              {/* Text */}
              {!collapsed && (
                <span className="text-sm font-medium">{link.name}</span>
              )}

              {/* Tooltip (only when collapsed) */}
              {collapsed && (
                <span className="absolute left-16 z-50 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  {link.name}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;