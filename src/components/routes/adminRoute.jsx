
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import { Loader } from "../types";

const AdminRoute = () => {
  const { state } = useContext(GlobalContext);

    console.log("adminROuteeeee is Login", state?.isLogin);

  
  if (state?.isLogin == null) <Loader />
  if (state?.isLogin == false) return <Navigate to="/login" />;

  if (state?.user?.user_role !== 1) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;