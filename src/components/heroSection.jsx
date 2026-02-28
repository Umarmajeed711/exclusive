import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import heroImage from "../assets/hero-image.png"; // replace with your image

const HeroSection = () => {
  const [animateText, setAnimateText] = useState(false);

  // trigger fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => setAnimateText(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-gray-50 overflow-hidden">
      {/* Background shapes / gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#03A9F4] to-purple-500 opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 opacity-20 blur-2xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-8 py-24 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Left Text Content */}
        <div className="lg:w-1/2 space-y-6">
          <h1
            className={`text-4xl sm:text-5xl font-bold text-gray-900 transition-all duration-1000 ${
              animateText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Discover the Future of Electronics
          </h1>
          <p
            className={`text-lg sm:text-xl text-gray-600 transition-all duration-1000 delay-200 ${
              animateText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            Explore top-notch gadgets, smartphones, laptops, and accessories
            with unbeatable deals.
          </p>

          <div
            className={`flex gap-4 mt-6 transition-all duration-1000 delay-400 ${
              animateText
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <Link to="/shop" className="text-decoration-none">
              <button className="bg-[#03A9F4] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0288d1] transition">
                Shop Now
              </button>
            </Link>
            {/* <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition">
              Learn More
            </button> */}
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 relative flex justify-center items-center">
          <img
            src="./hero-head.jpg"
            alt="Hero Electronics"
            className="w-full max-w-lg rounded-2xl shadow-xl hover:scale-105 transition-transform duration-700"
          />
          {/* Optional: small interactive circle overlay */}
          <div className="absolute top-10 xl:left-24 left-10 w-16 h-16 bg-[#03A9F4] rounded-full opacity-30 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
