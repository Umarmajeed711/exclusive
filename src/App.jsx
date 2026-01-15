import "./App.css";
import Myroute from "./components/Myroute";
import { useContext, useEffect } from "react";
import { GlobalContext } from "./context/Context";
import axios from "axios";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Signup } from "./pages/signup";
import { Login } from "./pages/login";
import Category from "./components/Category";
// import AddProduct from "./components/AddProduct";
import Products from "./pages/PrivatePages/Products";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NewArrivals from "./components/NewArrivals";
import api from "./components/api";
import OurProducts from "./components/OurProducts";
import { useState } from "react";

const App = () => {
  // data store in a context api
  let { state, dispatch } = useContext(GlobalContext);

  // important

  //   useEffect(() => {
  //       // Add a request interceptor
  //       axios.interceptors.request.use(function (config) {
  //          // Do something before request is sent

  //          config.withCredentials = true

  //          return config;
  //       }, function (error) {
  //          // Do something with request error
  //          return Promise.reject(error);
  //       });

  //       // Add a response interceptor
  //       axios.interceptors.response.use(function (response) {
  //          // Any status code that lie within the range of 2xx cause this function to trigger
  //          // Do something with response data
  //          return response;
  //       }, function (error) {

  //          if (error.response.status === 401) {
  //             dispatch({
  //                type: 'USER_LOGOUT'
  //             });
  //          }
  //          // Any status codes that falls outside the range of 2xx cause this function to trigger
  //          // Do something with response error
  //          return Promise.reject(error);
  //       });
  //    }, [])

  //  const getUserData = async() => {
  //       try {
  //         let res = await api.get('/profile');
  //         dispatch({type: "USER_LOGIN", user: res.data?.user})

  //       } catch (error) {
  //         dispatch({type: "USER_LOGOUT"})
  //       }
  //     }
  //     getUserData();

  const checkLogin = async () => {
    try {
      let response = await api.get(`/user-detail`);

      let adminLogin = response.data.user.email == "umarmajeed711@gmail.com";
      if (adminLogin) {
        dispatch({ type: "ADMIN_LOGIN", payload: response.data.user });
        getCategory();
      } else {
        dispatch({ type: "USER_LOGIN", payload: response.data.user });
      }
      console.log(response);
      getCartProduct(response?.data.user.user_id);
    } catch (error) {
      dispatch({ type: "USER_LOGOUT" });
    }
  };

  useEffect(() => {
    checkLogin();
  }, [state?.isReloadCart]);

  const getCartProduct = async (user_id) => {
    try {
      let cart_products = await api.get(`/cart-products?user_id=${user_id}`);
      console.log(cart_products.data.products);
      dispatch({ type: "UPDATE_CART", payload: cart_products?.data?.products });
    } catch (error) {
      console.log(error);
    }
  };

  
  
    const getCategory = async () => {
      try {
        let result = await api.get(`/categories`);
        console.log("CAtegory list", result.data.categories);
        
  
        
        dispatch({ type: "CATEGORY_LIST", payload: result.data.categories });
      } catch (error) {}
    };

   

  // useEffect(() => {
  //   getCartProduct()
  // },[])

  return (
    <div>
      <Navbar />
      <Myroute />
      <Footer />
      {/* <OurProducts/> */}
    </div>
  );
};

export default App;
