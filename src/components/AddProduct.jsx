import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";
import api from "./api";
import OurProducts from "./OurProducts";

const AddProduct = () => {
  const [apiError, setApiError] = useState("");
  const [loading, setloading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState(false); // true means "no file selected"

  const ProductValidation = yup.object({
    productName: yup.string().required("Product name required"),
    productDescription: yup.string().required("Product description required"),
    productPrice: yup.number().required("Prodcut Price is required"),
    productQuantity: yup.number().required("Product Quantity is required"),
    productCategory: yup.string().required("Please select the category"),
    productSizes: yup.string().required("Product sizes are required"),
    productColor: yup.string().required("Product colors are required")

  });

  const ProductFormik = useFormik({
    initialValues: {
      productName: "",
      productDescription: "",
      productPrice: "",
      productQuantity: "",
      productDiscount: 0,
      productCategory: "",
      productSizes:"",
      productColor:""
    },
    validationSchema: ProductValidation,

    onSubmit: async (values) => {

      console.log(values);
      console.log(selectedFiles);
       let productSizes  = values.productSizes.split(",")
       let productColor = values.productColor.split(",")
       console.log("product Sizes" , productSizes);
       console.log("product colors: " , productColor);
       

       
      
      
      if (!selectedFiles.length) {
        setApiError("Please select at least 1 image ");
        setError(true) 
        return;
      }

      if(selectedFiles.length > 5){
        setApiError("please select only 5 images for one product");
        return

      }
     
      const formData = new FormData();
      formData.append("name", values.productName);
      formData.append("description", values.productDescription);
      formData.append("price", values.productPrice);
      formData.append("quantity", values.productQuantity);
      formData.append("discount", values.productDiscount);
      formData.append("category_id", values.productCategory);
      formData.append("sizes",productSizes)
      formData.append("colors",productColor)
      Array.from(selectedFiles).forEach(files => {
        formData.append("images", files);
      });

     


      // for uplaoding single image
      //  formData.append("images", file); // ✅ Must match your multer field name!

      //  for uploading multiple images
      //  selectedFiles.forEach(file => {
      //   formData.append("images", file);
      // });

     
      try {
         let response = await api.post(`/products`, formData, {
          // headers: { "Content-Type": "multipart/form-data" },
          // withCredentials: true,
         });
        // let response = await  api.post(`/products`,
        //     {name:values.productName, description:values.productDescription,price:values.productPrice, quantity :values.productQuantity,
        //         image_url:values.productImage , discount :values.productDiscount,category_id:values.productCategory

        //      })

         console.log("response", response);
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
          title: "Add Product",
        });

        closeForm();
        getCategory();
        getProducts();
      } catch (error) {
        setApiError(error?.response.data.message || "Something went wrong");
        setloading(false);
        console.log(error);
      }
    },
  });

  const handleFileChange = (event) => {

    let files = event.target.files
    setSelectedFiles(files);
    console.log(files)

   
  }

  const [show, setShow] = useState(false);

  const showForm = () => {
    setShow(true);
  };

  const closeForm = () => {
    setShow(false);
    setSelectedFiles(null)
    setError(false)
    setApiError("")
    ProductFormik.resetForm();
  };

  const [categoryList, setCategoryList] = useState([]);

  const getCategory = async () => {
    try {
      let result = await api.get(`/categories`);

      setCategoryList(result.data.categories);
    } catch (error) {}
  };

  const [Products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      let result = await api.get(`/products`);

      setProducts(result.data.products);
      console.log(result.data)
    } catch (error) {}
  };

  useEffect(() => {
    getCategory();
    getProducts();
  }, []);

  let Styles = {
    inputField:
      "border-b-2  bg-transparent p-1 outline-none focus:drop-shadow-xl w-[220px]",
  };

  return (
    <div>
      <button onClick={showForm}>Add Products</button>

      {/* Form Modal */}
      <div>
        <Modal open={show} onClose={closeForm}>
          <div className="flex justify-center items-center flex-col h-full">
            <div className="h-[40px] w-full flex justify-center items-center mb-1 overflow-hidden">
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
            </div>
            <form
              onSubmit={ProductFormik.handleSubmit}
              className="bg-white p-6 shadow-2xl rounded w-96 my-10"
            >
              <div className="flex justify-end">
                <span
                  onClick={closeForm}
                  className="text-xl hover:text-red-500 hover:shadow-xl"
                >
                  <AiOutlineClose />
                </span>
              </div>

              <div className="flex flex-col justify-center  ">
                <p className="text-3xl font-bold  m-5 text-center">
                  Product Form
                </p>

                {/* Product Name */}
                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="productName">
                    <span className="text-xl ">Name:</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      name="productName"
                      id="productName"
                      //   placeholder="Name"
                      value={ProductFormik.values.productName}
                      onChange={ProductFormik.handleChange}
                      className={Styles.inputField}
                    />

                    {ProductFormik.touched.productName &&
                    Boolean(ProductFormik.errors.productName) ? (
                      <p className="requiredError">
                        {ProductFormik.touched.productName &&
                          ProductFormik.errors.productName}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )}
                  </div>
                </div>

                {/* Product Description*/}
                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="productDescription">
                    <span className="text-xl ">Description:</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      name="productDescription"
                      id="productDescription"
                      value={ProductFormik.values.productDescription}
                      onChange={ProductFormik.handleChange}
                      className={Styles.inputField}
                    />

                    {ProductFormik.touched.productDescription &&
                    Boolean(ProductFormik.errors.productDescription) ? (
                      <p className="requiredError">
                        {ProductFormik.touched.productDescription &&
                          ProductFormik.errors.productDescription}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )}
                  </div>
                </div>

                {/* Product Image*/}
                {/* <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="productImage">
                    <span className="text-xl ">
                      Image: 
                    </span>
                  </label>
                  <div>
                    <input
                      type="url"
                      name="productImage"
                      id="productImage"
                      value={ProductFormik.values.productImage}
                      onChange={ProductFormik.handleChange}
                      className={Styles.inputField}
                    />

                    {ProductFormik.touched.productImage &&
                    Boolean(ProductFormik.errors.productImage) ? (
                      <p className="requiredError">
                        {ProductFormik.touched.productImage &&
                          ProductFormik.errors.productImage}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )}
                  </div>

                 
                </div> */}

                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="productImage">
                    <span className="text-xl ">Image:</span>
                  </label>
                  <div>
                    <input
                      type="file"
                      id="productImage"
                      accept="image/*"
                      // onChange={(e) => setFile(e.target.files[0])}
                      onChange={handleFileChange}
                      multiple
                    />
                    {selectedFiles?.length > 0 ? (
                      <p className="text-xs text-green-600">
                        {/* File selected: {file.name} */}
                        File selected: {selectedFiles.length}
                      </p>
                    ) : (
                      <p className={`${error ? 'requiredError' : 'ErrorArea'}`} >No file selected</p>
                    )}
                  </div>
                </div>

                {/* Product Price*/}
                <div className="flex gap-3 items-center justify-between">
                  <div>
                    <label htmlFor="productPrice">
                      <span className="text-xl ">Price:</span>
                    </label>
                  </div>

                  <div>
                    <input
                      type="number"
                      name="productPrice"
                      id="productPrice"
                      value={ProductFormik.values.productPrice}
                      onChange={ProductFormik.handleChange}
                      className={Styles.inputField}
                      
                    />

                    {ProductFormik.touched.productPrice &&
                    Boolean(ProductFormik.errors.productPrice) ? (
                      <p className="requiredError">
                        {ProductFormik.touched.productPrice &&
                          ProductFormik.errors.productPrice}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )}
                  </div>
                </div>

                {/* Product Quantity*/}
                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="productQuantity">
                    <span className="text-xl ">Quantity:</span>
                  </label>
                  <div>
                    <input
                      type="number"
                      name="productQuantity"
                      id="productQuantity"
                      value={ProductFormik.values.productQuantity}
                      onChange={ProductFormik.handleChange}
                      className={Styles.inputField}
                    />

                    {ProductFormik.touched.productQuantity &&
                    Boolean(ProductFormik.errors.productQuantity) ? (
                      <p className="requiredError">
                        {ProductFormik.touched.productQuantity &&
                          ProductFormik.errors.productQuantity}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )}
                  </div>
                </div>

                {/* Product Discount*/}
                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="productDiscount">
                    <span className="text-xl ">Discount:</span>
                  </label>
                  <div>
                    <input
                      type="number"
                      name="productDiscount"
                      id="productDiscount"
                      value={ProductFormik.values.productDiscount}
                      onChange={ProductFormik.handleChange}
                      className={Styles.inputField}
                      maxLength={99}
                    />

                    {ProductFormik.touched.productDiscount &&
                    Boolean(ProductFormik.errors.productDiscount) ? (
                      <p className="requiredError">
                        {ProductFormik.touched.productDiscount &&
                          ProductFormik.errors.productDiscount}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )}
                  </div>
                </div>

                
          {/* product sizes */}
          {/* <div >
            <span className="text-xl">Sizes:</span>

            <div className="flex flex-wrap justify-center gap-3">
              extra-small
              <div>
                <label htmlFor="xs" className="flex gap-2">
                  <input
                    id="xs"
                    type="checkbox"
                    value={"xs"}
                    name="productSizes"
                    onChange={ProductFormik.handleChange}
                  />
                  xs
                </label>
              </div>

              small
              <div>
                <label htmlFor="sm" className="flex gap-2">
                  <input
                    id="sm"
                    type="checkbox"
                    value={"sm"}
                    name="productSizes"
                    onChange={ProductFormik.handleChange}
                  />
                  sm
                </label>
              </div>

              medium
              <div>
                <label htmlFor="md" className="flex gap-2">
                  <input
                    id="md"
                    type="checkbox"
                    value={"md"}
                    name="productSizes"
                    onChange={ProductFormik.handleChange}
                  />
                  md
                </label>
              </div>

              large
              <div>
                <label htmlFor="xl" className="flex gap-2">
                  <input
                    id="xl"
                    type="checkbox"
                    value={"xl"}
                    name="productSizes"
                    onChange={ProductFormik.handleChange}
                  />
                  xl
                </label>
              </div>

              x-large
              <div>
                <label htmlFor="xxl" className="flex gap-2">
                  <input
                    id="xxl"
                    type="checkbox"
                    value={"xxl"}
                    name="productSizes"
                    onChange={ProductFormik.handleChange}
                  />
                  xxl
                </label>
              </div>
            </div>



          </div> */}



           {/* product sizes by user input */}

                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="productSizes">
                    <span className="text-xl ">Sizes:</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      name="productSizes"
                      id="productSizes"
                      //   placeholder="Name"
                      value={ProductFormik.values.productSizes}
                      onChange={ProductFormik.handleChange}
                      className={Styles.inputField}
                    />


                    { ProductFormik.touched.productColor &&  Boolean(ProductFormik.errors.productColor) ?

                    ProductFormik.touched.productSizes &&
                    Boolean(ProductFormik.errors.productSizes) ? (
                      <p className="requiredError">
                        {ProductFormik.touched.productSizes &&
                          ProductFormik.errors.productSizes}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    ):
                    <p className="text-xs"><span className="font-medium"> Note:</span> Sizes should be ( <span className="font-semibold text-sm">,</span> )  seperated.</p>
                    }
                  </div>
                </div>


                {/* product color by user input */}

                <div className="flex gap-3 items-center justify-between">
                  <label htmlFor="productColor">
                    <span className="text-xl ">Colors:</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      name="productColor"
                      id="productColor"
                      //   placeholder="Name"
                      value={ProductFormik.values.productColor}
                      onChange={ProductFormik.handleChange}
                      className={Styles.inputField}
                    />

                    {
                      ProductFormik.touched.productColor &&  Boolean(ProductFormik.errors.productColor) ?

                      ProductFormik.touched.productColor &&
                    Boolean(ProductFormik.errors.productColor) ? (
                      <p className="requiredError">
                        {ProductFormik.touched.productColor &&
                          ProductFormik.errors.productColor}
                      </p>
                    ) : (
                      <p className="ErrorArea">Error Area</p>
                    )

                    :
                     <p className="text-xs"><span className="font-medium"> Note:</span> Colors should be ( <span className="font-semibold text-sm">,</span> )  seperated.</p>
                       

                       

                    }

                    
                  </div>
                </div>




                {/* product Category */}
                <div className="flex gap-3  justify-between mt-4">
                  <label htmlFor="options">
                    <span className="text-xl ">Category:</span>
                  </label>

                  <div className="self-center">
                    <select
                      className="w-full border "
                      id="options"
                      name="productCategory"
                      value={ProductFormik.values.productCategory}
                      onChange={ProductFormik.handleChange}
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
                    {ProductFormik.touched.productCategory &&
                    Boolean(ProductFormik.errors.productCategory) ? (
                      <span className="requiredError">
                        {ProductFormik.touched.productCategory &&
                          ProductFormik.errors.productCategory}
                      </span>
                    ) : (
                      <span className="ErrorArea">Error Area</span>
                    )}
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className=" bg-red-600 transition-all duration-200 rounded flex justify-center p-2 my-3 text-white  hover:shadow-red-400 hover:shadow-md"
                >
                  {loading ? (
                    <div className="flex items-center p-2 gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    </div>
                  ) : (
                    "Add Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>

      {/* <div className="grid gap-10 grid-cols-1 md:grid-cols-3 mx-4 md:mx-10 lg:mx-20">
        {Products?.map((eachProduct, i) => {
          return (
            <div
              key={i}
              className="col-span-1 border-2 shadow-inner rounded-xl p-4"
            >
              <div className="flex justify-end gap-5">
                <span>Edit</span>
                <span>Delete</span>
              </div>

              <div>
                <img
                  src={eachProduct?.image_urls[0] || "/logo 192.png"}
                  alt=""
                  className="w-full h-64"
                />
              </div>
              <div>
                <p>{eachProduct.name}</p>
                <p>ratings: 4.5 *****</p>
                <p>Price : {eachProduct.price}$</p>
              </div>
            </div>
          );
        })}
      </div> */}
      <OurProducts products={Products}   title="Our Products" description="Explore Our products"/>
    </div>
  );
};
export default AddProduct;
