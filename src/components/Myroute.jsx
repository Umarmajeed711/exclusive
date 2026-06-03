import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Signup } from "../pages/signup";
import { Login } from "../pages/login";
import Home from "../pages/Home";
import { GlobalContext } from "../context/Context";
import Category from "./Product/Category";
import Products from "../pages/admin/Products";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Checkout from "../pages/Checkout";
import ProductDetail from "./Product/ProductDetail";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import Verify_email from "../pages/VerifyEmail";
import Cart from "../pages/Cart";
import Whishlist from "../pages/Whishlist";
import OrderConfirmation from "../pages/OrderComplete";
import Account from "../pages/Account-old";
import Shop from "../pages/Shop";
import Dash from "../pages/admin/Dash";
import AddProduct from "../pages/admin/AddProduct";
import Orders from "../pages/admin/Orders";
import OrdersPage from "../pages/myOrders";
import { OrderTrackingWrapper } from "../pages/OrderTrack";
import Users from "../pages/admin/Users";

const Myroute = () => {
  let { state } = useContext(GlobalContext);

  return (
    <div>
      {state?.isLogin === true ? (
        <Routes>
          <Route path="/" index element={<Home />}></Route>
          <Route path="/category" element={<Category />}></Route>
          {/* <Route path="/Contact" element={<Contact />}></Route> */}
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/category" element={<Category />}></Route>
          <Route path="/productDetail/:id" element={<ProductDetail />}></Route>
          {/* <Route path="/Product" element={<Products />}></Route> */}
          <Route path="/contact" element={<Contact />}></Route>
          <Route path="/checkout" element={<Checkout />}></Route>
          <Route path="/wishlist" element={<Whishlist/>}></Route>
          <Route path="/shop" element={<Shop/>}></Route>
          <Route path="/orderComplete" element={<OrderConfirmation/>}></Route>
          <Route path="/account" element={<Account/>}></Route>
          <Route path="/dashboard" element={<Dash/>}/>
          <Route path="/account" element={<Account/>}></Route>
          <Route path="/orders" element={<Orders/>}></Route>
          <Route path="/users" element={<Users/>}></Route>
          <Route path="/orders/:id" element={<OrderTrackingWrapper />} />
          <Route path="/myOrders" element={<OrdersPage/>}></Route>
          <Route path="/product" element={<Products />}></Route>
          <Route path="/addProduct" element={<AddProduct />}></Route>
          {/* /////
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/verify_email" element={<Verify_email />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/ForgetPassword" element={<ForgetPassword />}></Route>
          /////// */}
          <Route path="/notFound" element={<NotFound />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      ) : state?.isLogin === false ? (
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/verifyEmail" element={<Verify_email />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgetPassword" element={<ForgetPassword />}></Route>
          {state?.userData && (
            <Route path="/resetPassword" element={<ResetPassword />}></Route>
          )}
          <Route path="*" element={<Navigate to="/login" />}></Route>
        </Routes>
      ) : (
        <div className="flex justify-center items-center main">
          <div className="loading"></div>
        </div>
      )}
    </div>
  );
};

export default Myroute;
