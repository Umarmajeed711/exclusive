import { RiDeleteBin6Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import { div } from "framer-motion/client";
import { Link } from "react-router";
import { FaGreaterThan } from "react-icons/fa";
import { PiGreaterThan } from "react-icons/pi";
import { GlobalContext } from "../../context/Context";
import moment from "moment";

import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import api from "../../components/api";
import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";

// Bar chart data
const BarChartData = [
  {
    name: "Jan",
    sales: 2700,
  },
  {
    name: "Feb",
    sales: 3000,
  },
  {
    name: "Mar",
    sales: 3200,
  },
  {
    name: "Apr",
    sales: 2800,
  },

  {
    name: "May",
    sales: 4100,
  },
  {
    name: "June",
    sales: 3600,
  },
  {
    name: "July",
    sales: 3400,
  },
  {
    name: "Aug",
    sales: 4200,
  },
  {
    name: "Sep",
    sales: 3650,
  },
];

// chart data:
const data = [
  { name: "Group A", value: 2140 },
  { name: "Group B", value: 1500 },
  { name: "Group C", value: 640 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const Dash = () => {
  let {state, dispatch } = useContext(GlobalContext);
  const [Orders, setOrders] = useState([]);
  const [CustomerDetail, setCustomerDetail] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [loading,setLoading] = useState(false)

  const getAllOrders = async () => {
    try {
      setLoading(true)
      let Orders = await api.get("/orders");

      console.log("ORders", Orders);
      setOrders(Orders.data.OrderItems);
      setCustomerDetail(Orders.data.CustomerData);
    } catch (error) {}
    finally{
      setLoading(false);

  }

  }
  useEffect(() => {
    getAllOrders();
  }, [toggle]);

  const [total, setTotal] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);

  useEffect(() => {
    let calculatedTotal = 0;
    let calculatedEarnedAmount = 0;

    CustomerDetail?.forEach((product) => {
      calculatedTotal += Number(product.total_price);

      let paidAmount =
        product.payment_status == "paid" ? Number(product.total_price) : 0;
      calculatedEarnedAmount += paidAmount;
    });

    setTotal(calculatedTotal);
    setTotalEarned(calculatedEarnedAmount);
  }, [CustomerDetail]);

  // delete product
  const deleteProduct = async (id) => {
    try {
      let deleteOrder = await api.delete(`/order/${id}`);

      setToggle(!toggle);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Delete Product",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-themeColor">
      <div className="container mx-auto px-2 sm:px-4  ">
        <div className="grid grid-cols-3 gap-y-3 md:gap-10 py-5">
          <div className="flex justify-between  items-center border col-span-3 md:col-span-1 bg-white p-4 rounded shadow">
            <div className="flex flex-col">
              <p className="text-[#0088FE] text-xl font-bold ">
                {CustomerDetail?.length}
              </p>
              <p>ORDERED RECIEVED</p>
            </div>

            <div>
              <img src={"/right.png"} alt="" className="h-10 w-10" />
            </div>
          </div>

          <div className="flex justify-between items-center border col-span-3 md:col-span-1  bg-white p-4 rounded shadow">
            <div className="flex flex-col">
              <p className="text-[#0088FE] text-xl font-bold ">
                ${total.toFixed(2)}
              </p>
              <p>TOTAL CHARGES</p>
            </div>

            <div>
              <img src={"/right.png"} alt="" className="h-10 w-10" />
            </div>
          </div>

          <div className="flex justify-between items-center border col-span-3 md:col-span-1  bg-white p-4 rounded shadow">
            <div className="flex flex-col">
              <p className="text-[#0088FE] text-xl font-bold ">
                ${totalEarned.toFixed(2)}
              </p>
              <p>TOTAL EARNED</p>
            </div>

            <div>
              <img src={"/right.png"} alt="" className="h-10 w-10" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-10 py-5">
          <div className="col-span-3 sm:col-span-2  h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={BarChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                barSize={20}
              >
                <XAxis
                  dataKey="name"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar
                  dataKey="sales"
                  fill=" #51a0e6"
                  background={{ fill: "#eee" }}
                />
              </BarChart>
              {/* #8884d8 */}
              {/* #0088FE */}
            </ResponsiveContainer>
          </div>
          <div className="col-span-3 sm:col-span-1 border shadow-lg h-[350px] w-full  flex flex-col justify-center items-center">
            <ResponsiveContainer width="100%" height="50%">
              <PieChart width={400}>
                <Pie
                  data={data}
                  innerRadius={55}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {/* {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))} */}
                  {data?.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap justify-center items-center gap-5 mt-10">
              <div className="flex  gap-1 items-center">
                <span className="bg-[#0088FE] rounded-full  h-[20px] w-[20px]"></span>
                <span>Orders</span>
              </div>

              <div className="flex gap-1 items-center">
                <span className="bg-[#00C49F] rounded-full  h-[20px] w-[20px]"></span>
                <span>Delivered</span>
              </div>

              <div className="flex gap-1 items-center">
                <span className="bg-[#FFBB28] rounded-full  h-[20px] w-[20px]"></span>
                <span>Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="py-5">
          <div className="w-full flex justigy-center items-center ">

             {loading ? (
                <div className="flex justify-center items-center w-full h-[50vh]">
       
          
          <div className="loading"></div>
        

          
        </div>
      ) : (CustomerDetail.length  === 0)  ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="text-md sm:text-xl font-medium text-red-500 drop-shadow">
            Products not found!
          </div>
        </div>
      ) : (

            <table className=" overflow-auto border   border-separate shadow-xl my-5 p-2">
              <thead className="h-16 bg-slate-200 text-xl">
                <tr className="">
                  <th className="p-2">No.</th>
                  <th className="">Products</th>
                  <th>Customers</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Payment Status</th>
                  <th>Payment Method</th>
                  <th>Delivery Status</th>
                  <th>Delivery Date</th>
                  <th>Action</th>
                </tr>
              </thead>

             
             
                <tbody className="border border-[#ddd]  ">
                  {CustomerDetail?.map((Customer, i) => {
                    return (
                      <tr
                        key={i}
                        className="bg-slate-100  border border-[#ddd]  h-14  text-md text-gray-600"
                      >
                        <td className="  text-center">{Number(i + 1)}.</td>
                        <td className="p-1 flex flex-col items-center justify-center">
                          {Orders?.map((order, i) => {
                            return (
                              <>
                                {order?.order_id == Customer?.order_id ? (
                                  <div>
                                    <img
                                      src={order?.image_url}
                                      className="h-12 w-12"
                                      alt=""
                                    />

                                    {/* {order?.product_name} */}
                                  </div>
                                ) : null}
                              </>
                            );
                          })}
                        </td>
                        <td className="p-1 ">{Customer?.shipping_name}</td>
                        <td className="p-1 ">{Customer?.shipping_address}</td>
                        <td className="p-1 ">{Customer.shipping_phone}</td>
                        <td className="p-1  text-center">
                          <span
                            className={`${
                              Customer.payment_status == "pending"
                                ? "bg-[#fadab0] text-[#e8a20b]"
                                : " bg-[#a0e9db] text-[#00C49F]"
                            } px-2 py-1 rounded-full text-center `}
                          >
                            {Customer.payment_status}
                          </span>{" "}
                        </td>

                        <td className="p-1  text-center">
                          {/* <span className={`${Customer.payment_method == "online" ? 'bg-[#28fff8]':' bg-[#90eb35]' } p-1 rounded `}>
                            
                          </span>{" "} */}
                          {Customer.payment_method}
                        </td>
                        <td className="p-1  text-center">
                          <span
                            className={`${
                              Customer.delivery_status == "pending"
                                ? "bg-[#fadab0] text-[#e8a20b]"
                                : " bg-[#a0e9db] text-[#00C49F]"
                            } px-2 py-1 rounded-full text-center `}
                          >
                            {/* <span className={`${Customer.delivery_status == "pending" ? 'bg-[#ffc068]':' bg-[#00C49F]' } px-2 py-1 rounded-full text-center `}> */}
                            {Customer.delivery_status}
                          </span>{" "}
                        </td>
                        <td className="p-1 ">
                          {/* {Customer.order_date} */}
                          {moment(
                            Customer.order_date,
                            "YYYY-MM-DD hh:mm"
                          ).format("DD-MMM-YYYY")}
                        </td>
                        <td className="p-1  flex items-center justify-center h-full">
                          <p>
                            <RiDeleteBin6Fill
                              className="text-red-500 cursor-pointer text-xl sm:text-2xl  "
                              onClick={() => {
                                Swal.fire({
                                  title: "Do you want delete this product?",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonText: "Delete",
                                }).then((result) => {
                                  /* Read more about isConfirmed, isDenied below */
                                  if (result.isConfirmed) {
                                    deleteProduct(Customer?.order_id);
                                    // Swal.fire("Saved!", "", "success");
                                  }
                                });
                              }}
                            />
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              
            </table>
)}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dash;
