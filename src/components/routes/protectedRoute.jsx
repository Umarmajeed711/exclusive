import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GlobalContext } from "../../context/Context";
import { Loader } from "../helper/types";

const ProtectedRoute = () => {
  const { state } = useContext(GlobalContext);
  const location = useLocation();

  return (

    state?.isLogin  ? <Outlet /> : state?.isLogin == null  ? <Loader/> : <Navigate to="/login" state={{ from: location }} replace />
  )
  
};

export default ProtectedRoute;
