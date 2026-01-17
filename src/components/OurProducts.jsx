import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import "../App.css";
import Title from "./Title";
import api from "./api";
import { GlobalContext } from "../context/Context";
import Modal from "./modal";
import AddProductForm from "./addProject";
import Swal from "sweetalert2";

const isNewArrival = (createdAt) => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24); // days difference
  return diffInDays <= 7;
};

const OurProducts = ({products,  title, description, loading, updateProduct,delProduct }) => {
  let { state, dispatch } = useContext(GlobalContext);
   let Admin = state?.isAdmin;

   
    const [projectData, setProjectData] = useState({});
     
    
      const [showModal, setShowModal] = useState(false);

 

  const addToFavorite = async (product_id) => {
    try {
      let response = await api.post("/add_to_favorite", {
        user_id: state?.user.user_id,
        product_id: product_id,
      });

      console.log("Add to Wishlist", response);
    } catch (error) {
      console.log(error);
    }
  };

  


  //
   const editProduct = (product) => {
    setProjectData(product);
    setShowModal(true);
  };

  const deleteProduct = async (id) => {


    // 🔥 Show confirmation alert first
    const result = await Swal.fire({
      title: "Are You Sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    // ✅ If user confirms
    if (result?.isConfirmed) {
      try {
        let response = await api.delete(`/product/${id}`);
        

        // Success toast
        Swal.fire({
          icon: "success",
          title: "Product deleted successfully",
          toast: true,
          position: "bottom-left",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        delProduct(id);
      } catch (error) {
        // Error toast
        Swal.fire({
          icon: "error",
          title: error?.response?.message || "Something went wrong",
          toast: true,
          position: "bottom-left",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

 

  const onSuccess = ({ position, icon, message,product }) => {
    updateProduct(product)
    setProjectData({});
    setShowModal(false);
    dynamicToast({ position, icon, message });
  };

  const OnError = ({ position, icon, message }) => {
    dynamicToast({ position, icon, message });
  };

  const dynamicToast = ({
    position = "bottom-left",
    icon = "success",
    message = "",
  }) => {
    const Toast = Swal.mixin({
      toast: true,
      position: position,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,

      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: icon,
      title: message,
    });
  };



   // const products = [
  //   {
  //     product_id:"1",
  //     name:"Product1",
  //     price:"500$",
  //     discount:10,
  //     created_at:"2-01-2026",
  //     image_urls:["./image.png",""]
  //   },
  //   {
  //     product_id:"1",
  //     name:"Product1",
  //     price:"500$",
  //     discount:10,
  //     created_at:"2-01-2026",
  //     image_urls:["./image.png",""]
  //   },
  //   {
  //     product_id:"1",
  //     name:"Product1",
  //     price:"500$",
  //     discount:10,
  //     created_at:"2-01-2026",
  //     image_urls:["./image.png",""]
  //   },
  //   {
  //     product_id:"1",
  //     name:"Product1",
  //     price:"500$",
  //     discount:10,
  //     created_at:"2-01-2026",
  //     image_urls:["./image.png",""]
  //   },
  // ]


  return (
    <div className="  w-full">
      {/* px-5 my-5 md:px-8 lg:px-14 lg:my-8 */}
      {loading ? ( 
        <div className="flex justify-center items-center main">
          <div className="loading"></div>
        </div>
      ) : products?.length === 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-md sm:text-xl font-medium  drop-shadow">
            Products not found!
          </div>
        </div>
      ) : (
        <>
          <Title title={title} description={description} />

          <div className="grid gap-10 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ">
            {products?.map((product, i) => (
              <Link
                key={i}
                to={`/ProductDetail/${product?.product_id}`}
                className="col-span-1"
              >
                <div className="relative border-none  overflow-hidden  group hover:-translate-y-4 hover:shadow-2xl transition duration-500">
                  {/* Image & hover */}
                  <div className="relative w-full  h-64 aspect-square overflow-hidden rounded  flex justify-center items-center   bg-slate-100  ">
                    <img
                      src={product?.image_urls[0] || ""}
                      alt={product?.name}
                      className=" h-[50%] object-cover group-hover:scale-105 transition "
                    />

                    {/* Favorite & Quick View */}
                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                      <button
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert("Add to favorite");
                          addToFavorite(product?.product_id);
                        }}
                      >
                        <AiOutlineHeart className="text-lg text-gray-700" />
                      </button>
                      {/* <button
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-200"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          alert("Quick View");
                        }}
                      >
                        <AiOutlineEye className="text-lg text-gray-700" />
                      </button> */}
                      {
                        Admin ? 
                        <>
                         <button
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-200 !z-30"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          editProduct(product)
                        }}
                      >
                        <BiEditAlt className="text-lg text-gray-700" />
                      </button>
                       <button
                        className="bg-white p-2 rounded-full shadow hover:bg-gray-200 !z-30"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                         
                          deleteProduct(product?.product_id)
                        }}
                      >
                        <RiDeleteBin5Line className="text-lg text-gray-700" />
                      </button>
                        </>
                        : null
                    
                      }
                    </div>

                    {/*check the product discount is available or not*/}

                    {product?.discount ? (
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                        <button className="px-2 py-1 rounded bg-theme-secondary text-white justify-center">
                          -{product?.discount}%
                        </button>
                      </div>
                    ) : null}

                    {/* product is new or not */}

                    {isNewArrival(product?.created_at) && !product?.discount ? (
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                        <button className="px-2 py-1 rounded bg-[#00ff66] text-white justify-center">
                          New
                        </button>
                      </div>
                    ) : null}

                    {/* Add to Cart on hover */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alert(`Add ${product?.name} to cart`);
                      }}
                      className="absolute bottom-0 w-full text-center bg-black text-white py-2 opacity-0 group-hover:opacity-90 transition"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-2 flex flex-col gap-1">
                    <p className="font-semibold">{product?.name}</p>
                    <div className="flex gap-2 items-center">
                      <p className="text-theme-primary font-medium">
                        ${product?.price}
                      </p>
                      <p className="text-gray-500 text-sm">⭐️ 4.5</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      {showModal && (
              <Modal
                onClose={() => {
                  setShowModal(false);
                  setProjectData({});
                }}
                isOpen={showModal}
              >
                <AddProductForm
                  onclose={() => {
                    setShowModal(false);
                    setProjectData({});
                  }}
                  productData={projectData}
                  OnSuccess={onSuccess}
                  OnError={OnError}
                />
              </Modal>
            )}
    </div>
  );
};

export default OurProducts;
