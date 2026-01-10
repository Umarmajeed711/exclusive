import React, { useEffect } from "react";
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
import api from "../components/api";
import Breadcrums from "../components/Breadcrums";


const Account = () => {

  let {state,dispatch} = useContext(GlobalContext);


   let {user_id,name,email,phone} = state?.user;


  const [loading, setloading] = useState(false);
    
    
  const [apiError, setApiError] = useState("");



 

  const contactValidation = yup.object({
    name: yup.string().trim().required("Name is required").min(2,"Name is too short"),
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
    phone: yup.string().required("Phone number is required").matches(/^\+?[0-9]{10,14}$/,"Enter a valid number")
    ,
    // If user enters a newPassword, require currentPassword
password: yup.string().when("newPassword", {
is: (val) => !!val && val.length > 0,
then: (schema) => schema.required("Password is required"),
otherwise: (schema) => schema.notRequired(),
}),

// newPassword is optional, but if present must meet strength rules
newPassword: yup.string()
  .nullable()
  .test("min-length", "At least 8 characters", (val) => !val || val.length >= 8)
  .test("lowercase", "Must include a lowercase letter", (val) => !val || /[a-z]/.test(val))
  .test("uppercase", "Must include an uppercase letter", (val) => !val || /[A-Z]/.test(val))
  .test("number", "Must include a number", (val) => !val || /\d/.test(val))
  .test("special", "Must include a special character", (val) => !val || /[@$!%*?&#]/.test(val)),


// confirmPassword only required when newPassword is present and must match
confirmPassword: yup.string().when("newPassword", {
  is: (val) => val && val.length > 0,
  then: (schema) => schema.required("Please confirm  password")
  .oneOf([yup.ref("newPassword")], "Passwords must match"),
  otherwise: (schema) => schema.notRequired(),
}),
      
  });

  const contactFormik = useFormik({
    initialValues: {
      name: name,
      email: email,
      phone: phone ? phone : "",
      password:"",
      newPassword:"",
      confirmPassword : ""
    },
    enableReinitialize: true,
    validationSchema: contactValidation,

   

    onSubmit: async (values) => {
      setloading(true);
      

      if(name === values.name && email === values.email && phone === values.phone && !values.password && !values.confirmPassword && !values.newPassword){
      setloading(false);
      return Swal.fire("No Changes", "You haven’t made any changes!", "info");
      }
      try {

         let response = await api.put(`/edit-profile`, {
          user_id: user_id,
          name:values.name !== name ? values.name : null,
          email: values.email !== email ? values.email : null,
          phone:values.phone !== phone ? values.phone : null,
          password: values.password,
          newPassword:values.newPassword,
          confirmPassword:values.confirmPassword
        });

        console.log(response);

        dispatch({ type: "USER_LOGIN", payload: response.data.profile });



        
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
        title: "Edit Profile Successfully",
      });

      setloading(false);
      contactFormik.resetForm();
      } catch (error) {

        setloading(false);
        setApiError(error?.response.data.message || "Something went wrong");
        console.log(error?.response.data.message);
        
        
      }
       
      
      

   

        
    },
  });

  let Styles = {
    inputField:
      "border-b-2  bg-gray-200 p-1 outline-none  w-full p-2",
  };
  return (
    <div className="mx-5 lg:mx-10">
      {/* BreadCrums */}
     
      <Breadcrums currentPage="My Account"/>

      <div className="my-10 flex flex-col  lg:flex-row lg:justify-center gap-10 ">

        {/* side Navigation section */}
        <div className="min-w-80 shadow-lg flex flex-col gap-5  p-10">
          {/* Calls to Us */}

          <div>
            <div className="flex gap-3 items-center ">
             
              <p className="bg-theme-primary  p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlineHeart className="text-lg text-white" />
              </p>
              <p className="text-xl font-medium">Manage My Account</p>
            </div>

            <div className="flex mx-10 gap-2 items-center p-2">
                 <Link to="">My Profile</Link>
            </div>
          </div>

          <div className="h-[3px] w-full bg-slate-400">
          </div>

         <div>
            <div className="flex gap-3 items-center ">
             
              <p className="bg-theme-primary  p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlineHeart className="text-lg text-white" />
              </p>
              <p className="text-xl font-medium">My Orders</p>
            </div>

            <div className=" mx-12 flex flex-col gap-2 ">
                 <Link to="">My returns</Link>
                 <Link to="">My cancellations</Link>
            </div>
          </div>

          <div className="h-[3px] w-full bg-slate-400">
          </div>

          <div>
            <div className="flex gap-5 items-center ">
             
              <p className="bg-theme-primary  p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlineHeart className="text-lg text-white" />
              </p>
              <p className="text-xl font-medium">My Wishlist</p>
            </div>
             <div className=" mx-12 flex flex-col gap-2 ">
                 <Link to="">Check wishlist</Link>
            </div>

          </div>

          

        </div>

        {/* contact Form */}

        <div className=" min-w-80 p-5 md:p-10 h-full shadow-lg">

          <div className="h-[40px] w-full flex justify-center items-center mb-2 overflow-hidden">
                      <Alert
                        severity="error"
                        className={`transition-all duration-300 transform text-sm px-4 py-1 w-[350px] md:w-full flex justify-center
                ${
                  apiError
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible -translate-y-2"
                }
              `}
                      >
                        {apiError || "placeholder"}
                      </Alert>
                    </div>

                    
          <form 
              onSubmit={contactFormik.handleSubmit}>

            <div className="text-2xl font-semibold text-theme-primary py-2">Edit Your Profile</div>    

            <div className=" grid grid-cols-1 md:grid-cols-3 gap-5">


                {/* name */}
            <div className="flex flex-col gap-3 justify-center col-span-1 ">
               <div>Name</div>
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
            <div className="flex flex-col gap-3 justify-center col-span-1">

              <div>Email</div>
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
                    {contactFormik.touched.email && contactFormik.errors.email}
                  </p>
                ) : (
                  <p className="ErrorArea">Error Area</p>
                )}
              </div>
            </div>


             {/* phone */}
            <div className="flex flex-col gap-3 justify-center col-span-1">
              <div>Phone</div>
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
                    {contactFormik.touched.phone && contactFormik.errors.phone}
                  </p>
                ) : (
                  <p className="ErrorArea">Error Area</p>
                )}
              </div>
            </div>
            </div>


              <div>Password Changes</div>
             <div className=" grid grid-cols-1 md:grid-cols-3 gap-5">


                {/* Password */}
            <div className="flex gap-3 items-center col-span-1 ">

              <div className="w-full">
                <input
                  type="text"
                  name="password"
                  placeholder="Current Password"
                  value={contactFormik.values.password}
                  onChange={(e) => {
                    contactFormik.handleChange(e);
                    setApiError(""); // clear backend error
                    
                  }}
                  className={Styles.inputField}
                  disabled={loading}
                />

                {contactFormik.touched.password &&
                Boolean(contactFormik.errors.password) ? (
                  <p className="requiredError">
                    {contactFormik.touched.password && contactFormik.errors.password}
                  </p>
                ) : (
                  <p className="ErrorArea">Error Area</p>
                )}
              </div>
            </div>


              {/* new password */}
            <div className="flex gap-3 items-center col-span-1">
              
              <div className="w-full">
                <input
                  type="text"
                  name="newPassword"
                  placeholder="new Password"
                  value={contactFormik.values.newPassword}
                  onChange={(e) => {
                    contactFormik.handleChange(e);
                    
                    setApiError(""); // clear backend error
                  }}
                  className={Styles.inputField}
                  disabled={loading}
                />

                {contactFormik.touched.newPassword &&
                Boolean(contactFormik.errors.newPassword) ? (
                  <p className="requiredError">
                    {contactFormik.touched.newPassword && contactFormik.errors.newPassword}
                  </p>
                ) : (
                  <p className="ErrorArea">Error Area</p>
                )}
              </div>
            </div>


             {/* Confirm new password */}
            <div className="flex gap-3 items-center col-span-1">
             
              <div className="w-full">
                <input
                  type="text"
                  name="confirmPassword"
                  placeholder="confirm Password"
                  value={contactFormik.values.confirmPassword}
                  onChange={(e) => {
                    contactFormik.handleChange(e);
                    setApiError(""); // clear backend error
                    
                  }}
                  className={Styles.inputField}
                  disabled={loading}
                />

                {contactFormik.touched.confirmPassword &&
                Boolean(contactFormik.errors.confirmPassword) ? (
                  <p className="requiredError">
                    {contactFormik.touched.confirmPassword && contactFormik.errors.confirmPassword}
                  </p>
                ) : (
                  <p className="ErrorArea">Error Area</p>
                )}
              </div>
            </div>
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
              ) : 
               "send Message"
               
              }
            </button>
           </div>

          
            
            

          </form>
        </div>
      </div>
    </div>
  );
};


export default Account