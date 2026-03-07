import React, { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../context/Context";
import api from "./api";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { MdDone } from "react-icons/md";
import OurProducts from "./OurProducts";
import ReactStars from "react-stars";
import { IoMdClose } from "react-icons/io";
import Breadcrums from "./Breadcrums";
import {
  HorizontalReviewSkeleton,
  ProductDetailSkeleton,
} from "./productCardSkeleton";

const ProductDetail = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const [Product, setProduct] = useState("");
  const [productLoading, setProductLoading] = useState(false);
  const [RelatedProduct, setRelatedProduct] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [resetRating, setResetRating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartloading, setcartLoading] = useState(false);

  //  useEffect for get product detail

  const { id } = useParams();

  const getProductDetail = async () => {
    setProductLoading(true);
    try {
      let result = await api.get(`/product-details/${id}`);
      console.log(result.data.products);
      setProduct(result?.data.products);
      relatedProducts(result?.data.products);
      getAverageRating(result?.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    // function for get data.

    getProductDetail();
  }, [id, resetRating]);

  // get related products
  const relatedProducts = async (Product) => {
    try {
      let get_related_products = await api.get(
        `related-products?productCategory=${Product?.category_name}&productId=${Product?.product_id}`,
      );
      // const filteredProduct = get_related_products.data.products.filter((product) => product.product_id != Product.product_id)
      setRelatedProduct(get_related_products.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  //  counter
  const [counter, setCounter] = useState(1);

  const handleIncreaseCounter = () => {
    if (counter < Product?.quantity) setCounter(counter + 1);
  };

  const handleDecreaseCounter = () => {
    if (counter > 1) {
      setCounter(counter - 1);
    }
  };

  ////////////////

  // select the size
  const [selectedSize, setSelectedSize] = useState([]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    // Only set selectedSize if sizes are available and the list is not empty
    if (Product?.sizes?.length > 0) {
      setSelectedSize(Product?.sizes[0]);
    }
  }, [Product?.sizes]);

  /// size selecled complete /////

  const [selectedColor, setSelectedColor] = useState([]);

  useEffect(() => {
    // Set the first color in the list as the default selected color
    if (Product?.colors?.length > 0) {
      setSelectedColor(Product?.colors[0]);
    }
  }, [Product?.colors]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  /// select the color complete////

  // function for set the rating
  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  // Handle the user's feedback input
  const handleFeedbackChange = (e) => {
    setFeedback(e?.target.value);
  };

  // Handle form submission for new review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let submitReview = await api.post("/submit_review", {
        name: state?.user.name,
        user_id: state?.user.user_id,
        rating: userRating,
        feedback: feedback,
        product_id: Product?.product_id,
      });
      setUserRating(0);
      setFeedback("");
      setLoading(false);
      setResetRating(!resetRating);
    } catch (error) {
      console.error("Error submitting review: ", error);
      setLoading(false);
    }
  };

  const [ratingLoading, setRatingLoading] = useState(true);

  const getAverageRating = async (Product) => {
    setRatingLoading(true);
    try {
      let response = await api.get(
        `/reviews?product_id=${Product?.product_id}`,
      );
      console.log(response.data);
      let reviews = response?.data?.reviews;
      if (reviews?.length === 0) return 0; // avoid divide by zero
      const avgRating =
        reviews?.reduce((sum, review) => sum + review?.rating, 0) /
        reviews?.length;
      setAverageRating(avgRating);
      setRatings(response?.data?.reviews);
    } catch (error) {
      console.log(error);
    } finally {
      setRatingLoading(false);
    }
  };

  // delete reviews
  const deleteReview = async (user_id, review_id) => {
    try {
      let response = await api.post("/delete-review", {
        user_id: user_id,
        review_id: review_id,
      });
      setResetRating(!resetRating);

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
        title: "Feedback Delete Successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // function for add to cart
  const addtoCart = async () => {
    setcartLoading(true);
    try {
      let addTOCart = await api.post("/add-cart", {
        productId: Product.product_id,
        productName: Product.name,
        productPrice: Product.price,
        productDiscount: Product.discount,
        productImage: Product?.image_urls[0],
        productSize: selectedSize,
        productColor: selectedColor,
        quantity: counter,
        user_id: state?.user.user_id,
      });
      dispatch({ type: "TOGGLE_CART" });
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
        title: "Add product successfully",
      });
      setSelectedColor(Product?.colors[0]);
      setSelectedSize(Product?.sizes[0]);
      setCounter("1");
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setcartLoading(false);
    }
  };
  // rate a product--------------------

  let newPrice = Number(Product.price) * (Product.discount / 100);

  const [selectedImage, setSelectedImage] = React.useState(null);

  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  return (
    <div className="container mx-auto py-2 sm:py-4 px-4 md:px-8 lg:px-14  w-full">
      {/* Breadcrums */}

      <Breadcrums
        currentPage={
          Product?.name ? (
            Product.name
          ) : (
            <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
          )
        }
        prevPages={[{ name: "shop", url: "/Shop" }]}
      />

      {/* Product Detail */}
      {productLoading ? (
        <ProductDetailSkeleton />
      ) : (
        <div className=" container   my-5 ">
          {/* mx-auto  px-4 lg:px-20 */}
          {/* Product details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images Section */}
            <div className="grid grid-cols-4 gap-4 h-full">
              {/* Sidebar Thumbnails */}
              {/* <div className="col-span-1 space-y-4 flex  items-center  flex-col    h-full">
              {Product?.image_urls?.map((image, i) => (
                <div
                  key={i}
                  className="border rounded-3xl overflow-hidden cursor-pointer "
                >
                  <img
                    src={image}
                    alt={i}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div> */}

              <div className="col-span-4 sm:col-span-1 space-y-2 flex items-center sm:flex-col  h-full gap-1">
                {Product?.image_urls
                  ? Product.image_urls.map((image, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedImage(image)}
                        className={`border rounded-3xl overflow-hidden cursor-pointer transition-all p-1 h-[80px] sm:h-[110px] w-[80px] sm:w-[110px] flex justify-center items-center
          ${
            selectedImage === image
              ? "ring-2 ring-theme-primary"
              : "hover:ring-1 hover:ring-gray-300"
          }`}
                      >
                        <img
                          src={image}
                          alt={`thumb-${i}`}
                          // className="w-full h-auto object-cover "
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ))
                  : // Skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-[110px] h-[110px] bg-gray-200 rounded-3xl animate-pulse"
                      />
                    ))}
              </div>

              {/* Main Image */}
              {/* <div className="col-span-3">
              <div className="border rounded-3xl overflow-hidden h-full  w-full flex justify-center items-center">
                <img
                  src={Product?.image_urls ? Product.image_urls[0] : null}
                  alt={Product?.name}
                  className=" h-[50%] object-cover"
                />
              </div>
            </div> */}

              <div className="col-span-4 sm:col-span-3">
                <div className="border rounded-3xl overflow-hidden h-full w-full max-h-[452px] flex justify-center items-center bg-gray-50">
                  {Product?.image_urls ? (
                    <img
                      src={selectedImage || Product.image_urls[0]}
                      alt={Product?.name}
                      className="h-[50%] object-cover transition-opacity duration-300"
                    />
                  ) : (
                    <div className="w-full h-full max-h-[452px] bg-gray-200 animate-pulse rounded-3xl" />
                  )}
                </div>
              </div>
            </div>

            {/* Product? Details Section */}
            <div className="space-y-3 h-full">
              {/* Product? Name */}
              <h1 className="text-2xl sm:text-4xl font-bold h11">
                {Product?.name || (
                  <span className="inline-block w-64 h-8 bg-gray-200 rounded animate-pulse" />
                )}
              </h1>

              {/* Rating */}
              <div className="flex sm:items-center sm:space-x-4 flex-col sm:flex-row">
                <div className="flex text-yellow-500">
                  <ReactStars
                    count={5}
                    value={averageRating > 0 ? averageRating : 4.5}
                    edit={false}
                    size={24}
                    color2={"#ffd700"}
                  />
                </div>
                {/* <span className="text-gray-600 text-xl">
                {averageRating > 0 ? averageRating.toFixed(1) : 4.5/5}
              </span> */}
                <span className="text-xl text-gray-500">
                  ({ratings?.length} Reviews) |{" "}
                  {Product.quantity ? (
                    <span className="text-xl text-green-300">
                      In Stock {Product?.quantity}
                    </span>
                  ) : (
                    <span className="text-xl text-red-500">Sold Out</span>
                  )}
                </span>
              </div>

              {/* Price */}
              <div>
                <div className="flex">
                  <span className="text-2xl font-bold mr-4">
                    ${Math.round(Number(Product?.price) - newPrice)}
                  </span>

                  {Product?.discount > 0 ? (
                    <>
                      <span className="line-through text-gray-400 text-2xl">
                        ${Product?.price}
                      </span>
                      <span className="text-theme-white bg-theme-primary px-1  md:text-md xl:text-xl md:px-2 rounded-full  py-1  ml-3 text-sm">
                        -{Product?.discount}%
                      </span>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Description */}
              <p className="text-black">
                {" "}
                {Product?.description || (
                  <span className="block w-full h-4 bg-gray-200 rounded animate-pulse" />
                )}
              </p>

              {/* Color Selection */}
              <div className="mt-10"></div>
              <hr />
              {Product?.colors?.length > 0 ? (
                <>
                  <div>
                    <p className="font-normal mb-2 text-xl">Colors</p>

                    {/* color option */}

                    <div className="flex space-x-3 ">
                      {Product?.colors?.map((color, index) => (
                        <button
                          key={index}
                          style={{
                            backgroundColor: color.toLowerCase(),
                            padding: "10px",
                            border: "none",
                            cursor: "pointer",
                            color: "#fff",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            position: "relative",
                            // fontWeight: selectedColor === color ? "bold" : "normal",
                            border:
                              selectedColor === color
                                ? "2px solid black"
                                : "2px solid transparent",
                          }}
                          onClick={() => handleColorSelect(color)}
                        >
                          {/* {color} */}

                          {selectedColor == color ? (
                            <span className="flex justify-center items-center">
                              <MdDone className="absolute text-xl font-bold" />
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-10"></div>
                </>
              ) : null}

              {/* Size Selection */}
              <hr />
              {Product?.sizes?.length > 0 ? (
                <div>
                  <p className="font-normal mb-2 text-xl">Sizes</p>
                  <div className="grid grid-cols-6  sm:grid-cols-10 sm:gap-3 gap-2 ">
                    {Product?.sizes?.map((size, index) => (
                      <button
                        key={index}
                        className={`p-2 rounded border font-medium tracking-tight col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-2 h-10 max-h-12 flex justify-center items-center cursor-pointer hover:bg-theme-primary hover:text-white hover:border-theme-primary hover:font-semibold transition-all duration-200 ${
                          selectedSize == size
                            ? "bg-theme-primary text-white border-theme-primary font-semibold text-xl shadow  shadow-theme-secondary"
                            : "bg-white-100 text-black"
                        }`}
                        onClick={() => handleSizeSelect(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Quantity and Add to Cart */}
              <hr />
              <div className="flex space-x-4">
                {/* counter */}
                <div className="grid grid-cols-3 place-content-center place-items-center border rounded bg-White">
                  <button
                    disabled={counter <= 1}
                    className="px-4 py-2 text-3xl w-full h-full  border-r-gray-600 hover:bg-theme-primary hover:text-white shadow hover:shadow-theme-secondary disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-300"
                    onClick={handleDecreaseCounter}
                  >
                    -
                  </button>
                  <span className="px-4 text-2xl w-full">{counter}</span>
                  <button
                    disabled={counter >= Product?.quantity}
                    className="px-4 py-2 text-3xl w-full h-full border-l-gray-600 hover:bg-theme-primary hover:text-white shadow hover:shadow-theme-secondary disabled:opacity-50 disabled:cursor-not-allowed
             transition-all duration-300"
                    onClick={handleIncreaseCounter}
                  >
                    +
                  </button>
                </div>
                <button
                  className="flex-grow transition-all duration-300 bg-theme-primary border border-transparent text-white py-2 rounded px-6 hover:shadow-xl  text-base sm:text-xl  "
                  onClick={addtoCart}
                  disabled={cartloading}
                  type="submit"
                >
                  {cartloading ? (
                    <div className="flex items-center justify-center px-1 py-2 gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    </div>
                  ) : (
                    "Add to Cart"
                  )}
                </button>

                {/* <button className="p-2 border-2 rounded flex justify-center items-center text-2xl outline-none border-gray-600 ">
                <FaRegHeart />
              </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

      <hr />

      {/* average Rating */}
      {/* {averageRating > 0 && (
        <div className="flex justify-center mt-5">
          <div className="flex flex-col gap-3 items-center bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-xl shadow-lg transition-all duration-300">
            <p className="text-lg sm:text-2xl font-bold text-gray-600">
              Overall Ratings
            </p>

            <p className="text-4xl sm:text-5xl font-extrabold text-gray-800">
              {averageRating?.toFixed(1)}
            </p>

            <ReactStars
              count={5}
              value={Number(averageRating)}
              edit={false}
              size={24} // mobile-friendly
              className="sm:text-3xl"
              color2={"#ffd700"}
            />

            <p className="text-sm sm:text-base font-medium text-gray-500">
              based on {ratings?.length} review{ratings?.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )} */}

      {/* Display product? reviews */}
      <div className=" container  mt-5">
        {ratings?.length > 0 ? (
          <div className="flex justify-between items-center mb-8">
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900">
              OUR HAPPY CUSTOMERS
              {/* (
            <span className="text-base text-gray-500">{ratings.length}</span>
            ){" "} */}
            </p>

            <div className="flex space-x-2">
              <button
                className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100"
                onClick={scrollLeft}
                aria-label="Previous testimonials"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100"
                onClick={scrollRight}
                aria-label="Next testimonials"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}

        {ratingLoading ? (
          <HorizontalReviewSkeleton />
        ) : (
          <>
            {ratings?.length > 0 ? (
              <>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5 mt-5">
                {(ratings?.length > 6 ? ratings.slice(-6) : ratings).map(
                  (rating, index) => {
                    return (
                      <div key={index} className="border rounded-2xl p-3">
                        <div className="flex justify-between">
                          <ReactStars
                            count={5}
                            value={Number(rating.rating)}
                            edit={false}
                            size={24}
                            color2={"#ffd700"}
                          />
          
                          <div className="flex items-center gap-2">
                            <span className="font-bold">...</span>
          
                            {state?.user?.user_id == rating.user_id ? (
                              <div>
                                <IoMdClose
                                  className="hover:text-red-500 shadow-lg "
                                  onClick={() => {
                                    Swal.fire({
                                      title: "Do you want delete this Feedback?",
                                      icon: "warning",
                                      showCancelButton: true,
                                      confirmButtonText: "Delete",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        deleteReview(
                                          rating.user_id,
                                          rating.review_id,
                                        );
                                      }
                                    });
                                  }}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
          
                        <div className="flex gap-2 items-center">
                          <p className="text-base sm:text-xl font-bold">
                            {rating?.name}
                          </p>
                         
                        </div>
          
                        <p className="text-sm sm:text-base font-normal text-gray-500">
                          "{rating.feedback}"
                        </p>
          
                        <p className="text-sm sm:text-base font-medium">
                          Posted On{" "}
                          {moment(rating.created_at).format("MMM Do YY")}{" "}
                        </p>
                      </div>
                    );
                  },
                )}
              </div> */}

                {/* Scrollable testimonial cards container */}
                <div
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto pb-6 gap-4 scrollbar-hide snap-x"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {(ratings?.length > 6 ? ratings?.slice(-6) : ratings)?.map(
                    (rating, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 snap-start w-full md:w-96 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
                      >
                        <div className="flex justify-between">
                          <ReactStars
                            count={5}
                            value={Number(rating.rating)}
                            edit={false}
                            size={24}
                            color2={"#ffd700"}
                          />

                          <div className="flex items-center gap-2">
                            {state?.user?.user_id == rating.user_id ? (
                              <div>
                                <IoMdClose
                                  className="hover:text-red-500 shadow-lg cursor-pointer "
                                  onClick={() => {
                                    Swal.fire({
                                      title:
                                        "Do you want delete this Feedback?",
                                      icon: "warning",
                                      showCancelButton: true,
                                      confirmButtonText: "Delete",
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        deleteReview(
                                          rating.user_id,
                                          rating.review_id,
                                        );
                                      }
                                    });
                                  }}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-gray-900">
                            {rating?.name}
                          </span>
                          {/* {testimonial.verified && ( */}
                          <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                            ✓
                          </span>
                          {/* )} */}
                        </div>

                        <p className="text-gray-600 text-sm">
                          "{rating.feedback}"
                        </p>
                        {/* <p className="text-xs font-medium">
                          Posted On{" "}
                          {moment(rating.created_at).format("MMM Do YY")}{" "}
                        </p> */}
                      </div>
                    ),
                  )}
                </div>
              </>
            ) : (
              
              // {/* <p className="bg-gray-200 text-center">No reviews yet.</p> */}
              
              null
              
            )}
          </>
        )}
      </div>

      {/* Submit a new review */}

      {/* <div className=" container mx-auto px-8  mt-5 flex justify-center flex-col items-center ">
        <p className="text-xl sm:text-2xl font-bold">Rate a product</p>
        <form
          onSubmit={handleSubmitReview}
          className="border rounded-3xl   w-80 sm:w-96  flex justify-center flex-col items-center my-3"
        >
          <div className="flex gap-5 items-center ">
            <label>Rating:</label>
            <ReactStars
              count={5}
              value={userRating}
              onChange={handleRatingChange}
              size={24}
              color2={"#ffd700"}
            />
          </div>
          <div className="flex flex-col">
            <label>Feedback:</label>
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              required
              className="border p-2 "
              style={{ width: "200px" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white hover:shadow-2xl hover:text-gray-300 p-1 rounded-lg my-3"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div> */}

      <div className="container mx-auto px-6 mt-10 flex flex-col items-center">
        <p className="text-xl sm:text-2xl font-bold mb-4">Rate this product</p>

        <form
          onSubmit={handleSubmitReview}
          className="w-full max-w-sm sm:max-w-md border rounded-3xl p-6 shadow-md flex flex-col gap-4 bg-white"
        >
          {/* Rating */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Your rating
            </label>
            <ReactStars
              count={5}
              value={userRating}
              onChange={handleRatingChange}
              size={28}
              color2={"#ffd700"}
            />
          </div>

          {/* Feedback */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-600">
              Your review
            </label>
            <textarea
              value={feedback}
              onChange={handleFeedbackChange}
              required
              rows={4}
              placeholder="Share your experience with this product…"
              className="border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-theme-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-theme-primary text-white py-2 rounded-xl font-medium
                 hover:shadow-lg hover:opacity-90 transition-all duration-300
                 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* map all related product?s */}
      {RelatedProduct?.length > 0 ? (
        <div className="md:container  mt-10">
           {/* md:mx-auto  sm:px-4 md:px-8 lg:px-10 */}
          <div>
            <OurProducts
              products={RelatedProduct}
              title="Related Products"
              description="Explore Our products"
              skeletonProducts={4}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default ProductDetail;
