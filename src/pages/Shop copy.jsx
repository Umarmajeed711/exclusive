import React from "react";
import { useState } from "react";
import { useContext } from "react";
import api from "../components/api";
import OurProducts from "../components/OurProducts";
import TopOffers from "../components/TopOffers";
import { useEffect } from "react";
import { GlobalContext } from "../context/Context";

const Shop = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const [Products, setProducts] = useState([]);
  const [Category, setCategory] = useState("");
  const [CategoryList, setCategoryList] = useState([]);
  const [ShowSearch, setShowSearch] = useState("All Products");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // products per page;

  const getProducts = async () => {
    try {
      let result = await api.get(
        `/products?searchby=${Category}?page=${currentPage}&limit=$?{limit}`
      );

      setProducts(result?.data?.products);
      setTotalPages(result?.data?.totalPages);
      console.log(result?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async () => {
    try {
      let response = await api.get("categories");
      setCategoryList(response?.data?.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProducts();
    getCategory();
  }, [Category, currentPage]);

  const SearchBy = (e) => {
    setCategory(e.target.value);
    const selectedCategory = CategoryList.find(
      (c) => c?.category_id === Number(e.target.value)
    );
    setShowSearch(selectedCategory?.category_name || "All Products");
  };

  return (
    <div className="mx-4 my-2 lg:mx-14 lg:my-8 flex flex-col justify-center  h-full">
      <div className="px-5 py-5 lg:px-12 lg:py-8 flex justify-between items-center w-full bg-gray-200">
        <div className="text-xl md:text-3xl font-medium md:font-semibold">
          {ShowSearch?.toUpperCase()}
        </div>

        <div className="flex gap-2">
          <span className="text-md">Browse By Category:</span>

          <select
            name="Category"
            value={Category}
            onChange={(e) => SearchBy(e)}
          >
            <option value="" selected>
              All products
            </option>
            {CategoryList.map((eachCategory, i) => {
              return (
                <option key={i} value={eachCategory.category_id}>
                  {eachCategory.category_name}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <OurProducts
        products={Products}
        title="Our Products"
        description="Explore Our products"
        loading={loading}
      />

      {/* Pagination Buttons */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* <button  className='px-3 py-2 bg-red-600 text-white rounded'>Load More</button> */}
    </div>
  );
};

export default Shop;
