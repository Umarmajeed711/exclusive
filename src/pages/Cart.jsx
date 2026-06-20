import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../components/helper/api";
import { useContext } from "react";
import { GlobalContext } from "../context/Context";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import { IoMdClose } from "react-icons/io";
import Breadcrums from "../components/helper/Breadcrums";
import { PiMinus, PiPlus } from "react-icons/pi";
import { isActiveUser, showToast } from "../components/helper/types";
import { VerifyEmailModal } from "../components/helper/VerifyBanner";

const Cart = () => {
  let { state, dispatch } = useContext(GlobalContext);
  // let user_id = state?.user.user_id;

  const [productCart, setProductCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  // const [toggleCart, setToggleCart] = useState(false);
  const [cartLoading, setCartLoading] = useState(true);

  // const getCartProduct = async () => {
  //   try {
  //     let cart_products = await api.get(`/cart-products?user_id=${user_id}`);
  //     setProductCart(cart_products.data.products);
  //     dispatch({type: "UPDATE_CART", payload: cart_products.data.products})
  //     console.log(cart_products.data.products);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // };

  // useEffect(() => {
  //   getCartProduct();
  // }, [toggleCart]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log("Cart product from context after 5s", state?.cart);
  //     setProductCart(state?.cart);
  //     setCartLoading(false);
  //   }, 5000);
  // }, [toggleCart]);

  useEffect(() => {
    setProductCart(state?.cart);
  }, [state?.cart]);

  useEffect(() => {
    let calculatedTotal = 0;
    // let calculatedDeliveryFee = 0;

    productCart?.forEach((product) => {
      const discountedPrice =
        product.price - product.price * (product.discount / 100);
      calculatedTotal += discountedPrice * product.quantity;
      // Add a fixed delivery fee for each product (adjust if necessary)
      // calculatedDeliveryFee += 5; // Example of a fixed delivery fee per product or total
    });

    // Example dynamic delivery fee logic
    let deliveryFeeAmount = 0;
    if (calculatedTotal < 200) {
      deliveryFeeAmount = 5; // $5
    } else if (calculatedTotal < 500) {
      deliveryFeeAmount = 3; // $3
    } else {
      deliveryFeeAmount = 0; // Free delivery
    }

    setTotal(calculatedTotal);
    setDeliveryFee(deliveryFeeAmount);
  }, [productCart]);

  const deleteCart = async (user_id, cart) => {
    const oldCart = state?.cart;

    // Guest User
    if (!user_id) {
      const updatedCart = state?.cart?.filter(
        (item) => item.cart_id !== cart?.cart_id,
      );

      localStorage.setItem("cart", JSON.stringify(updatedCart));

      dispatch({
        type: "UPDATE_CART",
        payload: updatedCart,
      });

      showToast({
        icon: "success",
        title: "Product removed successfully",
      });

      return;
    }

    // Logged In User
    dispatch({
      type: "UPDATE_CART",
      payload: state?.cart?.filter((item) => item.cart_id !== cart?.cart_id),
    });

    try {
      await api.post("/remove-cart", {
        user_id: user_id,
        cart_id: cart?.cart_id,
      });

      showToast({
        icon: "success",
        title: "Product removed successfully",
      });

      dispatch({ type: "TOGGLE_CART" });
    } catch (error) {
      dispatch({
        type: "UPDATE_CART",
        payload: oldCart,
      });

      showToast({
        icon: "error",
        title: error?.response?.data?.message || "Something went wrong",
      });
    }
  };

  useEffect(() => {
    // if (state?.user?.user_id) return;

    const guestCart = state?.user?.user_id
      ? state?.cart || []
      : JSON.parse(localStorage.getItem("cart")) || [];

    if (!guestCart.length) return;

    fetchGuestStock(guestCart);
  }, []);

  const fetchGuestStock = async (guestCart) => {
    try {
      const productIds = [...new Set(guestCart.map((item) => item.product_id))];

      const response = await api.post("/guest-cart-stock", {
        productIds,
      });

      const stockMap = {};

      response.data.forEach((product) => {
        stockMap[product.product_id] = product.stock;
      });

      const updatedCart = guestCart.map((item) => ({
        ...item,
        stock: stockMap[item.product_id] || 0,
      }));

      dispatch({
        type: "UPDATE_CART",
        payload: updatedCart,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantity = async (cartItem, type) => {
    const oldCart = state.cart;

    const nextQuantity =
      type === "increase" ? cartItem.quantity + 1 : cartItem.quantity - 1;

    if (nextQuantity < 1) return;

    if (type === "increase" && nextQuantity > cartItem.stock) {
      return showToast({
        icon: "error",
        title: `Only ${cartItem.stock} item(s) available`,
      });
    }

    let updatedCart = state.cart.map((item) => {
      const isCurrentItem = item.cart_id === cartItem.cart_id;

      if (isCurrentItem) {
        const newQty =
          type === "increase" ? item.quantity + 1 : item.quantity - 1;

        if (newQty < 1) return item;

        return {
          ...item,
          quantity: newQty,
        };
      }

      return item;
    });

    // Optimistic update
    dispatch({
      type: "UPDATE_CART",
      payload: updatedCart,
    });

    try {
      // Guest User
      if (!state?.user?.user_id) {
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        return;
      }

      const quantity =
        type === "increase" ? cartItem.quantity + 1 : cartItem.quantity - 1;

      if (quantity > cartItem.stock) {
        return showToast({
          icon: "error",
          title: `Only ${cartItem.stock} item(s) available`,
        });
      }

      if (quantity >= 1) {
        // Logged In User
        await api.put("/update-cart-quantity", {
          cart_id: cartItem.cart_id,
          quantity: quantity,
        });
      }
    } catch (error) {
      // Rollback
      dispatch({
        type: "UPDATE_CART",
        payload: oldCart,
      });
      showToast({
        icon: "error",
        title: error?.response?.data?.message || "Quantity update failed",
      });
    }
  };

   const [showVerifyModal, setShowVerifyModal] =
    useState(false);

  const handleCheckout = () => {
    if (!isActiveUser(state?.user) && state?.isLogin) {
      return showToast({
        icon: "error",
        title: `Your account is  ${state?.user?.status}`,
      });
    }
    if (productCart.length > 0) {
       if (!state?.user?.user_id) {
      window.location.href = "/login";
      return;
    }

    // user login hai but email verify nahi hai
    if (!state?.user?.email_verified) {
      setShowVerifyModal(true);
      return;
    }
      // If there are items in the cart, redirect to the checkout page
      window.location.href = "/checkout";
    } else {
      // If the cart is empty, show an alert or message
      Swal.fire({
        title: "Your cart is empty",
        text: "Add some product to start Shopping.",
        icon: "warning",
      });
    }
  };

   const handleVerifiedClick = () => {
    setShowVerifyModal(false);

    if (state?.user?.email_verified) {
      setShowVerifyModal(false);
      window.location.href = "/checkout";
    } else {
      showToast({
        icon: "info",
        title:
          "If you’ve already verified your email, please  logIn again.",
      });
      setTimeout(() => {
        window.location.href = "/login";
      },500)
    }
  };


  return (
    <div className="mx-5 md:mx-8 lg:mx-14 pb-10">
      <Breadcrums currentPage="Cart" />

      <div className="mt-5 mb-8">
        <h1 className="text-xl sm:text-4xl  font-bold">Your Cart</h1>

        <p className="text-gray-500 mt-2">
          {productCart?.length} Item(s) in your cart
        </p>
      </div>

      {state?.cardLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="loading"></div>
        </div>
      ) : productCart?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CART ITEMS */}
          <div className="lg:col-span-8 ">
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ">
              <div className="grid md:grid-cols-8 font-semibold text-gray-700">
                <div className="col-span-3">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-1 text-center">Quantity</div>
                <div className="col-span-1 text-center">Subtotal</div>
                <div className="col-span-1 text-center">Remove</div>
              </div>
            </div>

            {productCart?.map((cart, i) => {
              const newPrice = cart.price * (cart.discount / 100);

              return (
                <div key={i}>
                  {/* Desktop */}
                  <div className="hidden md:block">
                    <div className="grid md:grid-cols-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-5 my-3">
                      {/* Product */}
                      <div className="col-span-3 flex items-center gap-4">
                        <img
                          src={cart.image_url}
                          alt={cart.name}
                          className="h-20 w-20 object-cover rounded-xl border"
                        />

                        <div>
                          <h3 className="font-semibold text-lg">{cart.name}</h3>

                          <div className="flex gap-3 text-sm text-gray-500 mt-1">
                            <span>Size: {cart.sizes}</span>

                            <span>Color: {cart.colors}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 flex flex-col justify-center">
                        <p className="font-bold text-lg text-theme-primary">
                          ${Math.round(cart.price - newPrice)}
                        </p>

                        {cart.discount > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="line-through text-gray-400">
                              ${cart.price}
                            </span>

                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                              {cart.discount}% OFF
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-1 flex justify-center items-center w-full">
                        <div className="flex items-center border rounded-xl overflow-hidden">
                          <button
                            onClick={() => handleQuantity(cart, "decrease")}
                            disabled={cart.quantity <= 1}
                            className="px-2 py-2 hover:bg-gray-100 disabled:opacity-40"
                          >
                            <PiMinus />
                          </button>

                          <span className="px-4 font-medium">
                            {cart.quantity}
                          </span>

                          <button
                            onClick={() => handleQuantity(cart, "increase")}
                            disabled={cart.quantity >= cart.stock}
                            className="px-2 py-2 hover:bg-gray-100 disabled:opacity-40"
                          >
                            <PiPlus />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-1 flex justify-center items-center font-bold">
                        ${Math.round((cart.price - newPrice) * cart.quantity)}
                      </div>

                      {/* Delete */}
                      <div className="col-span-1 flex justify-center items-center">
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: "Do you want delete this product?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Delete",
                            }).then(async (result) => {
                              if (result.isConfirmed) {
                                await deleteCart(cart.user_id, cart);
                              }
                            });
                          }}
                          className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-red-50"
                        >
                          <RiDeleteBin6Fill className="text-red-500 text-xl" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="md:hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5 my-3 relative">
                    <button
                      className="absolute top-4 right-4"
                      onClick={() => {
                        Swal.fire({
                          title: "Do you want delete this product?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Delete",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteCart(cart.user_id, cart);
                          }
                        });
                      }}
                    >
                      <IoMdClose className="text-xl" />
                    </button>

                    <div className="flex gap-4">
                      <img
                        src={cart.image_url}
                        alt={cart.name}
                        className="h-24 w-24 rounded-xl object-cover border"
                      />

                      <div className="flex-1">
                        <h3 className="font-semibold">{cart.name}</h3>

                        <p className="text-sm text-gray-500">
                          Size: {cart.sizes}
                        </p>

                        <p className="text-sm text-gray-500">
                          Color: {cart.colors}
                        </p>

                        <p className="font-bold text-theme-primary mt-2">
                          ${Math.round(cart.price - newPrice)}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-5">
                      <div className="flex items-center border rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleQuantity(cart, "decrease")}
                          disabled={cart.quantity <= 1}
                          className="px-3 py-2"
                        >
                          <PiMinus />
                        </button>

                        <span className="px-4">{cart.quantity}</span>

                        <button
                          onClick={() => handleQuantity(cart, "increase")}
                          disabled={cart.quantity >= cart.stock}
                          className="px-3 py-2"
                        >
                          <PiPlus />
                        </button>
                      </div>

                      <div className="font-bold">
                        ${Math.round((cart.price - newPrice) * cart.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ORDER SUMMARY */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-5">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-5">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">${Math.round(total)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {deliveryFee > 0 ? `$${Math.round(deliveryFee)}` : "Free"}
                    </span>
                  </div>

                  <hr />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span>${Math.round(total + deliveryFee)}</span>
                  </div>
                </div>

                <button
                  disabled={!isActiveUser(state?.user) && state?.isLogin}
                  title={
                    !isActiveUser(state?.user) && state?.isLogin
                      ? `Your account is currently ${state?.user?.status}`
                      : "Checkout"
                  }
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-theme-primary text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <div className="text-8xl">🛒</div>

          <h2 className="text-4xl font-bold mt-4">Your Cart Is Empty</h2>

          <p className="text-gray-500 mt-3">
            Looks like you haven't added any products yet.
          </p>

          <Link
            to="/shop"
            className="mt-6 bg-theme-primary text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      <VerifyEmailModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        onVerified={handleVerifiedClick}
      />
    </div>
  );
};

export default Cart;
