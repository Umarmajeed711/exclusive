import api from "./api";
import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";

// const cards = [
//   {
//     title: "Total Revenue",
//     value: "$12,500",
//     change: "+12.5%",
//     isIncrease: true,
//     icon: DollarSign,
//   },
//   {
//     title: "Orders",
//     value: "320",
//     change: "+8.2%",
//     isIncrease: true,
//     icon: ShoppingCart,
//   },
//   {
//     title: "Users",
//     value: "1,200",
//     change: "-3.1%",
//     isIncrease: false,
//     icon: Users,
//   },
//   {
//     title: "Products",
//     value: "85",
//     change: "+2.4%",
//     isIncrease: true,
//     icon: Package,
//   },
// ];


const iconMap = {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
};

const CardSkeleton = ({key=""}) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse" key={key}>
  {/* Top */}
  <div className="flex justify-between items-center mb-4">
    <div className="h-4 w-24 bg-gray-200 rounded"></div>

    <div className="bg-gray-100 p-2 rounded-lg">
      <div className="h-5 w-5 bg-gray-200 rounded"></div>
    </div>
  </div>

  {/* Value */}
  <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>

  {/* Growth */}
  {/* <div className="flex items-center gap-2 mb-3">
    <div className="h-4 w-16 bg-gray-200 rounded"></div>
    <div className="h-3 w-20 bg-gray-100 rounded"></div>
  </div> */}

  {/* Progress Bar */}
  {/* <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
    <div className="h-full w-2/3 bg-gray-200 rounded-full"></div>
  </div> */}
</div>
  )
}

const DashboardCards = () => {



  const [cards,setCards] = useState([]);
  const [cardsLoading,setCardsLoading] = useState(false);

  const getCards = async () => {
    setCardsLoading(true);
  try {
    let response = await api("/dashboard-cards");

    response = response?.data?.data;

    setCards(response);

    console.log("response", response);
    
    
  } catch (error) {
    
  }
  finally{
    setCardsLoading(false);
  }

}

useEffect(() => {
  getCards();

},[])



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

      {
        cardsLoading ? 

        [1,2,3,4].map((i) => {
          return (

        <CardSkeleton key={i} />

          )
        })
          :
          cards?.map((card, i) => {
    
            const Icon = iconMap[card.icon];
    
            return (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                {/* Top */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-gray-500">{card.title}</p>
    
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Icon size={18} className="text-gray-700" />
                  </div>
                </div>
    
                {/* Value */}
                <h2 className="text-2xl font-bold text-gray-900">
                  {card.value}
                </h2>
    
                {/* Growth */}
                {/* <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      card.isIncrease ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {card.change}
                  </span>
    
                  <span className="text-xs text-gray-400">
                    vs last week
                  </span>
                </div> */}
    
                {/* Small progress bar */}
                {/* <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      card.isIncrease ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        Math.abs(parseFloat(card.change)),
                        100
                      )}%`,
                    }}
                  ></div>
                </div> */}
              </div>
            );
          })

      }
    </div>
  );
};

export default DashboardCards;