import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Context";
import api from "./api";
import Swal from "sweetalert2";
import { Link, useParams } from "react-router-dom";
import { PiFileMdDuotone, PiGreaterThan } from "react-icons/pi";
import { MdDone } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import OurProducts from "./OurProducts";
import ReactStars from "react-stars";
import moment from "moment/moment";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

const ProductDetail = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const [Product, setProduct] = useState("");
  const [RelatedProduct, setRelatedProduct] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [resetRating, setResetRating] = useState(false);
  const [loading, setLoading] = useState(false);

  //  useEffect for get product detail

  const { id } = useParams();

  useEffect(() => {
    // function for get data.
    const getProductDetail = async () => {
      try {
        let result = await api.get(`/product-details/${id}`);
        console.log(result.data.products);
        setProduct(result?.data.products);
        relatedProducts(result?.data.products);
        getAverageRating(result?.data.products);
      } catch (error) {
        console.log(error);
      }
    };

    getProductDetail();
  }, [id, resetRating]);

  // get related products
  const relatedProducts = async (Product) => {
    try {
      let get_related_products = await api.get(
        `related-products?productCategory=${Product?.category_name}&productId=${Product?.product_id}`
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
    setCounter(counter + 1);
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

  const getAverageRating = async (Product) => {
    try {
      let response = await api.get(
        `/reviews?product_id=${Product?.product_id}`
      );
      console.log(response.data);
      let reviews = response.data.reviews;
      if (reviews.length === 0) return 0; // avoid divide by zero
      const avgRating =
        reviews.reduce((sum, review) => sum + review.rating, 0) /
        reviews.length;
      setAverageRating(avgRating);
      setRatings(response?.data.reviews);
    } catch (error) {
      console.log(error);
    }
  };


  // delete reviews
  const deleteReview = async (user_id,review_id) => {

    try{
      let response = await api.post("/delete-review",{
        user_id : user_id,
        review_id: review_id
      });
      setResetRating(!resetRating)
      


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
    }
    catch(error){
      console.log(error);
      

    }
   
  };

  // function for add to cart
  const addtoCart = async () => {
    setLoading(true)
    try {
      let addTOCart = await api.post("/add-cart", {
        productId : Product.product_id,
        productName: Product.name,
        productPrice: Product.price,
        productDiscount: Product.discount,
        productImage: Product?.image_urls[0],
        productSize: selectedSize,
        productColor: selectedColor,
        quantity: counter,
        user_id: state?.user.user_id,
      });
      dispatch({type: "TOGGLE_CART"});
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
    }finally{
      setLoading(false)
    }
  };
  // rate a product--------------------


  

  let newPrice = Number(Product.price) * (Product.discount / 100);

  return (
    <div className="container mx-auto px-4 py-2 sm:py-4">
      {/* Breadcrums */}

      <div className="flex gap-2 items-center md:container  md:mx-auto px-3 sm:px-4 md:px-8 lg:px-10 mt-3  ">
        <Link
          to={"/"}
          className="text-base  sm:text-xl font-normal text-gray-500 cursor-pointer"
        >
          Home
        </Link>
        <PiGreaterThan />
        <Link
          to={"/Shop"}
          className="text-sm  sm:text-base font-normal text-gray-500"
        >
          Shop
        </Link>
        <PiGreaterThan />
        <Link className="text-sm  sm:text-base font-normal ">
          {Product?.name}
        </Link>
      </div>

      {/* Product Detail */}

      <div className=" container mx-auto  px-4 lg:px-20  my-5 ">
        {/* Product details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="grid grid-cols-4 gap-4 h-full">
            {/* Sidebar Thumbnails */}
            <div className="col-span-1 space-y-4 flex  items-center  flex-col    h-full">
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
            </div>

            {/* Main Image */}
            <div className="col-span-3">
              <div className="border rounded-3xl overflow-hidden h-full  w-full flex justify-center items-center">
                <img
                  src={Product?.image_urls ? Product.image_urls[0] : null}
                  alt={Product?.name}
                  className=" h-[50%] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Product? Details Section */}
          <div className="space-y-3 h-full">
            {/* Product? Name */}
            <h1 className="text-4xl font-bold h11">{Product?.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-4">
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
                ({ratings.length} Reviews) |{" "}
                {(Product.quantity) ? (
                  <span className="text-xl text-green-300">In Stock {Product.quantity}</span>
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
                    <span className="text-theme-secondary bg-red-200 px-1  md:text-md xl:text-xl md:px-2 rounded-full  py-1  ml-3 text-sm">
                      -{Product?.discount}%
                    </span>
                  </>
                ) : null}
              </div>
            </div>

            {/* Description */}
            <p className="text-black">{Product?.description}</p>

            {/* Color Selection */}
            <div className="mt-10"></div>
            <hr />
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

            {/* Size Selection */}
            <div className="mt-10"></div>
            <hr />
            <div>
              <p className="font-normal mb-2 text-xl">Sizes</p>
              <div className="grid grid-cols-6  sm:grid-cols-10 sm:gap-3 gap-2 ">
                {Product?.sizes?.map((size, index) => (
                  <button
                    key={index}
                    className={`p-2 rounded border col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2  cursor-pointer ${
                      selectedSize == size
                        ? "bg-theme-primary text-white border-theme-prbg-theme-primary font-semibold text-xl shadow  shadow-theme-secondary"
                        : "bg-white-100 text-black border-gray-600"
                    }`}
                    onClick={() => handleSizeSelect(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <hr />
            <div className="flex space-x-4">
              {/* counter */}
              <div className="flex items-center border border-gray-600 rounded bg-White">
                <button
                  className="px-4 py-2 text-3xl  border-r-black hover:bg-theme-primary hover:text-white shadow hover:shadow-theme-secondary transition-all duration-300"
                  onClick={handleDecreaseCounter}
                >
                  -
                </button>
                <span className="px-4 text-2xl">{counter}</span>
                <button
                  className="px-4 py-2 text-3xl border-l-black hover:bg-theme-primary hover:text-white shadow hover:shadow-theme-secondary transition-all duration-300"
                  onClick={handleIncreaseCounter}
                >
                  +
                </button>
              </div>
              <button
                className="flex-grow transition-all duration-300 bg-theme-primary border border-transparent text-white py-2 rounded px-6 hover:shadow-xl  text-xl  "
                onClick={addtoCart}
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <div className="flex items-center justify-center px-1 py-2 gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                  </div>
                ) : (
                  "Add to Cart"
                )}
                
              </button>
                

              <button className="p-2 border-2 rounded flex justify-center items-center text-2xl outline-none border-gray-600 ">
                <FaRegHeart />
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {averageRating > 0 ? (
        <div className="flex justify-center items-center mt-5">
          <div className="flex flex-col gap-3 items-center  bg-themeColor p-10 shadow-lg ">
            <p className="text-xl sm:text-2xl font-bold text-gray-500">
              OverAll Ratings
            </p>
            <p className="text-5xl font-extrabold">
              {averageRating.toFixed(1)}
            </p>

            <ReactStars
              count={5}
              value={Number(averageRating)}
              edit={false}
              size={48}
              color2={"#ffd700"}
              className="text-3xl"
            />

            <p className="text-base sm:text-xl font-medium text-gray-500">
              based on {ratings.length} reviews
            </p>
          </div>
        </div>
      ) : null}

      {/* Display product? reviews */}
      <div className=" container mx-auto px-4 lg:px-10  mt-5">
        <p className="text-xl sm:text-2xl font-bold">
          All Reviews (
          <span className="text-base text-gray-500">{ratings.length}</span>){" "}
        </p>

        {ratings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5 mt-5">
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
                                  deleteReview(rating.user_id, rating.review_id);
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
                      {/* <span>
                      <IoCheckmarkDoneCircleSharp className="text-green-500 text-base sm:text-xl " />
                    </span> */}
                    </div>

                    <p className="text-sm sm:text-base font-normal text-gray-500">
                      "{rating.feedback}"
                    </p>

                    <p className="text-sm sm:text-base font-medium">
                      Posted On {moment(rating.created_at).format("MMM Do YY")}{" "}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <p className="bg-gray-200 text-center">No reviews yet.</p>
        )}
      </div>

      {/* Submit a new review */}

      <div className=" container mx-auto px-8  mt-5 flex justify-center flex-col items-center ">
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
      </div>

      {/* map all related product?s */}
      {RelatedProduct?.length > 0 ? (
        <div className="md:container  md:mx-auto  sm:px-4 md:px-8 lg:px-10 mt-10">
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
