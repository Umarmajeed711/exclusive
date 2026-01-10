import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { useFormik } from "formik";
import * as yup from "yup";
import "../App.css";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GlobalContext } from "../context/Context";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";
import { PiGreaterThan } from "react-icons/pi";
import Breadcrums from "../components/Breadcrums";

const Contact = () => {
  const [loading, setloading] = useState(false);
  const formRef = React.useRef(null); // reference to native HTML form

  const [apiError, setApiError] = useState("");
  const contactValidation = yup.object({
    name: yup.string().trim().required("Name is required"),
    email: yup
      .string()
      .trim()
      .email("Invalid email format")
      .required("Email is required")
      .test(
        "valid-domain",
        "emails ending in @gmail.com are allowed",
        (value) => (value ? value.toLowerCase().endsWith("@gmail.com") : false)
      ),

    phone: yup.number().required("phone number is required").min(11),
  });

  const contactFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
      phone: undefined,
    },
    validationSchema: contactValidation,

    onSubmit: async (values) => {
      setloading(true);
      console.log(values);

      formRef.current.submit();

      // Simulate form submit (API call, FormSubmit, etc.)
      setTimeout(() => {
        setloading(false);
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
          title: "Thank you for message",
        });

        contactFormik.resetForm();
      }, 1000); 
    },
  });

  let Styles = {
    inputField: "border-b-2  bg-gray-200 p-1 outline-none  w-full p-2",
  };
  return (
    <div className="mx-5 lg:mx-10">
      {/* BreadCrums */}
      {/* <div className="container px-3 sm:px-4 md:px-8  mt-5 flex gap-2 items-center">
        <Link
          to="/"
          className="text-base  sm:text-xl font-normal text-gray-500"
        >
          Home
        </Link>{" "}
        <PiGreaterThan />
        <span className="text-sm  sm:text-base font-normal"></span>
      </div> */}

      <Breadcrums currentPage="My Account" />

      <div className="my-10 flex flex-col  lg:flex-row lg:justify-center gap-10 ">
        <div className="min-w-80 shadow-lg flex flex-col gap-5  p-10">
          {/* Calls to Us */}

          <div>
            <div className="flex gap-10 items-center ">
              <p className="bg-theme-primary  p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlineHeart className="text-lg text-white" />
              </p>
              <p className="text-xl font-medium">Calls to Us</p>
            </div>

            <div className="my-5 flex gap-2 flex-col">
              <p>We are available 24/7,7 days a week,</p>
              <p>
                Phone: <a href="tel:111222333">+1 111-222-333</a>
              </p>
            </div>
          </div>

          <div className="h-[3px] w-full bg-slate-400"></div>

          {/* write to Us */}

          <div>
            <div className="flex gap-10 items-center ">
              <p className="bg-theme-primary  p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlineHeart className="text-lg text-white" />
              </p>
              <p className="text-xl font-medium">Write to Us</p>
            </div>

            <div className="my-5 flex gap-2 flex-col">
              <p>
                Fill out the our form and we will contact you within 24 hours.
              </p>
              <p>
                Email: <a href="mailto:abc@gmail.com">customer@exclusive.com</a>
              </p>
              <p>
                Email: <a href="mailto:abc@gmail.com">Support@exclusive.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* contact Form */}

        <div className=" min-w-80 p-5 md:p-10 h-full shadow-lg">
          <form
            action="https://formsubmit.co/abc@gmail.com"
            method="POST"
            ref={formRef}
            onSubmit={contactFormik.handleSubmit}
          >
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* name */}
              <div className="flex gap-3 items-center col-span-1 ">
                <div className="w-full">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Your Name *"
                    value={contactFormik.values.name}
                    onChange={(e) => {
                      contactFormik.handleChange(e);
                      setApiError(""); // clear backend error
                    }}
                    className={Styles.inputField}
                    disabled={loading}
                  />

                  {contactFormik.touched.name &&
                  Boolean(contactFormik.errors.name) ? (
                    <p className="requiredError">
                      {contactFormik.touched.name && contactFormik.errors.name}
                    </p>
                  ) : (
                    <p className="ErrorArea">Error Area</p>
                  )}
                </div>
              </div>

              {/* email */}
              <div className="flex gap-3 items-center col-span-1">
                <div className="w-full">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Your Email *"
                    value={contactFormik.values.email}
                    onChange={(e) => {
                      contactFormik.handleChange(e);
                      setApiError(""); // clear backend error
                    }}
                    className={Styles.inputField}
                    disabled={loading}
                  />

                  {contactFormik.touched.email &&
                  Boolean(contactFormik.errors.email) ? (
                    <p className="requiredError">
                      {contactFormik.touched.email &&
                        contactFormik.errors.email}
                    </p>
                  ) : (
                    <p className="ErrorArea">Error Area</p>
                  )}
                </div>
              </div>

              {/* phone */}
              <div className="flex gap-3 items-center col-span-1">
                <div className="w-full">
                  <input
                    type="number"
                    name="phone"
                    id="phone"
                    placeholder="Your Phone *"
                    value={contactFormik.values.phone}
                    onChange={(e) => {
                      contactFormik.handleChange(e);
                      setApiError(""); // clear backend error
                    }}
                    className={Styles.inputField}
                    disabled={loading}
                  />

                  {contactFormik.touched.phone &&
                  Boolean(contactFormik.errors.phone) ? (
                    <p className="requiredError">
                      {contactFormik.touched.phone &&
                        contactFormik.errors.phone}
                    </p>
                  ) : (
                    <p className="ErrorArea">Error Area</p>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full mt-2">
              <textarea
                name="message"
                value={contactFormik.values.message}
                onChange={(e) => {
                  contactFormik.handleChange(e);
                  setApiError(""); // clear backend error
                }}
                disabled={loading}
                placeholder="Your Message *"
                className="w-full h-60  bg-gray-200  outline-none  p-2 max-h-72 "
                required
              ></textarea>
            </div>

            <div className="flex justify-end items-center">
              <button
                disabled={loading}
                type="submit"
                className=" bg-theme-primary transition-all duration-200 rounded flex justify-center px-8 py-3 my-4 text-white  hover:shadow-theme-secondary hover:shadow"
              >
                {loading ? (
                  <div className="flex items-center  p-2 gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                  </div>
                ) : (
                  "send Message"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
