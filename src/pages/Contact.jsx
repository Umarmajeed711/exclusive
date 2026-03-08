import React from "react";
import { AiOutlineHeart, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import { useFormik } from "formik";
import * as yup from "yup";
import "../App.css";
import { useState } from "react";
import Swal from "sweetalert2";
import Breadcrums from "../components/Breadcrums";

const Contact = () => {
  const [loading, setloading] = useState(false);
  const formRef = React.useRef(null); // reference to native HTML form

  // const [apiError, setApiError] = useState("");
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
        (value) => (value ? value.toLowerCase().endsWith("@gmail.com") : false),
      ),

    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(11, "Phone number must be at least 11 digits")
      .max(13, "Phone number is too long"),
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

  const Styles = {
    inputField:
      "border-b-2 bg-gray-200 outline-none w-full px-3 py-2  focus:border-theme-primary transition",
  };
  return (
    <div className="mx-5 md:mx-8 lg:mx-14">
      {/* BreadCrums */}

      <Breadcrums currentPage="Contact" />

      <div className="my-10  grid grid-cols-1 lg:grid-cols-3 place-content-center gap-10 ">
        <div className="col-span-3 lg:col-span-1 min-w-80 shadow-[0_0_7px_rgba(0,0,0,.5)] flex flex-col gap-5  p-5 md:p-8">
          {/* Calls to Us */}
          <div>
            <div className="flex gap-10 items-center ">
              <p className="bg-theme-primary p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlinePhone className="text-lg text-white" />
              </p>
              <p className="text-xl font-medium">Calls to Us</p>
            </div>

            <div className="my-5 flex gap-2 flex-col">
              <p className="text-gray-400 text-sm tracking-normal">
                We are available 24/7, 7 days a week.
              </p>
              <p>
                Phone:{" "}
                <a href="tel:+1111222333" className="hover:text-theme-primary">
                  +1 111-222-333
                </a>
              </p>
              <p>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/1111222333"
                  target="_blank"
                  className="hover:text-theme-primary"
                >
                  +1 111-222-333
                </a>
              </p>
              {/* <p>
                Fax: <span className="text-gray-500">+1 111-222-334</span>
              </p> */}
            </div>
          </div>

          <div className="h-[3px] w-full bg-slate-400"></div>

          {/* Write to Us */}
          <div>
            <div className="flex gap-10 items-center ">
              <p className="bg-theme-primary p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlineMail className="text-lg text-white" />
              </p>
              <p className="text-xl font-medium">Write to Us</p>
            </div>

            <div className="my-5 flex gap-2 flex-col">
              <p className="text-gray-400 text-sm tracking-normal">
                Fill out our form and we will contact you within 24 hours.
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:customer@exclusive.com"
                  className="hover:text-theme-primary italic"
                >
                  customer@exclusive.com
                </a>
              </p>
              <p>
                Support:{" "}
                <a
                  href="mailto:Support@exclusive.com"
                  className="hover:text-theme-primary italic"
                >
                  Support@exclusive.com
                </a>
              </p>
              <p className="text-gray-400 text-sm tracking-normal">
                Address: 123 Exclusive St., Suite 456, New York, NY 10001, USA
              </p>
              <p className="text-gray-400 text-sm tracking-normal">
                Office Hours: Mon-Fri, 9:00 AM - 6:00 PM
              </p>

              {/* Optional: Social Links */}
              <div className="flex gap-3 mt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Facebook
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  Twitter
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  className="text-pink-500 hover:underline"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* contact Form */}

        <div className="col-span-3 lg:col-span-2 min-w-80 p-5 md:p-8 lg:p-8 h-full shadow-[0_0_7px_rgba(0,0,0,.5)]">
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
                    }}
                    onBlur={contactFormik.handleBlur}
                    className={Styles.inputField}
                    disabled={loading}
                  />

                 

                  <div className="error-wrapper">
                    {contactFormik.touched.name &&
                      contactFormik.errors.name && (
                        <p className="requiredError">
                          {contactFormik.errors.name}
                        </p>
                      )}
                  </div>
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
                    }}
                    onBlur={contactFormik.handleBlur}
                    className={Styles.inputField}
                    disabled={loading}
                  />

                  <div className="error-wrapper">
                    {contactFormik.touched.email &&
                      contactFormik.errors.email && (
                        <p className="requiredError">
                          {contactFormik.errors.email}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* phone */}
              <div className="flex gap-3 items-center col-span-1">
                <div className="w-full">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Your Phone *"
                    value={contactFormik.values.phone}
                    onChange={(e) => {
                      contactFormik.handleChange(e);
                    }}
                    onBlur={contactFormik.handleBlur}
                    className={Styles.inputField}
                    disabled={loading}
                  />

                  <div className="error-wrapper">
                    {contactFormik.touched.phone &&
                      contactFormik.errors.phone && (
                        <p className="requiredError">
                          {contactFormik.errors.phone}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 items-center col-span-3 ">

              <textarea
                name="message"
                value={contactFormik.values.message}
                onChange={(e) => {
                  contactFormik.handleChange(e);
                }}
                onBlur={contactFormik.handleBlur}
                disabled={loading}
                placeholder="Your Message *"
                className="w-full h-52 sm:h-[320px] bg-gray-200 outline-none p-2 resize-none border-b-2 border-transparent focus:border-theme-primary transition"
                // className="w-full min-h-48 max-h-60 sm:min-h-[320px] sm:max-h-80  h-full  bg-gray-200  outline-none  p-2 "
                required
              ></textarea>
              </div>

            </div>

            {/* <div className="w-full mt-3 sm:mt-2">
              <textarea
                name="message"
                value={contactFormik.values.message}
                onChange={(e) => {
                  contactFormik.handleChange(e);
                }}
                onBlur={contactFormik.handleBlur}
                disabled={loading}
                placeholder="Your Message *"
                className="w-full min-h-48 max-h-60 sm:min-h-72 sm:max-h-80  h-full  bg-gray-200  outline-none  p-2 "
                required
              ></textarea>
            </div> */}

            <div className="flex justify-end items-center">
              <button
                disabled={loading}
                type="submit"
                className=" bg-theme-primary transition-all duration-200 rounded flex justify-center px-8 py-3 mt-4 text-white  hover:shadow-theme-secondary hover:shadow"
              >
                {loading ? (
                  <div className="flex items-center  p-2 gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                  </div>
                ) : (
                  "Send Message"
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
