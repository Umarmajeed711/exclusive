import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
// import MainLayout from "./layouts/mainLayout";
// import AdminLayout from "./layouts/adminLayout";

// Guards
import ProtectedRoute from "./protectedRoute";
import AdminRoute from "./adminRoute";
import Home from "../../pages/Home";
import Shop from "../../pages/Shop";
import Contact from "../../pages/Contact";
import Cart from "../../pages/Cart";
import Account from "../../pages/Account";
import Checkout from "../../pages/Checkout";
import { Login } from "../../pages/login";
import { Signup } from "../../pages/signup";
import Dash from "../../pages/admin/Dash";
import Users from "../../pages/admin/Users";
import Orders from "../../pages/admin/Orders";
import Products from "../../pages/admin/Products";
import AddProduct from "../../pages/admin/AddProduct";
import MainLayout from "../layouts/mainLayout";
import AdminLayout from "../layouts/adminLayout";
import VerifyEmail from "../../pages/VerifyEmail";
import ForgetPassword from "../../pages/ForgetPassword";
import ResetPassword from "../../pages/ResetPassword";
import OrdersPage from "../../pages/myOrders";
import { OrderTrackingWrapper } from "../../pages/OrderTrack";
import OrderConfirmation from "../../pages/OrderComplete";
import Whishlist from "../../pages/Whishlist";
import Category from "../Product/Category";
import Dashboard from "../../pages/admin/Dashboard";
import ProductDetail from "../Product/ProductDetail";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import { isActiveUser } from "../helper/types";

const AppRoutes = () => {
  const { state } = useContext(GlobalContext);

  return (
    <Routes>
      {/* ================= USER SIDE ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/productDetail/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/wishlist" element={<Whishlist />} />
        <Route path="/cart" element={<Cart />} />

        <Route path={state?.isLogin ? "/account" : "/"} element={<Account />} />

        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard/>} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="add-product" element={<AddProduct />} />
        </Route> */}

        {/* Protected user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orderComplete" element={<OrderConfirmation />} />
          <Route path="/orders/:id" element={<OrderTrackingWrapper />} />
          <Route path="/myOrders" element={<OrdersPage />} />
        </Route>
      </Route>

      {/* ================= AUTH ================= */}
      {/* <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> */}

      <Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/verifyEmail" element={<VerifyEmail />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
        <Route path="/resetPassword" element={<ResetPassword />}></Route>

        <Route path="*" element={<Navigate to="/login" />}></Route>
      </Route>

      {/* ================= ADMIN ================= */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* <Route index element={<Dash />} /> */}
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          {/* <Route path="products" element={<Products />} /> */}
          <Route path="addProduct" element={<AddProduct />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
