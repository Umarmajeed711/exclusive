import { useContext, useState } from "react";
import { GlobalContext } from "../context/Context";
import { Bell, Search, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminTopbar = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "USER_LOGOUT" });
    navigate("/login");
  };

  return (
    <div className="w-full top-0 sticky z-50 bg-white border-b px-6 py-4 flex items-center justify-between">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-2 text-sm"
          />
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={18} />
            </div>
            <span className="hidden md:block text-sm font-medium">
              {state?.user?.name || "Admin"}
            </span>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border z-50">

              <button
                onClick={() => navigate("/")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                View Store
              </button>

              <button
                onClick={() => navigate("/account")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </button>

              <div className="border-t"></div>

              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminTopbar;