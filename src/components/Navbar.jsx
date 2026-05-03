import { useEffect, useState } from "react";
import { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineClose } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { GlobalContext } from "../context/Context";
import api from "./api";
import { FaRegUser } from "react-icons/fa6";

import { FaRegHeart } from "react-icons/fa";
import { GrCart } from "react-icons/gr";
import { TbShoppingBagCheck } from "react-icons/tb";
import { ImCancelCircle } from "react-icons/im";
import { HiOutlineArrowLeftStartOnRectangle } from "react-icons/hi2";
import { IoLogIn, IoStarOutline } from "react-icons/io5";
import useOutsideClick from "./outSideClick";

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

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const logout = async () => {
    try {
      let user_logout = await api.get("/logout");
      console.log("user logout", user_logout);
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
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

  const menuRef = useOutsideClick(() => {
    setShowDropdown(false); // close when clicked outside
  });

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
              <Link to="/wishlist" className="link">
                <span className="relative text-xl cursor-pointer group transition-all duration-300 ">
                  <FaRegHeart className="text-xl hover:scale-110 transition-all duration-200" />
                  {state?.wishlist?.length > 0 && (
                    <span className="absolute -top-1 -right-1 group-hover:animate-bounce transition-all duration-200   bg-theme-primary text-white rounded px-1  text-xs">
                      {state?.wishlist?.length}
                    </span>
                  )}
                </span>
                {/* <FaRegHeart className="text-xl hover:scale-110 transition-all duration-200" /> */}
              </Link>

              <Link to="/Cart" className="link text-xl">
                <span className="relative text-xl cursor-pointer group transition-all duration-300 ">
                  <GrCart className="text-xl hover:scale-110 transition-all duration-200" />
                  {state?.cart?.length > 0 && (
                    <span className="absolute -top-1 -right-1 group-hover:animate-bounce transition-all duration-200   bg-theme-primary text-white rounded px-1  text-xs">
                      {state?.cart?.length}
                    </span>
                  )}
                </span>
              </Link>

              <div
                className="relative !z-50"
                ref={menuRef}
                // onMouseEnter={() => {
                //   setShowDropdown(true);
                // }}
                // onMouseLeave={() => {
                //   setShowDropdown(false);
                // }}
                onClick={() => {
                  setShowDropdown(!showDropdown);
                }}
              >
                <p className="text-xl cursor-pointer">
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
                        to="/myOrders"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <TbShoppingBagCheck className="text-lg text-gray-500" />
                        <span className="font-medium">My Orders</span>
                      </Link>

                      <Link
                        to="/myOrders"
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

                       {state?.isAdmin && state?.user?.user_role == 1 && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                      >
                        <IoStarOutline className="text-lg text-gray-500" />
                        <span className="font-medium">Admin Panel</span>
                      </Link>
                    )}
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
      </div>

      {show ? (
        <nav className="fixed inset-y-0 scroll-none navbar" id="hideSideBar">
          <div
            className="flex flex-col justify-between h-full px-5 py-6"
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

              <ul className="flex flex-col mb-8">
                {["Home", "Shop", "Contact", "Account"].map((item, idx) => (
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
                <Link to="/wishlist">
                  <span className="relative text-xl cursor-pointer group transition-all duration-300 ">
                    <FaRegHeart className="text-xl hover:scale-110 transition-all duration-200" />
                    {state?.wishlist?.length > 0 && (
                      <span className="absolute -top-1 -right-1 group-hover:animate-bounce transition-all duration-200   bg-theme-primary text-white rounded px-1  text-xs">
                        {state?.wishlist?.length}
                      </span>
                    )}
                  </span>
                  {/* <FaRegHeart className="text-xl text-gray-600 hover:text-black transition" /> */}
                </Link>

                <Link to="/Cart" className="relative">
                  <span className="relative text-xl cursor-pointer group transition-all duration-300 ">
                    <GrCart className="text-xl hover:scale-110 transition-all duration-200" />
                    {state?.cart?.length > 0 && (
                      <span className="absolute -top-1 -right-1 group-hover:animate-bounce transition-all duration-200   bg-theme-primary text-white rounded px-1  text-xs">
                        {state?.cart?.length}
                      </span>
                    )}
                  </span>
                </Link>

                <Link to="/Account">
                  <FaRegUser className="text-xl text-gray-600 hover:text-black transition" />
                </Link>
              </div>

              {/* Manage Account */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Manage Account
              </h3>

              <div className="flex flex-col">
                <Link
                  to="/myOrders"
                  className="flex items-center  !gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <TbShoppingBagCheck className="text-gray-500" />
                  <span className="text-gray-700">My Orders</span>
                </Link>

                <Link
                  to="/myOrders"
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
                {state?.isAdmin && state?.user?.user_role == 1 && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <IoStarOutline className=" text-gray-500" />
                    <span className="text-gray-700">Admin Panel</span>
                  </Link>
                )}
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
              ) : (
                <div className="flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl hover:bg-black transition">
                  <IoLogIn />
                  <Link
                    to="/login"
                    className={({ isActive }) =>
                      `${style.navLink} ${isActive ? style.active : "after:w-0 hover:after:w-full"}`
                    }
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
};
export default Navbar;
