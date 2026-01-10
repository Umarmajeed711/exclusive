import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiOutlineEye } from "react-icons/ai";
import "../App.css";

const MyProducts = () => {
  // Example product data (replace with your dynamic map)
  const products = [
    {
      id: 1,
      name: "Product Name",
      price: 100,
      image: "/logo192.png",
    },
     {
      id: 1,
      name: "Product Name",
      price: 100,
      image: "/logo192.png",
    },
     {
      id: 1,
      name: "Product Name",
      price: 100,
      image: "/logo192.png",
    },
     {
      id: 1,
      name: "Product Name",
      price: 100,
      image: "/logo192.png",
    },
    // Add more products here
  ];

  return (
    <div className="mx-5 my-5 lg:mx-12 lg:my-8">


      <div className="flex flex-col gap-5 my-5 sm:my-10">
        <div className="flex gap-5 items-center">
          <p className="h-10 w-5 rounded bg-red-500"></p>
          <p className="text-red-500 text-xl font-medium">Featured</p>
        </div>
        <div className="text-3xl sm:text-4xl font-medium">New Arrival</div>
      </div>

      <div className="grid gap-10 grid-cols-1 md:grid-cols-3 mx-4 md:mx-10 lg:mx-20">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="col-span-1"
          >
            <div className="relative border-none overflow-hidden  group hover:-translate-y-4 hover:shadow-xl transition duration-500">
              {/* Image & hover */}
              <div className="relative w-full aspect-square  h-80 overflow-hidden  bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition "
                />

                {/* Favorite & Quick View */}
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                  <button
                    className="bg-white p-2 rounded-full shadow hover:bg-red-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      alert("Add to favorite");
                    }}
                  >
                    <AiOutlineHeart className="text-lg text-gray-700" />
                  </button>
                  <button
                    className="bg-white p-2 rounded-full shadow hover:bg-blue-100"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      alert("Quick View");
                    }}
                  >
                    <AiOutlineEye className="text-lg text-gray-700" />
                  </button>
                </div>

                {/* Add to Cart on hover */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert(`Add ${product.name} to cart`);
                  }}
                  className="absolute bottom-0 w-full text-center bg-black text-white py-2 opacity-0 group-hover:opacity-90 transition"
                >
                  Add to Cart
                </button>
              </div>

              {/* Product Info */}
              <div className="p-2 flex flex-col gap-1">
                <p className="font-semibold">{product.name}</p>
                <div className="flex gap-2 items-center">
                  <p className="text-red-500 font-medium">${product.price}</p>
                  <p className="text-gray-500 text-sm">⭐️ 4.5</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
