import "./App.css";
import Myroute from "./components/Myroute";
import { useContext, useEffect } from "react";
import { GlobalContext } from "./context/Context";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import api from "./components/api";
import AppRoutes from "./components/routes/AppRoutes";
import { useNavigate } from "react-router-dom";
import { showToast } from "./components/types";

const App = () => {
  // data store in a context api
  let { state, dispatch } = useContext(GlobalContext);

  const navigate = useNavigate();

  const checkLogin = async () => {
    try {
      let response = await api.get(`/user-detail` , {
        
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
      });

       if (!response?.data?.user) return;

      let adminLogin =
        response.data.user.email === "umarmajeed711@gmail.com" &&
        response.data.user.user_role == 1;
      if (adminLogin) {
        dispatch({ type: "ADMIN_LOGIN", payload: response.data.user });
        getCategory();
      } else {
        dispatch({ type: "USER_LOGIN", payload: response.data.user });
      }

      // if (response?.data?.user.user_role === 1) {
      //   navigate("/admin");
      // } else {
      //   navigate("/");
      // }
      getCartProduct(response?.data?.user?.user_id);
      getWishlist(response?.data?.user?.user_id);
    } catch (error) {
      dispatch({ type: "USER_LOGOUT" });
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (state?.user?.user_id) {
      getCartProduct(state.user.user_id);
    }
  }, [state?.isReloadCart]);

  useEffect(() => {
    if (state?.user?.user_id) {
      getWishlist(state.user.user_id);
    }
  }, [state?.isWishlistReload]);

  const getCartProduct = async (user_id) => {
    dispatch({ type: "LODING_CART", payload: true });
    try {
      let cart_products = await api.get(`/cart-products?user_id=${user_id}`);
      dispatch({ type: "UPDATE_CART", payload: cart_products?.data?.products });
    } catch (error) {
      showToast({
        icon:"error",
        title:error?.data?.message || "something went wrong"
      })
    } finally {
      dispatch({ type: "LODING_CART", payload: false });
    }
  };

  const getWishlist = async (user_id) => {
    dispatch({ type: "WISHLIST_LODING_CART", payload: true });
    try {
      let result = await api.get(`/wishlist?user_id=${user_id}`);
      dispatch({ type: "WISHLIST_CART", payload: result.data.products });
    } catch (error) {
      showToast({
        icon:"error",
        title:error?.data?.message || "something went wrong"
      })
    } finally {
      dispatch({ type: "WISHLIST_LODING_CART", payload: false });
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
      {/* <Navbar />
      <Myroute />
      <Footer /> */}
      <AppRoutes />
    </div>
  );
};

export default App;
