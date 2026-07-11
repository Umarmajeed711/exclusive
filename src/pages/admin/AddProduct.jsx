import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import Swal from "sweetalert2";
import Alert from "@mui/material/Alert";
import api from "../../components/helper/api";
import OurProducts from "../../components/Product/OurProducts";
import Modal from "../../components/helper/modal";
import AddProductForm from "../../components/Product/addProduct";
import { GlobalContext } from "../../context/Context";
import { BiGrid, BiListCheck, BiPlus } from "react-icons/bi";
import {
  MdFormatListBulleted,
  MdOutlineAdd,
  MdOutlineFilterAlt,
} from "react-icons/md";
import ProductListView from "../../components/Product/ProductList";
import SmartFilter from "../../components/helper/SmartFilters";
import {
  FILTER_OPERATORS,
  INPUT_TYPES,
  showToast,
} from "../../components/helper/types";
import { ActiveFilters } from "../../components/Product/ActiveFilters";
import Pagination from "../../components/helper/Pagination";
import { TableLayout } from "../../components/helper/table";
import { useProducts } from "../../hooks/queries/useProducts";
import { useQueryClient } from "@tanstack/react-query";

const AddProduct = () => {
  const { state } = useContext(GlobalContext);

  let isAdmin = state?.isAdmin;

  const [showModal, setShowModal] = useState(false);
  // const [isloading, setloading] = useState(false);
  const [projectData, setProjectData] = useState({});
  const [toggle, setToggle] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [viewType, setViewType] = useState("grid");

  // const [categoryList, setCategoryList] = useState([]);

  // const getCategory = async () => {
  //   try {
  //     let result = await api.get(`/categories`);

  //     setCategoryList(result.data.data);
  //   } catch (error) {}
  // };

  const categoryList = state?.categoryList;

  const categoryOptions = categoryList?.map((c) => ({
    label: c?.category_name,
    value: c?.category_name,
  }));

  // const [Products, setProducts] = useState([]);
  // const [productsByPage, setProductsByPage] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [filters, setFilters] = useState([]);
  const [filterquery, setFilterQuery] = useState([]);

  // const [totalProducts, setTotalProducts] = useState(0);

  // const getProducts = async ({ filters = {}, page = 1, limit = 12 } = {}) => {
  //   setloading(true);

  //   try {
  //     const result = await api.get(isAdmin ? "/admin/products" : "/products", {
  //       params: {
  //         page,
  //         limit,
  //         filters: JSON.stringify(filters),
  //       },
  //     });

  //     setProducts(result?.data?.products);
  //     setPage(result?.data?.page);
  //     setTotalPages(result?.data?.totalPages);
  //     setTotalProducts(result?.data?.totalProducts);
  //     setProductsByPage((prev) => ({
  //       ...prev,
  //       [page]: result?.data.products,
  //     }));

  //   } catch (error) {
  //   } finally {
  //     setloading(false);
  //   }
  // };

  // useEffect(() => {
  //   getProducts();
  // }, [toggle]);

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching, error } = useProducts({
    filters:filterquery,
    page,
    limit,
    isAdmin,
  });

  // console.log("datadata",data);
  // console.log("error",error)

  const Products = data?.products ?? [];

  // const currentddPage = data?.currentddPage;

  const totalPages = data?.totalPages;

  const totalProducts = data?.totalProducts;

  const handleProductUpdate = (product) => {
    queryClient.invalidateQueries({
      queryKey: ["products"],
    });
    // setProducts((prev) => {
    //   const exists = prev?.some((p) => p?.product_id == product?.product_id);

    //   if (exists) {
    //     // UPDATE
    //     return prev?.map((p) =>
    //       p.product_id === product.product_id ? product : p,
    //     );
    //   }

    //   // ADD
    //   return [product, ...prev];
    // });
  };

  const handleProductDelete = (id) => {
    queryClient.invalidateQueries({
      queryKey: ["products"],
    });
    // setProducts((prev) => prev.filter((p) => p.product_id !== id));
  };

  const onSuccess = ({ icon, title, product }) => {
    // getProducts();
    setProjectData({});
    setShowModal(false);

    showToast({
      icon: icon,
      title: title,
    });
  };

  const OnError = ({ icon, title }) => {
    showToast({
      icon: icon,
      title: title,
    });
  };

  // const dynamicToast = ({
  //   position = "bottom-left",
  //   icon = "success",
  //   message = "",
  // }) => {
  //   const Toast = Swal.mixin({
  //     toast: true,
  //     position: position,
  //     showConfirmButton: false,
  //     timer: 3000,
  //     timerProgressBar: true,

  //     didOpen: (toast) => {
  //       toast.onmouseenter = Swal.stopTimer;
  //       toast.onmouseleave = Swal.resumeTimer;
  //     },
  //   });
  //   Toast.fire({
  //     icon: icon,
  //     title: message,
  //   });
  // };

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
      options: categoryOptions,
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

  // useEffect(() => {

  //   getProducts({ filters:filterquery, page: page, limit });
  // }, [page]);

  const handleFilterApply = (query, activeFilters) => {
    setFilters(activeFilters);
    // setProductsByPage({});
    setPage(1);
    setFilterQuery(query);
    // getProducts(query);

    // getProducts({ filters: query, page: 1, limit });
  };

  const removeFilter = (index) => {
    const updated = filters?.filter((_, i) => i !== index);
    setFilters(updated);
    setFilterQuery(updated);
    // getProducts(updated);
    // getProducts({ filters: updated, page: 1, limit });
  };

  const clearAllFilters = () => {
    setFilters([]);
    setFilterQuery([]);
    // getProducts([]);
    // getProducts({ filters: [], page: 1, limit });
  };

  const handlePageChange = (page) => {
    setPage(page);
    // if (productsByPage[page]) {
    //   setPage(page);
    //   setProducts(productsByPage[page] || []);
    //   return;
    // }

    // getProducts({
    //   filters: filterquery,
    //   page,
    //   limit,
    // });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mx-2">
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
        <div className="flex flex-col  gap-5 my-2">
          <div className="flex flex-col gap-2 md:flex-row justify-between h-full md:items-center">
            <div className="flex gap-5 items-center">
              <p className="h-10 w-5 rounded bg-theme-primary"></p>
              <p className="text-theme-primary text-xl font-medium">
                Explore All products
              </p>
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
                  }}
                >
                  <MdOutlineFilterAlt />
                </button>
              </div>
            </div>
          </div>
          {/* <div className="text-3xl sm:text-4xl font-medium">{props.description}</div> */}
          <div className="flex justify-between items-center h-full">
            {/* <div className="text-xl sm:text-4xl font-medium">
              Explore All products
            </div> */}
            <div className="flex items-center gap-2">
              {/* <span className="text-sm font-medium text-gray-600">Rows:</span> */}

              {totalProducts > 10 ? (
                <select
                  defaultValue={limit == totalProducts ? "All Products" : limit}
                  onChange={(e) => {
                    const newLimit =
                      e.target.value == "all"
                        ? Number(totalProducts)
                        : Number(e.target.value);
                    setLimit(newLimit);
                    setPage(1);

                    // getProducts({
                    //   filters: filterquery,
                    //   page: 1,
                    //   limit: newLimit,
                    // });
                  }}
                  disabled={isLoading}
                  className="disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm
               focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30
               hover:border-gray-400 transition"
                >
                  <option value={50}>50 Products</option>
                  <option value={75}>75 Products</option>
                  <option value={100}>100 Products</option>
                  <option value="all">All Products</option>
                </select>
              ) : // <div className="text-xl sm:text-4xl font-medium py-1">
              //   Explore All products
              // </div>
              null}
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
        </div>
      </div>

      <TableLayout>
        {viewType === "grid" ? (
          <OurProducts
            products={Products}
            skeletonProducts={12}
            loading={isLoading}
            updateProduct={handleProductUpdate}
            delProduct={handleProductDelete}
          />
        ) : (
          <ProductListView
            products={Products}
            loading={isLoading}
            updateProduct={handleProductUpdate}
            delProduct={handleProductDelete}
            filters={filters}
            // onBulkUpdate={getProducts}
          />
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalProducts={totalProducts}
          pageSize={limit}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      </TableLayout>
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setProjectData({});
          }}
          isOpen={showModal}
        >
          <AddProductForm
            onClose={() => {
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
