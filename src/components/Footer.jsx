import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" bg-black text-white">
      <div className="mx-4 mt-5   lg:mt-8 ">
        <div className="flex justify-between gap-5 lg:gap-10 p-5 lg:p-10 flex-wrap">
          {/* Exclusive */}

          <div className="flex flex-col gap-4 ">
            <p className="text-xl md:text-2xl font-semibold">Exlusive</p>
            <p className="text-xl ">Subscribe</p>
            <div>
              <p className="text-[16px] ">
                Get 10% of your first order
              </p>
              <form className="flex relative mt-2">
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="Enter your email"
                  className="bg-transparent border border-white rounded p-1 flex justify-center items-center text-gray-300"
                />
                <button className="absolute top-0 right-0 bottom-0 px-2">
                  X
                </button>
              </form>
            </div>
          </div>

          {/* Support */}

          <div className="flex gap-5 flex-col">
            <p className="text-xl font-medium">Support</p>
            <div className="flex flex-col gap-2">
              <p>1111-/ DHA Head Office Karachi,Pakistan</p>
              <a href="mailto:abc@gmail.com">exclusive@gmail.com</a>
              <a href="tell:111222333">+111 222 333</a>
            </div>
          </div>

          {/* Accounts */}

          <div className="flex gap-5 flex-col">
            <p className="text-xl font-medium">Accounts</p>

            <ul className="flex flex-col gap-2 ">
              <li >
              <Link to="/Account" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">My Account</Link>
            </li>

            <li >
              <Link to="/login" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Register/login</Link>
            </li>

            <li >
              <Link to="/Cart" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Cart</Link>
            </li>

            <li >
              <Link to="/Whishlist" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Wishlist</Link>
            </li>

            <li >
              <Link to="/Shop" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Shop</Link>
            </li>
             
             
            </ul>
          </div>

          {/* Quick Link */}

          <div className="flex gap-5 flex-col">
            <p className="text-xl font-medium">Quick Link</p>

            <ul className="flex flex-col gap-2">
               <li >
              <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Privacy Policy</Link>
            </li>
             <li >
              <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Terms of Use</Link>
            </li>
             <li >
              <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">FAQs</Link>
            </li>
             <li >
              <Link to="/Contact" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Contact</Link>
            </li>
            </ul>
          </div>

          {/* Follow US */}

          <div className="flex gap-5 flex-col">
            <p className="text-xl font-medium">Follow Us</p>

            <ul className="flex flex-col gap-2 ">

              <li >
              <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Facebook</Link>
            </li>

            <li >
              <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Instagram</Link>
            </li>

            <li >
              <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Twitter</Link>
            </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
