import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function HeroCarousel() {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      className="w-full h-[550px] -z-50"
    >
      <SwiperSlide>
        <img
          src="/Frame 600.png"
          alt="Banner 1"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </SwiperSlide>

      <SwiperSlide>
        <img
          src="/Frame 706.png"
          alt="Banner 2"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </SwiperSlide>

      <SwiperSlide>
        <img
         src="/Frame 707.png"
          alt="Banner 3"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </SwiperSlide>
    </Swiper>
  );
}
