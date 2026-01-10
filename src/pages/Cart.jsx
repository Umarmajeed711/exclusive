import React, { useState } from "react";
import { useEffect } from "react";
import { PiGreaterThan } from "react-icons/pi";
import { Link } from "react-router-dom";
import api from "../components/api";
import { useContext } from "react";
import { GlobalContext } from "../context/Context";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import { IoMdClose } from "react-icons/io";
import Breadcrums from "../components/Breadcrums";

const Cart = () => {
  let { state, dispatch } = useContext(GlobalContext);
  let user_id = state?.user.user_id;

  const [productCart, setProductCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [toggleCart, setToggleCart] = useState(false);

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

  useEffect(() => {
    setTimeout(() => {
      console.log("Cart product from context", state?.cart);
      setProductCart(state?.cart);
    }, 5000);
  }, [toggleCart]);

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

  const deleteCart = async (user_id, cart_id) => {
    try {
      let response = await api.post("/remove-cart", {
        user_id: user_id,
        cart_id: cart_id,
      });

      console.log(response.data);
      setToggleCart(!toggleCart);
      dispatch({ type: "TOGGLE_CART" });
      dispatch({
        type: "UPDATE_CART",
        payload: state?.cart.filter((item) => item?.cart_id !== cart_id),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = () => {
    if (productCart.length > 0) {
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

  return (
    <div className="mx-5 md:mx-14">
      {/* BreadCrums */}
      {/* <div className="container px-3 sm:px-4 md:px-8  mt-5 flex gap-2 items-center">
        <Link
          to="/"
          className="text-base  sm:text-xl font-normal text-gray-500"
        >
          Home
        </Link>{" "}
        <PiGreaterThan />
        <span className="text-sm  sm:text-base font-normal">Cart</span>
      </div> */}
      <Breadcrums currentPage="Cart" />
      <h1 className="text-xl md:text-4xl blii font-bold mt-3 sm:mt-5">
        YOUR CART
      </h1>

      <div>
        {productCart?.length > 0 ? (
          <>
            <div className="hidden md:block">
              <div className="grid  grid-cols-1 md:grid-cols-10 bg-white shadow-xl p-5 text-center text-base lg:text-xl font-medium">
                <div className="col-span-3 text-start">Product</div>
                <div className="col-span-2 text-start">Price</div>
                <div className="col-span-1">Quantity </div>
                <div className="col-span-1">Color</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-1">SubTotal</div>
                <div className="col-span-1">Remove</div>
              </div>
            </div>

            {productCart?.map((cart, i) => {
              let newPrice = cart?.price * (cart?.discount / 100);
              return (
                <div key={i}>
                  {/* show on Tablet and PCs */}
                  <div className="hidden md:block" key={i}>
                    <div className="grid  grid-cols-1 md:grid-cols-10 my-2 bg-white shadow-xl p-5 border">
                      {/* Product */}
                      <div className="col-span-3 flex gap-3  items-center">
                        <div>
                          <img
                            src={cart.image_url}
                            alt=""
                            className="h-12 w-12"
                          />
                        </div>
                        <span className="font-normal">{cart.name}</span>
                      </div>

                      {/* Price */}

                      <div className="col-span-2 flex items-center  gap-2">
                        <p className="text-base lg:text-xl font-semibold   ">
                          ${Math.round(cart.price - newPrice)}
                        </p>

                        {cart.discount > 0 ? (
                          <div className="flex gap-2 items-center">
                            <p className="text-base lg:text-xl font-semibold  text-[rgba(0,0,0,0.4)] line-through  ">
                              ${cart.price}
                            </p>
                            <span className="text-red-600 bg-red-200 px-1 italic text-base lg:text-xl lg:px-2 rounded-xl">
                              -{cart.discount}%
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {/* quantity */}
                      <div className="col-span-1 flex items-center justify-center">
                        {cart.quantity}
                      </div>
                      {/* color */}
                      <div className="col-span-1 flex items-center justify-center">
                        <span
                          className="h-5 ms-1 w-5 rounded-full absolute"
                          style={{
                            backgroundColor: cart.colors.toLowerCase(),
                          }}
                        ></span>
                      </div>
                      {/* sizes */}
                      <div className="col-span-1 flex items-center justify-center">
                        {cart.sizes}
                      </div>
                      {/* subTotal */}
                      <div className="col-span-1 flex items-center justify-center">
                        <p className="text-base lg:text-xl font-semibold">
                          ${Math.round((cart.price - newPrice) * cart.quantity)}
                        </p>
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <RiDeleteBin6Fill
                          className="text-red-500 cursor-pointer text-xl sm:text-2xl"
                          onClick={() => {
                            Swal.fire({
                              title: "Do you want delete this product?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Delete",
                            }).then((result) => {
                              /* Read more about isConfirmed, isDenied below */
                              if (result.isConfirmed) {
                                deleteCart(cart.user_id, cart.cart_id);
                                Swal.fire("Delete!", "", "success");
                              }
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Show on mobiles */}

                  <div className="block md:hidden">
                    <div
                      className="flex justify-center flex-col my-2 bg-white shadow-xl p-5 border relative"
                      key={i}
                    >
                      <div className="col-span-1 flex items-center justify-between absolute top-0 right-0 p-3">
                        <IoMdClose
                          className="text-black hover:text-red-500 cursor-pointer text-xl sm:text-2xl"
                          onClick={() => {
                            Swal.fire({
                              title: "Do you want delete this product?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonText: "Delete",
                            }).then((result) => {
                              /* Read more about isConfirmed, isDenied below */
                              if (result.isConfirmed) {
                                deleteCart(cart.user_id, cart.cart_id);
                                Swal.fire("Delete!", "", "success");
                              }
                            });
                          }}
                        />
                      </div>

                      {/* Product */}

                      <div className="flex justify-center items-center">
                        <img
                          src={cart.image_url}
                          alt=""
                          className="h-20 w-20"
                        />
                      </div>

                      <div className="col-span-3 flex gap-3  items-center justify-between">
                        <div>name:</div>
                        <span className="font-normal">{cart.name}</span>
                      </div>

                      {/* Price */}

                      <div className="col-span-2 flex items-center justify-between  ">
                        <div>Price:</div>

                        <div className="flex gap-2">
                          <p className="text-base lg:text-xl font-semibold   ">
                            ${Math.round(cart.price - newPrice)}
                          </p>

                          {cart.discount > 0 ? (
                            <div className="flex gap-2 items-center">
                              <p className="text-base lg:text-xl font-semibold  text-[rgba(0,0,0,0.4)] line-through  ">
                                ${cart.price}
                              </p>
                              <span className="text-red-600 bg-red-200 px-1 italic text-base lg:text-xl lg:px-2 rounded-xl">
                                -{cart.discount}%
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* quantity */}
                      <div className="col-span-1 flex items-center justify-between ">
                        <div>Quantity:</div>
                        {cart.quantity}
                      </div>
                      {/* color */}
                      <div className="col-span-1 flex items-center justify-between">
                        <div>Color:</div>
                        <div
                          className="h-5 ms-1 w-5 rounded-full "
                          style={{
                            backgroundColor: cart.colors.toLowerCase(),
                          }}
                        ></div>
                      </div>
                      {/* sizes */}
                      <div className="col-span-1 flex items-center justify-between">
                        <div>Sizes:</div>
                        {cart.sizes}
                      </div>
                      {/* subTotal */}
                      <div className="col-span-1 flex items-center justify-between">
                        <div>SubTotal:</div>
                        <p className="text-base lg:text-xl font-semibold">
                          ${Math.round((cart.price - newPrice) * cart.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="flex justify-center flex-col items-center text-base sm:text-2xl sm:min-h-80 h-full my-10 ">
            <p className="text-center font-bold text-xl sm:text-4xl md:text-5xl  ">
              YOUR CART IS EMPTY.
            </p>
            <p className="text-normal text-center text-base sm:text-lg py-4 text-gray-400">
              Must add items to the cart before you proceed to checkout
            </p>
            <Link
              to={"/home"}
              className=" bg-theme-primary text-white w-full sm:w-auto px-9 py-3 rounded-full text-base text-center font-normal
                      hover:shadow-theme-secondary hover:shadow hover:scale-105 transition duration-300 mb-8 md:mb-10"
            >
              Shop Now
            </Link>
          </div>
        )}
      </div>

      {/* order Summary */}

      {productCart?.length > 0 ? (
        <div className="w-full items-center  max-h-96 bg-white shadow-xl ">
          <div className="p-5">
            <p className="text-xl  font-bold sm:text-2xl">Order Summary</p>

            {/* order summary */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex justify-between">
                <p className="text-base  sm:text-xl font-normal text-gray-700">
                  SubTotal
                </p>
                <p className="text-base  sm:text-xl font-semibold">
                  ${Math.round(total)}
                </p>
              </div>

              <div className="flex justify-between">
                <p className="text-base  sm:text-xl font-normal text-gray-700">
                  Shipping:
                </p>
                <p className="text-base  sm:text-xl font-semibold">
                  {deliveryFee > 0 ? `$` + Math.round(deliveryFee) : "Free"}
                </p>
              </div>
              <hr />
              <div className="flex justify-between">
                <p className="text-base  sm:text-xl font-normal ">Total</p>
                <p className=" text-xl  sm:text-2xl font-bold">
                  ${Math.round(total + deliveryFee)}
                </p>
              </div>
            </div>

            <div>
              <button
                className="w-full  transition-all duration-200 bg-red-500 text-white rounded-full p-2 mt-5 hover:bg-red-600"
                onClick={handleCheckout}
                type="submit"
              >
                Go to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Cart;
