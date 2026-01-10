import { useFormik } from "formik";
import * as yup from "yup";
import "../App.css";
import { useContext, useState } from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { GlobalContext } from "../context/Context";
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import api from "../components/api";

const ForgetPassword = () => {
  const navigate = useNavigate();
  let { state, dispatch } = useContext(GlobalContext);

  const [loading, setloading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);



  const ForgertValidation = yup.object({
    email: isOtpSent ? yup.string() :
       yup
      .string()
      .trim()
      .email("Invalid Email")
      .required("Email is required"),
    otp: isOtpSent
      ? yup.string().length(5, "Must be 5 digits").required("OTP is required")
      : yup.string(),
  });

  const ForgetPassFormik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema: ForgertValidation,

    onSubmit: async (values) => {
      setloading(true);

      

      try {
        if (!isOtpSent) {
           let response = await api.post(`/forget-password`, {
            email: values.email,
          });

          Swal.fire(
            "Success",
            "OTP Send Successfully",
            "success"
          );

          setIsOtpSent(true)
          dispatch({ type: "RESET_PASSWORD", payload: response.data });

          console.log(response.data)
        } else {

           let response = await api.post("/verify-otp", {
            email: state?.userData.email,
            otp: values.otp,
          });
 
          Swal.fire(
            "Verified",
            "OTP verified! You can now reset your password.",
            "success"
          );

          

          navigate("/ResetPassword")

         
        }
      } catch (error) {
        setApiError(error?.response?.data?.message || "Something went wrong");
        
      } finally {
        setloading(false);
      }
    },
  });

  let Styles = {
    inputField:
      "border-b-2  bg-transparent p-1 outline-none focus:drop-shadow-xl hover: w-[220px]",
  };
  return (
    <div className="flex justify-center  items-center main">
      <div className=" flex items-center  gap-20 p-10 bg-slate-100">
        {/* Image div */}
        <div className="hidden md:flex flex-col ">
          <div>
            <img src="/giphy.gif" alt="" />
          </div>

          <div className="flex justify-center">
            <p className="text-4xl font-bold">Exclusive</p>
          </div>
        </div>

        {/* Login form */}

        <div>

          <div className="h-[40px] w-full flex justify-center items-center mb-2 overflow-hidden">
            <Alert
              severity="error"
              className={`transition-all duration-300 transform text-sm px-4 py-1 max-w-[350px]
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
            onSubmit={ForgetPassFormik.handleSubmit}
            className=" p-6   flex flex-col justify-center "
          >
            <p className="text-3xl  ">Log in to Exclusive</p>
            <p className="py-2">Enter your email to receive an OTP</p>

            <div className="flex flex-col justify-center gap-3 my-2">

              {
                isOtpSent ? 
                <div className="flex gap-3 items-center">
                  <label htmlFor="otp">
                    <span className="text-xl font-bold">
                      <MdEmail />
                    </span>
                  </label>
                  <div>
                    <input
                      type="number"
                      name="otp"
                      id="otp"
                      placeholder="enter your OTP"
                      value={ForgetPassFormik.values.otp}
                      onChange={(e) => {
                        ForgetPassFormik.handleChange(e);
                        setApiError(""); // clear backend error
                      }}
                      disabled={loading}
                      className={Styles.inputField}
                      
                    />

                    {ForgetPassFormik.touched.otp &&
                    Boolean(ForgetPassFormik.errors.otp) ? (
                      <p className="requiredError">
                        {ForgetPassFormik.touched.otp &&
                          ForgetPassFormik.errors.otp}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )}
                  </div>
                </div>

                :
                <div className="flex gap-3 items-center">
                <label htmlFor="email">
                  <span className="text-xl font-bold">
                    <MdEmail />
                  </span>
                </label>
                <div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="enter your Email"
                    value={ForgetPassFormik.values.email}
                    onChange={(e) => {
                      ForgetPassFormik.handleChange(e);
                      setApiError(""); // clear backend error
                    }}
                    disabled={loading || isOtpSent}
                    className={Styles.inputField}
                  />

                  {ForgetPassFormik.touched.email &&
                  Boolean(ForgetPassFormik.errors.email) ? (
                    <p className="requiredError">
                      {ForgetPassFormik.touched.email &&
                        ForgetPassFormik.errors.email}
                    </p>
                  ) : (
                    <p className="ErrorArea">Error Area</p>
                  )}
                </div>
              </div>

              }
              

              
                
            
            </div>

            <div className="flex justify-between items-center">
              <button
                disabled={loading}
                className=" bg-theme-primary transition-all duration-200 flex justify-center rounded px-3 py-2 my-4 text-white  hover:shadow-theme-secondary hover:shadow"
                type="submit"
              >
                {loading ? (
                  <div className="flex items-center px-1 py-2 gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                  </div>
                ) : (

                  isOtpSent ? "Verify OTP" : "Send OTP"
                  
                )}
              </button>

            </div>

            <div className="flex justify-center mt-2">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="transition-all duration-100  hover:underline hover:text-theme-secondary"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
