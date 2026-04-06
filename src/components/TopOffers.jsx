import api from "./api";
import { useState } from "react";
import { useEffect } from "react";
import OurProducts from "./OurProducts";

const TopOffers = ({onAdd = () => {}}) => {
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
      onAdd={onAdd}
      products={DiscountProducts}
      skeletonProducts={4}
      title="Top Offers"
      description="Top Discounted Products"
      loading={loading}
    />
  );
};

export default TopOffers;
