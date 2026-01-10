import React, { useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../components/api";
import { GlobalContext } from "../context/Context";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router";
import { PiGreaterThan } from "react-icons/pi";
import { Alert, Snackbar } from "@mui/material";
import Swal from "sweetalert2";

const stripePromise = loadStripe("pk_test_51RzAxGPWEiSO1R9cQzeOZ1uKA3zhy3I3k3TXdRRAyioYt52AJH1qCeRgWQoLBrXVcunvUZjo2vK0rqezkM8fi7Bx00dNeqyJXf");

function Form() {

  let {state} = useContext(GlobalContext)
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setloading] = useState(false);
  const [OnlinePay, setOnlinePay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // billing Validation
  const billingValidation = yup.object({
    name: yup.string().required("name is required"),
    email: yup
      .string()
      .email("enter a valid email")
      .required("Email is required"),
    street: yup.string().required("street address is required"),
    city: yup.string().required("city name is required"),
    number: yup.number().required("phone number is required").min(11),
  });

  // initailizes the billingFormik
  const billingFormik = useFormik({
    initialValues: {
      name: "",
      street: "",
      city: "",
      number: "",
      email: "",
      apartment: "",
    },
    validationSchema: billingValidation,

    onSubmit: async (values) => {
      console.log(values);
      // billingFormik.resetForm();

      // checkout start

   
    if (paymentMethod === "cash") {
    //   await axios.post("/api/create-order", { cartItems, paymentMethod: "COD" });
     return alert("Order placed successfully!");
    } else {
      setOnlinePay(true);
    }
  



   

    },
  });


   const handleStripePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {  
    // 1) Ask backend to create PaymentIntent + draft order
    const { data } = await api.post("/stripe-payment", {
      user_id: 12, // replace with real logged in user id
    //   shipping: values,
      items :productCart,
      currency: "usd"
    });

    // 2) Confirm card payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });


    if (error) {
      alert(error.message)
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      // Webhook will mark order as paid/processing
      alert("Payment success! Check your order status page.");
    }


    } catch (error) {
        alert(error.message);
    
        
    }

    };




 let user_id = state?.user.user_id;

   const [productCart, setProductCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
  
  const getCartProduct = async () => {
      try {
        let cart_products = await api.get(`/cart-products?user_id=${user_id}`);
        setProductCart(cart_products.data.products);
        console.log(cart_products.data.products);
        
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getCartProduct();
    }, []);



    useEffect(() => {
      let calculatedTotal = 0;
      let calculatedDeliveryFee = 0;
  
      productCart?.forEach((product) => {
        const discountedPrice =
          product.price - product.price * (product.discount / 100);
        calculatedTotal += discountedPrice * product.quantity;
        // Add a fixed delivery fee for each product (adjust if necessary)
        calculatedDeliveryFee += 5; // Example of a fixed delivery fee per product or total
      });
  
      setTotal(calculatedTotal);
      setDeliveryFee(calculatedDeliveryFee);
    }, [productCart]);


  let Styles = {
    fieldName: "text-base sm:text-xl text-slate-500",
    inputField:
      "bg-slate-100 p-2 sm:p-3 w-full outline-none focus:bg-slate-200 focus:animate-pulse focus:shadow-xl",
  };



  return (
    <div>

    <div className="container  px-3 sm:px-4 md:px-8  mt-5 flex gap-2 items-center ">
        <Link
          to={"/"}
          className="text-base  sm:text-xl font-normal text-gray-500"
        >
          Home
        </Link>
        <PiGreaterThan />
        <Link to={"/cart"} className="text-sm  sm:text-base font-normal">
          Cart
        </Link>
        <PiGreaterThan />
        <Link className="text-sm  sm:text-base font-normal">Checkout</Link>
      </div>

    <div className="container mx-auto px-2 sm:px-4  flex justify-center ">
        <form onSubmit={billingFormik.handleSubmit}>
          <div className="grid grid-cols-2 gap-3 lg:px-20 ">
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

              {/* street address div */}
              <div className="my-3">
                <label htmlFor="streetAddress">
                  <p className={Styles.fieldName}>
                    Street address <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="text"
                    id="streetAddress"
                    className={Styles.inputField}
                    name="street"
                    value={billingFormik.values.street}
                    onChange={billingFormik.handleChange}
                  />
                </label>
                {billingFormik.touched.street &&
                Boolean(billingFormik.errors.street) ? (
                  <p className="requiredError">
                    {billingFormik.touched.street &&
                      billingFormik.errors.street}
                  </p>
                ) : null}
              </div>

              {/* Apartment. floor */}

              <div className="my-3 ">
                <label htmlFor="apartment">
                  <p className={Styles.fieldName}>
                    Apartment,floor, etc.(optional)
                  </p>
                  <input
                    type="text"
                    id="apartment"
                    className={Styles.inputField}
                    name="apartment"
                    value={billingFormik.values.apartment}
                    onChange={billingFormik.handleChange}
                  />
                </label>
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
            <div className="col-span-2 sm:col-span-1">
              <div className=" px-4 py-2  md:py-4 shadow-md bg-slate-100  sm:mt-10  ">
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
                            // setOnlinePay(true);
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
                            setPaymentMethod("cash");
                            // setOnlinePay(false);
                          }}
                          checked={paymentMethod === "cash"}
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

                  
                    {/* place order button */}
                    <div className="flex justify-center sm:justify-start mt-4">
                      <button
                        disabled={!stripe}
                        className=" bg-red-600 transition-all duration-200 flex justify-center rounded px-6 py-3 my-4 text-white  hover:shadow-red-400 hover:shadow-md"
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


     {OnlinePay && (
        <div>
          <CardElement/>
          <button onClick={handleStripePayment}>Pay Now</button>
        </div>
      )}



    </div>
  );
}

export default function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <Form />
    </Elements>
  );
}
