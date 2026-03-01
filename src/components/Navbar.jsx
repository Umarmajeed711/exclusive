import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineClose } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
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

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // cleanup (VERY important)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [show]);

  const style = {
    navLink:
      "text-[18px] hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full active:w-full after:bg-black acitve:bg-black after:transition-all after:duration-300",
    active: "text-black after:w-full",
  };

  return (
    <header className="relative z-[1000]">
      <div className="px-2  lg:px-10 sticky top-0  z-10 bg-white border-b">
        <div className="h-20  w-full  mx-auto px-4  py-4 flex justify-between items-center">
          {/* max-w-7xl */}

          <div className="text-3xl md:text-4xl  lg:text-[50px]  logo font-bold italic">
            Exclusive
          </div>

          <div className="md:hidden">
            <button onClick={showSideBar}>
              {!show ? <GiHamburgerMenu /> : null}
            </button>
          </div>

          <ul className="hidden md:flex space-x-6 text-black font-medium ">
            {/* <li className={style?.navLink}>
              <Link to="/">Home</Link>
            </li>
            <li className={style?.navLink}>
              <Link to="/Shop">Shop</Link>
            </li>
            <li className={style?.navLink}>
              <Link to="/Contact">Contact</Link>
            </li>
            {state?.isLogin ? (
              <>
                <li className={style?.navLink}>
                  <Link to="/Account">My Account</Link>
                </li>
              </>
            ) : (
              <>
                <li className={style?.navLink}>
                  <Link to="/login">Login</Link>
                </li>
                <li className={style?.navLink}>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </>
            )} */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${style.navLink} ${isActive ? style.active : "after:w-0 hover:after:w-full"}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Shop"
                className={({ isActive }) =>
                  `${style.navLink} ${isActive ? style.active : "after:w-0 hover:after:w-full"}`
                }
              >
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Contact"
                className={({ isActive }) =>
                  `${style.navLink} ${isActive ? style.active : "after:w-0 hover:after:w-full"}`
                }
              >
                Contact
              </NavLink>
            </li>
            {state?.isLogin ? (
              <li>
                <NavLink
                  to="/Account"
                  className={({ isActive }) =>
                    `${style.navLink} ${isActive ? style.active : "after:w-0 hover:after:w-full"}`
                  }
                >
                  My Account
                </NavLink>
              </li>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `${style.navLink} ${isActive ? style.active : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/signup"
                    className={({ isActive }) =>
                      `${style.navLink} ${isActive ? style.active : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="hidden md:flex gap-5 items-center">
            {/* search field */}

            {/*<div className='bg-gray-200 py-1 px-3 rounded flex gap-5 items-center'>
              <input type="text" placeholder='what you are looking for?' className='outline-none bg-gray-200' />
              <button className='text-xl'><FiSearch/></button>
           </div> */}

            {/* cart icons */}
            <div className="hidden md:flex  gap-4 items-center">
              <Link to="/CheckOut" className="link">
                <FaRegHeart className="text-xl hover:scale-110 transition-all duration-200" />
              </Link>

              <Link to="/Cart" className="link text-xl">
                <span className="relative text-xl cursor-pointer">
                  <GrCart className="text-xl hover:scale-110 transition-all duration-200" />
                  {state?.cart?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded px-1  text-xs">
                      {state?.cart?.length}
                    </span>
                  )}
                </span>
              </Link>

              {/* <div
                className="relative !z-50"
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
                  <div className="absolute right-0  p-3 w-52 rounded Dropdown flex flex-col gap-1 !z-50">
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
              </div> */}
              <div
                className="relative !z-50"
                onMouseEnter={() => {
                  setShowDropdown(true);
                }}
                onMouseLeave={() => {
                  setShowDropdown(false);
                }}
              >
                <p className="text-xl">
                  <FaRegUser />
                </p>

                {showDropdown ? (
                  <div className="absolute right-0 mt-1 w-56 rounded-xl bg-white shadow-xl border border-gray-100 !z-50 overflow-hidden">
                    {/* Menu items */}
                    <div className="flex flex-col py-2">
                      <Link
                        to="/Account"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <FaRegUser className="text-lg text-gray-500" />
                        <span className="font-medium">Manage My Account</span>
                      </Link>

                      <Link
                        to="/Account"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <TbShoppingBagCheck className="text-lg text-gray-500" />
                        <span className="font-medium">My Orders</span>
                      </Link>

                      <Link
                        to="/Account"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <ImCancelCircle className="text-lg text-gray-500" />
                        <span className="font-medium">My Cancellations</span>
                      </Link>

                      <Link
                        to="/Account"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <IoStarOutline className="text-lg text-gray-500" />
                        <span className="font-medium">My Reviews</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100" />

                    {/* Logout */}
                    {state?.isLogin ? (
                      <div className="px-4 py-2">
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 w-full px-2 py-2 rounded-md transition"
                        >
                          <HiOutlineArrowLeftStartOnRectangle className="text-lg" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {/* md:hidden navbar px-4 pt-2 pb-4 shadow-md  bg-white sticky top-0  */}
      </div>

      {show ? (
        // <nav className="navbar" id="hideSideBar">
        //   <div className="flex flex-col  justify-between  h-screen p-3">
        //     <div className="md:hidden">
        //       <button onClick={HideSideBar}>
        //         <MdOutlineClose className="text-2xl font-bold hover:text-red-500 mt-4" />
        //       </button>
        //     </div>

        //     <div className="flex flex-col  gay-y-10 pl-0 ">
        //       <div className="text-black text-xl flex justify-start font-medium">
        //         Quick Links
        //       </div>

        //       <ul className="flex items-center flex-col gap-y-3 my-5">
        //         <li onClick={HideSideBar}>
        //           <Link
        //             to="/"
        //             className="text-md sm:text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
        //           >
        //             Home
        //           </Link>
        //         </li>
        //         <li onClick={HideSideBar}>
        //           <Link
        //             to="/Contact"
        //             className="text-md sm:text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
        //           >
        //             Contact
        //           </Link>
        //         </li>
        //         <li onClick={HideSideBar}>
        //           <Link
        //             to="/"
        //             className="text-md sm:text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
        //           >
        //             About
        //           </Link>
        //         </li>
        //         <li onClick={HideSideBar}>
        //           <Link
        //             to="/"
        //             className="text-md sm:text-xl hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
        //           >
        //             Sign Up
        //           </Link>
        //         </li>
        //       </ul>

        //       <div className="flex justify-center my-10 gap-5">
        //         <div>
        //           <Link to="/CheckOut">
        //             <FaRegHeart className="text-xl sideIcons" />
        //           </Link>
        //         </div>
        //         <div>
        //           <Link to="/Cart" className="text-xl">
        //             <span className="relative text-xl cursor-pointer">
        //               <GrCart className="sideIcons" />
        //               {state?.cart?.length > 0 && (
        //                 <span className="absolute -top-1 -right-1 bg-red-500 text-black rounded px-1 py-2 text-xs ">
        //                   {state?.cart?.length}
        //                 </span>
        //               )}
        //             </span>
        //           </Link>
        //         </div>

        //         <div>
        //           <Link to="/MyAccount">
        //             <FaRegUser className="text-xl sideIcons " />
        //           </Link>
        //         </div>
        //       </div>

        //       <div className="text-black text-xl flex justify-start font-medium">
        //         Manage Account
        //       </div>

        //       <div className="flex flex-col justify-center items-center  gap-y-3  mt-5 ">
        //         <Link to="/Account" className="flex gap-2 items-center">
        //           <TbShoppingBagCheck />{" "}
        //           <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
        //             {" "}
        //             My Orders
        //           </span>
        //         </Link>
        //         <Link to="/Account" className="flex gap-2 items-center">
        //           {" "}
        //           <ImCancelCircle />{" "}
        //           <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
        //             {" "}
        //             My Cancellations
        //           </span>
        //         </Link>
        //         <Link to="/Account" className="flex gap-2 items-center">
        //           {" "}
        //           <IoStarOutline />{" "}
        //           <span className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
        //             {" "}
        //             My reviews
        //           </span>
        //         </Link>

        //         <div>
        //           {" "}
        //           {state?.isLogin ? (
        //             <div className="flex gap-2 items-center hover:text-black">
        //               <HiOutlineArrowLeftStartOnRectangle />{" "}
        //               <button
        //                 onClick={logout}
        //                 className=" hover:text-black transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-gray-700 after:transition-all after:duration-300"
        //               >
        //                 logout
        //               </button>
        //             </div>
        //           ) : null}
        //         </div>
        //       </div>
        //     </div>

        //     <div>
        //       <div className="flex flex-col items-center mt-5 py-5">
        //         <p className="text-3xl font-medium ">Exclusive</p>
        //       </div>

        //       <div>
        //         {" "}
        //         {/* {state?.isLogin ? ( */}
        //         <div className="flex gap-2 items-center justify-center text-black bg-gray-300 hover:bg-gray-600 hover:text-white p-3 rounded-xl  transition-colors duration-200  after:transition-all after:duration-300">
        //           <HiOutlineArrowLeftStartOnRectangle />{" "}
        //           <button onClick={logout} className="">
        //             logout
        //           </button>
        //         </div>
        //         {/* ) : null} */}
        //       </div>
        //     </div>
        //   </div>
        // </nav>
        <nav className="fixed inset-y-0  navbar" id="hideSideBar">
          <div
            className="flex flex-col justify-between h-screen px-5 py-6"
            onClick={() => {
              setTimeout(() => {
                HideSideBar();
              }, 200);
            }}
          >
            {/* Top Section */}
            <div>
              {/* Close button */}
              <div className="md:hidden mb-6 left-0">
                <button onClick={HideSideBar}>
                  <MdOutlineClose className="text-2xl hover:text-red-500 transition" />
                </button>
              </div>

              {/* Quick Links */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Links
              </h3>

              <ul className="flex flex-col gap-3 mb-8">
                {["Home", "Contact", "About", "Sign Up"].map((item, idx) => (
                  <li
                    key={idx}
                    //  onClick={HideSideBar}
                  >
                    <Link
                      to={item === "Home" ? "/" : `/${item.replace(" ", "")}`}
                      className="block rounded-lg px-3 py-2 text-base text-gray-700 hover:bg-gray-100 hover:text-black transition"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Icons */}
              <div className="flex justify-around py-4 border-t border-b border-gray-100 mb-6">
                <Link to="/CheckOut">
                  <FaRegHeart className="text-xl text-gray-600 hover:text-black transition" />
                </Link>

                <Link to="/Cart" className="relative">
                  <GrCart className="text-xl text-gray-600 hover:text-black transition" />
                  {state?.cart?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                      {state?.cart?.length}
                    </span>
                  )}
                </Link>

                <Link to="/MyAccount">
                  <FaRegUser className="text-xl text-gray-600 hover:text-black transition" />
                </Link>
              </div>

              {/* Manage Account */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Manage Account
              </h3>

              <div className="flex flex-col gap-2">
                <Link
                  to="/Account"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <TbShoppingBagCheck className="text-gray-500" />
                  <span className="text-gray-700">My Orders</span>
                </Link>

                <Link
                  to="/Account"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <ImCancelCircle className="text-gray-500" />
                  <span className="text-gray-700">My Cancellations</span>
                </Link>

                <Link
                  to="/Account"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <IoStarOutline className="text-gray-500" />
                  <span className="text-gray-700">My Reviews</span>
                </Link>

                {/* {state?.isLogin ? (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition">
            <HiOutlineArrowLeftStartOnRectangle />
            <button onClick={logout}>Logout</button>
          </div>
        ) : null} */}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-6 border-t border-gray-100">
              <p className="text-center text-2xl font-semibold mb-4">
                Exclusive
              </p>
              {state?.isLogin ? (
                <div className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-black transition">
                  <HiOutlineArrowLeftStartOnRectangle />
                  <button onClick={logout}>Logout</button>
                </div>
              ) : null}
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
};
export default Navbar;
