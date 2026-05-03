import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useContext } from "react";
import { GlobalContext } from "../../context/Context";

const MainLayout = () => {

  const {state} = useContext(GlobalContext);
  
  return state?.isLogin ? (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  ) : (
    <div className="flex justify-center items-center main">
      <div className="loading"></div>
    </div>
  );
};

export default MainLayout;
