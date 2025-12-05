import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from '../components/sidebar'
import { Search, Clock, Apple, X } from "lucide-react"
import { motion } from "framer-motion"
import { getCurrentUser, getOrders } from '../services/api'


export default function OrdersPage() {
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = useSearchParams();
   const [activeTab, setActiveTab] = useState("All Orders");
   const [orders, setOrders] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [user, setUser] = useState(null);
   const [currentTime, setCurrentTime] = useState(new Date());
   const [ripples, setRipples] = useState({});
   const [showDetailsModal, setShowDetailsModal] = useState(false);
   const [selectedOrder] = useState(null);

   // Use URL search parameter for search query to persist across pages
   const searchQuery = searchParams.get('search') || ""
   const setSearchQuery = (query) => {
     const newSearchParams = new URLSearchParams(searchParams)
     if (query) {
       newSearchParams.set('search', query)
     } else {
       newSearchParams.delete('search')
     }
     setSearchParams(newSearchParams)
   }

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.id) {
          const userOrders = await getOrders(currentUser.id);
          const sortedOrders = userOrders.sort((a, b) => parseInt(b.id) - parseInt(a.id)); // newest first
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All Orders") return true;
    if (activeTab === "Pending") return order.status === "pending";
    if (activeTab === "Ready") return order.status === "ready";
    if (activeTab === "Delivered") return order.status === "delivered";
    return true;
  }).filter((order) =>
    searchQuery === "" ||
    order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    (order.items && order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getActionButton = (status) => {
    if (status === "delivered") return "Reorder Items";
    return "View Order";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'ready': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleContinueShopping = (e) => {
    navigate('/home?category=Dashboard')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar
          categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]}
          selectedItem='orders'
          onSelectCategory={(category) => navigate('/home?category=' + category)}
        />
        <div className="ml-[250px]">
          <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] px-8 py-6 shadow-lg flex justify-between items-center relative">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-0">
                <Clock className="text-[#8B3A3A]" size={24} strokeWidth={3} />
                <p className="text-[#8B3A3A] font-bold text-2xl" style={{ fontFamily: 'Marykate' }}>
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
              <p className="text-gray-600 font-bold text-sm">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Looking for something?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 pl-12 rounded-full bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] shadow-md"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} strokeWidth={2} />
              </div>
            </div>
          </div>
          <main className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <img
                src="/teknoeats-loading.png"
                alt="Loading"
                className="w-20 h-20 animate-pulse"
              />
              <p className="text-center text-lg">Just a wild second...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='orders' onSelectCategory={(category) => {
        const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
        navigate(`/home?category=${category}${searchParam}`);
      }} />
      <div className="ml-[250px]">
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] px-8 py-6 shadow-lg flex justify-between items-center relative">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-0">
              <Clock className="text-[#8B3A3A]" size={24} strokeWidth={3} />
              <p className="text-[#8B3A3A] font-bold text-2xl" style={{ fontFamily: 'Marykate' }}>
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </p>
            </div>
            <p className="text-gray-600 font-bold text-sm">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Looking for something?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 rounded-full bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] shadow-md"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} strokeWidth={2} />
            </div>
          </div>

          {user && (
            <div className="text-right flex items-center justify-end">
              <div>
                <p className="text-[#8B3A3A] font-bold text-2xl mb-0"><span style={{ fontFamily: 'Marykate' }}>Welcome,</span> <span style={{ fontFamily: 'Marykate' }}>{(user.firstName || user.email).toUpperCase()}</span>!</p>
                <p className="text-gray-600 font-bold text-sm">{user.email}</p>
              </div>
              <div className="ml-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:border-2 hover:border-[#8B3A3A] transition cursor-pointer" onClick={() => navigate('/profile')}>
                <span className="text-[#8B3A3A] font-bold text-lg" style={{ fontFamily: 'Marykate' }}>
                  {(user.firstName?.[0] || '').toUpperCase()}{(user.lastName?.[0] || '').toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
        <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-bold text-white text-center py-3 mb-6 rounded" style={{
          background: 'linear-gradient(to right, #8B3A3A, #FFC107, #8B3A3A)',
          fontFamily: 'Marykate',
          boxShadow: 'inset 0 0 20px rgba(139, 58, 58, 0.06)',
          textShadow: '0 0 10px rgba(216, 5, 5, 0.4)'
        }}>
          MY ORDERS
        </h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          {["All Orders", "Pending", "Ready", "Delivered"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                activeTab === tab
                  ? "bg-[#8B3A3A] text-white"
                  : "bg-gray-100 text-[#8B3A3A] border-2 border-[#8B3A3A] hover:bg-white"
              }`}
              style={{ fontSize: '16px' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <div className="text-center space-y-4 py-12">
            <Apple size={64} strokeWidth={1.1} className="text-gray-400 mb-4 mx-auto animate-pulse" />
            <p className="text-gray-600 text-lg">No orders found. Start your food journey!</p>

            <motion.button
              onClick={handleContinueShopping}
              className="mt-4 bg-[#8B3A3A] text-white px-6 py-2 text-lg rounded font-bold hover:bg-[#6B2A2A] transition relative overflow-hidden"
            >
              Continue Shopping
            </motion.button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 flex items-center">

                {/* SECTION 1: IMAGE */}
                <img
                  src={order.items && order.items[0] ? order.items[0].image : "/placeholder.svg"}
                  alt="Order item"
                  className="w-20 h-20 object-cover rounded mr-6"
                />

                {/* SECTION 2: MIDDLE CONTENT (Tag + Text) */}
                <div className="flex-1 flex flex-col justify-center">

                  {/* The Tag and Date - Aligned Left, above the text */}
                  <div className="mb-1 flex items-center gap-2">
                    <span className={`flex items-center gap-3 px-3 py-1 rounded-full text-white text-sm font-bold ${
                      order.status === 'ready' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      order.status === 'pending' ? 'bg-gradient-to-r from-gray-500 to-gray-400' :
                      'bg-gradient-to-br from-[#8b3a3a33] to-[#8B3A3A]'
                    }`}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-base text-gray-600 ml-1">|</span>
                    <p className="text-base text-gray-600" style={{ fontFamily: 'Marykate' }}>
                      {order.status === 'delivered' ? `DELIVERED ON ${order.date.toUpperCase()}` : `ORDERED ON ${order.date.toUpperCase()}`}
                    </p>
                  </div>

                  {/* The Text Details */}
                  <div>
                    <p className="font-bold text-lg text-black mb-0">Order ID: {order.id}</p>
                    <p className="text-gray-600">
                      <span className="text-sm font-semibold text-[#8B3A3A]" >PHP {order.total ? order.total.toFixed(2) : '0.00'}</span>
                      <span className="text-black ml-2">•</span>
                      <span className="text-base ml-2" style={{ fontFamily: 'Marykate' }}>
                        {order.items && order.items.length > 0 ?
                          order.items.length <= 4 ?
                            order.items.map(item => item.name.toUpperCase()).join(' | ') :
                            `${order.items.slice(0, 4).map(item => item.name.toUpperCase()).join(' | ')} & ${order.items.length - 4} ${order.items.length - 4 === 1 ? 'MORE ITEM' : 'MORE ITEMS'}`
                          : 'No items'
                        }
                      </span>
                    </p>
                  </div>
                </div>

                {/* SECTION 3: BUTTON (Far Right, Vertically Centered) */}
                <div className="ml-4">
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      const rippleId = Date.now()
                      setRipples(prev => ({ ...prev, [order.id]: [...(prev[order.id] || []), { id: rippleId, x, y }] }))
                      setTimeout(() => setRipples(prev => ({ ...prev, [order.id]: (prev[order.id] || []).filter(r => r.id !== rippleId) })), 600)
                      order.status === 'delivered' ? navigate('/cart?reorder=' + order.id) : navigate('/cart?viewOrder=' + order.id)
                    }}
                    className="bg-[#FFD700] text-[#8B3A3A] px-6 py-3 text-lg rounded font-bold hover:opacity-90 hover:scale-105 transition-all shadow-sm whitespace-nowrap relative overflow-hidden"
                  >
                    <span className="relative z-10">{getActionButton(order.status)}</span>
                    {(ripples[order.id] || []).map((ripple) => (
                      <motion.span
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.3 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full bg-yellow-200 pointer-events-none z-0"
                        style={{
                          left: ripple.x - 15,
                          top: ripple.y - 15,
                          width: 30,
                          height: 30,
                        }}
                      />
                    ))}
                  </button>
                </div>

              </motion.div>
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

