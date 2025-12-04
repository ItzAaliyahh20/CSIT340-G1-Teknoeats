import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/sidebar'
import { X } from 'lucide-react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setIsLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      if (!user.id) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchOrders();
}, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active")
      return order.status === "ready" || order.status === "pending" || order.status === "preparing";
    if (activeTab === "Past") return order.status === "delivered";
    return true;
  });

  const getStatusDisplay = (status) => {
    if (status === "ready") return "Order is ready for delivery";
    if (status === "delivered") return "Order has been delivered";
    if (status === "preparing") return "Order is being prepared";
    return "Order pending";
  };

  const getActionButton = (status) => {
    if (status === "delivered") return "Reorder";
    return "View Order";
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar
          categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]}
          selectedItem='orders'
          onSelectCategory={(category) => navigate('/home?category=' + category)}
        />
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
      <Sidebar
        categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]}
        selectedItem='orders'
        onSelectCategory={(category) => navigate('/home?category=' + category)}
      />
      <div className="ml-[250px]">
        <div className="bg-[#FFD700] px-10 py-12 shadow-lg"></div>
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
                    ? "bg-white text-[#8B3A3A] border-2 border-[#8B3A3A]"
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
                <div
                  key={order.id}
                  className="bg-white rounded-lg border-2 border-[#8B3A3A] p-6"
                >
                  <h3 className="text-center font-bold text-[#8B3A3A] mb-4">
                    {getStatusDisplay(order.status)}
                  </h3>
                  <div className="border-b border-gray-300 pb-3 mb-4">
                    <p className="font-bold text-[#8B3A3A]">ID: #{order.id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/restaurant2.svg"
                        alt="Restaurant"
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="text-sm text-gray-600">Pickup at:</p>
                        <p className="font-bold text-gray-800">{order.restaurant}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="bg-[#FFD700] text-[#8B3A3A] px-6 py-2 rounded font-bold hover:opacity-90 transition"
                    >
                      {getActionButton(order.status)}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <X size={28} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="font-mono font-bold">#{selectedOrder.id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="font-semibold">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-semibold">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pickup Time</p>
                  <p className="font-semibold">{selectedOrder.pickupTime}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm text-gray-600 mb-3 font-semibold">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">x{item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-red-600">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-xl font-bold">Total Amount</p>
                  <p className="text-2xl font-bold text-[#8B3A3A]">
                    ₱{selectedOrder.total?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}