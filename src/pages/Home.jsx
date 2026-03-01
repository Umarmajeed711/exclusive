import React, { useContext, useEffect } from "react";
import "../App.css";
import { Link } from "react-router";
import { GlobalContext } from "../context/Context";
import api from "../components/api";
import { useState } from "react";
import NewArrivals from "../components/NewArrivals";
import OurProducts from "../components/OurProducts";
import Title from "../components/Title";
import TopOffers from "../components/TopOffers";
import HeroCarousel from "../components/HeroCarousal";
import HeroSection from "../components/heroSection";

const Home = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    try {
      let result = await api.get(`/products`);

      setProducts(result?.data?.products);
      console.log(result.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleProductUpdate = (product) => {
    setProducts((prev) => prev.map((p) => (p.product_id == product.product_id ? product : p)));
  };

  const handleProductDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.product_id !== id));
  };

  return (
    <div>
      {/* <div className="relative h-80 sm:h-full">
        <img src="./heroPic.jpg" className="h-full w-full" />

        <div className="absolute bottom-[50%]  top-[25%] w-[50%] left-0  p-5 md:p-10 text-white">
          <p className="text-xl md:text-2xl lg:text-3xl font-medium">
            Exclusive
          </p>
          <p className="text-xs md:text-sm lg:text-xl font-normal hidden sm:block">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim
            sequi, ipsam aut veniam, corporis nulla doloremque harum provident
            laborum non praesentium atque omnis inventore delectus molestiae ut
            eveniet quis sapiente!
          </p>
          <Link to="/shop" className="text-decoration-none">
            <button
              className="font-bold  bg-white text-red-500  p-2 rounded outline-none transition-all duration-300 hover:text-white hover:bg-[#9D0A14] "
              style={{ boxShadow: "0 0 5px #fff" }}
            >
              Shop Now!
            </button>
          </Link>
        </div>
      </div> */}
      <HeroSection />

      {/* <HeroCarousel/> */}
      <div className="mx-4 my-2 lg:mx-14 lg:my-8 flex flex-col justify-center items-center  h-full">
        <TopOffers />

        {/* <div className="h-full w-full p-4 ">
          <img src="/Frame 600.png" alt="" className="h-full w-full " />
        </div> */}
        <HeroCarousel/>

        <OurProducts
          products={Products.slice(0,8)}
          skeletonProducts={8}
          title="Our Products"
          description="Explore Our products"
          loading={loading}
          updateProduct={handleProductUpdate}
          delProduct={handleProductDelete}
        />

        {Products?.length > 0 ? (
          // <Link to="/" className="px-3 py-2 bg-red-600 text-white rounded">
          //   View ALL Products
          // </Link>
          <Link to="/shop" className="text-decoration-none mt-3">
              <button className="bg-[#03A9F4] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0288d1] transition">
                Explore More
              </button>
            </Link>
        ) : null}
        {/* <NewArrivals /> */}
      </div>
    </div>
  );
};

export default Home;
