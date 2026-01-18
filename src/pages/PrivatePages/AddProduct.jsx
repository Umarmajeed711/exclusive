import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";
import api from "../../components/api";
import OurProducts from "../../components/OurProducts";
import Modal from "../../components/modal";
import AddProductForm from "../../components/addProject";
import { GlobalContext } from "../../context/Context";

const AddProduct = () => {
  const { state } = useContext(GlobalContext);

  let isAdmin = state?.isAdmin;

  const [showModal, setShowModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [toggle, setToggle] = useState(false);

  const [categoryList, setCategoryList] = useState([]);

  const getCategory = async () => {
    try {
      let result = await api.get(`/categories`);

      setCategoryList(result.data.categories);
    } catch (error) {}
  };

  const [Products, setProducts] = useState([]);

  const getProducts = async () => {
    setloading(true);
    try {
      let result = await api.get(`/products`);

      setProducts(result.data.products);
      console.log(result.data);
    } catch (error) {
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getCategory();
    getProducts();
  }, [toggle]);

  const handleProductUpdate = (product) => {
    setProducts((prev) =>
      prev.map((p) => (p.product_id == product.product_id ? product : p)),
    );
  };

  const handleProductDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.product_id !== id));
  };

  const onSuccess = ({ position, icon, message, product }) => {
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
  return (
    <div className="mx-5  md:mx-8 lg:mx-14">
      {/* Form Modal */}

      <div className="flex gap-1 items-center text-sm text-theme-secondary ibm my-2 md:my-5">
        Add your new project now...
        <button
          className="button px-2  text-xl"
          onClick={() => {
            setShowModal(true);
          }}
        >
          +
        </button>
      </div>

      <OurProducts
        products={Products}
        title="Our Products"
        description="Explore Our products"
        loading={loading}
        updateProduct={handleProductUpdate}
        delProduct={handleProductDelete}
      />

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
            projectData={projectData}
            categoryList={categoryList}
            OnSuccess={onSuccess}
            OnError={OnError}
          />
        </Modal>
      )}
    </div>
  );
};
export default AddProduct;
