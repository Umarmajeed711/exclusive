import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GlobalContext } from "../../context/Context";
import { isActiveUser, Loader } from "../helper/types";

const ProtectedRoute = () => {
  const { state } = useContext(GlobalContext);
  const location = useLocation();

  return (

    state?.isLogin && isActiveUser(state?.user) ? <Outlet /> : state?.isLogin == null  ? <Loader/> : <Navigate to="/login" state={{ from: null }} replace />
  )
  
};

export default ProtectedRoute;
