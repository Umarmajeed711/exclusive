import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { useFormik } from "formik";
import * as yup from "yup";
import "../App.css";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { GlobalContext } from "../context/Context";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";
import api from "../components/helper/api";
import Breadcrums from "../components/helper/Breadcrums";
import { FiEdit2 } from "react-icons/fi";
import { getInitials, showToast } from "../components/helper/types";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AccountSecurity from "../components/helper/AccountSecurity";

const Styles = {
    inputField:
      "border-b-2 bg-gray-200 outline-none w-full px-3 py-2 focus:border-theme-primary transition",
  };
const Account = () => {
  let { state, dispatch } = useContext(GlobalContext);

  let { user_id, name, email, phone, profile } = state?.user;

  const fileInputRef = useRef(null);

  const [loading, setloading] = useState(false);

  const [apiError, setApiError] = useState("");

  const [showSecurityForm, setShowSecurityForm] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(profile || null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const contactValidation = yup.object({
    name: yup
      .string()
      .trim()
      .required("Name is required")
      .min(2, "Name is too short"),
    email: yup
      .string()
      .trim()
      .email("Invalid email format")
      .required("Email is required"),
    // .test(
    //   "valid-domain",
    //   "emails ending in @gmail.com are allowed",
    //   (value) => (value ? value.toLowerCase().endsWith("@gmail.com") : false),
    // )
    // phone: yup.string().required("Phone number is required").matches(/^\+?[0-9]{10,14}$/,"Enter a valid number")
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^\+?[0-9\s-]+$/, "Phone number must contain only digits")
      .test("valid-phone-length", "Enter a valid phone number", (val) => {
        if (!val) return false;

        const digits = val.replace(/\D/g, "");
        return digits.length >= 10 && digits.length <= 13;
      }),
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
      name: name,
      email: email,
      phone: phone ? phone : "",
      image: null,
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    enableReinitialize: true,
    validationSchema: contactValidation,

    onSubmit: async (values) => {
      if (loading) return;
      setloading(true);

      if (
        profile == previewImage &&
        name === values.name &&
        email === values.email &&
        phone === values.phone &&
        !values.password &&
        !values.confirmPassword &&
        !values.newPassword
      ) {
        setloading(false);
        return Swal.fire("No Changes", "You haven’t made any changes!", "info");
      }

      const formData = new FormData();

      formData.append("user_id", user_id);
      formData.append("name", values.name !== name ? values.name?.trim() : "");
      formData.append(
        "email",
        values.email !== email ? values.email?.trim() : "",
      );
      formData.append(
        "phone",
        values.phone !== phone ? values.phone?.trim() : "",
      );
      formData.append("password", values.password);
      formData.append("newPassword", values.newPassword);
      formData.append("confirmPassword", values.confirmPassword);

      // if (profileImage) {
      //   formData.append("profile", profileImage);
      // }
      if (values?.image) {
        formData.append("profile", values?.image);
      }
      try {
        // let response = await api.put(`/edit-profile`, {
        //   user_id: user_id,
        //   name: values.name !== name ? values.name : null,
        //   email: values.email !== email ? values.email : null,
        //   phone: values.phone !== phone ? values.phone : null,
        //   password: values.password,
        //   newPassword: values.newPassword,
        //   confirmPassword: values.confirmPassword,
        // });

        const response = await api.put(`/edit-profile`, formData);

        dispatch({ type: "USER_LOGIN", payload: response.data.profile });

        showToast({
          icon: "success",
          title: "Edit Profile Successfully",
        });

        setloading(false);
        contactFormik.resetForm({
          values: {
            name: response.data.profile.name || "",
            email: response.data.profile.email || "",
            phone: response.data.profile.phone || "",
            image: null,
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

  const hasChanges = useMemo(() => {
    return (
      !!contactFormik.values.image ||
      contactFormik.values.name?.trim() !== (name || "").trim() ||
      contactFormik.values.email?.trim() !== (email || "").trim() ||
      contactFormik.values.phone?.trim() !== String(phone || "").trim() ||
      !!contactFormik.values.password?.trim() ||
      !!contactFormik.values.newPassword?.trim() ||
      !!contactFormik.values.confirmPassword?.trim()
    );
  }, [contactFormik.values, name, email, phone]);

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const MAX_SIZE = 2 * 1024 * 1024;

  const allowed = ["image/jpeg", "image/png", "image/webp"];

  // const handleImage = (file) => {
  //   if (!file) return;

  //   if (!file.type.startsWith("image/")) {
  //     alert("Only image allowed");
  //     return;
  //   }

  //   contactFormik.handleChange(file);

  //   // setProfileImage(file);
  //   setPreviewImage(URL.createObjectURL(file));
  // };

  const handleNavigate = (value) => {
    setShowSecurityForm(value ?? false)
  };
 
  

  return (
    <div className="mx-5 md:mx-8 lg:mx-14">
      {/* BreadCrums */}

      <Breadcrums currentPage="My Account" />

      <div className="my-10 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* side Navigation section */}
        <div
          // className="col-span-3 lg:col-span-1 min-w-80 shadow-lg flex flex-col gap-5  p-10"
          className="col-span-3 lg:col-span-1 min-w-[300px] bg-white shadow-[0_0_7px_rgba(0,0,0,.5)]  flex flex-col gap-5 p-5 md:p-8"
        >
          {/* Calls to Us */}

          <div>
            <div className="flex gap-3 items-center ">
              <p className="bg-theme-primary  p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlineHeart className="text-lg text-white" />
              </p>
              <p className="text-lg font-semibold text-gray-800">
                Manage My Account
              </p>
            </div>

            <div className="flex mx-10 gap-2 items-center p-2 cursor-pointer" >
              <span
              onClick={() => {handleNavigate(false)}}
              >
                My Profile
              </span>
            </div>
            <div className="flex mx-10 gap-2 items-center p-2 cursor-pointer">
              <span
              onClick={() => {handleNavigate(true)}}
              
              >
                Account Security
              </span>
            </div>
          </div>

          <div className="h-[3px] w-full bg-slate-400"></div>

          <div>
            <div className="flex gap-3 items-center ">
              <p className="bg-theme-primary  p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlineHeart className="text-lg text-white" />
              </p>
              <p className="text-lg font-semibold text-gray-800">My Orders</p>
            </div>

            <div className=" mx-12 flex flex-col gap-2 ">
              <Link to="/myOrders">My returns</Link>
              <Link to="/myOrders">My cancellations</Link>
            </div>
          </div>

          <div className="h-[3px] w-full bg-slate-400"></div>

          <div>
            <div className="flex gap-3 items-center ">
              <p className="bg-theme-primary  p-2 rounded-full shadow-theme-secondary shadow-md ">
                <AiOutlineHeart className="text-lg text-white" />
              </p>
              <p className="text-lg font-semibold text-gray-800">My Wishlist</p>
            </div>
            <div className=" mx-12 flex flex-col gap-2 ">
              <Link to="/wishlist">Check wishlist</Link>
            </div>
          </div>
        </div>

        {/* contact Form */}

        {showSecurityForm ? (
          <AccountSecurity />
        ) : (
          <div className="col-span-3 lg:col-span-2 w-full  min-w-[300px] p-5 md:p-8 h-full  shadow-[0_0_7px_rgba(0,0,0,.5)]">
            <form
              onSubmit={contactFormik.handleSubmit}
              className="flex flex-col items-center w-full"
            >
              <div className="text-2xl font-semibold text-theme-primary py-2 flex justify-start w-full">
                Edit Your Profile
              </div>

              {/* Profile Image */}
              <div className="flex flex-col items-center  relative group">
                <div
                  className="w-20 h-20 rounded-full overflow-hidden cursor-pointer flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-lg font-semibold text-gray-700 border-2 border-white shadow-sm"
                  // onClick={() => document.getElementById("profileInput").click()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="profile"
                      className="w-full h-full rounded-full object-cover border-4 border-theme-primary shadow group-hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <span className="uppercase tracking-wide flex justify-center items-center w-full h-full rounded-full object-cover border-4 border-theme-primary shadow group-hover:scale-105 transition duration-200">
                      {getInitials(contactFormik.values.name || "U")}
                    </span>
                  )}
                </div>

                {/* Edit Button */}
                <span
                  htmlFor="profileInput"
                  // onClick={() => document.getElementById("profileInput").click()}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1  bg-theme-primary text-white   shadow-md rounded-full p-1.5 
              hover:scale-110 transition cursor-pointer"
                >
                  <FiEdit2 size={16} />
                </span>

                {/* Hidden Input */}
                <input
                  ref={fileInputRef}
                  name="image"
                  type="file"
                  id="profileInput"
                  accept="image/*"
                  hidden
                  // onChange={(e) => {
                  //   const file = e.target.files[0];

                  //   if (file) {
                  //     if (!file.type.startsWith("image/")) {
                  //       alert("Only image allowed");
                  //       return;
                  //     }

                  //     contactFormik.setFieldValue("image", file);

                  //     setPreviewImage(URL.createObjectURL(file));
                  //   }
                  // }}
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (!file) return;

                    if (!allowed.includes(file.type)) {
                      showToast({
                        icon: "error",
                        title: "Only JPG, PNG, and WEBP images are allowed",
                      });

                      e.target.value = null;
                      return;
                    }

                    if (file.size > MAX_SIZE) {
                      showToast({
                        icon: "error",
                        title: "Image size must be less than 2MB",
                      });

                      e.target.value = null;
                      return;
                    }
                    if (previewImage?.startsWith("blob:")) {
                      URL.revokeObjectURL(previewImage);
                    }

                    contactFormik.setFieldValue("image", file);

                    const imageUrl = URL.createObjectURL(file);

                    setPreviewImage(imageUrl);

                    e.target.value = null;
                  }}
                  disabled={loading}
                />
              </div>
              {/* User Name */}
              <div className="mt-3 text-lg font-semibold text-theme-primary">
                {name || "User Name"}
              </div>

              <div className=" grid grid-cols-1 md:grid-cols-3 gap-2 w-full">
                {/* name */}
                <div className="flex flex-col gap-3 justify-center col-span-1 ">
                  <div className="text-base font-semibold">Name</div>
                  <div className="w-full">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Your Name *"
                      value={contactFormik.values.name}
                      autoComplete="name"
                      onChange={(e) => {
                        contactFormik.handleChange(e);
                        setApiError(""); // clear backend error
                      }}
                      className={Styles.inputField}
                      disabled={loading}
                      onBlur={(e) => {
                        contactFormik.setFieldValue(
                          "name",
                          e.target.value.trim(),
                        );
                      }}
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
                <div className="flex flex-col gap-3 justify-center col-span-1">
                  <div className="text-base font-semibold">Email</div>
                  <div className="w-full">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Your Email *"
                      autoComplete="email"
                      value={contactFormik.values.email}
                      onChange={(e) => {
                        contactFormik.handleChange(e);
                        setApiError(""); // clear backend error
                      }}
                      onBlur={(e) => {
                        contactFormik.setFieldValue(
                          "email",
                          e.target.value.trim(),
                        );
                      }}
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
                <div className="flex flex-col gap-3 justify-center col-span-1">
                  <div className="text-base font-semibold">Phone</div>
                  <div className="w-full">
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="Your Phone *"
                      autoComplete="tel"
                      value={contactFormik.values.phone}
                      onChange={(e) => {
                        contactFormik.handleChange(e);
                        setApiError(""); // clear backend error
                      }}
                      onBlur={(e) => {
                        contactFormik.setFieldValue(
                          "phone",
                          e.target.value.trim(),
                        );
                      }}
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
              </div>

              <div className="flex flex-col gap-3 justify-center col-span-3 w-full">
                <div className="text-base font-semibold">Password Changes</div>
                <div className=" grid grid-cols-1 md:grid-cols-3 gap-2">
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
                          setApiError(""); // clear backend error
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

                          setApiError(""); // clear backend error
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
                          setApiError(""); // clear backend error
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
              </div>

              {/* <div className="h-[40px]  flex justify-center items-center mb-2 overflow-hidden">
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
            </div> */}

              {hasChanges && (
                <div className="flex justify-end items-center w-full animate-fadeIn mt-2">
                  <div className="flex w-full sm:w-[50%] gap-2">
                    <button
                      onClick={() => {
                        contactFormik.resetForm();
                        setPreviewImage(profile || "");
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
              {/* <div className="flex justify-end items-center w-full">
            </div> */}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
