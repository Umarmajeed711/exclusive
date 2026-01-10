import { useFormik } from "formik";
import * as yup from "yup";
import "../App.css";
import { useContext, useState } from "react";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { GlobalContext } from "../context/Context";
import axios from "axios";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import api from "../components/api";


const ResetPassword = () => {


    const navigate = useNavigate();

    let { state, dispatch } = useContext(GlobalContext);
  
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  
  
    const [loading, setloading] = useState(false);
  
    const [apiError, setApiError] = useState("");
  
  
    const PasswordVisible = () => {
      setShowPassword(!showPassword);
    };

    const  ConfirmPasswordVisible = () => {
       setShowConfirmPassword(!showConfirmPassword);
      };

   
  
    const ResetValidation = yup.object({
        password: yup
        .string()
        .required()
        .min(8, "At least 8 characters")
        .matches(/[a-z]/, "Must include a lowercase letter")
        .matches(/[A-Z]/, "Must include an uppercase letter")
        .matches(/\d/, "Must include a number")
        .matches(/[@$!%*?&#]/, "Must include a special character"),
        confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm password is required")
    });
  
    const ResetFormik = useFormik({
      initialValues: {
        password: "",
        confirmPassword:"",
      },
      validationSchema: ResetValidation,
  
      onSubmit: async (values) => {
        setloading(true);

         console.log("USER Data :" ,  state?.userData) 

         let {email,otp} = state.userData;
  
        try {

        
          let response = await api.post(`/reset-password`, {
            email:email,
            password: values.password,
            otp:otp
          });
          
       
  
          setloading(false);
          
          Swal.fire("Success", "Password reset successfully", "success");
  
          ResetFormik.resetForm();
  
          navigate("/login");
  
         
        } catch (error) {
          setloading(false);
          setApiError(error?.response.data.message || "Something went wrong");
          
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

      {/* Reset form */}

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
          onSubmit={ResetFormik.handleSubmit}
          className=" p-6   flex flex-col justify-center "
        >
          <p className="text-3xl  ">Reset Password</p>
          <p className="py-2">Enter your new password </p>

          <div className="flex flex-col justify-center gap-3 my-2">
            

            <div
              className="flex gap-3 items-center"
              style={{ position: "relative" }}
            >
              <label htmlFor="password">
                <span className="text-xl font-bold">
                  <RiLockPasswordFill />
                </span>
              </label>
              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  maxLength={32}
                  value={ResetFormik.values.password}
                  onChange={(e) => {
                    ResetFormik.handleChange(e);
                    setApiError(""); // clear backend error
                  }}
                  disabled={loading}
                  className={Styles.inputField}
                />

                <p
                  onClick={PasswordVisible}
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    margin: "10px",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </p>

                {ResetFormik.touched.password &&
                Boolean(ResetFormik.errors.password) ? (
                  <p className="requiredError">
                    {ResetFormik.touched.password &&
                      ResetFormik.errors.password}
                  </p>
                ) : (
                  <p className="ErrorArea">Error Area</p>
                )}
              </div>
            </div>

            <div
              className="flex gap-3 items-center"
              style={{ position: "relative" }}
            >
              <label htmlFor="confirmPassword">
                <span className="text-xl font-bold">
                  <RiLockPasswordFill />
                </span>
              </label>
              <div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="confirm New Password"
                  maxLength={32}
                  value={ResetFormik.values.confirmPassword}
                  onChange={(e) => {
                    ResetFormik.handleChange(e);
                    setApiError(""); // clear backend error
                  }}
                  disabled={loading}
                  className={Styles.inputField}
                />

                <p
                  onClick={ConfirmPasswordVisible}
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    margin: "10px",
                    cursor: "pointer",
                  }}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </p>

                {ResetFormik.touched.confirmPassword &&
                Boolean(ResetFormik.errors.confirmPassword) ? (
                  <p className="requiredError">
                    {ResetFormik.touched.confirmPassword &&
                      ResetFormik.errors.confirmPassword}
                  </p>
                ) : (
                  <p className="ErrorArea">Error Area</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              disabled={loading}
              className=" bg-theme-primary transition-all duration-200 flex justify-center rounded px-3 py-2 my-4 text-white  hover:shadow-theme-secondary hover:shadow-md"
              type="submit"
            >
              {loading ? (
                <div className="flex items-center px-1 py-2 gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                </div>
              ) : (
                "Submit"
              )}
            </button>

            
          </div>

          <div className="flex justify-center mt-2">
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="transition-all duration-100  hover:underline hover:text-blue-400"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default ResetPassword