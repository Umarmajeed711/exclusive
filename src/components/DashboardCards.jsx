import { ShoppingCart, Users, DollarSign, Package } from "lucide-react";

const cards = [
  {
    title: "Total Revenue",
    value: "$12,500",
    change: "+12.5%",
    isIncrease: true,
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "320",
    change: "+8.2%",
    isIncrease: true,
    icon: ShoppingCart,
  },
  {
    title: "Users",
    value: "1,200",
    change: "-3.1%",
    isIncrease: false,
    icon: Users,
  },
  {
    title: "Products",
    value: "85",
    change: "+2.4%",
    isIncrease: true,
    icon: Package,
  },
];

const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => {
        const Icon = card.icon;

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
            <div className="mt-2 flex items-center gap-2">
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
            </div>

            {/* Small progress bar */}
            <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;