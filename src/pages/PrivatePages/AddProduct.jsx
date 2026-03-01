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
import { ActiveFilters } from "../../components/ActiveFilters";
import Pagination from "../../components/Pagination";

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
  const [productsByPage, setProductsByPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit, setLimit] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);

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

  // const getProducts = async (filters = {}) => {
  //   setloading(true);

  //   try {
  //     const result = await api.get("/products", {
  //       params: {
  //         filters: JSON.stringify(filters),
  //       },
  //     });

  //     setProducts(result?.data?.products);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setloading(false);
  //   }
  // };

  const getProducts = async ({ filters = {}, page = 1, limit = 12 } = {}) => {
    setloading(true);

    try {
      const result = await api.get("/products", {
        params: {
          page,
          limit,
          filters: JSON.stringify(filters),
        },
      });

      setProducts(result?.data?.products);
      setCurrentPage(result?.data?.currentPage);
      setTotalPages(result?.data?.totalPages);
      setTotalProducts(result?.data?.totalProducts);
      setProductsByPage((prev) => ({
        ...prev,
        [page]: result?.data.products,
      }));

      console.log("total PRoducts", result?.data?.totalProducts);
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
  const [filterquery, setFilterQuery] = useState([]);

  // useEffect(() => {
  //   console.log("Current FIlters", filterquery);

  //   getProducts({ filters:filterquery, page: currentPage, limit });
  // }, [currentPage]);

  const handleFilterApply = (query, activeFilters) => {
    setFilters(activeFilters);
    setProductsByPage({});
    setCurrentPage(1);
    setFilterQuery(query);
    // getProducts(query);

    console.log("Filters", filters);
    console.log("query", query);
    getProducts({ filters: query, page: 1, limit });
  };

  const removeFilter = (index) => {
    const updated = filters?.filter((_, i) => i !== index);
    setFilters(updated);
    // getProducts(updated);
    getProducts({ filters: updated, page: 1, limit });
  };

  const clearAllFilters = () => {
    setFilters([]);
    // getProducts([]);
    getProducts({ filters: [], page: 1, limit });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (productsByPage[page]) {
      setCurrentPage(page);
      setProducts(productsByPage[page] || []);
      return;
    }

    getProducts({
      filters: filterquery,
      page,
      limit,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <div className="flex flex-col gap-2 md:flex-row justify-between h-full md:items-center">
            <div className="flex gap-5 items-center">
              <p className="h-10 w-5 rounded bg-theme-primary"></p>
              <p className="text-theme-primary text-xl font-medium">
                Explore All products
              </p>
            </div>
            <ActiveFilters
              filters={filters}
              onRemove={removeFilter}
              onClear={clearAllFilters}
              showFilterModal={() => {
                setShowFilter(true);
              }}
            />
          </div>
          {/* <div className="text-3xl sm:text-4xl font-medium">{props.description}</div> */}
          <div className="flex justify-between items-center h-full">
            {/* <div className="text-xl sm:text-4xl font-medium">
              Explore All products
            </div> */}
            <div className="flex items-center gap-2">
              {/* <span className="text-sm font-medium text-gray-600">Rows:</span> */}

              {totalProducts > 100 ? (
                <select
                  defaultValue={limit == totalProducts ? "All Products" : limit}
                  onChange={(e) => {
                    const newLimit =
                      e.target.value == "all"
                        ? Number(totalProducts)
                        : Number(e.target.value);
                    setLimit(newLimit);
                    setCurrentPage(1);

                    getProducts({
                      filters: filterquery,
                      page: 1,
                      limit: newLimit,
                    });
                  }}
                  disabled={loading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm
               focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30
               hover:border-gray-400 transition"
                >
                  <option value={100}>100 Products</option>
                  <option value={200}>200 Products</option>
                  <option value={500}>500 Products</option>
                  <option value="all">All Products</option>
                </select>
              ) : (
                <div className="text-xl sm:text-4xl font-medium py-1">
                  Explore All products
                </div>
              )}
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

              <div className="flex justify-center cursor-pointer">
                <button
                 className={`button   text-xl ${filters?.length > 0 ? "active" : ""}`}
                  onClick={() => {
                    setShowFilter(!showFilter);
                    console.log("show filter", showFilter);
                  }}
                >
                  <MdOutlineFilterAlt />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {viewType === "grid" ? (
        <OurProducts
          products={Products}
          skeletonProducts={12}
          loading={loading}
          updateProduct={handleProductUpdate}
          delProduct={handleProductDelete}
        />
      ) : (
        <ProductListView
          products={Products}
          loading={loading}
          updateProduct={handleProductUpdate}
          delProduct={handleProductDelete}
        />
      )}

      {/* <p className="text-sm text-gray-600">
        Showing page {currentPage} of {totalPages} ({Products?.length} products)
      </p> */}
      {/* <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={loading}
        Products={Products?.length}
        
      /> */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalProducts / limit)}
        totalProducts={totalProducts}
        pageSize={limit}
        isLoading={loading}
        onPageChange={handlePageChange}
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
            productData={projectData}
            OnSuccess={onSuccess}
            OnError={OnError}
          />
        </Modal>
      )}

      {showFilter && (
        <SmartFilter
          showFilterModal={showFilter}
          filters={productFilters}
          onChange={handleFilterApply}
          value={filters}
          onClose={() => {
            setShowFilter(false);
          }}
        />
      )}
    </div>
  );
};
export default AddProduct;
