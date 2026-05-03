import "./App.css";
import Myroute from "./components/Myroute";
import { useContext, useEffect } from "react";
import { GlobalContext } from "./context/Context";
// import AddProduct from "./components/AddProduct";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import api from "./components/api";

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

  // useEffect(() => {
  //   checkLogin();
  // }, [state?.isReloadCart]);
  // 3120294147799 


  const checkLogin = async () => {
    try {
      let response = await api.get(`/user-detail`);

      let adminLogin = response.data.user.email === "umarmajeed711@gmail.com";
      if (adminLogin) {
        dispatch({ type: "ADMIN_LOGIN", payload: response.data.user });
        getCategory();
      } else {
        dispatch({ type: "USER_LOGIN", payload: response.data.user });
      }
      console.log(response);
      getCartProduct(response?.data?.user?.user_id);
      getWishlist(response?.data?.user?.user_id)
    } catch (error) {
      dispatch({ type: "USER_LOGOUT" });
    }
  };

  
useEffect(() => {
  // const user =
  //   JSON.parse(localStorage.getItem("user")) ||
  //   JSON.parse(sessionStorage.getItem("user"));

  //   console.log("user FRom storage",user)

  // if (user) {
  //   if (user.email === "umarmajeed711@gmail.com") {
  //     dispatch({ type: "ADMIN_LOGIN", payload: user });
  //   } else {
  //     dispatch({ type: "USER_LOGIN", payload: user });
  //   }
  // }else{
  //   dispatch({ type: "USER_LOGOUT" });

  // }
  checkLogin();
}, []);

useEffect(() => {
  if (state?.user?.user_id) {
    getCartProduct(state.user.user_id);
  }
}, [state?.isReloadCart]);

useEffect(() => {
  if (state?.user?.user_id) {
    console.log("Whishlsit load");
    
    getWishlist(state.user.user_id);
  }
}, [state?.isWishlistReload]);



  const getCartProduct = async (user_id) => {
    dispatch({ type: "LODING_CART",payload:true });
    try {
      let cart_products = await api.get(`/cart-products?user_id=${user_id}`);
      // console.log(cart_products.data.products);
      dispatch({ type: "UPDATE_CART", payload: cart_products?.data?.products });
     
    } catch (error) {
      console.log(error);
    }
    finally{
       dispatch({ type: "LODING_CART",payload:false});
    }
  };

   const getWishlist = async (user_id) => {
    dispatch({ type: "WISHLIST_LODING_CART",payload:true });
    try {
      let result = await api.get(`/wishlist?user_id=${user_id}`);
      dispatch({ type: "WISHLIST_CART", payload: result.data.products });
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: "WISHLIST_LODING_CART",payload:false});
    }
  };

  const getCategory = async () => {
    try {
      let result = await api.get(`/categories`);

      dispatch({ type: "CATEGORY_LIST", payload: result.data.categories });
    } catch (error) {}
  };

  
  return (
    <div>
      <Navbar />
      <Myroute />
      <Footer />
    </div>
  );
};

export default App;
