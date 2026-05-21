
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import { Loader } from "../helper/types";

const AdminRoute = () => {
  const { state } = useContext(GlobalContext);
  
  if (state?.isLogin == null) <Loader />
  if (state?.isLogin == false) return <Navigate to="/login" />;

  if (state?.user?.user_role !== 1) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;