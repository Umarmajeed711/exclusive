import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
// import MainLayout from "./layouts/mainLayout";
// import AdminLayout from "./layouts/adminLayout";

// Guards
import ProtectedRoute from "./protectedRoute";
import AdminRoute from "./adminRoute";
import Home from "../../pages/Home";
import Shop from "../../pages/Shop";
import ProductDetail from "../ProductDetail";
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
import Verify_email from "../../pages/Verify_email";
import ForgetPassword from "../../pages/ForgetPassword";
import ResetPassword from "../../pages/ResetPassword";
import OrdersPage from "../../pages/myOrders";
import { OrderTrackingWrapper } from "../../pages/OrderTrack";
import OrderConfirmation from "../../pages/OrderComplete";
import Whishlist from "../../pages/Whishlist";
import Category from "../Category";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= USER SIDE ================= */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/ProductDetail/:id" element={<ProductDetail />} />
        <Route path="/Contact" element={<Contact />} />

        <Route path="/Category" element={<Category />}></Route>
        <Route path="/wishlist" element={<Whishlist />}></Route>

        {/* Protected user */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Account" element={<Account />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/OrderComplete" element={<OrderConfirmation />}></Route>
          <Route path="/orders/:id" element={<OrderTrackingWrapper />}></Route>
          <Route path="/myOrders" element={<OrdersPage />}></Route>
          <Route path="/ResetPassword" element={<ResetPassword />}></Route>
        </Route>
      </Route>

      {/* ================= AUTH ================= */}
      {/* <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} /> */}

      <Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/verify_email" element={<Verify_email />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/ForgetPassword" element={<ForgetPassword />}></Route>
       
        <Route path="*" element={<Navigate to="/login" />}></Route>
      </Route>

      {/* ================= ADMIN ================= */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dash />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<Orders />} />
          <Route path="products" element={<Products />} />
          <Route path="add-product" element={<AddProduct />} />
        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
