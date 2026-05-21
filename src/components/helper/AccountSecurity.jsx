

import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { useFormik } from "formik";
import * as yup from "yup";
import "../../App.css";
import { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";
import api from "./api";
import Breadcrums from "./Breadcrums";
import { FiEdit2 } from "react-icons/fi";
import { getInitials, showToast } from "./types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GlobalContext } from "../../context/Context";

const AccountSecurity = () => {
  let { state, dispatch } = useContext(GlobalContext);

  let { user_id, name, email, phone, profile } = state?.user;


  const [loading, setloading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const contactValidation = yup.object({
  
    // If user enters a newPassword, require currentPassword
    password: yup
      .string()
      .when("newPassword", {
        is: (val) => !!val && val.length > 0,
        then: (schema) => schema.required("Password is required"),
        otherwise: (schema) => schema.notRequired(),
      })
      .max(72, "Password too long"),

    // newPassword is optional, but if present must meet strength rules
    newPassword: yup
      .string()
      .nullable()
      .test(
        "min-length",
        "At least 8 characters",
        (val) => !val || val.length >= 8,
      )
      .test(
        "lowercase",
        "Must include a lowercase letter",
        (val) => !val || /[a-z]/.test(val),
      )
      .test(
        "uppercase",
        "Must include an uppercase letter",
        (val) => !val || /[A-Z]/.test(val),
      )
      .test("number", "Must include a number", (val) => !val || /\d/.test(val))
      .test(
        "special",
        "Must include a special character",
        (val) => !val || /[@$!%*?&#]/.test(val),
      )
      .test(
        "same-password",
        "New password must be different from current password",
        function (val) {
          return !val || val !== this.parent.password;
        },
      ),

    // confirmPassword only required when newPassword is present and must match
    confirmPassword: yup.string().when("newPassword", {
      is: (val) => val && val.length > 0,
      then: (schema) =>
        schema
          .required("Please confirm  password")
          .oneOf([yup.ref("newPassword")], "Passwords must match"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const contactFormik = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: contactValidation,

    onSubmit: async (values) => {
      if (loading) return;
      setloading(true);

    
      try {
        let response = await api.put(`/edit-profile`, {
          user_id: user_id,
          password: values.password,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        });

      

        dispatch({ type: "USER_LOGIN", payload: response.data.profile });

        showToast({
          icon: "success",
          title: "Edit Profile Successfully",
        });

        setloading(false);
        contactFormik.resetForm({
          values: {
            password: "",
            newPassword: "",
            confirmPassword: "",
          },
        });
        // setProfileImage(null);
      } catch (error) {
        showToast({
          icon: "error",
          title: error?.response?.data?.message || "Something went wrong",
        });
        // setApiError(error?.response?.data?.message || "Something went wrong");
      } finally {
        setloading(false);
      }
    },
  });

const hasChanges =
  !!contactFormik.values.password?.trim() ||
  !!contactFormik.values.newPassword?.trim() ||
  !!contactFormik.values.confirmPassword?.trim();    

  

  const Styles = {
    inputField:
      "border-b-2 bg-gray-200 outline-none w-full px-3 py-2 focus:border-theme-primary transition",
  };

  return (
    <>
    
        {/* contact Form */}

        <div className="col-span-3 lg:col-span-2 w-full  min-w-[300px] p-5 md:p-8 h-full  shadow-[0_0_7px_rgba(0,0,0,.5)]">
          <form
            onSubmit={contactFormik.handleSubmit}
            className="flex flex-col items-center w-full"
          >
            <div className="text-2xl font-semibold text-theme-primary py-2 flex justify-start w-full">
              Edit Your Profile
            </div>

           
            {/* User Name */}
            <div className="mt-3 text-lg font-semibold text-theme-primary w-20 h-20">
              <AccountSecurity />
            </div>

            <div className="flex flex-col gap-3 justify-center col-span-3 w-full">
              <div className="text-base font-semibold">Password Changes</div>
              
                {/* Password */}
                <div className="flex gap-3 items-center col-span-1 ">
                  <div className="w-full relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Current Password"
                      // autoComplete="current-password"
                      value={contactFormik.values.password}
                      onChange={(e) => {
                        contactFormik.handleChange(e);
                         
                      }}
                      onBlur={(e) => {
                        contactFormik.setFieldValue(
                          "password",
                          e.target.value.trim(),
                        );
                      }}
                      className={Styles.inputField}
                      disabled={loading}
                    />

                    <p
                      onClick={() => {
                        // if (loading) return;
                        setShowPassword(!showPassword);
                      }}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        margin: "10px",
                        cursor: "pointer",
                      }}
                      className={
                        loading ? "pointer-events-none opacity-50" : null
                      }
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </p>

                    <div className="error-wrapper">
                      {contactFormik.touched.password &&
                        contactFormik.errors.password && (
                          <p className="requiredError">
                            {contactFormik.errors.password}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* new password */}
                <div className="flex gap-3 items-center col-span-1">
                  <div className="w-full relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="New Password"
                      autoComplete="new-password"
                      value={contactFormik.values.newPassword}
                      onChange={(e) => {
                        contactFormik.handleChange(e);

                         
                      }}
                      onBlur={(e) => {
                        contactFormik.setFieldValue(
                          "newPassword",
                          e.target.value.trim(),
                        );
                      }}
                      className={Styles.inputField}
                      disabled={loading}
                    />

                    <p
                      onClick={() => {
                        setShowNewPassword(!showNewPassword);
                      }}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        margin: "10px",
                        cursor: "pointer",
                      }}
                      className={
                        loading ? "pointer-events-none opacity-50" : null
                      }
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </p>

                    <div className="error-wrapper">
                      {contactFormik.touched.newPassword &&
                        contactFormik.errors.newPassword && (
                          <p className="requiredError">
                            {contactFormik.errors.newPassword}
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Confirm new password */}
                <div className="flex gap-3 items-center col-span-1">
                  <div className="w-full relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      aria-label="Current Password"
                      value={contactFormik.values.confirmPassword}
                      onChange={(e) => {
                        contactFormik.handleChange(e);
                         
                      }}
                      onBlur={(e) => {
                        contactFormik.setFieldValue(
                          "confirmPassword",
                          e.target.value.trim(),
                        );
                      }}
                      className={Styles.inputField}
                      disabled={loading}
                    />

                    <p
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        margin: "10px",
                        cursor: "pointer",
                      }}
                      className={
                        loading ? "pointer-events-none opacity-50" : null
                      }
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </p>

                    <div className="error-wrapper">
                      {contactFormik.touched.confirmPassword &&
                        contactFormik.errors.confirmPassword && (
                          <p className="requiredError">
                            {contactFormik.errors.confirmPassword}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              
            </div>

            {hasChanges && (
              <div className="flex justify-end items-center w-full animate-fadeIn mt-2">
                <div className="flex w-full sm:w-[50%] gap-2">
                  <button
                    onClick={() => {
                      contactFormik.resetForm();
                    }}
                    type="button"
                    className="rounded-md border py-2 sm:py-3 text-sm bg-white transition-all duration-200 hover:bg-gray-100 hover:shadow-md w-full"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={loading}
                    type="submit"
                    className="bg-theme-primary w-full transition-all duration-200 rounded-md flex justify-center  py-2 sm:py-3 text-white hover:shadow-theme-secondary hover:shadow"
                  >
                    {loading ? (
                      <div className="flex items-center p-2 gap-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            )}
            
          </form>
        </div>
    </>
   
        

     
  );
};

export default AccountSecurity;
