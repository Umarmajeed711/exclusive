import { Link, useNavigate } from "react-router-dom";
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
import { Shield } from "lucide-react";
import { Styles } from "../components/helper/types";

const Account = () => {
  let { state, dispatch } = useContext(GlobalContext);

  let { user_id, name, email, phone, profile} = state?.user || {};

  const navigate = useNavigate();

  let {user} = state;

  const fileInputRef = useRef(null);

  const [loading, setloading] = useState(false);

  const [apiError, setApiError] = useState("");

  const [showSecurityForm, setShowSecurityForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(profile || null);
 

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

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+?[0-9\s-]+$/, "Phone number must contain only digits")
    .test("valid-phone-length", "Enter a valid phone number", (val) => {
      if (!val) return false;

      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 13;
    }),

  password: yup.string().when("email", {
    is: (email) =>
      email?.trim()?.toLowerCase() !==
      user?.email?.trim()?.toLowerCase(),
    then: (schema) =>
      schema.required(
        "current password is required to change email"
      ),
    otherwise: (schema) => schema.notRequired(),
  }),
});


 const logout = async () => {
    try {
      let user_logout = await api.get("/logout");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      dispatch({ type: "USER_LOGOUT" });
    } catch (error) {
      showToast({
        icon:"error",
        title:error?.data?.message || "something went wrong"
      })
    }
  };

  const contactFormik = useFormik({
    initialValues: {
      name: name,
      email: email ? email : "",
      phone: phone ? phone : "",
      password: "",
      image: null,
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
        phone === values.phone
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

        const response = await api.put(`/account/profile`, formData);

        dispatch({ type: "USER_LOGIN", payload: response.data.profile });

        showToast({
          icon: "success",
          title: "Edit Profile Successfully",
        });

        if(email !== contactFormik?.values?.email){
          setTimeout(() => {
        logout();
      }, 2000);
        }

        setloading(false);
        contactFormik.resetForm({
          values: {
            name: response.data.profile.name || "",
            email: response.data.profile.email || "",
            phone: response.data.profile.phone || "",
            password: "",
            image: null,
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
      contactFormik.values.phone?.trim() !== String(phone || "").trim()
    );
  }, [contactFormik.values, name, email, phone]);

  const handlePageChange = () => {
    setShowSecurityForm(true);
    console?.log("show Security form", showSecurityForm);
  };

  const handleNavigate = (value) => {
    setShowSecurityForm(value ?? false);
  };

  

  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const MAX_SIZE = 2 * 1024 * 1024;

  const allowed = ["image/jpeg", "image/png", "image/webp"];


  return (
    <div className="mx-5 md:mx-8 lg:mx-14">
      {/* BreadCrums */}

      <Breadcrums currentPage="My Account" />

      <div className="my-10 grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
        {/* side Navigation section */}

        <div
          className="
    col-span-3 lg:col-span-1 min-w-[300px]
    bg-white rounded-2xl
    border border-gray-100
    shadow-[0_10px_40px_rgba(0,0,0,0.08)]
    p-5 md:p-6
    h-fit
  "
        >
          {/* Header */}
          <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
            <div
              className="
        w-11 h-11 rounded-xl
        bg-theme-primary/10
        flex items-center justify-center
        shadow-sm
      "
            >
              <AiOutlineHeart className="text-xl text-theme-primary" />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">My Account</h2>

              <p className="text-sm text-gray-500">
                Manage your profile & activities
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex flex-col gap-2">
            {/* Profile */}
            <button
              type="button"
              onClick={() => handleNavigate(false)}
              className={`
        group flex items-center justify-between
        w-full rounded-xl px-4 py-3
        transition-all duration-200
        ${
          !showSecurityForm
            ? "bg-theme-primary text-white shadow-md"
            : "hover:bg-gray-100 text-gray-700"
        }
      `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
            p-2 rounded-lg transition
            ${
              !showSecurityForm
                ? "bg-white/20"
                : "bg-theme-primary/10 text-theme-primary"
            }
          `}
                >
                  <FiEdit2 size={18} />
                </div>

                <div className="text-left">
                  <p className="font-medium">My Profile</p>
                  <p
                    className={`
              text-xs
              ${!showSecurityForm ? "text-white/80" : "text-gray-500"}
            `}
                  >
                    Update personal information
                  </p>
                </div>
              </div>

              <span
                className={`
          transition-transform duration-200
          group-hover:translate-x-1
        `}
              >
                →
              </span>
            </button>

            {/* Security */}
            <button
              type="button"
              onClick={() => handleNavigate(true)}
              className={`
        group flex items-center justify-between
        w-full rounded-xl px-4 py-3
        transition-all duration-200
        ${
          showSecurityForm
            ? "bg-theme-primary text-white shadow-md"
            : "hover:bg-gray-100 text-gray-700"
        }
      `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
            p-2 rounded-lg transition
            ${
              showSecurityForm
                ? "bg-white/20"
                : "bg-theme-primary/10 text-theme-primary"
            }
          `}
                >
                  <Shield size={18} />
                </div>

                <div className="text-left">
                  <p className="font-medium">Account Security</p>
                  <p
                    className={`
              text-xs
              ${showSecurityForm ? "text-white/80" : "text-gray-500"}
            `}
                  >
                    Change password & security
                  </p>
                </div>
              </div>

              <span
                className="
          transition-transform duration-200
          group-hover:translate-x-1
        "
              >
                →
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-gray-100"></div>

          {/* Orders */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="
          w-11 h-11 rounded-xl
          bg-orange-100
          flex items-center justify-center
        "
              >
                <AiOutlineHeart className="text-orange-500 text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">My Orders</h3>

                <p className="text-sm text-gray-500">Track and manage orders</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                to="/myOrders"
                className="
          px-4 py-3 rounded-xl
          hover:bg-gray-100
          transition text-gray-700
          flex justify-between items-center
        "
              >
                <span>My Orders</span>
                <span>→</span>
              </Link>

              <Link
                to="/myOrders"
                className="
          px-4 py-3 rounded-xl
          hover:bg-gray-100
          transition text-gray-700
          flex justify-between items-center
        "
              >
                <span>My Cancellations</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 border-t border-gray-100"></div>

          {/* Wishlist */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="
          w-11 h-11 rounded-xl
          bg-pink-100
          flex items-center justify-center
        "
              >
                <AiOutlineHeart className="text-pink-500 text-xl" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-800">Wishlist</h3>

                <p className="text-sm text-gray-500">
                  Your saved favorite products
                </p>
              </div>
            </div>

            <Link
              to="/wishlist"
              className="
        flex justify-between items-center
        px-4 py-3 rounded-xl
        hover:bg-gray-100
        transition text-gray-700
      "
            >
              <span>Check Wishlist</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* contact Form */}

        {showSecurityForm ? (
          <AccountSecurity />
        ) : (
          <div
            className="col-span-3 lg:col-span-2 w-full
            min-w-[300px] p-5 md:p-8 h-full 
              bg-white rounded-2xl
    border border-gray-100
    shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
          >
            <form
              onSubmit={contactFormik.handleSubmit}
              className="flex flex-col items-center w-full gap-2"
            >
              <div className="w-full flex flex-col items-center text-center ">
                {/* Heading */}
                <div className="w-full flex justify-between items-start mb-6">
                  <div>
                    <div className="text-2xl font-semibold text-theme-primary  flex justify-start w-full">
                      Edit Your Profile
                    </div>
                  </div>

                  <div
                    className="
        hidden sm:flex items-center gap-2
        px-3 py-1.5 rounded-full
        bg-theme-primary/10 text-theme-primary
        text-sm font-medium border border-theme-primary/20
      "
                  >
                    <span className="w-2 h-2 rounded-full bg-theme-primary animate-pulse"></span>
                    Active Account
                  </div>
                </div>

                {/* Profile Image Section */}
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-theme-primary/20 blur-xl scale-110 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                  {/* Avatar */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="
        relative w-28 h-28 rounded-full overflow-hidden
        cursor-pointer flex items-center justify-center
        bg-gradient-to-br from-gray-100 to-gray-300
        border-4 border-white
        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        transition-all duration-300
        group-hover:scale-105
        group-hover:shadow-theme-primary/30
      "
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="
            uppercase text-3xl font-bold text-theme-primary
            tracking-wide
          "
                      >
                        {getInitials(contactFormik.values.name || "U")}
                      </span>
                    )}

                    {/* Overlay */}
                    <div
                      className="
          absolute inset-0 bg-black/30
          opacity-0 group-hover:opacity-100
          transition duration-300
          flex items-center justify-center
        "
                    >
                      <span className="text-white text-sm font-medium">
                        Change Photo
                      </span>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="
        absolute bottom-1 right-1
        bg-theme-primary text-white
        shadow-lg rounded-full p-2.5
        hover:scale-110 hover:rotate-6
        transition-all duration-200
        border-2 border-white
      "
                  >
                    <FiEdit2 size={16} />
                  </button>

                  {/* Hidden Input */}
                  <input
                    ref={fileInputRef}
                    name="image"
                    type="file"
                    id="profileInput"
                    accept="image/*"
                    hidden
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

                      contactFormik.setFieldValue("image", file);

                      if (previewImage?.startsWith("blob:")) {
                        URL.revokeObjectURL(previewImage);
                      }

                      const imageUrl = URL.createObjectURL(file);

                      setPreviewImage(imageUrl);

                      e.target.value = null;
                    }}
                    disabled={loading}
                  />
                </div>

                {/* User Info */}
                <div className="mt-5 flex flex-col items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {name || "User Name"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Keep your profile updated for a better experience
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 justify-center  w-full">

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* name */}
                <div className="flex flex-col gap-3 justify-center  w-full">
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
                  <div className="flex flex-col gap-3 justify-center w-full">
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

                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">

                  {/* phone */}
                  <div className="flex flex-col gap-3 justify-center w-full ">
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

                  {/* Password */}
                                    <div className="flex flex-col gap-3 justify-center w-full ">

                                      <div className="text-base font-semibold">Password</div>
                                      <div className="w-full relative" disabled={loading || contactFormik.values.email  == email}>
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
                                          disabled={loading || contactFormik.values.email  == email}


                                        />
                  
                                        <p
                                          onClick={() => {
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
                </div>
              </div>

              <div className="flex justify-end items-center w-full animate-fadeIn mt-2">
                <div className="flex w-full sm:w-[50%] gap-2">
                  <button
                    disabled={!hasChanges || loading}
                    onClick={() => {
                      contactFormik.resetForm();
                      setPreviewImage(profile || "");
                    }}
                    type="button"
                    className="rounded-md border py-2 sm:py-3 text-sm bg-white  disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-gray-100 hover:shadow-md w-full"
                  >
                    Cancel
                  </button>

                  <button
                    disabled={!hasChanges || loading}
                    type="submit"
                    className="bg-theme-primary w-full transition-all duration-200 rounded-md flex 
                      justify-center  py-2 sm:py-3 text-white disabled:cursor-not-allowed disabled:opacity-50 hover:shadow-theme-secondary hover:shadow"
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
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
