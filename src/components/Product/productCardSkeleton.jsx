import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="col-span-1">
      <div className="relative overflow-hidden animate-pulse">
        {/* Image Skeleton */}
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center relative">
          {/* Floating icon skeletons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <div className="w-9 h-9 bg-gray-300 rounded-full" />
            <div className="w-9 h-9 bg-gray-300 rounded-full" />
          </div>

          {/* Badge skeleton */}
          <div className="absolute top-2 left-2 w-12 h-6 bg-gray-300 rounded" />

          {/* Add to cart bar */}
          <div className="absolute bottom-0 w-full h-10 bg-gray-300" />
        </div>

        {/* Product Info Skeleton */}
        <div className="p-2 flex flex-col gap-2">
          {/* Title */}
          <div className="h-4 w-3/4 bg-gray-300 rounded" />

          {/* Price + rating */}
          <div className="flex gap-2 items-center">
            <div className="h-4 w-16 bg-gray-300 rounded" />
            <div className="h-4 w-10 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const ProductDetailSkeleton = () => {
  return (
    <div className="container my-5 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="grid grid-cols-4 gap-4">
          {/* Thumbnails */}
          <div className="col-span-1 space-y-2 flex flex-col items-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[110px] h-[110px] bg-gray-200 rounded-3xl"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="col-span-3">
            <div className="w-full h-[452px] bg-gray-200 rounded-3xl" />
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          {/* Title */}
          <div className="w-2/3 h-8 bg-gray-200 rounded" />

          {/* Rating */}
          <div className="w-1/2 h-5 bg-gray-200 rounded" />

          {/* Price */}
          <div className="flex space-x-3">
            <div className="w-24 h-6 bg-gray-200 rounded" />
            <div className="w-16 h-6 bg-gray-200 rounded" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-5/6 h-4 bg-gray-200 rounded" />
            <div className="w-4/6 h-4 bg-gray-200 rounded" />
          </div>

          <hr />

          {/* Colors */}
          <div className="space-y-2">
            <div className="w-24 h-5 bg-gray-200 rounded" />
            <div className="flex space-x-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[30px] h-[30px] rounded-full bg-gray-200"
                />
              ))}
            </div>
          </div>

          <hr />

          {/* Sizes */}
          <div className="space-y-2">
            <div className="w-24 h-5 bg-gray-200 rounded" />
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 col-span-2 bg-gray-200 rounded"
                />
              ))}
            </div>
          </div>

          <hr />

          {/* Quantity + Button */}
          <div className="flex space-x-4">
            <div className="w-[140px] h-12 bg-gray-200 rounded" />
            <div className="flex-grow h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HorizontalReviewSkeleton = () => {
  return (
    <div
      className="flex overflow-x-auto pb-6 gap-4 scrollbar-hide snap-x animate-pulse"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex-shrink-0 snap-start w-full md:w-96 bg-white p-3 rounded-xl border border-gray-100 shadow-sm"
        >
          {/* Top row */}
          <div className="flex justify-between items-center mb-3">
            <div className="w-28 h-4 bg-gray-200 rounded" />
            <div className="w-4 h-4 bg-gray-200 rounded-full" />
          </div>

          {/* Name + badge */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-24 h-4 bg-gray-200 rounded" />
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
          </div>

          {/* Feedback lines */}
          <div className="space-y-2">
            <div className="w-full h-3 bg-gray-200 rounded" />
            <div className="w-5/6 h-3 bg-gray-200 rounded" />
            <div className="w-4/6 h-3 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

;

