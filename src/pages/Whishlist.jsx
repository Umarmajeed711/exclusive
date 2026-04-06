import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Context";
import api from "../components/api";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import OurProducts from "../components/OurProducts";
import Title from "../components/Title";
import Swal from "sweetalert2";
import { ActiveFilters } from "../components/ActiveFilters";
import TopOffers from "../components/TopOffers";

const Whishlist = () => {
  let { state, dispatch } = useContext(GlobalContext);

   

  let isAdmin = state?.isAdmin;

  

  

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadWishlist, setLoadWhishlist] = useState(false);
  const [toggle,setToggle] = useState(false);
  const [toggleproducts, settoggleProducts] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      // setProducts(result.data.products);
      // console.log(result.data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getWishlist = async () => {
    try {
      setLoadWhishlist(true);
      let result = await api.get(`/wishlist?user_id=${state?.user.user_id}`);
      setWishlist(result.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadWhishlist(false);
    }
  };

    useEffect(() => {
    setWishlist(state?.wishlist);
  }, [state?.wishlist]);

  useEffect(() => {
    // getProducts();
    // getWishlist();
  }, [toggle]);

   


  const handleProductUpdate = (product) => {
      setWishlist((prev) => {
        const exists = prev?.some((p) => p?.product_id === product?.product_id);
  
        if (exists) {
          // UPDATE
          return prev?.map((p) =>
            p.product_id === product.product_id ? product : p,
          );
        }
  
        // ADD
        return [product, ...prev];
      });
    };
  
    const handleProductDelete = (id) => {
      setWishlist((prev) => prev.filter((p) => p.product_id !== id));
    };
  
    const onSuccess = ({ position, icon, message, product }) => {
      dynamicToast({ position, icon, message });
    };
  
    const OnError = ({ position, icon, message }) => {
      dynamicToast({ position, icon, message });
    };
  
    const dynamicToast = ({
      position = "bottom-left",
      icon = "success",
      message = "",
    }) => {
      const Toast = Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
  
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: icon,
        title: message,
      });
    };

  return (
    <div>
      <div className="mx-5 my-5 lg:mx-14 lg:my-8">


         <Title title="Wishlist" description="Explore your wishlist" />

        <OurProducts
          // description="Explore your wishlist"
          // title="Wishlist"
          isWishList={true}
          skeletonProducts={8}
          products={wishlist}
          loading={state?.wishlistLoading}
          // updateProduct={handleProductUpdate}
          // delProduct={handleProductDelete}
        />

        <TopOffers onAdd={() => {setToggle(!toggle)}}/>
       
      </div>
    </div>
  );
};

export default Whishlist;
