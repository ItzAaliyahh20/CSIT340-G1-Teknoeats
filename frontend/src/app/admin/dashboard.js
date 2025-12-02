import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, LogOut, TrendingUp, DollarSign, Package, ChevronRight, AlertCircle } from 'lucide-react';

const API_BASE_URL = "http://localhost:8080/api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch stats from backend
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Stats fetched:', data);
        setStats({
          totalOrders: data.totalOrders || 0,
          totalRevenue: data.totalRevenue || 0,
          totalUsers: data.totalUsers || 0,
          totalProducts: data.totalProducts || 0,
          pendingOrders: data.pendingOrders || 0,
          completedOrders: data.completedOrders || 0
        });
      } else {
        console.error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Function to fetch recent orders
  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders`);
      if (response.ok) {
        const data = await response.json();
        setRecentOrders(data.slice(-5).reverse());
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  // Listen for storage events (when products are added/updated)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'productsUpdated') {
        console.log('🔄 Products updated, refreshing stats...');
        fetchStats();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event from same window
    const handleCustomEvent = () => {
      console.log('🔄 Products updated (custom event), refreshing stats...');
      fetchStats();
    };
    
    window.addEventListener('productsUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleCustomEvent);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext, bgGradient }) => (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/80 text-sm font-medium mb-2">{label}</p>
          <p className={`text-4xl font-bold text-white mb-1`}>{value}</p>
          {subtext && <p className="text-white/70 text-xs">{subtext}</p>}
        </div>
        <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
          <Icon className="text-white" size={32} />
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, onClick, gradient }) => (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white group`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
          <Icon size={32} />
        </div>
        <span className="font-semibold text-lg">{title}</span>
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A3A] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#8B3A3A] to-[#6B2A2A] text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <LayoutDashboard size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-white/80 text-sm">TeknoEats Management System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-[#8B3A3A] px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-[#FFD700] to-[#FFC107] rounded-2xl p-8 shadow-lg">
          <h2 className="text-4xl font-bold text-[#8B3A3A] mb-2">
            Welcome, Administrator
          </h2>
          <p className="text-[#8B3A3A]/80 text-lg">
            Here's what's happening with your canteen today
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={stats.totalOrders}
            subtext={`${stats.pendingOrders} pending`}
            bgGradient="from-blue-500 to-blue-600"
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`₱${stats.totalRevenue.toFixed(0)}`}
            subtext="All time earnings"
            bgGradient="from-green-500 to-green-600"
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            subtext="Active customers"
            bgGradient="from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Package}
            label="Menu Items"
            value={stats.totalProducts}
            subtext="Available products"
            bgGradient="from-orange-500 to-orange-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ChevronRight className="text-[#8B3A3A]" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickActionCard
              icon={UtensilsCrossed}
              title="Manage Menu"
              onClick={() => navigate('/admin/menu')}
              gradient="from-[#8B3A3A] to-[#6B2A2A]"
            />
            <QuickActionCard
              icon={ShoppingBag}
              title="View Orders"
              onClick={() => navigate('/admin/orders')}
              gradient="from-blue-500 to-blue-600"
            />
            <QuickActionCard
              icon={Users}
              title="Manage Users"
              onClick={() => navigate('/admin/users')}
              gradient="from-purple-500 to-purple-600"
            />
            <QuickActionCard
              icon={TrendingUp}
              title="View Reports"
              onClick={() => {}}
              gradient="from-green-500 to-green-600"
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <AlertCircle className="text-[#8B3A3A]" />
              Recent Orders
            </h3>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-[#8B3A3A] hover:text-[#6B2A2A] font-semibold flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight size={20} />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium">No orders yet</p>
              <p className="text-gray-400 text-sm">Orders will appear here once placed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        #{order.id.toString().slice(-6)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.createdAt}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'ready'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">
                        ₱{order.total?.toFixed(2) || '0.00'}
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
  );
}