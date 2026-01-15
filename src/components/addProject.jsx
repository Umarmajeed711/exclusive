import React, { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { GlobalContext } from "../context/Context";
import Alert from "@mui/material/Alert";
import api from "./api";
// import {
//   Heading,
//   AlignLeft,
//   ExternalLink,
//   Github,
//   FolderKanban,
// } from "lucide-react";

const DiscountField = ({ originalPrice = 0, formik, loading }) => {
  const discount = Number(formik.values.productDiscount) || 0;

  const finalPrice = originalPrice - (originalPrice * discount) / 100;

  const handleDiscountChange = (value) => {
    if (value === "") {
      formik.setFieldValue("productDiscount", 0);
      return;
    }

    const clampedValue = Math.max(0, Math.min(99, Number(value)));
    formik.setFieldValue("productDiscount", clampedValue);
  };

  return (
    <div className="space-y-3">
      {/* Label */}
      {/* <label className="block text-sm font-medium text-gray-700">
        Discount
      </label> */}
      <span className="text-xl font-bold flex items-center gap-1">
        {/* <ExternalLink /> */}
        Discount
      </span>

      {/* Slider + Input */}
      <div className="flex items-center gap-4">
        {/* Slider */}
        <input
          type="range"
          min={0}
          max={99}
          step={1}
          value={discount}
          onChange={(e) => handleDiscountChange(e.target.value)}
          disabled={loading || originalPrice == 0}
          className="w-full disabled:cursor-not-allowed"
        />

        {/* Number Input */}
        <div className="relative w-24">
          <input
            type="number"
            min={0}
            max={99}
            step={1}
            value={formik.values.productDiscount}
            onChange={(e) => handleDiscountChange(e.target.value)}
            disabled={loading || originalPrice == 0}
            className="inputField pr-7 disabled:cursor-not-allowed"
            placeholder="0"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            %
          </span>
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-400">
        Enter a discount between 0% and 99%
      </p>

      {/* Price Preview */}
      <div className="bg-gray-50 rounded-lg p-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Original Price</span>
          <span>Rs {originalPrice.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Discount</span>
          <span>- {discount}%</span>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between font-semibold text-gray-900">
          <span>Final Price</span>
          <span>Rs {finalPrice.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
};

const CategorySelect = ({ formik, categoryList, loading }) => {
  const [open, setOpen] = useState(false);
  const selected = categoryList?.find(
    (c) => c.category_id == formik.values.productCategory
  );

 
  

  return (
    <div className="relative">
      <span className="text-xl font-bold flex items-center gap-1">
        Category
      </span>

      <button
        type="button"
        disabled={loading}
        onClick={() => setOpen(!open)}
        className="inputField bg-white flex justify-between items-center mt-3"
      >
        <span>{selected ? selected.category_name : "SELECT CATEGORY"}</span>
        <span className="text-gray-400">▼</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-52  overflow-y-auto custom-scrollbar">
          {categoryList?.map((cat) => {
            return cat?.category_id !== selected?.category_id ? (
              <div
                key={cat.category_id}
                onClick={() => {
                  formik.setFieldValue("productCategory", cat.category_id);
                  setOpen(false);
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {cat.category_name}
              </div>
            ) : null;
          })}
        </div>
      )}
      <div className="error-wrapper">
        {formik.touched.productCategory && formik.errors.productCategory && (
          <p className="requiredError">{formik.errors.productCategory}</p>
        )}
      </div>
    </div>
  );
};

const AddProductForm = ({
  onclose = () => {},
  productData = {},
  OnSuccess = () => {},
  OnError = () => {}
}) => {
  let { state, dispatch } = useContext(GlobalContext);

  const fileInputRef = useRef(null);

  const baseUrl = state?.baseUrl;
  const categoryList = state?.categoryList;

  const [loading, setloading] = useState(false);

  const [apiError, setApiError] = useState("");
  const [allPreview, setPreview] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imgError, setImageError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("project Data", productData);
    let sizes = productData.sizes.join(",");
    let colors = productData.colors.join(",");

    addProjectFormik.setFieldValue("productName", productData?.name);
    addProjectFormik.setFieldValue("productDescription", productData?.description);
    addProjectFormik.setFieldValue("productPrice", productData?.price);
    addProjectFormik.setFieldValue("productQuantity", productData?.quantity);
    addProjectFormik.setFieldValue("productCategory", productData?.category_id);
    addProjectFormik.setFieldValue("productSizes", sizes);
    addProjectFormik.setFieldValue("productColor", colors);
    addProjectFormik.setFieldValue("productDiscount", productData?.discount);
    
    setPreview(productData?.image_urls);
    setSelectedFiles(productData?.image_urls)
  }, []);

  const ProductValidation = yup.object({
    productName: yup.string().required("This field is required"),
    productDescription: yup.string().required("This field is required"),
    productPrice: yup.number().required("This field is required"),
    productQuantity: yup.number().required("This field is required"),
    productCategory: yup.string().required("This field is required"),
    productSizes: yup.string().required("This field is required"),
    productColor: yup.string().required("This field is required"),
  });

  const addProjectFormik = useFormik({
    initialValues: {
      productName: "",
      productDescription: "",
      productPrice: "",
      productQuantity: "",
      productDiscount: 0,
      productCategory: "",
      productSizes: "",
      productColor: "",
    },
    validationSchema: ProductValidation,

    onSubmit: async (values) => {

      console.log("values", values);
      
      setloading(true);
      

      let productSizes = values.productSizes.split(",");
      let productColor = values.productColor.split(",");



      if (!selectedFiles.length) {
        setApiError("Please select at least 1 image ");
        setImageError(true);
        setloading(false);
        return;
      }

      if (selectedFiles.length > 5) {
        setApiError("please select only 5 images for one product");
        setloading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", values.productName);
      formData.append("description", values.productDescription);
      formData.append("price", values.productPrice);
      formData.append("quantity", values.productQuantity);
      formData.append("discount", values.productDiscount);
      formData.append("category_id", values.productCategory);
      formData.append("sizes", productSizes);
      formData.append("colors", productColor);
      Array.from(selectedFiles).forEach((files) => {
        formData.append("images", files);
      });




      console.log("Form dAta", formData);

      try {
        let response =   productData.product_id ? await api.put(
          `/products/${productData?.product_id}`,
          formData
        ) :await api.post(
          `/products`,
          formData
        );

        console.log(response);

        setloading(false);
        // navigate("/dashbaord")

        addProjectFormik.resetForm();

        OnSuccess({
          icon: "success",
          message: response?.data?.message || "Add Product Successfully",
        });
      } catch (error) {
        setloading(false);
        console.log(error?.response.data?.message);
        OnError({
          icon: "warning",
          title: error?.response.data?.message || "Something went wrong",
        });

        setApiError(error?.response.data.message || "Something went wrong");
      } finally {
        setloading(false);
      }
    },
  });

  // const handleFile = (file) => {
  //   if (!file) return;

  //   if (!file.type.startsWith("image/")) {
  //     alert("Only image files allowed!");
  //     return;
  //   }

  //   setPreview(URL.createObjectURL(file));
  //   addProjectFormik.setFieldValue("image", file);
  // };

  const handleFile = (files) => {
    if (!files) return;

    console.log("files", files);

    let array = [];

    Object.entries(files)?.map((fl, i) => {
      console.log("fl", fl[1].type, i);

      if (!fl[1]?.type.startsWith("image/")) {
        alert("Only image files allowed!");
        return;
      }
      let newPreview = URL.createObjectURL(fl[1]);

      array.push(newPreview);
    });

    setPreview(array);
    setSelectedFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFile(files);
  };

  const handleInput = (e) => {
    const files = e.target.files;
    handleFile(files);
  };

  return (
    <div className="overflow-auto h-full w-full bg-transparent">
      {/*Add Project Form */}

      <div
        className="border rounded-lg  w-full   overflow-hidden h-full pl-2 bg-gray-200"
        style={{ boxShadow: "0 0 10px #03A9F4  " }}
      >
        <div className="flex justify-center items-center flex-col h-full ">
          {/* <div className="h-[40px] w-full flex justify-center items-center mb-1 overflow-hidden">
            <Alert
              severity="error"
              className="transition-all duration-300 max-w-[350px] text-sm px-4 py-1"
              style={{
                opacity: apiError ? 1 : 0,
                visibility: apiError ? "visible" : "hidden",
              }}
            >
              {apiError || "placeholder"}
            </Alert>
          </div> */}
          <form
            onSubmit={addProjectFormik.handleSubmit}
            className=" px-4   flex flex-col gap-4 items-center overflow-hidden h-full w-full "
          >
            <p className="jetBranis text-xl sm:text-2xl md:text-3xl font-medium sm:font-semibold mt-2   ">
              {productData?.product_id ? "Update" : "Add"} Product
            </p>

            <div className="flex flex-col gap-4 w-full overflow-x-hidden overflow-y-auto  h-full custom-scrollbar p-1">
              {/* productName */}
              <div className="flex gap-3 flex-col justify-center ">
                <label>
                  <span className="text-xl font-bold flex items-center gap-1">
                    {/* <FolderKanban /> */}
                    Name
                  </span>
                </label>
                <div>
                  <input
                    type="text"
                    name="productName"
                    value={addProjectFormik.values.productName}
                    onChange={(e) => {
                      addProjectFormik.handleChange(e);
                      setApiError("");
                    }}
                    disabled={loading}
                    className="inputField"
                    // placeholder="new-project"
                  />

                  <div className="error-wrapper">
                    {addProjectFormik.touched.productName &&
                      addProjectFormik.errors.productName && (
                        <p className="requiredError">
                          {addProjectFormik.errors.productName}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* productQuantity */}
              <div className="flex gap-3 flex-col justify-center ">
                <label>
                  <span className="text-xl font-bold flex items-center gap-1">
                    {/* <ExternalLink />  */}
                    Quantity
                  </span>
                </label>
                <div>
                  <input
                    type="number"
                    name="productQuantity"
                    value={addProjectFormik.values.productQuantity}
                    onChange={(e) => {
                      addProjectFormik.handleChange(e);
                      setApiError("");
                    }}
                    disabled={loading}
                    className="inputField"
                    // placeholder="https://newhost.com"
                  />

                  <div className="error-wrapper">
                    {addProjectFormik.touched.productQuantity &&
                      addProjectFormik.errors.productQuantity && (
                        <p className="requiredError">
                          {addProjectFormik.errors.productQuantity}
                        </p>
                      )}
                  </div>
                </div>
              </div>
              {/* productDiscount */}
              {/* <div className="flex gap-3 flex-col justify-center ">
                <label>
                  <span className="text-xl font-bold flex items-center gap-1">
                    
                    Discount
                  </span>
                </label>
                <div>
                  <input
                    type="number"
                    name="productDiscount"
                    maxLength={2}
                    value={addProjectFormik.values.productDiscount}
                    onChange={(e) => {
                      addProjectFormik.handleChange(e);
                      setApiError("");
                    }}
                    disabled={loading}
                    className="inputField"
                    
                  />

                  <div className="error-wrapper">
                    {addProjectFormik.touched.productDiscount &&
                      addProjectFormik.errors.productDiscount && (
                        <p className="requiredError">
                          {addProjectFormik.errors.productDiscount}
                        </p>
                      )}
                  </div>
                </div>
              </div> */}

              {/* productPrice */}
              <div className="flex gap-3 flex-col justify-center ">
                <label>
                  <span className="text-xl font-bold flex items-center gap-1">
                    Price
                  </span>
                </label>
                <div>
                  <input
                    type="number"
                    name="productPrice"
                    value={addProjectFormik.values.productPrice}
                    onChange={(e) => {
                      addProjectFormik.handleChange(e);
                      setApiError("");
                    }}
                    disabled={loading}
                    className="inputField"
                  />

                  <div className="error-wrapper">
                    {addProjectFormik.touched.productPrice &&
                      addProjectFormik.errors.productPrice && (
                        <p className="requiredError">
                          {addProjectFormik.errors.productPrice}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <DiscountField
                originalPrice={addProjectFormik.values.productPrice}
                formik={addProjectFormik}
                loading={loading}
              />

              {/* Sizes */}
              <div className="flex gap-3 flex-col justify-center ">
                <label>
                  <span className="text-xl font-bold flex items-center gap-1">
                    {/* <ExternalLink /> */}
                    Sizes
                  </span>
                </label>
                <div>
                  <input
                    type="text"
                    name="productSizes"
                    value={addProjectFormik.values.productSizes}
                    onChange={(e) => {
                      addProjectFormik.handleChange(e);
                      setApiError("");
                    }}
                    disabled={loading}
                    className="inputField"
                  />

                  <div className="error-wrapper">
                    {addProjectFormik.touched.productSizes &&
                    addProjectFormik.errors.productSizes ? (
                      <p className="requiredError">
                        {addProjectFormik.errors.productSizes}
                      </p>
                    ) : (
                      <p className="text-xs">
                        <span className="font-medium"> Note:</span> Sizes should
                        be ( <span className="font-semibold text-sm">,</span> )
                        seperated.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* productColor */}
              <div className="flex gap-3 flex-col justify-center ">
                <label>
                  <span className="text-xl font-bold flex items-center gap-1">
                    {/* <ExternalLink />  */}
                    Color
                  </span>
                </label>
                <div>
                  <input
                    type="text"
                    name="productColor"
                    value={addProjectFormik.values.productColor}
                    onChange={(e) => {
                      addProjectFormik.handleChange(e);
                      setApiError("");
                    }}
                    disabled={loading}
                    className="inputField"
                  />

                  <div className="error-wrapper">
                    {addProjectFormik.touched.productColor &&
                    addProjectFormik.errors.productColor ? (
                      <p className="requiredError">
                        {addProjectFormik.errors.productColor}
                      </p>
                    ) : (
                      <p className="text-xs">
                        <span className="font-medium"> Note:</span> Colors
                        should be ({" "}
                        <span className="font-semibold text-sm">,</span> )
                        seperated.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Category */}
              {/* <div className="flex gap-3 flex-col justify-center ">
                <label>
                  <span className="text-xl font-bold flex items-center gap-1">
                    
                    Category
                  </span>
                </label>
                <div>
                  <select
                    className="inputField"
                    id="options"
                    disabled={loading}
                    name="productCategory"
                    value={addProjectFormik.values.productCategory}
                    onChange={addProjectFormik.handleChange}
                  >
                    <option value="" disabled>
                      SELECT CATEGORY
                    </option>

                    {categoryList?.map((eachCategory, i) => (
                      <option key={i} value={eachCategory.category_id}>
                        {eachCategory?.category_name}
                      </option>
                    ))}
                  </select>

                  <div className="error-wrapper">
                    {addProjectFormik.touched.productCategory &&
                      addProjectFormik.errors.productCategory && (
                        <p className="requiredError">
                          {addProjectFormik.errors.productCategory}
                        </p>
                      )}
                  </div>
                </div>
              </div> */}
              <CategorySelect
                categoryList={categoryList}
                formik={addProjectFormik}
                loading={loading}
              />
              {/* Description */}
              <div className="flex gap-3 flex-col justify-center">
                <label>
                  <span className="text-xl font-bold flex items-center gap-1">
                    {/* <AlignLeft />  */}
                    Description
                  </span>
                </label>

                <div>
                  <textarea
                    name="productDescription"
                    value={addProjectFormik.values.productDescription}
                    onChange={(e) => {
                      addProjectFormik.handleChange(e);
                      setApiError("");
                    }}
                    disabled={loading}
                    className="inputField !h-28 resize-none"
                    placeholder="Write product Description..."
                  />
                  <div className="error-wrapper">
                    {addProjectFormik.touched.productDescription &&
                      addProjectFormik.errors.productDescription && (
                        <p className="requiredError">
                          {addProjectFormik.errors.productDescription}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              <div
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`w-full border-2 border-dashed  border-gray-400 rounded-xl p-3 text-center cursor-pointer 
             hover:border-theme-primary transition `}
              >
                {allPreview?.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {allPreview?.map((prev, i) => (
                      <img
                        src={prev}
                        key={i}
                        alt="Preview"
                        className="w-full h-28 col-span-1 object-cover rounded-lg border-2 border-double border-gray-400"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 flex justify-center items-center h-full">
                    Drag & Drop image here or click to upload
                  </p>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInput}
                  disabled={loading}
                  multiple
                  className="hidden"
                />
              </div>
              {selectedFiles?.length > 0 ? (
                <p className="text-xs text-theme-primary text-center">
                  File selected: {selectedFiles.length}
                </p>
              ) : (
                <p
                  className={`${
                    setImageError ? "requiredError" : "ErrorArea"
                  } text-center`}
                >
                  No file selected
                </p>
              )}
              {/* <div className="error-wrapper">
                {addProjectFormik.touched.image &&
                  addProjectFormik.errors.image && (
                    <p className="requiredError">
                      {addProjectFormik.errors.image}
                    </p>
                  )}
              </div> */}

              <div className="flex flex-col justify-between items-center">
                <button
                  disabled={loading}
                  className=" bg-theme-primary transition-all duration-200 flex justify-center rounded px-3 py-2 my-2 text-white  hover:shadow-theme-secondary hover:shadow-md"
                  type="submit"
                >
                  {loading ? (
                    <div className="flex items-center px-1 py-2 gap-2 bg-transparent">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    </div>
                  ) : productData?.product_id ? (
                    "Update Product"
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
