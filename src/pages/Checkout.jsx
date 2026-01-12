import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router";
import { PiGreaterThan } from "react-icons/pi";
import { Alert, Snackbar } from "@mui/material";
import Swal from "sweetalert2";
import { GlobalContext } from "../context/Context";
import api from "../components/api";
import { loadStripe } from "@stripe/stripe-js";
import Breadcrums from "../components/Breadcrums";

const stripePromise = loadStripe(
  "pk_test_51RzAxGPWEiSO1R9cQzeOZ1uKA3zhy3I3k3TXdRRAyioYt52AJH1qCeRgWQoLBrXVcunvUZjo2vK0rqezkM8fi7Bx00dNeqyJXf"
); // publishable key

const Checkout = () => {
  const [CoupenCode, setCoupenCode] = useState("");
  const [loading, setloading] = useState(false);
  const [OnlinePay, setOnlinePay] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("online");

  const navigate = useNavigate();


  // billing Validation
  const billingValidation = yup.object({
    name: yup.string().required("name is required"),
    email: yup
      .string()
      .email("enter a valid email")
      .required("Email is required"),
    address: yup.string().required("address is required"),
    city: yup.string().required("city name is required"),
    number: yup.number().required("phone number is required").min(11),
  });

  // initailizes the billingFormik
  const billingFormik = useFormik({
    initialValues: {
      name: "",
      address: "",
      city: "",
      number: "",
      email: "",
    },
      validationSchema: billingValidation,

    onSubmit: async (values) => {
      console.log(values);
      

      if (productCart?.length >= 1) {
        // checkout start
       
          let address = `${values.address},${values.city}`;
          try{
            
          

          let response = await api.post("/create-order", {
            user_id: state?.user.user_id,
            shipping_name: values.name,
            shipping_phone: values.number,
            shipping_address: address,
            payment_status: "pending",
            payment_method: paymentMethod,
            delivery_status: "pending",
            cartItems: productCart,
          });

          console.log(response);
          

          // If Online Payment, redirect to Stripe Checkout
        if (paymentMethod === "online" && response?.data?.id) {
          const stripe = await stripePromise;
          await stripe.redirectToCheckout({ sessionId: response?.data.id });
        } else {
          // COD or Offline Order Success
          console.log("Order placed successfully", response?.data);
          // Optionally redirect to success page
          dispatch({type: "UPDATE_CART", payload: null})
          navigate("/OrderComplete");
        }
      }catch(error){
        console.log(error);
        
      }
        
      }
    },
  });

  const handleCheckout = async () => {
    const response = await api.post("/create-checkout-session", {
      items: productCart,
    });

  
    console.log("response.id", response?.data.id);
      console.log("response.session", response?.data.session);
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: response?.data.id });


  };

  

  let { state, dispatch } = useContext(GlobalContext);
  let user_id = state?.user.user_id;

  const [productCart, setProductCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [toggleCart, setToggleCart] = useState(false);

  const getCartProduct = async () => {
    try {
      let cart_products = await api.get(`/cart-products?user_id=${user_id}`);
      setProductCart(cart_products.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCartProduct();
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
  let Styles = {
    fieldName: "text-base sm:text-xl text-slate-500",
    inputField:
      "bg-slate-100 p-2 sm:p-3 w-full outline-none focus:bg-slate-200 focus:animate-pulse focus:shadow-xl",
  };

  return (
    <div className="px-5 md:px-8 lg:px-14  w-full">
      {/* Breadcrums */}

      

      <Breadcrums currentPage="Checkout" prevPages={[{name:"cart",url:"/cart"}]} />

      <div className=" ">
        {/* container mx-auto px-2 sm:px-4  flex justify-center */}
        <form onSubmit={billingFormik.handleSubmit}>
          <div className="grid grid-cols-2 gap-3  ">
            {/* Billing Details */}
            <div className="col-span-2 sm:col-span-1 p-4 md:p-8">
              <p className=" text-3xl sm:text-4xl md:text-5xl  bli">
                Billing Details
              </p>

              {/*  name div */}
              <div className="my-3 ">
                <label htmlFor="name">
                  <p className={Styles.fieldName}>
                    Name <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="text"
                    id="name"
                    className={Styles.inputField}
                    name="name"
                    value={billingFormik.values.name}
                    onChange={billingFormik.handleChange}
                  />
                </label>
                {billingFormik.touched.name &&
                Boolean(billingFormik.errors.name) ? (
                  <p className="requiredError">
                    {billingFormik.touched.name && billingFormik.errors.name}
                  </p>
                ) : null}
              </div>

              {/*address div */}
              <div className="my-3">
                <label htmlFor="Address">
                  <p className={Styles.fieldName}>
                    Address <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="text"
                    id="Address"
                    className={Styles.inputField}
                    name="address"
                    value={billingFormik.values.address}
                    onChange={billingFormik.handleChange}
                  />
                </label>
                {billingFormik.touched.address &&
                Boolean(billingFormik.errors.address) ? (
                  <p className="requiredError">
                    {billingFormik.touched.address &&
                      billingFormik.errors.address}
                  </p>
                ) : null}
              </div>

              {/* town city div */}
              <div className="my-3 ">
                <label htmlFor="townCity">
                  <p className={Styles.fieldName}>
                    Town / City <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="text"
                    id="townCity"
                    className={Styles.inputField}
                    name="city"
                    value={billingFormik.values.city}
                    onChange={billingFormik.handleChange}
                  />
                </label>
                {billingFormik.touched.city &&
                Boolean(billingFormik.errors.city) ? (
                  <p className="requiredError">
                    {billingFormik.touched.city && billingFormik.errors.city}
                  </p>
                ) : null}
              </div>

              {/* phone number */}
              <div className="my-3 ">
                <label htmlFor="phoneNumber">
                  <p className={Styles.fieldName}>
                    Phone number <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="number"
                    id="phoneNumber"
                    className={Styles.inputField}
                    maxLength={12}
                    name="number"
                    value={billingFormik.values.number}
                    onChange={billingFormik.handleChange}
                  />
                </label>
                {billingFormik.touched.number &&
                Boolean(billingFormik.errors.number) ? (
                  <p className="requiredError">
                    {billingFormik.touched.number &&
                      billingFormik.errors.number}
                  </p>
                ) : null}
              </div>

              {/* Email address */}
              <div className="my-3  ">
                <label htmlFor="emailAddress">
                  <p className={Styles.fieldName}>
                    Email address <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="email"
                    id="emailAddress"
                    className={Styles.inputField}
                    name="email"
                    value={billingFormik.values.email}
                    onChange={billingFormik.handleChange}
                  />
                </label>
                {billingFormik.touched.email &&
                Boolean(billingFormik.errors.email) ? (
                  <p className="requiredError">
                    {billingFormik.touched.email && billingFormik.errors.email}
                  </p>
                ) : null}
              </div>
            </div>

            {/* products Detail */}
            <div className="col-span-2 sm:col-span-1 place-content-center">
              <div className=" px-4 py-2  md:py-4 shadow-md bg-slate-100    ">
                {/* product details */}
                <div className="">
                  <div className="p-3">
                    <div className="flex justify-between">
                      <p className="text-base sm:text-xl lg:text-2xl font-bold">
                        Product
                      </p>
                      <p className="text-base sm:text-xl lg:text-2xl font-bold">
                        Sub total
                      </p>
                    </div>

                    {productCart?.map((product, i) => {
                      let newPrice = product.price * (product.discount / 100);
                      return (
                        <div className="flex justify-between mt-2" key={i}>
                          <p className="text-base md:text-xl  text-gray-600 ">
                            {product.name}{" "}
                            <span className="text-black">
                              x {product.quantity}
                            </span>
                          </p>
                          <p className="text-base md:text-xl">
                            {" "}
                            $
                            {Math.round(
                              (product.price - newPrice) * product.quantity
                            )}
                          </p>
                        </div>
                      );
                    })}

                    <div className="flex justify-between mt-2">
                      <p className="text-base md:text-xl font-medium">
                        Subtotal:
                      </p>
                      <p className="text-base md:text-xl">
                        ${Math.round(total)}
                      </p>
                    </div>
                    <hr />

                    <div className="flex justify-between mt-2">
                      <p className="text-base md:text-xl font-medium">
                        Shipping:
                      </p>
                      <p className="text-base md:text-xl">
                        {" "}
                        ${Math.round(deliveryFee)}
                      </p>
                    </div>

                    <hr />

                    <div className="flex justify-between mt-2">
                      <p className="text-base md:text-xl font-bold">Total</p>
                      <p className="text-base md:text-xl font-bold text-[#b88e2f]">
                        {" "}
                        ${Math.round(total + deliveryFee)}
                      </p>
                    </div>

                    <hr />

                    {/* Radio Button for Payment */}

                    <div className="mt-3">
                      {/* Direct trandfer radio button */}

                      <label
                        htmlFor="onlinePay"
                        className="flex gap-2 text-base  font-medium mt-2 "
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          onChange={() => {
                            setPaymentMethod("online");
                            setOnlinePay(true);
                          }}
                          checked={paymentMethod === "online"}
                        />
                        <span id="onlinePay">Direct Bank Transfer</span>
                      </label>

                      {/* Cash on Delivery radio button */}
                      <label
                        htmlFor="cashPay"
                        className="flex gap-2 text-base  font-medium"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value="cash"
                          onChange={() => {
                            setPaymentMethod("cod");
                            setOnlinePay(false);
                          }}
                          checked={paymentMethod === "cod"}
                        />
                        <span id="cashPay">Cash On Delivery</span>
                      </label>

                      {/* policy div */}
                      <p className="text-base  mt-3  text-gray-500">
                        Your personal data will be used to support your
                        experience throughout this website, to manage access to
                        your account, and for other purposes described in our{" "}
                        <span className="font-bold text-black">
                          privacy policy
                        </span>
                        .
                      </p>
                    </div>

                    {/* <div className="flex justify-between gap-5">
                      <input type="text" className="p-2 flex-grow" placeholder="Coupen Code" value={CoupenCode} required onChange={(e) => {setCoupenCode(e?.target.value)}}  />
                      <button type="submit" className=" bg-red-600 transition-all duration-200 flex justify-center rounded px-4 py-2  text-white  hover:shadow-red-400 hover:shadow-md">Apply Coupen</button>
                    </div> */}

                    {/* place order button */}
                    <div className="flex justify-center sm:justify-start mt-4">
                      <button
                        disabled={loading}
                        className=" bg-theme-primary transition-all duration-200 flex justify-center rounded px-6 py-3 my-4 text-white  hover:shadow-theme-secondary hover:shadow-md"
                        type="submit"
                      >
                        {loading ? (
                          <div className="flex items-center px-1 py-2 gap-2">
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                          </div>
                        ) : (
                          "Place Order"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* // */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
