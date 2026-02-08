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
import { BiGrid, BiListCheck, BiPlus } from "react-icons/bi";
import {
  MdFormatListBulleted,
  MdOutlineAdd,
  MdOutlineFilterAlt,
} from "react-icons/md";
import ProductListView from "../../components/ProductList";
import SmartFilter from "../../components/SmartFilters";
import { FILTER_OPERATORS, INPUT_TYPES } from "../../components/types";
import {ActiveFilters} from "../../components/ActiveFilters";

const AddProduct = () => {
  const { state } = useContext(GlobalContext);

  let isAdmin = state?.isAdmin;

  const [showModal, setShowModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [toggle, setToggle] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [viewType, setViewType] = useState("grid");

  const [categoryList, setCategoryList] = useState([]);

  const getCategory = async () => {
    try {
      let result = await api.get(`/categories`);

      setCategoryList(result.data.categories);
    } catch (error) {}
  };

  const [Products, setProducts] = useState([]);

  // const getProducts = async () => {
  //   setloading(true);
  //   try {
  //     let result = await api.get(`/products`);

  //     setProducts(result.data.products);
  //     console.log(result.data);
  //   } catch (error) {
  //   } finally {
  //     setloading(false);
  //   }
  // };

  const getProducts = async (filters = {}) => {
    setloading(true);

    try {
      const result = await api.get("/products", {
        params: {
          filters: JSON.stringify(filters),
        },
      });

      setProducts(result?.data?.products);
    } catch (error) {
      console.error(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    getCategory();
    getProducts();
  }, [toggle]);

  // const handleProductUpdate = (product) => {
  //   setProducts((prev) =>
  //     prev.map((p) => (p.product_id == product.product_id ? product : p)),
  //   );
  // };

  const handleProductUpdate = (product) => {
    setProducts((prev) => {
      const exists = prev?.some((p) => p?.product_id == product?.product_id);

      if (exists) {
        // UPDATE
        return prev?.map((p) =>
          p.product_id === product.product_id ? product : p,
        );
      }

      // ADD
      return [product, ...prev];
    });
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

  const productFilters = [
    {
      key: "name",
      label: "Product Name",
      operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },
    {
      key: "price",
      label: "Price",
      operators: [FILTER_OPERATORS.BETWEEN, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.NUMBER,
    },
    {
      key: "category_name",
      label: "Category",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Headphones", value: "headphones" },
        { label: "Mobile", value: "mobile" },
        { label: "Laptop", value: "laptop" },
      ],
    },
    {
      key: "colors",
      label: "Color",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Black", value: "Black" },
        { label: "Yellow", value: "Yellow" },
        { label: "White", value: "White" },
        { label: "Red", value: "Red" },
      ],
    },
    {
      key: "discount",
      label: "Discount (%)",
      operators: [FILTER_OPERATORS.BETWEEN, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.NUMBER,
    },
    {
      key: "is_available",
      label: "Availability",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.SELECT,
      options: [
        { label: "Available", value: true },
        { label: "Not Available", value: false },
      ],
    },
    {
      key: "created_at",
      label: "Created Date",
      operators: [FILTER_OPERATORS.BETWEEN],
      inputType: INPUT_TYPES.DATE,
    },
    {
      key: "quantity",
      label: "Quantity",
      operators: [FILTER_OPERATORS.BETWEEN, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.NUMBER,
    },
  ];

  const [filters, setFilters] = useState([]);

  const handleFilterApply = (query,activeFilters) => {
    setFilters(activeFilters);
    getProducts(query);
  };

  const removeFilter = (index) => {
    const updated = filters?.filter((_, i) => i !== index);
    setFilters(updated);
    getProducts(updated);
  };

  const clearAllFilters = () => {
    setFilters([]);
    getProducts([]);
  };

  return (
    <div className="mx-5  md:mx-8 lg:mx-14">
      {/* Form Modal */}
      {/* <div className="flex gap-1 items-center text-sm text-theme-secondary ibm my-2 md:my-5">
        Add your new project now...
        <button
          className="button px-2  text-xl"
          onClick={() => {
            setShowModal(true);
          }}
        >
          +
        </button>
      </div> */}
      <div>
        <div className="flex flex-col  gap-5 my-5 sm:my-10">
          <div className="flex justify-between h-full items-center">
            <div className="flex gap-5 items-center">
              <p className="h-10 w-5 rounded bg-theme-primary"></p>
              <p className="text-theme-primary text-xl font-medium">
                All Products
              </p>
            </div>
            <ActiveFilters
              filters={filters}
              onRemove={removeFilter}
              onClear={clearAllFilters}
            />
          </div>
          {/* <div className="text-3xl sm:text-4xl font-medium">{props.description}</div> */}
          <div className="flex justify-between items-center h-full">
            <div className="text-3xl sm:text-4xl font-medium">
              Explore All products
            </div>
            <div className="flex gap-2">
              <button
                className="button   text-xl"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <MdOutlineAdd />
              </button>

              <div className="flex gap-[2px] text-xl  font-medium border border-theme-primary bg-theme-background p-[2px] rounded">
                <button
                  className={`gridButton  ${viewType == "grid" ? "bg-theme-primary text-white" : ""}`}
                  onClick={() => {
                    setViewType("grid");
                  }}
                >
                  <BiGrid />
                </button>
                <button
                  className={`gridButton  ${viewType == "list" ? "bg-theme-primary text-white" : ""}`}
                  onClick={() => {
                    setViewType("list");
                  }}
                >
                  <MdFormatListBulleted />
                </button>
              </div>
              {/* <button
                className="button   text-xl"
                onClick={() => {
                  setShowFilter(true);
                }}
              >
                <MdOutlineFilterAlt />
              </button> */}
              <SmartFilter
                filters={productFilters}
                onChange={handleFilterApply}
                value={filters}  
              />
            </div>
          </div>
        </div>
      </div>
      {viewType === "grid" ? (
        <OurProducts
          products={Products}
          loading={loading}
          updateProduct={handleProductUpdate}
          delProduct={handleProductDelete}
        />
      ) : (
        <ProductListView
          products={Products}
          updateProduct={handleProductUpdate}
          delProduct={handleProductDelete}
        />
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
      {/* {showFilter && (
        <Modal
          onClose={() => {
            setShowFilter(false);
          }}
          isOpen={showFilter}
        >
          <SmartFilter
            filters={productFilters}
            enablePagination={true}
            enableSorting={false}
            onChange={(query) => {
              // yahan API call hogi (later)
            }}
            onClose={() => {
              setShowFilter(false);
            }}
          />
        </Modal>
      )} */}
    </div>
  );
};
export default AddProduct;
