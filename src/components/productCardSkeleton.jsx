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