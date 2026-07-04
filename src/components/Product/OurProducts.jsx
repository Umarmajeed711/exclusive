import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../../App.css";
import Title from "../helper/Title";
import api from "../helper/api";
import { GlobalContext } from "../../context/Context";
import Modal from "../helper/modal";
import AddProductForm from "./addProduct";
import Swal from "sweetalert2";
import ProductCardSkeleton from "./productCardSkeleton";
import { MdClose } from "react-icons/md";
import { showToast } from "../helper/types";

const isNewArrival = (createdAt) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24); // days difference
  return diffInDays <= 7;
};

const OurProducts = ({
  isWishList = false,
  products = [],
  title = "",
  description = "",
  loading = false,
  updateProduct = () => {},
  delProduct = () => {},
  skeletonProducts = 4,
  onAdd = () => {},
}) => {
  let { state, dispatch } = useContext(GlobalContext);
  let Admin = state?.isAdmin;

  const [projectData, setProjectData] = useState({});

  const [showModal, setShowModal] = useState(false);

  // const addToFavorite = async (product_id) => {
  //   try {
  //     let response = await api.post("/add_to_favorite", {
  //       user_id: state?.user?.user_id,
  //       product_id: product_id,
  //     });
  //     onAdd();
  //     dispatch({ type: "WISHLIST_RELOAD" });
  //     showToast({
  //       icon:"success",
  //       title:response?.data?.message || "Add to wishlist"
  //     })

  //   } catch (error) {
  //     showToast({
  //       icon:"error",
  //       title:error?.response?.data?.message || "something went wrong"
  //     })
  //   }
  // };

  const addToFavorite = async (product_id) => {
    try {
      // Guest User
      if (!state?.user?.user_id) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        if (wishlist.includes(product_id)) {
          return showToast({
            icon: "info",
            title: "Already in wishlist",
          });
        }

        const updatedWishlist = [...wishlist, product_id];

        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        dispatch({
          type: "WISHLIST_CART",
          payload: updatedWishlist,
        });

        dispatch({
          type: "WISHLIST_RELOAD",
        });

        onAdd();

        return showToast({
          icon: "success",
          title: "Added to wishlist",
        });
      }

      // Logged In User
      const response = await api.post("/add_to_favorite", {
        user_id: state?.user?.user_id,
        product_id,
      });

      onAdd();

      dispatch({
        type: "WISHLIST_RELOAD",
      });

      showToast({
        icon: "success",
        title: response?.data?.message,
      });
    } catch (error) {
      showToast({
        icon: "error",
        title: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  const removeToFavorite = async (product_id) => {
    const result = await Swal.fire({
      title: "Are You Sure?",
      text: "Do you want to remove from favorites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    let user_id = state?.user?.user_id;

    // ✅ If user confirms
    if (result?.isConfirmed) {
      let oldCart = state?.wishlist;

      // Guest User
      if (!user_id) {
        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        const updatedWishlist = wishlist.filter((id) => id !== product_id);

        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        dispatch({
          type: "WISHLIST_CART",
          payload: updatedWishlist,
        });

        dispatch({
          type: "WISHLIST_RELOAD",
        });

        showToast({
          icon: "success",
          title: "Product removed successfully",
        });

        return;
      }

      dispatch({
        type: "WISHLIST_CART",
        payload: state?.wishlist?.filter(
          (item) => item.product_id !== product_id,
        ),
      });
      // let check = products?.find((fav) => fav?.product_id === product_id);
      try {
        let response = await api.delete(
          `/remove_to_favorite?user_id=${user_id}&product_id=${product_id}`,
        );
        // Success toast

        showToast({
          icon: "success",
          title: response?.data?.message || "Product Removed Successfully",
        });
        dispatch({ type: "WISHLIST_RELOAD" });
        // delProduct(product_id);
      } catch (error) {
        showToast({
          icon: "error",
          title:
            error?.response?.data?.message || "Product Removed Successfully",
        });

        dispatch({
          type: "WISHLIST_CART",
          payload: oldCart,
        });
      }
    }
  };

  const editProduct = (product) => {
    setProjectData(product);
    setShowModal(true);
  };

  const deleteProduct = async (id) => {
    // 🔥 Show confirmation alert first
    const result = await Swal.fire({
      title: "Are You Sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    // ✅ If user confirms
    if (result?.isConfirmed) {
      try {
        let response = await api.delete(`/product/${id}`);

        showToast({
          icon: "success",
          title: "Product deleted successfully",
        });

        showToast({
          icon: "success",
          title: "Product deleted successfully",
        });
        delProduct(id);
      } catch (error) {
        showToast({
          icon: "error",
          title: error?.response?.data?.message || "something went wrong",
        });
      }
    }
  };

  const onSuccess = ({ position, icon, title, product }) => {
    updateProduct(product);
    setProjectData({});
    setShowModal(false);
    showToast({
          icon: icon,
          title: title,
        });
  };

  const OnError = ({ position, icon, title }) => {
    showToast({
          icon: icon,
          title: title,
        });
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

  const [cartLoading, setcartLoading] = useState(false);

  // function for add to cart
  // const addtoCart = async (product) => {
  //   setcartLoading(true);
  //   try {
  //     let response = await api.post("/add-cart", {
  //       productId: product.product_id,
  //       productName: product.name,
  //       productPrice: product.price,
  //       productDiscount: product.discount,
  //       productImage: product?.image_urls[0],
  //       productSize: product?.sizes[0],
  //       productColor: product?.colors[0],
  //       quantity: 1,
  //       user_id: state?.user?.user_id,
  //     });
  //     dispatch({ type: "TOGGLE_CART" });
  //     // const Toast = Swal.mixin({
  //     //   toast: true,
  //     //   position: "bottom-left",
  //     //   showConfirmButton: false,
  //     //   timer: 3000,
  //     //   timerProgressBar: true,
  //     //   didOpen: (toast) => {
  //     //     toast.onmouseenter = Swal.stopTimer;
  //     //     toast.onmouseleave = Swal.resumeTimer;
  //     //   },
  //     // });
  //     // Toast.fire({
  //     //   icon: "success",
  //     //   title: "Add product successfully",
  //     // });

  //     showToast({
  //       icon:"success",
  //       title:response?.data?.message || "Add product successfully"
  //     })
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //     showToast({
  //             icon:"error",
  //             title:e?.data?.message || "Something went wrong"
  //           })
  //   } finally {
  //     setcartLoading(false);
  //   }
  // };

  const addtoCart = async (product) => {
    if (product?.quantity <= 0) return;
    setcartLoading(true);

    try {
      // Guest User
      if (!state?.user?.user_id) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const existingProduct = cart.find(
          (item) =>
            item.product_id === product.product_id &&
            item.sizes === product?.sizes[0] &&
            item.colors === product?.colors[0],
        );

        if (existingProduct) {
          if ((existingProduct.quantity + 1) > product.quantity) {
            return showToast({
              icon: "error",
              title: `Only ${product.quantity} item(s) available in stock`,
            });
          }
          existingProduct.quantity += 1;
        } else {
          cart.push({
            cart_id: crypto.randomUUID(),
            product_id: product.product_id,
            name: product.name,
            category_name: product?.category_name,
            price: product.price,
            discount: product.discount,
            image_url: product?.image_urls[0],
            sizes: product?.sizes[0],
            colors: product?.colors[0],
            quantity: 1,
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        dispatch({ type: "TOGGLE_CART" });

        return showToast({
          icon: "success",
          title: "Product added to cart",
        });
      }

      // Logged In User
      const response = await api.post("/add-cart", {
        productId: product.product_id,
        productName: product.name,
        productPrice: product.price,
        productDiscount: product.discount,
        productImage: product?.image_urls[0],
        productSize: product?.sizes[0],
        productColor: product?.colors[0],
        quantity: 1,
        user_id: state.user.user_id,
      });

      dispatch({ type: "TOGGLE_CART" });

      showToast({
        icon: "success",
        title: response?.data?.message,
      });
    } catch (e) {

      showToast({
        icon: "error",
        title: e?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setcartLoading(false);
    }
  };

  // const products = [
  //   {
  //     product_id:"1",
  //     name:"Product1",
  //     price:"500$",
  //     discount:10,
  //     created_at:"2-01-2026",
  //     image_urls:["./image.png",""]
  //   },
  //   {
  //     product_id:"1",
  //     name:"Product1",
  //     price:"500$",
  //     discount:10,
  //     created_at:"2-01-2026",
  //     image_urls:["./image.png",""]
  //   },
  //   {
  //     product_id:"1",
  //     name:"Product1",
  //     price:"500$",
  //     discount:10,
  //     created_at:"2-01-2026",
  //     image_urls:["./image.png",""]
  //   },
  //   {
  //     product_id:"1",
  //     name:"Product1",
  //     price:"500$",
  //     discount:10,
  //     created_at:"2-01-2026",
  //     image_urls:["./image.png",""]
  //   },
  // ]

  return (
    <div className="  w-full">
      {/* px-5 my-5 md:px-8 lg:px-14 lg:my-8 */}
      {loading ? (
        // <div className="flex justify-center items-center main">
        //   <div className="loading"></div>
        // </div>
        <div className="grid gap-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 my-5 md:my-8">
          {Array.from({ length: skeletonProducts }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products?.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-md sm:text-xl font-medium  drop-shadow">
            No products found
          </div>
        </div>
      ) : (
        <>
          {title ? <Title title={title} description={description} /> : null}

          <div className="grid gap-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 my-5 md:my-8">
            {products?.map((product, i) => (
              <Link
                key={i}
                to={`/productDetail/${product?.product_id}`}
                className="col-span-1"
              >
                <div className="relative border-none shadow-xl  overflow-hidden  group hover:-translate-y-4 hover:rounded-xl hover:shadow-[0_0_20px_#03A9F4,0_0_20px_#4EC3F8]  transition duration-500">
                  {/* Image & hover */}
                  <div className="relative w-full  h-64 aspect-square overflow-hidden   flex justify-center items-center   bg-slate-100  ">
                    <img
                      src={
                        product?.main_image ||
                        (product?.image_urls?.length > 0
                          ? product?.image_urls[0]
                          : "") ||
                        ""
                      }
                      alt={product?.name}
                      className=" h-[50%]  object-cover group-hover:scale-105 transition "
                    />

                    {/* Favorite & Quick View */}
                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                      {isWishList ? (
                        <button
                          className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-90 shadow hover:bg-gray-200 hover:scale-110 hover:!text-theme-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeToFavorite(product?.product_id);
                          }}
                        >
                          <MdClose className="text-lg text-gray-700 " />
                        </button>
                      ) : (
                        <button
                          className="bg-white p-2 rounded-full shadow opacity-0 group-hover:opacity-90 hover:bg-gray-200 hover:scale-110 hover:!text-theme-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToFavorite(product?.product_id);
                          }}
                        >
                          <AiOutlineHeart className="text-lg text-gray-700 " />
                        </button>
                      )}

                      {/* <button
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert("Quick View");
                        }}
                      >
                        <AiOutlineEye className="text-lg text-gray-700" />
                      </button> */}
                      {Admin && !isWishList ? (
                        <>
                          <button
                            className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-90 shadow hover:bg-gray-200 !z-30 hover:scale-110 hover:!text-theme-primary "
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              editProduct(product);
                            }}
                          >
                            <BiEditAlt className="text-lg text-gray-700" />
                          </button>
                          <button
                            className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-90 shadow hover:bg-gray-200 !z-30 hover:scale-110 hover:!text-theme-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();

                              deleteProduct(product?.product_id);
                            }}
                          >
                            <RiDeleteBin5Line className="text-lg text-gray-700" />
                          </button>
                        </>
                      ) : null}
                    </div>

                    {/*check the product discount is available or not*/}

                    {product?.discount ? (
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                        <button className="px-2 py-1 rounded bg-theme-secondary text-white justify-center">
                          -{product?.discount}%
                        </button>
                      </div>
                    ) : null}

                    {/* product is new or not */}

                    {isNewArrival(product?.created_at) && !product?.discount ? (
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                        <button className="px-2 py-1 rounded bg-[#00ff66] text-white justify-center">
                          New
                        </button>
                      </div>
                    ) : null}

                    {product?.quantity < 1 ? (
                      <button
                        className={`absolute bottom-0 w-full text-center rounded-0 overflow-hidden bg-red-300 text py-2 opacity-0 group-hover:opacity-90 transition "cursor-not-allowed" `}
                      >
                        SOLD OUT
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // alert(`Add ${product?.name} to cart`);
                          addtoCart(product);
                        }}
                        disabled={cartLoading || product?.quantity <= 0}
                        className={`absolute bottom-0 w-full text-center rounded-0 overflow-hidden bg-black text-white py-2 opacity-0 group-hover:opacity-90 transition ${cartLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-2 flex flex-col gap-1">
                    <p className="font-semibold">{product?.name}</p>
                    <div className="flex gap-2 items-center">
                      {/* <p className="text-theme-primary font-medium">
                        ${product?.price}
                      </p> */}
                      {/* <p className="text-gray-500 text-sm">⭐️ 4.5</p> */}
                      {product?.discount ? (
                        <>
                          <p className="text-theme-primary font-medium">
                            $
                            {product?.price -
                              (product?.price * product?.discount) / 100}
                          </p>
                          <p className="line-through text-sm text-gray-400">
                            ${product?.price}
                          </p>
                        </>
                      ) : (
                        <p className="text-theme-primary font-medium">
                          ${product?.price}
                        </p>
                      )}
                      <p className="text-gray-500 text-sm">
                        ⭐ {product?.rating || "4.5"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setProjectData({});
          }}
          isOpen={showModal}
        >
          <AddProductForm
            onClose={() => {
              setShowModal(false);
              setProjectData({});
            }}
            productData={projectData}
            OnSuccess={onSuccess}
            OnError={OnError}
          />
        </Modal>
      )}
    </div>
  );
};

export default OurProducts;
