import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin-sidebar';
import { ShoppingBag, DollarSign, Users, Package, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = "http://localhost:8080/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    readyOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('Stats data:', statsData);
        setStats(statsData);
      } else {
        throw new Error('Failed to fetch stats');
      }

      // Fetch recent orders
      const ordersRes = await fetch(`${API_BASE_URL}/admin/orders`);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        console.log('Orders data:', ordersData);
        
        // Sort by createdAt and take top 5
        const sortedOrders = [...ordersData]
          .sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          })
          .slice(0, 5);
        
        console.log('Sorted recent orders:', sortedOrders);
        setRecentOrders(sortedOrders);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-700 text-sm font-medium mb-2">{label}</p>
          <p className={`text-4xl font-bold ${color} mb-1`}>{value}</p>
          {subtext && <p className="text-xs text-gray-600 mt-2">{subtext}</p>}
        </div>
        <div className={`${color} bg-opacity-10 p-4 rounded-full`}>
          <Icon className={color} size={32} />
        </div>
      </div>
    </div>
  );

  if (loading && recentOrders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="w-64 fixed left-0 top-0 h-screen">
          <AdminSidebar currentPage="/admin/dashboard" />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B3A3A] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 top-0 h-screen">
        <AdminSidebar currentPage="/admin/dashboard" />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-[#8B3A3A] text-white shadow-lg">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-white/80 text-sm">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Today's Date</p>
              <p className="font-semibold text-white/80">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-3" size={24} />
                <p className="text-red-700">{error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="ml-auto text-red-700 hover:text-red-900 font-semibold"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={ShoppingBag}
              label="Total Orders"
              value={stats.totalOrders}
              color="text-blue-600"
              bgColor="bg-blue-50"
              subtext={`${stats.pendingOrders} pending`}
            />
            <StatCard
              icon={DollarSign}
              label="Total Revenue"
              value={`₱${stats.totalRevenue?.toFixed(2) || '0.00'}`}
              color="text-green-600"
              bgColor="bg-green-50"
              subtext="All time"
            />
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.totalUsers}
              color="text-purple-600"
              bgColor="bg-purple-50"
              subtext="Registered customers"
            />
            <StatCard
              icon={Package}
              label="Menu Items"
              value={stats.totalProducts}
              color="text-orange-600"
              bgColor="bg-orange-50"
              subtext="Available products"
            />
          </div>

          {/* Order Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <AlertCircle className="text-yellow-500" size={32} />
              </div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-800 font-medium">Preparing</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.preparingOrders}</p>
                </div>
                <TrendingUp className="text-blue-500" size={32} />
              </div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 font-medium">Ready</p>
                  <p className="text-3xl font-bold text-green-600">{stats.readyOrders}</p>
                </div>
                <CheckCircle className="text-green-500" size={32} />
              </div>
            </div>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-800 font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-600">{stats.completedOrders}</p>
                </div>
                <CheckCircle className="text-gray-500" size={32} />
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
              <a
                href="/admin/orders"
                className="text-[#8B3A3A] hover:text-[#6B2A2A] font-semibold text-sm flex items-center gap-2 transition"
              >
                View All Orders
                <TrendingUp size={16} />
              </a>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Restaurant</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Items</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-[#8B3A3A]">
                            #{order.id.toString().slice(-8)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.restaurant}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                          ₱{order.total?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {order.items?.length || 0} items
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}