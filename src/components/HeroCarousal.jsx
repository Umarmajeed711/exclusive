import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    image: "gamepade1.jpg",
    title: "Next-Gen Gaming Gear",
    subtitle: "Experience precision, performance, and immersive control",
    cta: "Shop Gaming",
    link: "/Shop",
  },

  {
    image: "head.avif",
    title: "Premium Audio",
    subtitle: "Crystal-clear sound with comfort built for all-day listening",
    cta: "Shop Headphones",
    link: "/Shop",
  },
  {
    image: "keyboard.png",
    title: "High-Performance Keyboards",
    subtitle: "Built for speed, accuracy, and professional workflows",
    cta: "View Collection",
    link: "/Shop",
  },
  {
    image: "gamepade2.jpg",
    title: "Smart Accessories",
    subtitle: "Designed to enhance your everyday digital experience",
    cta: "Explore Now",
    link: "/Shop",
  },
  {
    image: "laptop.jpeg",
    title: "Powerful Laptops",
    subtitle: "Performance that keeps up with your work and creativity",
    cta: "Discover More",
    link: "/Shop",
  },
];

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop
      className="w-full h-96 sm:[500px] md:h-[620px] rounded-xl overflow-hidden"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-full">
            {/* Background image */}
            <img
              src={`/craousal-${slide.image}`}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="absolute inset-0 flex items-end !justify-start">
              <div className="max-w-7xl  my-5 px-6">
                <div className="max-w-xl text-white space-y-4 animate-fadeIn">
                  <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                    {slide.title}
                  </h1>

                  <p className="text-gray-200 text-sm md:text-lg">
                    {slide.subtitle}
                  </p>

                  <a
                    href={slide.link}
                    className="inline-block mt-4 bg-[#03A9F4] hover:bg-[#0298d9] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {slide.cta}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
