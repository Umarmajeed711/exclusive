import { Outlet } from "react-router-dom";
import Navbar from "../helper/Navbar";
import Footer from "../helper/Footer";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";
import { VerifyEmailBanner } from "../helper/VerifyBanner";

const MainLayout = () => {

  const {state} = useContext(GlobalContext);
  
  // return state?.isLogin ? (
  //   <>
  //     <Navbar />
  //     <Outlet />
  //     <Footer />
  //   </>
  // ) : (
  //   <div className="flex justify-center items-center main">
  //     <div className="loading"></div>
  //   </div>
  // );

   return  (
    <>
      <Navbar />
        {!state?.user?.email_verified && (
    <VerifyEmailBanner />
  )}
      <Outlet />
      <Footer />
    </>
  ) 
};

export default MainLayout;
