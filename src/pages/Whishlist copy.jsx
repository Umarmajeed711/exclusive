import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Context";
import api from "../components/api";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import OurProducts from "../components/OurProducts";
import Title from "../components/Title";
import Swal from "sweetalert2";

const Whishlist = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadWishlist, setLoadWhishlist] = useState(false);
  const [toggleproducts, settoggleProducts] = useState(false);

  const isNewArrival = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24); // days difference
    return diffInDays <= 7;
  };

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
    getProducts();
    getWishlist();
  }, [toggleproducts]);

  const addToFavorite = async (product_id) => {
    let check = wishlist?.find((fav) => fav?.product_id === product_id);
    if (check) {
      return;
    }

    try {
      let response = await api.post("/add_to_favorite", {
        user_id: state?.user.user_id,
        product_id: product_id,
      });
      settoggleProducts(!toggleproducts);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const removeToFavorite = async (product_id) => {
    let check = wishlist?.find((fav) => fav?.product_id === product_id);
    try {
      if (check) {
        let response = await api.delete("/remove_to_favorite", {
          user_id: state?.user.user_id,
          product_id: product_id,
        });
        settoggleProducts(!toggleproducts);
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [cartLoading, setcartLoading] = useState(false);

  // function for add to cart
  const addtoCart = async (product) => {
    setcartLoading(true);
    try {
      let addTOCart = await api.post("/add-cart", {
        productId: product.product_id,
        productName: product.name,
        productPrice: product.price,
        productDiscount: product.discount,
        productImage: product?.image_urls[0],
        productSize: product?.sizes[0],
        productColor: product?.colors[0],
        quantity: 1,
        user_id: state?.user?.user_id,
      });
      dispatch({ type: "TOGGLE_CART" });
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Add product successfully",
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setcartLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-5 my-5 lg:mx-14 lg:my-8">
        {loadWishlist ? (
          <div className="flex justify-center items-center main">
            <div className="loading"></div>
          </div>
        ) : wishlist.length === 0 ? (
          // <div className="flex justify-center items-center h-[50vh]">
          //   <div className="text-md sm:text-xl font-medium text-red-500 drop-shadow">
          //     No Product in your wishlist , Explore our shop now

          //   </div>

          // </div>
          <div className="flex justify-center flex-col items-center text-base sm:text-2xl my-10 emptyHeight">
            <p className="text-center font-bold text-xl sm:text-4xl md:text-5xl  ">
              Your Wishlist Is Empty.
            </p>
            <p className="text-normal text-center text-base sm:text-lg py-4">
              Add your Favorite Product In your Wishlist now
            </p>
            <Link
              to={"/"}
              className=" bg-black text-white w-full sm:w-auto px-9 py-3 rounded-full text-base text-center font-normal
                                hover:bg-gray-800 transition duration-300 mb-8 md:mb-10"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <Title title="Wishlist" description="Explore your wishlist" />

            <div className="grid gap-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ">
              {wishlist?.map((product, i) => (
                // <Link
                //   key={i}
                //   to={`/ProductDetail/${product.product_id}`}
                //   className="col-span-1"
                // >
                //   <div className="relative border-none  overflow-hidden  group hover:-translate-y-4 hover:shadow-2xl transition duration-500">
                //     {/* Image & hover */}
                //     <div className="relative w-full  h-64 aspect-square overflow-hidden rounded  flex justify-center items-center   bg-slate-100  ">
                //       <img
                //         src={product.image_urls[0]}
                //         alt={product.name}
                //         className=" h-[50%] object-cover group-hover:scale-105 transition "
                //       />

                //       {/* Favorite & Quick View */}
                //       <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                //         <button
                //           className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
                //           onClick={(e) => {
                //             e.preventDefault();
                //             e.stopPropagation();
                //             alert("Remove to favorite");
                //           }}
                //         >
                //           <AiOutlineHeart className="text-lg text-gray-700" />
                //         </button>
                //         <button
                //           className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
                //           onClick={(e) => {
                //             e.preventDefault();
                //             e.stopPropagation();
                //             alert("Quick View");
                //           }}
                //         >
                //           <AiOutlineEye className="text-lg text-gray-700" />
                //         </button>
                //       </div>

                //       {/*check the product discount is available or not*/}

                //       {product.discount ? (
                //         <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                //           <button className="px-2 py-1 rounded bg-red-500 text-white justify-center">
                //             -{product.discount}%
                //           </button>
                //         </div>
                //       ) : null}

                //       {/* product is new or not */}

                //       {isNewArrival(product.created_at) &&
                //       !product.discount ? (
                //         <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                //           <button className="px-2 py-1 rounded bg-[#00ff66] text-white justify-center">
                //             New
                //           </button>
                //         </div>
                //       ) : null}

                //       {/* Add to Cart on hover */}
                //       <button
                //         onClick={(e) => {
                //           e.preventDefault();
                //           e.stopPropagation();
                //           alert(`Add ${product.name} to cart`);
                //         }}
                //         className="absolute bottom-0 w-full text-center bg-black text-white py-2 opacity-0 group-hover:opacity-90 transition"
                //       >
                //         Add to Cart
                //       </button>
                //     </div>

                //     {/* Product Info */}
                //     <div className="p-2 flex flex-col gap-1">
                //       <p className="font-semibold">{product.name}</p>
                //       <div className="flex gap-2 items-center">
                //         <p className="text-red-500 font-medium">
                //           ${product.price}
                //         </p>
                //         <p className="text-gray-500 text-sm">⭐️ 4.5</p>
                //       </div>
                //     </div>
                //   </div>
                // </Link>

                <Link
                  key={i}
                  to={`/ProductDetail/${product?.product_id}`}
                  className="col-span-1"
                >
                  <div className="relative border-none  overflow-hidden  group hover:-translate-y-4 hover:shadow-2xl transition duration-500">
                    {/* Image & hover */}
                    <div className="relative w-full  h-64 aspect-square overflow-hidden   flex justify-center items-center   bg-slate-100  ">
                      <img
                        src={
                          product?.main_image || product?.image_urls[0] || ""
                        }
                        alt={product?.name}
                        className=" h-[50%]  object-cover group-hover:scale-105 transition "
                        // className="h-full w-full object-contain group-hover:scale-105 transition"
                      />

                      {/* <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition" /> */}

                      {/* Favorite & Quick View */}
                      <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                        <button
                          className="bg-white p-2 rounded-full shadow hover:bg-gray-200 hover:scale-110 hover:!text-theme-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            alert("Add to favorite");
                            addToFavorite(product?.product_id);
                          }}
                        >
                          <AiOutlineHeart className="text-lg text-gray-700 " />
                        </button>
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

                      {isNewArrival(product?.created_at) &&
                      !product?.discount ? (
                        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                          <button className="px-2 py-1 rounded bg-[#00ff66] text-white justify-center">
                            New
                          </button>
                        </div>
                      ) : null}

                      {/* Add to Cart on hover */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addtoCart(product);
                        }}
                        disabled={cartLoading}
                        className={`absolute bottom-0 w-full text-center rounded-0 overflow-hidden bg-black text-white py-2 opacity-0 group-hover:opacity-90 transition ${cartLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        Add to Cart
                      </button>
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

            <OurProducts
              products={products}
              title="Our Products"
              description="Explore Our products"
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Whishlist;
