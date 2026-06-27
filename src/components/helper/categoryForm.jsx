import { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "../helper/api";
import { showToast } from "./types";
import { GlobalContext } from "../../context/Context";

const CategoryForm = ({
  onClose = () => {},
  categoryData = null,
  OnSuccess = () => {},
  OnError = () => {},
}) => {
  const [loading, setLoading] = useState(false);

  const {state,dispatch} = useContext(GlobalContext);

  // const [categoryCount,setCategoryCount] = useState(null);


  

  const isEdit = Boolean(categoryData?.category_id);

  const validationSchema = yup.object({
    category_name: yup
      .string()
      .trim()
      .required("Category name is required"),
    category_description: yup
      .string()
      .trim()
      .required("Category description is required"),
  });

  const formik = useFormik({
    initialValues: {
      category_name: categoryData?.category_name ||  "",
      category_description: categoryData?.category_description || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if(!categoryReched) return;
      setLoading(true);

      try {
        let res;

        if (isEdit) {
          res = await api.put(`/categories/${categoryData?.category_id}`, {
            category_name: values.category_name,
            category_description: values.category_description,
          });
        } else {
          res = await api.post(`/categories`, {
            category_name: values.category_name,
            category_description: values.category_description,
          });
        }

        const response = res?.data?.data ?? "";

        
        OnSuccess({
          icon: "success",
          message:
            res?.data?.message ||
            (isEdit
              ? "Category updated successfully"
              : "Category added successfully"),
          category:
            response ? {
              category_id: response?.category_id,
              category_name: response?.category_name,
              category_description: response?.category_description,
              created_at:response?.created_at
            } : {},
        });
        // dispatch({ type: "TOGGLE_CATEGORY"});
        

        formik.resetForm();
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          (isEdit ? "Failed to update category" : "Failed to add category");

          OnError({
            icon: "error",
            message,
          });
        // setApiError(message);

      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (categoryData) {
      formik.setValues({
        category_name: categoryData?.category_name || "",
        category_description: categoryData?.category_description || "",
      });
    } else {
      formik.resetForm();
    }
  }, [categoryData]);

  const minRequired = 20;
  const countCategory = Math.round(formik.values.category_description.length);
  const categoryReched = countCategory >= minRequired;



  return (
    <div className="overflow-auto h-full w-full bg-transparent">
      <div className="w-full h-full overflow-hidden bg-gray-100 border border-gray-200 shadow-xl">
        <div className="flex justify-center items-center flex-col h-full">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-2 overflow-hidden h-full w-full"
          >
            {/* Header */}
            <p className="text-xl sm:text-2xl font-medium sm:font-semibold font-mono py-3 border-b px-4">
              {isEdit ? "Update Category" : "Add Category"}
            </p>

            {/* Body */}
            <div className="flex flex-col gap-5 w-full overflow-y-auto h-full custom-scrollbar py-4 px-4">
              {/* API Error */}
              {/* {apiError ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {apiError}
                </div>
              ) : null} */}

              {/* Category Name */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-gray-700">
                  Category Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="category_name"
                  placeholder="Enter category name"
                  value={formik.values.category_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="inputField"
                />

                <div className="error-wrapper">
                  {formik.submitCount > 0 && formik.errors.category_name && (
                    <p className="requiredError">
                      {formik.errors.category_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Category Description */}
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="category_description"
                  rows={5}
                  placeholder="Enter category description"
                  value={formik.values.category_description}
                  onChange={formik.handleChange}
                  //  onChange={(e) => {formik.setFieldValue("category_description", e.target.value);setCategoryCount(e.target.value)}}
                  onBlur={formik.handleBlur}
                  className="inputField min-h-[130px] resize-none"
                />
                <div className="flex justify-between items-center m-0 p-0 text-xs">
                  <div className={!categoryReched ? `text-theme-secondary` : `text-green-400`}>
                    {
                      !categoryReched ?
                      `Minimum ${minRequired} characters required`
                      : `Minimum Reached`
                    }

                  </div>
                  <div>
                    
                     <span className="text-gray-500">{countCategory} </span>/<span>  {minRequired}</span>
                    
                  </div>
                </div>

                {/* <div className="error-wrapper">
                  {formik.submitCount > 0 &&
                    formik.errors.category_description && (
                      <p className="requiredError">
                        {formik.errors.category_description}
                      </p>
                    )}
                </div> */}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 w-full p-3 border-t">
              <button
                type="button"
                onClick={() => {
                  formik.resetForm();
                  onClose();
                }}
                className="rounded-md border py-2 text-sm bg-white transition-all duration-200 hover:bg-gray-100 hover:shadow-md w-full"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="bg-theme-primary w-full transition-all duration-200 flex justify-center rounded-md py-2 text-white hover:shadow-theme-secondary hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center px-1 py-2 gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                  </div>
                ) : isEdit ? (
                  "Update Category"
                ) : (
                  "Add Category"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;