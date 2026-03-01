import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // <footer className=" bg-black text-white">
    //   <div className="mx-4 mt-5   lg:mt-8 ">
    //     <div className="flex justify-between gap-5 lg:gap-10 p-5 lg:p-10 flex-wrap">
          

    //       <div className="flex flex-col gap-4 ">
    //         <p className="text-xl md:text-2xl font-semibold">Exlusive</p>
    //         <p className="text-xl ">Subscribe</p>
    //         <div>
    //           <p className="text-[16px] ">
    //             Get 10% of your first order
    //           </p>
    //           <form className="flex relative mt-2">
    //             <input
    //               type="email"
    //               required
    //               name="email"
    //               placeholder="Enter your email"
    //               className="bg-transparent border border-white rounded p-1 flex justify-center items-center text-gray-300"
    //             />
    //             <button className="absolute top-0 right-0 bottom-0 px-2">
    //               X
    //             </button>
    //           </form>
    //         </div>
    //       </div>

         
    //       <div className="flex gap-5 flex-col">
    //         <p className="text-xl font-medium">Support</p>
    //         <div className="flex flex-col gap-2">
    //           <p>1111-/ DHA Head Office Karachi,Pakistan</p>
    //           <a href="mailto:abc@gmail.com">exclusive@gmail.com</a>
    //           <a href="tell:111222333">+111 222 333</a>
    //         </div>
    //       </div>

         
    //       <div className="flex gap-5 flex-col">
    //         <p className="text-xl font-medium">Accounts</p>

    //         <ul className="flex flex-col gap-2 ">
    //           <li >
    //           <Link to="/Account" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">My Account</Link>
    //         </li>

    //         <li >
    //           <Link to="/login" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Register/login</Link>
    //         </li>

    //         <li >
    //           <Link to="/Cart" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Cart</Link>
    //         </li>

    //         <li >
    //           <Link to="/Whishlist" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Wishlist</Link>
    //         </li>

    //         <li >
    //           <Link to="/Shop" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Shop</Link>
    //         </li>
             
             
    //         </ul>
    //       </div>

    //       {/* Quick Link */}

    //       <div className="flex gap-5 flex-col">
    //         <p className="text-xl font-medium">Quick Link</p>

    //         <ul className="flex flex-col gap-2">
    //            <li >
    //           <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Privacy Policy</Link>
    //         </li>
    //          <li >
    //           <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Terms of Use</Link>
    //         </li>
    //          <li >
    //           <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">FAQs</Link>
    //         </li>
    //          <li >
    //           <Link to="/Contact" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Contact</Link>
    //         </li>
    //         </ul>
    //       </div>

        

    //       <div className="flex gap-5 flex-col">
    //         <p className="text-xl font-medium">Follow Us</p>

    //         <ul className="flex flex-col gap-2 ">

    //           <li >
    //           <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Facebook</Link>
    //         </li>

    //         <li >
    //           <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Instagram</Link>
    //         </li>

    //         <li >
    //           <Link to="/" className=" hover:text-gray-200 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-200 after:transition-all after:duration-300">Twitter</Link>
    //         </li>
    //         </ul>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
    <footer className="bg-black text-white border-t border-gray-700">
  <div className="max-w-[1440px] mx-auto px-6 py-14">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

      {/* Brand / Subscribe */}
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-semibold">Exclusive</h3>
        <p className="text-lg">Subscribe</p>
        <p className="text-sm text-gray-400">
          Get 10% off your first order
        </p>

        <form className="relative mt-2">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bottom-1 px-3 rounded-md bg-white text-black text-sm hover:bg-gray-200 transition"
          >
            →
          </button>
        </form>
      </div>

      {/* Support */}
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium">Support</h4>
        <p className="text-sm text-gray-400">
          DHA Head Office<br />Karachi, Pakistan
        </p>
        <a href="mailto:exclusive@gmail.com" className="footer-link">
          exclusive@gmail.com
        </a>
        <a href="tel:111222333" className="footer-link">
          +111 222 333
        </a>
      </div>

      {/* Account */}
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium">Account</h4>
        <ul className="flex flex-col gap-2">
          <li><Link to="/Account" className="footer-link">My Account</Link></li>
          <li><Link to="/login" className="footer-link">Login / Register</Link></li>
          <li><Link to="/Cart" className="footer-link">Cart</Link></li>
          <li><Link to="/Whishlist" className="footer-link">Wishlist</Link></li>
          <li><Link to="/Shop" className="footer-link">Shop</Link></li>
        </ul>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium">Quick Links</h4>
        <ul className="flex flex-col gap-2">
          <li><Link to="/" className="footer-link">Privacy Policy</Link></li>
          <li><Link to="/" className="footer-link">Terms of Use</Link></li>
          <li><Link to="/" className="footer-link">FAQs</Link></li>
          <li><Link to="/Contact" className="footer-link">Contact</Link></li>
        </ul>
      </div>

      {/* Social */}
      <div className="flex flex-col gap-4">
        <h4 className="text-xl font-medium">Follow Us</h4>
        <ul className="flex flex-col gap-2">
          <li><Link to="/" className="footer-link">Facebook</Link></li>
          <li><Link to="/" className="footer-link">Instagram</Link></li>
          <li><Link to="/" className="footer-link">Twitter</Link></li>
        </ul>
      </div>

    </div>

    {/* Bottom Bar */}
    <div className="mt-14 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Exclusive. All rights reserved.
    </div>
  </div>
</footer>
  );
};

export default Footer;
