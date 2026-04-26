import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Context";
import api from "./api";
import { useFormik } from "formik";
import * as yup from "yup";
import { getInitials } from "./types";
import { FiEdit, FiEdit2 } from "react-icons/fi";

const UserUpdateForm = ({
  onClose = () => {},
  userData = {},
  OnSuccess = () => {},
  OnError = () => {},
}) => {
  const { state } = useContext(GlobalContext);
  const baseUrl = state?.baseUrl;

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const roles = [
    { id: 1, label: "Super Admin", color: "text-red-600" },
    { id: 2, label: "Admin", color: "text-purple-600" },
    { id: 3, label: "Manager / Seller", color: "text-blue-600" },
    { id: 4, label: "User", color: "text-gray-600" },
  ];

  useEffect(() => {
    userFormik.setFieldValue("name", userData?.name || "");
    userFormik.setFieldValue("email", userData?.email || "");
    userFormik.setFieldValue("phone", userData?.phone || "");
    userFormik.setFieldValue("role", userData?.user_role || "");

    if (userData?.profile) {
      setPreview(userData.profile);
    }
  }, [userData]);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email().required("Email is required"),
  });

  const userFormik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
    },
    validationSchema,

    onSubmit: async (values) => {

      console.log("User update");
      
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("user_role", values.role);

      if (profileImage) {
        formData.append("profile", profileImage);
      }

      try {
        const res = await api.put(`/users/${userData?.user_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        OnSuccess({
          icon: "success",
          message: res?.data?.message || "User updated successfully",
        });

        userFormik.resetForm();
      } catch (err) {
        OnError({
          icon: "error",
          title: err?.response?.data?.message || "Update failed",
        });
        setApiError(err?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image allowed");
      return;
    }

    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="overflow-auto h-full w-full bg-transparent">
      {/*Add Project Form */}

      <div
        className="border rounded-lg  w-full   overflow-hidden h-full pl-[2px] bg-white"
        style={{ boxShadow: "0 0 10px #03A9F4  " }}
      >
        <div className="flex justify-center items-center flex-col h-full ">
          <form
            onSubmit={userFormik.handleSubmit}
            className=" px-4   flex flex-col gap-2 items-center overflow-hidden h-full w-full "
          >
            <p className=" text-xl sm:text-2xl font-medium sm:font-semibold mt-2   ">
              Update User
            </p>

            {/* Profile Image */}
            <div className="flex flex-col items-center gap-2 relative group">
              {/* Avatar */}
              <div
                className="w-20 h-20 rounded-full overflow-hidden cursor-pointer flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 text-lg font-semibold text-gray-700 border-2 border-white shadow-sm"
                onClick={() => document.getElementById("profileInput").click()}
              >
                {preview ? (
                  <img
                    src={preview}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                ) : (
                  <span className="uppercase tracking-wide">
                    {getInitials(userData?.name || "U")}
                  </span>
                )}
              </div>

              {/* Edit Icon */}
              <span
                onClick={() => document.getElementById("profileInput").click()}
                className="absolute bottom-1 right-1 bg-white border shadow-md rounded-full p-1.5 
    text-gray-600 hover:text-blue-600 hover:scale-110 transition cursor-pointer"
              >
                <FiEdit2 size={14} />
              </span>

              {/* Hidden Input */}
              <input
                id="profileInput"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImage(e.target.files[0])}
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-gray-700">Name</label>

              <div>

              {/* Name */}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={userFormik.values.name}
                onChange={userFormik.handleChange}
                className="inputField"
              />

              <div className="error-wrapper">
                    {userFormik.submitCount > 0 &&
                      userFormik.errors.name && (
                        <p className="requiredError">
                          {userFormik.errors.name}
                        </p>
                      )}
                  </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-gray-700">Email</label>

              <div>

              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={userFormik.values.email}
                onChange={userFormik.handleChange}
                className="inputField"
              />


              <div className="error-wrapper">
                    {userFormik.submitCount > 0 &&
                      userFormik.errors.email && (
                        <p className="requiredError">
                          {userFormik.errors.email}
                        </p>
                      )}
                  </div>
              </div>

            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-gray-700">Phone</label>

              {/* Phone */}
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={userFormik.values.phone}
                onChange={userFormik.handleChange}
                className="inputField"
              />
            </div>

            {/* Role */}

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-gray-700">
                User Role
              </label>

              <div className="relative">
                <select
                  name="role"
                  value={userFormik.values.role || ""}
                  onChange={userFormik.handleChange}
                  //   w-full px-3 py-2 rounded-lg border bg-white text-sm appearance-none
                  // focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  // transition cursor-pointer
                  className={`
        appearance-none
      
       inputField
      ${!userFormik.values.role ? "text-gray-400" : "text-gray-700"}`}
                >
                  {/* Placeholder */}
                  <option value="" disabled hidden>
                    Select Role
                  </option>

                  {roles.map((role) => (
                    <option
                      key={role.id}
                      value={role.id}
                      className={`${role.color}`}
                    >
                      {role.label}
                    </option>
                  ))}
                </select>

                {/* Custom Arrow */}
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                  ▼
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-theme-primary text-white py-2 rounded p-1 mt-2"
            >
              {loading ? "Updating..." : "Update User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserUpdateForm;
