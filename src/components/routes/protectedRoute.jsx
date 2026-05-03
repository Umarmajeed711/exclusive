import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GlobalContext } from "../../context/Context";

const ProtectedRoute = () => {
  const { state } = useContext(GlobalContext);
    const location = useLocation();

  console.log("ProtectedRouteProtectedRoute is Login", state?.isLogin);
  

  return state?.isLogin  ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
