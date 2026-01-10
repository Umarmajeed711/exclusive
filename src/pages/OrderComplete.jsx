import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router";
import { GlobalContext } from "../context/Context";
import api from "../components/api";

const OrderConfirmation = () => {
  let { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    console.log("Cart Items", state?.cart);
  });

  const OrderComplete = async () => {
    const params = new URLSearchParams(window.location.search);
    const session_id = params.get("session_id");

    if (session_id) {
      try {
        let response = await api.get(`/verify-payment/${session_id}`);

        if (response?.data.success) {
          console.log("Order saved with ID:", response?.data.order_id);
          dispatch({type: "UPDATE_CART", payload: null})
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    OrderComplete();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 ">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between ">
        <motion.div
          className="text-center w-full md:w-1/2 flex flex-col items-center gap-4 sm:gap-5 mt-8 md:mt-0"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            className="font-bold text-3xl sm:text-4xl md:text-5xl  bli"
            variants={fadeInUp}
          >
            THANK YOU FOR YOUR PURCHASE!
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg text-black"
          >
            You can track your order on the Order items page
          </motion.p>

          <motion.div variants={fadeInUp} className="p-3 sm:p-4 mt-2 sm:mt-3">
            <Link
              className="body-text bg-black text-white w-full sm:w-auto px-9 py-3 rounded-full text-lg font-medium 
              hover:bg-gray-800 transition duration-300 mb-8 md:mb-10"
              to="/Shop"
            >
              Go to Shop
            </Link>
          </motion.div>
        </motion.div>

        {/* Image section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 12,
            delay: 0.3,
          }}
          className="w-full sm:w-4/5 md:w-1/2 flex justify-center"
        >
          <motion.img
            src="/image.png"
            alt="Order Confirmation"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="max-w-full h-auto md:m-12 w-4/5 sm:w-auto bg-transparent"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
