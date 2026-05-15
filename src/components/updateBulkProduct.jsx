import { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import api from "./api";
import { GlobalContext } from "../context/Context";

const BulkUpdateProductForm = ({
  selectedProducts = [],
  onClose = () => {},
  OnSuccess = () => {},
  OnError = () => {},
}) => {
  const { state } = useContext(GlobalContext);

  const categoryList = state?.categoryList || [];

  const [loading, setLoading] = useState(false);

  const BulkValidation = yup.object({
    productPrice: yup.number().nullable(),
    productDiscount: yup.number().min(0).max(99).nullable(),
    productQuantity: yup.number().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      updateAvailability: false,
      isAvailable: true,

      updatePrice: false,
      priceOperation: "set",
      productPrice: "",

      updateDiscount: false,
      productDiscount: 0,

      updateStock: false,
      stockOperation: "set",
      productQuantity: "",

      updateCategory: false,
      productCategory: "",

      updateSizes: false,
      sizesOperation: "replace",
      productSizes: "",

      updateColors: false,
      colorsOperation: "replace",
      productColors: "",

      // updateStatus: false,
      // productStatus: "active",

      

      // updateFeatured: false,
      // isFeatured: false,
    },

    validationSchema: BulkValidation,

    onSubmit: async (values) => {
      setLoading(true);

      try {
        const updates = {};

        // PRICE
        if (values.updatePrice) {
          updates.price = {
            operation: values.priceOperation,
            value: Number(values.productPrice),
          };
        }

        // DISCOUNT
        if (values.updateDiscount) {
          updates.discount = {
            value: Number(values.productDiscount),
          };
        }

        // STOCK
        if (values.updateStock) {
          updates.stock = {
            operation: values.stockOperation,
            value: Number(values.productQuantity),
          };
        }

        // CATEGORY
        if (values.updateCategory) {
          updates.category = {
            value: values.productCategory,
          };
        }

        // SIZES
        if (values.updateSizes) {
          updates.sizes = {
            operation: values.sizesOperation,
            value: values.productSizes
              .split(",")
              .map((s) => s.trim()),
          };
        }

        // COLORS
        if (values.updateColors) {
          updates.colors = {
            operation: values.colorsOperation,
            value: values.productColors
              .split(",")
              .map((c) => c.trim()),
          };
        }

        // STATUS
        if (values.updateAvailability) {
          updates.is_available = {
            value: values.isAvailable,
          };
        }

        // FEATURED
        // if (values.updateFeatured) {
        //   updates.featured = {
        //     value: values.isFeatured,
        //   };
        // }

        if (Object.keys(updates).length === 0) {
          alert("Please select at least one update field");
          setLoading(false);
          return;
        }

        const response = await api.put("/admin/products/bulk-update", {
          product_ids: selectedProducts,
          updates,
        });

        OnSuccess({
          icon: "success",
          title: response?.data?.message || "Products Updated Successfully"
        });

        formik.resetForm();
      } catch (error) {
        OnError({
          icon: "warning",
          title: error?.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  const Checkbox = ({ name, label }) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name={name}
          checked={formik.values[name]}
          onChange={formik.handleChange}
          className="w-4 h-4"
        />

        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
    );
  };

  return (
    <div className="overflow-auto h-full w-full bg-transparent">
      <div
        className="border rounded-lg w-full overflow-hidden h-full pl-[2px] bg-gray-200"
        style={{ boxShadow: "0 0 10px #03A9F4" }}
      >
        <div className="flex justify-center items-center flex-col h-full">
          <form
            onSubmit={formik.handleSubmit}
            className="px-4 flex flex-col gap-4 items-center overflow-hidden h-full w-full"
          >
            <p className="jetBranis text-xl sm:text-2xl font-semibold mt-3">
              Bulk Update Products
            </p>

            <p className="text-sm text-theme-primary">
              Updating {selectedProducts?.length} selected products
            </p>

            <div className="flex flex-col gap-5 w-full overflow-y-auto h-full custom-scrollbar p-1">
              {/* PRICE UPDATE */}
              <div className="bg-white rounded-lg p-4 space-y-4">
                <Checkbox
                  name="updatePrice"
                  label="Update Product Price"
                />

                {formik.values.updatePrice && (
                  <div className="space-y-3">
                    <select
                      name="priceOperation"
                      value={formik.values.priceOperation}
                      onChange={formik.handleChange}
                      className="inputField"
                    >
                      <option value="" selected disabled>- Select Price -</option>
                      <option value="set">Set Exact Price</option>
                      <option value="increase_percent">
                        Increase Percentage
                      </option>
                      <option value="decrease_percent">
                        Decrease Percentage
                      </option>
                      <option value="increase_fixed">
                        Increase Fixed Amount
                      </option>
                      <option value="decrease_fixed">
                        Decrease Fixed Amount
                      </option>
                    </select>

                    <input
                      type="number"
                      name="productPrice"
                      value={formik.values.productPrice}
                      onChange={formik.handleChange}
                      className="inputField"
                      placeholder="Enter value"
                    />
                  </div>
                )}
              </div>

              {/* DISCOUNT */}
              <div className="bg-white rounded-lg p-4 space-y-4">
                <Checkbox
                  name="updateDiscount"
                  label="Update Discount"
                />

                {formik.values.updateDiscount && (
                  <div className="space-y-3">
                    <input
                      type="range"
                      min={0}
                      max={99}
                      value={formik.values.productDiscount}
                      onChange={formik.handleChange}
                      name="productDiscount"
                      className="w-full"
                    />

                    <input
                      type="number"
                      name="productDiscount"
                      value={formik.values.productDiscount}
                      onChange={formik.handleChange}
                      className="inputField"
                    />
                  </div>
                )}
              </div>

              {/* STOCK */}
              <div className="bg-white rounded-lg p-4 space-y-4">
                <Checkbox
                  name="updateStock"
                  label="Update Stock"
                />

                {formik.values.updateStock && (
                  <div className="space-y-3">
                    <select
                      name="stockOperation"
                      value={formik.values.stockOperation}
                      onChange={formik.handleChange}
                      className="inputField"
                    >
                       <option value="" selected disabled>- Select Quantity -</option>
                      <option value="set">Set Quantity</option>
                      <option value="add">Add Quantity</option>
                      <option value="remove">Remove Quantity</option>
                    </select>

                    <input
                      type="number"
                      name="productQuantity"
                      value={formik.values.productQuantity}
                      onChange={formik.handleChange}
                      className="inputField"
                      placeholder="Quantity"
                    />
                  </div>
                )}
              </div>

              {/* CATEGORY */}
              <div className="bg-white rounded-lg p-4 space-y-4">
                <Checkbox
                  name="updateCategory"
                  label="Update Category"
                />

                {formik.values.updateCategory && (
                  <select
                    name="productCategory"
                    value={formik.values.productCategory}
                    onChange={formik.handleChange}
                    className="inputField"
                  >
                    <option value="" selected disabled>SELECT CATEGORY</option>

                    {categoryList?.map((cat) => (
                      <option
                        key={cat.category_id}
                        value={cat.category_id}
                      >
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* SIZES */}
              <div className="bg-white rounded-lg p-4 space-y-4">
                <Checkbox
                  name="updateSizes"
                  label="Update Sizes"
                />

                {formik.values.updateSizes && (
                  <div className="space-y-3">
                    <select
                      name="sizesOperation"
                      value={formik.values.sizesOperation}
                      onChange={formik.handleChange}
                      className="inputField"
                    >
                       <option value="" selected disabled>- Select Sizes -</option>
                      <option value="replace">Replace Sizes</option>
                      <option value="add">Add Sizes</option>
                      <option value="remove">Remove Sizes</option>
                    </select>

                    <input
                      type="text"
                      name="productSizes"
                      value={formik.values.productSizes}
                      onChange={formik.handleChange}
                      className="inputField"
                      placeholder="S,M,L,XL"
                    />

                    <p className="text-xs text-gray-500">
                      Sizes should be comma separated
                    </p>
                  </div>
                )}
              </div>

              {/* COLORS */}
              <div className="bg-white rounded-lg p-4 space-y-4">
                <Checkbox
                  name="updateColors"
                  label="Update Colors"
                />

                {formik.values.updateColors && (
                  <div className="space-y-3">
                    <select
                      name="colorsOperation"
                      value={formik.values.colorsOperation}
                      onChange={formik.handleChange}
                      className="inputField"
                    >
                       <option value="" selected disabled>- Select Colors -</option>
                      <option value="replace">Replace Colors</option>
                      <option value="add">Add Colors</option>
                      <option value="remove">Remove Colors</option>
                    </select>

                    <input
                      type="text"
                      name="productColors"
                      value={formik.values.productColors}
                      onChange={formik.handleChange}
                      className="inputField"
                      placeholder="Black,White,Blue"
                    />

                    <p className="text-xs text-gray-500">
                      Colors should be comma separated
                    </p>
                  </div>
                )}
              </div>

              {/* STATUS */}
              <div className="bg-white rounded-lg p-4 space-y-4">
                <Checkbox
  name="updateAvailability"
  label="Update Availability"
/>

                {formik.values.updateAvailability && (
                  <select
                    name="isAvailable"
                    value={formik.values.isAvailable}
                    onChange={formik.handleChange}
                    className="inputField"
                  >
                  <option value="" selected disabled>- Select Availibility -</option>
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                  </select>
                )}
              </div>

              {/* FEATURED */}
              {/* <div className="bg-white rounded-lg p-4 space-y-4">
                <Checkbox
                  name="updateFeatured"
                  label="Update Featured Products"
                />

                {formik.values.updateFeatured && (
                  <select
                    name="isFeatured"
                    value={formik.values.isFeatured}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "isFeatured",
                        e.target.value === "true",
                      )
                    }
                    className="inputField"
                  >
                    <option value="true">Featured</option>
                    <option value="false">Not Featured</option>
                  </select>
                )}
              </div> */}

              {/* SUBMIT */}
              <div className="flex justify-center items-center pb-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-theme-primary transition-all duration-200 flex justify-center rounded px-5 py-2 my-2 text-white hover:shadow-theme-secondary hover:shadow-md"
                >
                  {loading ? (
                    <div className="flex items-center px-1 py-2 gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    </div>
                  ) : (
                    "Update Products"
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

export default BulkUpdateProductForm;