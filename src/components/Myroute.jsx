import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Signup } from "../pages/signup";
import { Login } from "../pages/login";
import Home from "../pages/Home";
import { GlobalContext } from "../context/Context";
import Category from "./Category";
import Products from "../pages/PrivatePages/Products";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import Checkout from "../pages/Checkout";
import ProductDetail from "./ProductDetail";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import Verify_email from "../pages/Verify_email";
import Cart from "../pages/Cart";
import Whishlist from "../pages/Whishlist";
import OrderConfirmation from "../pages/OrderComplete";
import Account from "../pages/Account";
import Shop from "../pages/Shop";
import Dash from "../pages/PrivatePages/Dash";
import AddProduct from "../pages/PrivatePages/AddProduct";

const Myroute = () => {
  let { state, dispatch } = useContext(GlobalContext);

  return (
    <div>
      {state?.isLogin == false ? (
        <Routes>
          <Route path="/" index element={<Home />}></Route>
          <Route path="/Category" element={<Category />}></Route>
          <Route path="/Contact" element={<Contact />}></Route>
          <Route path="/Cart" element={<Cart />}></Route>
          <Route path="/Category" element={<Category />}></Route>
          <Route path="/ProductDetail/:id" element={<ProductDetail />}></Route>
          <Route path="/Product" element={<Products />}></Route>
          <Route path="/Contact" element={<Contact />}></Route>
          <Route path="/Checkout" element={<Checkout />}></Route>
          <Route path="/Whishlist" element={<Whishlist/>}></Route>
          <Route path="/Shop" element={<Shop/>}></Route>
          <Route path="/OrderComplete" element={<OrderConfirmation/>}></Route>
          <Route path="/Account" element={<Account/>}></Route>
          <Route path="/Dashboard" element={<Dash/>}/>
          <Route path="/Account" element={<Account/>}></Route>
          <Route path="/Product" element={<Products />}></Route>
          <Route path="/AddProduct" element={<AddProduct />}></Route>
          {/* /////
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/verify_email" element={<Verify_email />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/ForgetPassword" element={<ForgetPassword />}></Route>
          /////// */}
          <Route path="/NotFound" element={<NotFound />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      ) : state?.isLogin == false ? (
        <Routes>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/verify_email" element={<Verify_email />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/ForgetPassword" element={<ForgetPassword />}></Route>
          {state?.userData && (
            <Route path="/ResetPassword" element={<ResetPassword />}></Route>
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
