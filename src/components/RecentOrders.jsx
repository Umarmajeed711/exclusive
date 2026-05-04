const orders = [
  { id: 1, name: "Ali", total: "$120", status: "Delivered" },
  { id: 2, name: "Ahmed", total: "$80", status: "Pending" },
  { id: 3, name: "Sara", total: "$200", status: "Shipped" },
];

const RecentOrders = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-semibold mb-4">Recent Orders</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th>ID</th>
            <th>Name</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t">
              <td>#{order.id}</td>
              <td>{order.name}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;