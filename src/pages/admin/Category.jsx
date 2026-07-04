import React, { useContext, useEffect, useState } from "react";
import { MdOutlineAdd, MdOutlineFilterAlt } from "react-icons/md";
import Swal from "sweetalert2";
import api from "../../components/helper/api";
import {
  FILTER_OPERATORS,
  INPUT_TYPES,
  showToast,
} from "../../components/helper/types";
import Pagination from "../../components/helper/Pagination";
import SmartFilter from "../../components/helper/SmartFilters";
import { ActiveFilters } from "../../components/Product/ActiveFilters";
import CategoryForm from "../../components/helper/categoryForm";
import CategoryList from "../../components/helper/CategoryList";
import Modal from "../../components/helper/modal";
import { PlusIcon } from "lucide-react";
import { GlobalContext } from "../../context/Context";
import { TableLayout } from "../../components/helper/table";

const Category = () => {
  const [loading, setLoading] = useState(false);
  const {dispatch} = useContext(GlobalContext);

  const [showFilter, setShowFilter] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesByPage, setCategoriesByPage] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState([]);
  const [filterQuery, setFilterQuery] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);

  /* =========================
     GET CATEGORIES
  ========================= */
  const getCategories = async ({ filters = [], page = 1, limit = 10 } = {}) => {
    setLoading(true);

    try {
      const result = await api.get("/categories", {
        params: {
          page,
          limit,
          filters: JSON.stringify(filters),
        },
      });

      const data = result?.data;

      setCategories(data?.data || []);
      setCurrentPage(data?.currentPage || 1);
      setTotalPages(data?.totalPages || 1);
      setTotalCategories(data?.totalCategories || 0);

      setCategoriesByPage((prev) => ({
        ...prev,
        [page]: data?.data || [],
      }));
    } catch (error) {
      showToast({
        icon: "error",
        title: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

    const onSuccess = ({ position, icon, message, category }) => {
      getCategories();
      handleCategoryUpdate(category);
      setSelectedCategory("")
      setShowCategoryModal(false)
      showToast({
        icon: icon,
        title: message || "",
      });
    };
  
    const OnError = ({ position, icon, message }) => {
      showToast({
        icon: icon,
        title: message || "",
      });
    };

  /* =========================
     FILTERS
  ========================= */
  const categoryFilters = [
    {
      key: "category_id",
      label: "Category ID",
      operators: [FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.NUMBER,
    },
    {
      key: "category_name",
      label: "Category Name",
      operators: [FILTER_OPERATORS.CONTAINS, FILTER_OPERATORS.IS],
      inputType: INPUT_TYPES.TEXT,
    },
    {
      key: "category_description",
      label: "Description",
      operators: [FILTER_OPERATORS.CONTAINS],
      inputType: INPUT_TYPES.TEXT,
    },
  ];

  const handleFilterApply = (query, activeFilters) => {
    setFilters(activeFilters);
    setFilterQuery(query);
    setCategoriesByPage({});
    setCurrentPage(1);

    getCategories({
      filters: query,
      page: 1,
      limit,
    });
  };

  const removeFilter = (index) => {
    const updatedFilters = filters.filter((_, i) => i !== index);
    setFilters(updatedFilters);
    setFilterQuery(updatedFilters);
    setCategoriesByPage({});

    getCategories({
      filters: updatedFilters,
      page: 1,
      limit,
    });
  };

  const clearAllFilters = () => {
    setFilters([]);
    setFilterQuery([]);
    setCategoriesByPage({});

    getCategories({
      filters: [],
      page: 1,
      limit,
    });
  };

  /* =========================
     PAGINATION
  ========================= */
  const handlePageChange = (page) => {
    setCurrentPage(page);

    if (categoriesByPage[page]) {
      setCategories(categoriesByPage[page]);
      return;
    }

    getCategories({
      filters: filterQuery,
      page,
      limit,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* =========================
     ADD / UPDATE CATEGORY IN UI
  ========================= */
  const handleCategoryUpdate = (category) => {
    setCategories((prev) => {
      const exists = prev.some(
        (item) => item?.category_id === category?.category_id,
      );

      if (exists) {
        return prev.map((item) =>
          item?.category_id === category?.category_id ? category : item,
        );
      }

      return [category, ...prev];
    });

    setCategoriesByPage({});
    dispatch({ type: "TOGGLE_CATEGORY" });
  };

  /* =========================
     SINGLE DELETE CATEGORY
  ========================= */
  const handleCategoryDelete = async (categoryId, category = null) => {
    const result = await Swal.fire({
      title: "Are You Sure?",
      text: `Do you want to delete ${
        category?.category_name || "this category"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    const previousCategories = [...categories];

    setCategories((prev) =>
      prev.filter((item) => item.category_id !== categoryId[0]),
    );
    setTotalCategories((prev) => Math.max(prev - 1, 0));

    try {
      await api.delete(`/categories/delete`, {
        data: { ids:categoryId },
      });

      showToast({
        icon: "success",
        title: "Category deleted successfully",
      });

      setCategoriesByPage({});
      dispatch({ type: "TOGGLE_CATEGORY" });
    } catch (error) {
      setCategories(previousCategories);
      setTotalCategories((prev) => prev + 1);

      showToast({
        icon: "error",
        title: error?.response?.data?.message || "Failed to delete category",
      });
    }
  };



  /* =========================
     BULK DELETE CATEGORY
  ========================= */
  const handleBulkDeleteCategories = async (ids = []) => {
    const result = await Swal.fire({
      title: "Are You Sure?",
      text: `Do you want to delete ${ids.length} selected categories?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!result?.isConfirmed) return;

    const previousCategories = [...categories];

    setCategories((prev) =>
      prev.filter((item) => !ids.includes(item.category_id)),
    );
    setTotalCategories((prev) => Math.max(prev - ids.length, 0));

    try {
      // backend later create this route
      await api.delete("/categories/delete", {
        data: { ids },
      });

      showToast({
        icon: "success",
        title: "Selected categories deleted successfully",
      });

      dispatch({ type: "TOGGLE_CATEGORY" });

      setCategoriesByPage({});
    } catch (error) {
      setCategories(previousCategories);
      setTotalCategories(previousCategories.length);

      showToast({
        icon: "error",
        title:
          error?.response?.data?.message ||
          "Failed to delete selected categories",
      });

      throw error;
    }
  };

  return (
    <div className="mx-2">
      {/* Header */}
      <div className="flex flex-col gap-5 my-2">
        <div className="flex flex-row justify-between h-full md:items-center">
          <div className="flex gap-5 items-center">
            <p className="h-10 w-5 rounded bg-theme-primary"></p>
            <p className="text-theme-primary text-xl font-medium">
              Explore All Categories
            </p>
          </div>

          <div className="flex  gap-2 h-8">
            <button
              title="Add Category"
              className="button text-xl h-full"
              onClick={() => {
                setSelectedCategory(null);
                setShowCategoryModal(true);
              }}
            >
              <MdOutlineAdd />
            </button>

            <button
              className={`button  text-xl h-full ${
                filters?.length > 0 ? "active" : ""
              }`}
              onClick={() => setShowFilter(!showFilter)}
            >
              <MdOutlineFilterAlt />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-2">
            {totalCategories > 50 ? (
              <select
                value={limit}
                onChange={(e) => {
                  const newLimit =
                    e.target.value === "all"
                      ? Number(totalCategories)
                      : Number(e.target.value);

                  setLimit(newLimit);
                  setCurrentPage(1);
                  setCategoriesByPage({});

                  getCategories({
                    filters: filterQuery,
                    page: 1,
                    limit: newLimit,
                  });
                }}
                disabled={loading}
                className="disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm
                focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30
                hover:border-gray-400 transition"
              >
                <option value={10}>10 Categories</option>
                <option value={25}>25 Categories</option>
                <option value={50}>50 Categories</option>
                <option value={100}>100 Categories</option>
                <option value="all">All Categories</option>
              </select>
            ) : null}
          </div>

          <ActiveFilters
            filters={filters}
            onRemove={removeFilter}
            onClear={clearAllFilters}
            showFilterModal={() => setShowFilter(true)}
          />
        </div>
      </div>

      <TableLayout>
        <div>
           {/* Category List */}
      <CategoryList
        categories={categories}
        loading={loading}
        filters={filters}
        onEdit={(category) => {
          setSelectedCategory(category);
          setShowCategoryModal(true);
        }}
        onDelete={handleCategoryDelete}
        onBulkDelete={handleBulkDeleteCategories}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCategories / (limit || 10))}
        totalProducts={totalCategories}
        pageSize={limit || 10}
        isLoading={loading}
        onPageChange={handlePageChange}
      />
      </div>


      </TableLayout>

     


      {/* Filters */}
      {showFilter && (
        <SmartFilter
          showFilterModal={showFilter}
          filters={categoryFilters}
          onChange={handleFilterApply}
          value={filters}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* Add/Edit Category Modal */}
      {showCategoryModal && (
        <Modal
          onClose={() => {
            setShowCategoryModal(false);
            setSelectedCategory(null);
          }}
          isOpen={showCategoryModal}
        >
          <CategoryForm
            open={showCategoryModal}
            onClose={() => {
              setShowCategoryModal(false);
              setSelectedCategory(null);
            }}
            categoryData={selectedCategory}
            OnSuccess={onSuccess}
            OnError={OnError}
          />
        </Modal>
      )}
    </div>
  );
};

export default Category;
