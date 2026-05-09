import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GlobalContext } from "../../context/Context";
import { Loader } from "../types";

const ProtectedRoute = () => {
  const { state } = useContext(GlobalContext);
  const location = useLocation();

  console.log("ProtectedRouteProtectedRoute is Login", state?.isLogin);
  return (

    state?.isLogin  ? <Outlet /> : state?.isLogin == false  ? <Loader/> : <Navigate to="/login" state={{ from: location }} replace />
  )
  
};

export default ProtectedRoute;
