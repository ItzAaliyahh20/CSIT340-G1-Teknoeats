import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  ChefHat,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { getActiveOrders, updateCanteenOrderStatus, getCanteenStats } from '../../services/api';

// Add fade-in animation styles
const fadeInStyle = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = fadeInStyle;
  document.head.appendChild(styleSheet);
}
export default function CanteenDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    completedToday: 0,
    revenueToday: 0
  });

  useEffect(() => {
    loadOrders();
    // Refresh every 30 seconds
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      console.log('CANTEEN DASHBOARD: Loading orders and stats from API');

      // Load orders and stats in parallel
      const [activeOrders, canteenStats] = await Promise.all([
        getActiveOrders(),
        getCanteenStats()
      ]);

      console.log('CANTEEN DASHBOARD: Orders from API:', activeOrders);
      console.log('CANTEEN DASHBOARD: Stats from API:', canteenStats);

      setOrders(activeOrders);

      // Use stats from backend instead of calculating locally
      setStats({
        pendingOrders: canteenStats.pendingOrders || 0,
        preparingOrders: canteenStats.preparingOrders || 0,
        readyOrders: canteenStats.readyOrders || 0,
        completedToday: canteenStats.completedToday || 0,
        revenueToday: canteenStats.revenueToday || 0
      });

      console.log('CANTEEN DASHBOARD: Updated stats:', stats);
    } catch (error) {
      console.error('CANTEEN DASHBOARD: Error loading orders/stats from API:', error);
      // Fallback to empty array on error
      setOrders([]);
      setStats({
        pendingOrders: 0,
        preparingOrders: 0,
        readyOrders: 0,
        completedToday: 0,
        revenueToday: 0
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('CANTEEN DASHBOARD: Updating order status via API', { orderId, newStatus });
      const updatedOrder = await updateCanteenOrderStatus(orderId, newStatus);
      console.log('CANTEEN DASHBOARD: Order updated via API:', updatedOrder);

      // Update the orders state with the updated order
      const updatedOrders = orders.map(order =>
        order.id === orderId ? updatedOrder : order
      );
      setOrders(updatedOrders);
      console.log('CANTEEN DASHBOARD: Updated orders state:', updatedOrders);

      // Refresh stats after update
      loadOrders();
    } catch (error) {
      console.error('CANTEEN DASHBOARD: Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'border-yellow-400 bg-yellow-50';
      case 'preparing':
        return 'border-blue-400 bg-blue-50';
      case 'ready':
        return 'border-green-400 bg-green-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-lg p-6 shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-sm font-medium mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={color} size={40} />
      </div>
    </div>
  );

  // Get active orders (not delivered)
  const activeOrders = orders.filter(o => o.status !== 'delivered');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B3A3A] via-[#A04444] to-[#8B3A3A] text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm">
              <ChefHat size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-wide">Canteen Dashboard</h1>
              <p className="text-sm text-gray-100 opacity-90">Order Management & Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-gray-100">Last updated</p>
              <p className="text-lg font-semibold">{new Date().toLocaleTimeString()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-[#8B3A3A] px-5 py-2.5 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12"></div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <span className="text-2xl">👋</span>
                Welcome, Canteen Personnel
              </h2>
              <p className="text-gray-600 text-lg">
                Manage incoming orders and update their status efficiently
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                🟢 System Online
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Active Orders</p>
                <p className="text-2xl font-bold text-[#8B3A3A]">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-700 text-sm font-medium mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-800">{stats.pendingOrders}</p>
                <p className="text-xs text-yellow-600 mt-1">Awaiting preparation</p>
              </div>
              <div className="bg-yellow-200 p-3 rounded-full">
                <AlertCircle className="text-yellow-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium mb-1">Preparing</p>
                <p className="text-3xl font-bold text-blue-800">{stats.preparingOrders}</p>
                <p className="text-xs text-blue-600 mt-1">In progress</p>
              </div>
              <div className="bg-blue-200 p-3 rounded-full">
                <Clock className="text-blue-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 text-sm font-medium mb-1">Ready for Pickup</p>
                <p className="text-3xl font-bold text-green-800">{stats.readyOrders}</p>
                <p className="text-xs text-green-600 mt-1">Ready to serve</p>
              </div>
              <div className="bg-green-200 p-3 rounded-full">
                <CheckCircle className="text-green-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-700 text-sm font-medium mb-1">Completed Today</p>
                <p className="text-3xl font-bold text-purple-800">{stats.completedToday}</p>
                <p className="text-xs text-purple-600 mt-1">Orders served</p>
              </div>
              <div className="bg-purple-200 p-3 rounded-full">
                <TrendingUp className="text-purple-700" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-medium mb-1">Revenue Today</p>
                <p className="text-3xl font-bold text-emerald-800">₱{stats.revenueToday.toFixed(0)}</p>
                <p className="text-xs text-emerald-600 mt-1">Today's earnings</p>
              </div>
              <div className="bg-emerald-200 p-3 rounded-full">
                <DollarSign className="text-emerald-700" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-xl">⚡</span>
              Quick Actions
            </h3>
            <button
              onClick={() => navigate('/canteen/order')}
              className="text-[#8B3A3A] hover:text-[#6B2A2A] font-semibold transition-colors duration-200 flex items-center gap-1"
            >
              View All Orders
              <span className="text-lg">→</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/canteen/order')}
              className="group bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white p-6 rounded-xl hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl font-bold">{stats.pendingOrders}</div>
                <div className="bg-white bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
                  <AlertCircle size={20} />
                </div>
              </div>
              <div className="text-sm font-semibold text-left">New Pending Orders</div>
              <div className="text-xs opacity-90 mt-1">Click to manage</div>
            </button>
            <button
              onClick={() => navigate('/canteen/order')}
              className="group bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl font-bold">{stats.preparingOrders}</div>
                <div className="bg-white bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
                  <Clock size={20} />
                </div>
              </div>
              <div className="text-sm font-semibold text-left">Currently Preparing</div>
              <div className="text-xs opacity-90 mt-1">Update progress</div>
            </button>
            <button
              onClick={() => navigate('/canteen/order')}
              className="group bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-500 hover:via-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl font-bold">{stats.readyOrders}</div>
                <div className="bg-white bg-opacity-20 p-2 rounded-lg group-hover:bg-opacity-30 transition-all">
                  <CheckCircle size={20} />
                </div>
              </div>
              <div className="text-sm font-semibold text-left">Ready for Pickup</div>
              <div className="text-xs opacity-90 mt-1">Serve customers</div>
            </button>
          </div>
        </div>

        {/* Active Orders Queue */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Active Orders Queue
            </h3>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              {activeOrders.length} active
            </div>
          </div>

          {activeOrders.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
              <div className="animate-pulse">
                <ChefHat size={72} className="mx-auto text-gray-300 mb-4" />
              </div>
              <p className="text-gray-500 text-xl font-medium mb-2">No active orders at the moment</p>
              <p className="text-gray-400 text-sm">New orders will appear here automatically</p>
              <div className="mt-4 flex justify-center">
                <div className="animate-bounce bg-[#8B3A3A] text-white px-4 py-2 rounded-full text-sm">
                  Waiting for orders...
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeOrders.slice(0, 6).map((order, index) => (
                <div
                  key={order.id}
                  className={`bg-gradient-to-br ${
                    order.status === 'pending' ? 'from-yellow-50 to-yellow-100 border-yellow-300' :
                    order.status === 'preparing' ? 'from-blue-50 to-blue-100 border-blue-300' :
                    'from-green-50 to-green-100 border-green-300'
                  } rounded-xl shadow-md border-l-4 ${
                    order.status === 'pending' ? 'border-l-yellow-500' :
                    order.status === 'preparing' ? 'border-l-blue-500' :
                    'border-l-green-500'
                  } overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono text-sm font-bold text-gray-700">
                        Order #{String(order.id).slice(-6)}
                      </p>
                      <p className="text-xs text-gray-600">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      order.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-blue-200 text-blue-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-700 font-semibold mb-2">Items:</p>
                    <div className="space-y-2">
                      {order.items?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <p className="text-sm text-gray-600">
                            {item.name} x{item.quantity}
                          </p>
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <p className="text-xs text-gray-500 ml-10">
                          +{order.items.length - 2} more items...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-300">
                    <p className="font-bold text-[#8B3A3A]">
                      ₱{order.total?.toFixed(2) || '0.00'}
                    </p>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          Start Preparing
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm font-semibold hover:bg-gray-700 transition"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}