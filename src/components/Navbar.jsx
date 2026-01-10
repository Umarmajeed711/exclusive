import React, { useState } from "react";
import { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/Context";
import api from "./api";
import { FaRegUser } from "react-icons/fa6";

import { FiSearch } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import { GrCart } from "react-icons/gr";
import { TbShoppingBagCheck } from "react-icons/tb";
import { ImCancelCircle } from "react-icons/im";
import { HiOutlineArrowLeftStartOnRectangle } from "react-icons/hi2";
import { IoStarOutline } from "react-icons/io5";

const Navbar = () => {
  let { state, dispatch } = useContext(GlobalContext);

  const [show, setShow] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const showSideBar = () => {
    setShow(true);
  };

  const HideSideBar = () => {
    document.getElementById("hideSideBar").className = "closesideBar";
    setTimeout(() => {
      setShow(false);
    }, 500);
  };

  const logout = async () => {
    try {
      let user_logout = await api.get("/logout");
      console.log("user logout", user_logout);
      dispatch({ type: "USER_LOGOUT" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header>
      <div className="px-2  lg:px-10 sticky top-0  z-10 bg-white border-b-2">
        <div className="h-20  w-full  mx-auto px-4  py-4 flex justify-between items-center">
          {/* max-w-7xl */}

          <div className="text-3xl md:text-4xl  lg:text-[50px]  logo">
            Exclusive
          </div>

          <div className="md:hidden">
            <button onClick={showSideBar}>
              {!show ? <GiHamburgerMenu /> : null}
            </button>
          </div>

          <ul className="hidden md:flex space-x-6 text-black font-medium ">
            <li className="text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
              <Link to="/">Home</Link>
            </li>
            <li className="text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
              <Link to="/Shop">Shop</Link>
            </li>
            <li className="text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
              <Link to="/Contact">Contact</Link>
            </li>
            <li className="text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
              <Link to="/">SignUp</Link>
            </li>
            {/* <li className="text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-700 after:transition-all after:duration-300">
            <Link to="/Category">Category</Link>
          </li> */}
            {/* <li className="text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-gray-700 after:transition-all after:duration-300">
            
            <Link to="/Product">Products</Link>
          </li> */}
          </ul>

          <div className="hidden md:flex gap-5 items-center">
            {/* search field */}

            {/*<div className='bg-gray-200 py-1 px-3 rounded flex gap-5 items-center'>
              <input type="text" placeholder='what you are looking for?' className='outline-none bg-gray-200' />
              <button className='text-xl'><FiSearch/></button>
           </div> */}

            {/* cart icons */}
            <div className="hidden md:flex  gap-4 items-center">
              <p>
                <Link to="/CheckOut" className="link text-xl">
                  <FaRegHeart />
                </Link>
              </p>
              <p>
                <Link to="/Cart" className="link text-xl">
                  <span className="relative text-xl cursor-pointer">
                    <GrCart />
                    {state?.cart?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded px-1  text-xs">
                        {state?.cart?.length}
                      </span>
                    )}
                  </span>
                </Link>
              </p>

              <div
                className="relative"
                onMouseEnter={() => {
                  setShowDropdown(true);
                }}
                onMouseLeave={() => {
                  setShowDropdown(false);
                }}
              >
                <p>
                  <Link to="/MyAccount" className="link text-xl">
                    <FaRegUser />
                  </Link>
                </p>

                {showDropdown ? (
                  <div className="absolute right-0  p-3 w-52 rounded Dropdown flex flex-col gap-1 z-50 ">
                    <Link to="/Account" className="flex gap-2 items-center">
                      {" "}
                      <FaRegUser />{" "}
                      <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
                        Manage My Account
                      </span>
                    </Link>
                    <Link to="/Account" className="flex gap-2 items-center">
                      <TbShoppingBagCheck />{" "}
                      <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
                        {" "}
                        My Orders
                      </span>
                    </Link>
                    <Link to="/Account" className="flex gap-2 items-center">
                      {" "}
                      <ImCancelCircle />{" "}
                      <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
                        {" "}
                        My Cancellations
                      </span>
                    </Link>
                    <Link to="/Account" className="flex gap-2 items-center">
                      {" "}
                      <IoStarOutline />{" "}
                      <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
                        {" "}
                        My reviews
                      </span>
                    </Link>

                    <div>
                      {" "}
                      {state?.isLogin ? (
                        <div className="flex gap-2 items-center hover:text-black">
                          <HiOutlineArrowLeftStartOnRectangle />{" "}
                          <button
                            onClick={logout}
                            className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-gray-700 after:transition-all after:duration-300"
                          >
                            logout
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {/* md:hidden navbar px-4 pt-2 pb-4 shadow-md  bg-white sticky top-0  */}
      </div>

      {show ? (
        <nav className="navbar" id="hideSideBar">
          <div className="flex flex-col  justify-between  h-screen p-3">
            <div className="md:hidden">
              <button onClick={HideSideBar}>
                <MdOutlineClose className="text-2xl font-bold hover:text-red-500 mt-4" />
              </button>
            </div>

            {/* sideLinks */}
            <div className="flex flex-col  gay-y-10 pl-0 ">
              <div className="text-black text-xl flex justify-start font-medium">
                Quick Links
              </div>

              <ul className="flex items-center flex-col gap-y-3 my-5">
                <li onClick={HideSideBar}>
                  <Link
                    to="/"
                    className="text-md sm:text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li onClick={HideSideBar}>
                  <Link
                    to="/Contact"
                    className="text-md sm:text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
                  >
                    Contact
                  </Link>
                </li>
                <li onClick={HideSideBar}>
                  <Link
                    to="/"
                    className="text-md sm:text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
                  >
                    About
                  </Link>
                </li>
                <li onClick={HideSideBar}>
                  <Link
                    to="/"
                    className="text-md sm:text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>

              <div className="flex justify-center my-10 gap-5">
                <div>
                  <Link to="/CheckOut">
                    <FaRegHeart className="text-xl sideIcons" />
                  </Link>
                </div>
                <div>
                  <Link to="/Cart" className="text-xl">
                    <span className="relative text-xl cursor-pointer">
                      <GrCart className="sideIcons" />
                      {state?.cart?.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-black rounded px-1 py-2 text-xs ">
                          {state?.cart?.length}
                        </span>
                      )}
                    </span>
                  </Link>
                </div>

                <div>
                  <Link to="/MyAccount">
                    <FaRegUser className="text-xl sideIcons " />
                  </Link>
                </div>
              </div>

              <div className="text-black text-xl flex justify-start font-medium">
                Manage Account
              </div>

              <div className="flex flex-col justify-center items-center  gap-y-3  mt-5 ">
                <Link to="/Account" className="flex gap-2 items-center">
                  <TbShoppingBagCheck />{" "}
                  <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
                    {" "}
                    My Orders
                  </span>
                </Link>
                <Link to="/Account" className="flex gap-2 items-center">
                  {" "}
                  <ImCancelCircle />{" "}
                  <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
                    {" "}
                    My Cancellations
                  </span>
                </Link>
                <Link to="/Account" className="flex gap-2 items-center">
                  {" "}
                  <IoStarOutline />{" "}
                  <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
                    {" "}
                    My reviews
                  </span>
                </Link>

                <div>
                  {" "}
                  {state?.isLogin ? (
                    <div className="flex gap-2 items-center hover:text-black">
                      <HiOutlineArrowLeftStartOnRectangle />{" "}
                      <button
                        onClick={logout}
                        className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-gray-700 after:transition-all after:duration-300"
                      >
                        logout
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col items-center mt-5 py-5">
                <p className="text-3xl font-medium ">Exclusive</p>
              </div>

              <div>
                {" "}
                {/* {state?.isLogin ? ( */}
                <div className="flex gap-2 items-center justify-center text-black bg-gray-300 hover:bg-gray-600 hover:text-white p-3 rounded-xl  transition-colors duration-200  after:transition-all after:duration-300">
                  <HiOutlineArrowLeftStartOnRectangle />{" "}
                  <button onClick={logout} className="">
                    logout
                  </button>
                </div>
                {/* ) : null} */}
              </div>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
};
export default Navbar;
