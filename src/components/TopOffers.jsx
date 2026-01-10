import React from "react";
import api from "./api";
import { useState } from "react";
import { useEffect } from "react";
import Title from "./Title";
import { AiOutlineEye, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import OurProducts from "./OurProducts";

const TopOffers = () => {
  const [DiscountProducts, setDiscountProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const DiscountedProducts = async () => {
    try {
      let result = await api.get("/discounted-products");
      setDiscountProducts(result?.data?.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DiscountedProducts();
  }, []);
  return (
    <OurProducts
      products={DiscountProducts}
      title="Top Offers"
      description="Top Discounted Products"
      loading={loading}
    />
  );
};

export default TopOffers;
