import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
import { logDOM } from "@testing-library/dom";

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
      <span className="text-xl font-bold flex items-center gap-1">
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
        {formik.submitCount > 0 && formik.errors.productCategory && (
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
  OnError = () => {},
}) => {
  let { state, dispatch } = useContext(GlobalContext);

  const fileInputRef = useRef(null);

  const baseUrl = state?.baseUrl;
  const categoryList = state?.categoryList;

  const [loading, setloading] = useState(false);

  const [apiError, setApiError] = useState("");
  const [oldImages, setOldImages] = useState([]); // URLs from DB
  const [newImages, setNewImages] = useState([]); // File objects
  const [removedImages, setRemovedImages] = useState([]); // URLs to delete

  const [imgError, setImageError] = useState(false);
  const [mainImage, setMainImage] = useState(null);


  const navigate = useNavigate();

  useEffect(() => {
    console.log("project Data", productData);
    let sizes = productData?.sizes?.join(",");
    let colors = productData?.colors?.join(",");

    addProjectFormik.setFieldValue("productName", productData?.name);
    addProjectFormik.setFieldValue(
      "productDescription",
      productData?.description
    );
    addProjectFormik.setFieldValue("productPrice", productData?.price);
    addProjectFormik.setFieldValue("productQuantity", productData?.quantity);
    addProjectFormik.setFieldValue("productCategory", productData?.category_id);
    addProjectFormik.setFieldValue("productSizes", sizes);
    addProjectFormik.setFieldValue("productColor", colors);
    addProjectFormik.setFieldValue("productDiscount", productData?.discount);

    setOldImages(productData?.image_urls || []);
  }, []);



useEffect(() => {
  if (productData?.main_image_index) {
    // backend main image always assumed to be index 0 in oldImages
    setMainImage({ type: "old", index: Number(productData?.main_image_index) });
  } else if (productData?.image_urls?.length > 0) {
    setMainImage({ type: "old", index: 0 });
  }
}, [productData]);


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
      console.log("mainImage",mainImage);
      

      setloading(true);

      let productSizes = values.productSizes.split(",");
      let productColor = values.productColor.split(",");

      

      const formData = new FormData();
      formData.append("name", values.productName);
      formData.append("description", values.productDescription);
      formData.append("price", values.productPrice);
      formData.append("quantity", values.productQuantity);
      formData.append("discount", values.productDiscount);
      formData.append("category_id", values.productCategory);
      formData.append("sizes", productSizes);
      formData.append("colors", productColor);
      Array.from(newImages).forEach((files) => {
        formData.append("images", files);
      });
      if (mainImage) {
        formData.append("mainImageType", mainImage.type);
        formData.append("mainImageIndex", Number(mainImage.index));
      }

      // ✅ send removed images
      removedImages.forEach((img) => {
        formData.append("removedImages[]", img);
      });

      if (!oldImages.length && !newImages.length) {
        setloading(false);
        alert("At least one image is required");
        return;
      }

      console.log("Form dAta", formData);

      try {
        let response = productData.product_id
          ? await api.put(`/products/${productData?.product_id}`, formData)
          : await api.post(`/products`, formData);

        console.log(response);

        setloading(false);
        

        addProjectFormik.resetForm();

        OnSuccess({
          icon: "success",
          message: response?.data?.message || "Add Product Successfully",
          product: response?.data?.product || {},
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

  // const handleFile = (files) => {
  //   if (!files) return;

  //   console.log("files", files);

  //   let array = [];

  //   Object.entries(files)?.map((fl, i) => {
  //     console.log("fl", fl[1].type, i);

  //     if (!fl[1]?.type.startsWith("image/")) {
  //       alert("Only image files allowed!");
  //       return;
  //     }
  //     let newPreview = URL.createObjectURL(fl[1]);

  //     array.push(newPreview);
  //   });

  //   setPreview(array);
  //   setSelectedFiles(files);
  // };

  const handleInput = (e) => {
    const files = Array.from(e.target.files);

    const totalImages = oldImages.length + newImages.length + files.length;

    if (totalImages > 5) {
      alert("Maximum 5 images allowed per product");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);

    const totalImages = oldImages.length + newImages.length + files.length;

    if (totalImages > 5) {
      alert("Maximum 5 images allowed per product");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);
  };

 
  
  const removeOldImage = (img, index) => {
  setOldImages((prev) => {
    const updated = prev.filter((_, i) => i !== index);

    if (mainImage?.type === "old" && mainImage.index === index) {
      if (updated.length > 0) {
        setMainImage({ type: "old", index: 0 });
      } else if (newImages.length > 0) {
        setMainImage({ type: "new", index: 0 });
      } else {
        setMainImage(null);
      }
    }

    return updated;
  });

  setRemovedImages((prev) => [...prev, img]);
};






  const removeNewImage = (index) => {
  setNewImages((prev) => {
    const updated = prev.filter((_, i) => i !== index);

    if (mainImage?.type === "new" && mainImage.index === index) {
      if (updated.length > 0) {
        setMainImage({ type: "new", index: 0 });
      } else if (oldImages?.length > 0) {
        setMainImage({ type: "old", index: 0 });
      } else {
        setMainImage(null);
      }
    }

    return updated;
  });
};


const newImagePreviews = useMemo(
  () => newImages?.map((file) => URL.createObjectURL(file)),
  [newImages]
);

useEffect(() => {
  return () => {
    newImagePreviews?.forEach(URL.revokeObjectURL);
  };
}, [newImagePreviews]);



  return (
    <div className="overflow-auto h-full w-full bg-transparent">
      {/*Add Project Form */}

      <div
        className="border rounded-lg  w-full   overflow-hidden h-full pl-[2px] bg-gray-200"
        style={{ boxShadow: "0 0 10px #03A9F4  " }}
      >
        <div className="flex justify-center items-center flex-col h-full ">
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
                    {addProjectFormik.submitCount > 0 &&
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
                    {addProjectFormik.submitCount > 0 &&
                      addProjectFormik.errors.productQuantity && (
                        <p className="requiredError">
                          {addProjectFormik.errors.productQuantity}
                        </p>
                      )}
                  </div>
                </div>
              </div>

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
                    {addProjectFormik.submitCount > 0 &&
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
                    {addProjectFormik.submitCount > 0 &&
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
                    {addProjectFormik.submitCount > 0 &&
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
                    {addProjectFormik.submitCount > 0 &&
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
                {newImages?.length > 0 || oldImages.length > 0 ? (
                  // <div className="grid grid-cols-3 gap-2">
                  //   {/* OLD IMAGES */}
                  //   {oldImages.map((img, i) => (
                  //     <div key={i} className="relative">
                  //       <img
                  //         src={img}
                  //         className="w-full h-28 col-span-1 object-cover rounded-lg border-2 border-double border-theme-primary"
                  //       />

                  //       <button
                  //         type="button"
                  //         onClick={(e) =>  {
                  //   e.preventDefault();
                  // e.stopPropagation();
                  //           removeOldImage(img)}}
                  //         className="z-10 flex justify-center items-center absolute top-0 -pt-2 right-0 text-xl font-bold bg-theme-primary   hover:bg-red-600 hover:scale-105 -m-1 text-white rounded-full w-6 h-6 transition-all duration-300"
                  //       >
                  //         <span className="">×</span>
                  //       </button>
                  //     </div>
                  //   ))}

                  //   {/* NEW IMAGES */}
                  //   {newImages.map((file, i) => (
                  //     <div key={i} className="relative">
                  //       <img
                  //         src={URL.createObjectURL(file)}
                  //         className="w-full h-28 col-span-1 object-cover rounded-lg border-2 border-double border-gray-400"
                  //       />
                  //       <button
                  //         type="button"
                  //         onClick={(e) => {
                  //           e.preventDefault();
                  //         e.stopPropagation();
                  //           removeNewImage(i)}}
                  //         className="z-10 flex justify-center items-center absolute top-0 -pt-2 right-0 text-xl font-bold bg-theme-primary   hover:bg-red-600 hover:scale-105 -m-1 text-white rounded-full w-6 h-6 transition-all duration-300"
                  //       >
                  //         <span>×</span>
                  //       </button>
                  //     </div>
                  //   ))}
                  // </div>
                  <div className="grid grid-cols-3 gap-2">
                    {/* OLD IMAGES */}
                    {oldImages.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={img}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMainImage({ type: "old", index: i });
                          }}
                          className={`w-full h-28 object-cover rounded-lg border-2 cursor-pointer
          ${
            mainImage?.type === "old" && mainImage.index === i
              ? "border-green-500"
              : "border-gray-400"
          }`}
                        />

                        {mainImage?.type === "old" && mainImage.index === i && (
                          <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 rounded">
                            MAIN
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeOldImage(img, i);
                          }}
                          className="z-10 flex justify-center items-center absolute top-0 -pt-2 right-0 text-xl font-bold bg-theme-primary   hover:bg-red-600 hover:scale-105 -m-1 text-white rounded-full w-6 h-6 transition-all duration-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {/* NEW IMAGES */}
                    {newImages.map((file, i) => {
                      
                      return (
                        <div key={i} className="relative">
                          <img
                            src={newImagePreviews[i]}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setMainImage({ type: "new", index: ((oldImages?.length) + i )});
                            }}
                            className={`w-full h-28 object-cover rounded-lg border-2 cursor-pointer
            ${
              mainImage?.type === "new" && mainImage.index === ((oldImages?.length) + i )
                ? "border-green-500"
                : "border-gray-400"
            }`}
                          />

                          {mainImage?.type === "new" &&
                            mainImage.index === ((oldImages?.length) + i ) && (
                              <span className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 rounded">
                                MAIN
                              </span>
                            )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeNewImage(i);
                            }}
                            className="z-10 flex justify-center items-center absolute top-0 -pt-2 right-0 text-xl font-bold bg-theme-primary   hover:bg-red-600 hover:scale-105 -m-1 text-white rounded-full w-6 h-6 transition-all duration-300"
                           
                         >
                            ×
                          </button>
                        </div>
                      );
                    })}
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
              {newImages?.length > 0 || oldImages.length > 0 ? (
                <p className="text-xs text-theme-primary text-center">
                  File selected: {newImages.length + oldImages.length}
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
