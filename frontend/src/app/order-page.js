import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/sidebar'
import { ChevronLeft } from "lucide-react";
import { Search } from "lucide-react"

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    setIsLoading(false);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return order.status === "ready" || order.status === "pending";
    if (activeTab === "Past") return order.status === "delivered";
    return true;
  });

  const getStatusDisplay = (status) => {
    if (status === "ready") return "Order is ready for delivery";
    if (status === "delivered") return "Order has been delivered";
    return "Order pending";
  };

  const getActionButton = (status) => {
    if (status === "delivered") return "Reorder";
    return "View Order";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='orders' onSelectCategory={(category) => navigate('/home?category=' + category)} />
        <div className="ml-[250px]">
          <main className="max-w-4xl mx-auto px-4 py-8">
            <p className="text-center">Loading orders...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='orders' onSelectCategory={(category) => navigate('/home?category=' + category)} />
      <div className="ml-[250px]">
        <div className="bg-[#FFD700] px-8 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="What are you craving for?"
              className="w-full px-4 py-2 pl-10 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} strokeWidth={3} />
          </div>
        </div>
        <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#8B3A3A] text-center mb-8">My Orders</h1>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 justify-center pb-4 border-b border-gray-300">
          {["All", "Active", "Past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-bold transition ${
                activeTab === tab
                  ? "bg-white text-[#8B3A3A] border-2 border-gray-300"
                  : "text-[#8B3A3A] hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-600 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg border-2 border-[#8B3A3A] p-6">
                <h3 className="text-center font-bold text-[#8B3A3A] mb-4">
                  {getStatusDisplay(order.status)}
                </h3>

                <div className="border-b border-gray-300 pb-3 mb-4">
                  <p className="font-bold text-[#8B3A3A]">ID: {order.id}</p>
                  <p className="text-sm text-gray-600">{order.date}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/cozy-italian-restaurant.png"
                      alt="Restaurant"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Pickup at:</p>
                      <p className="font-bold text-gray-800">{order.restaurant}</p>
                    </div>
                  </div>
                  <button className="bg-[#FFD700] text-[#8B3A3A] px-6 py-2 rounded font-bold hover:opacity-90 transition">
                    {getActionButton(order.status)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </main>
      </div>
    </div>
  );
}
