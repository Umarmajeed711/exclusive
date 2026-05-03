
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";

const AdminRoute = () => {
  const { state } = useContext(GlobalContext);

  if (!state?.isLogin) return <Navigate to="/login" />;

  if (state?.user?.user_role !== 1) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;