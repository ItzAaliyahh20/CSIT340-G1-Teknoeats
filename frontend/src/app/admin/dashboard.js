import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Users, 
  LogOut,
  TrendingUp,
  DollarSign,
  Package
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 32,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    // Load statistics from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    
    setStats({
      totalOrders: orders.length,
      totalRevenue: totalRevenue,
      totalUsers: users.length + 1, // +1 for current user
      totalProducts: 32,
      pendingOrders: pendingOrders,
      completedOrders: completedOrders
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
        </div>
        <div className={`${color} bg-opacity-10 p-4 rounded-full`}>
          <Icon className={color} size={32} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#8B3A3A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={32} />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-gray-200">TeknoEats Management System</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-[#8B3A3A] px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, Administrator
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your canteen today
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={stats.totalOrders}
            color="text-blue-600"
            subtext={`${stats.pendingOrders} pending`}
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={`₱${stats.totalRevenue.toFixed(2)}`}
            color="text-green-600"
            subtext="All time"
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            color="text-purple-600"
            subtext="Active customers"
          />
          <StatCard
            icon={Package}
            label="Menu Items"
            value={stats.totalProducts}
            color="text-orange-600"
            subtext="Available products"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/menu')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center gap-3 hover:bg-[#8B3A3A] hover:text-white group"
            >
              <UtensilsCrossed size={40} className="text-[#8B3A3A] group-hover:text-white" />
              <span className="font-semibold">Manage Menu</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/orders')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center gap-3 hover:bg-[#8B3A3A] hover:text-white group"
            >
              <ShoppingBag size={40} className="text-[#8B3A3A] group-hover:text-white" />
              <span className="font-semibold">View Orders</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center gap-3 hover:bg-[#8B3A3A] hover:text-white group"
            >
              <Users size={40} className="text-[#8B3A3A] group-hover:text-white" />
              <span className="font-semibold">Manage Users</span>
            </button>
            
            <button
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center gap-3 hover:bg-[#8B3A3A] hover:text-white group"
            >
              <TrendingUp size={40} className="text-[#8B3A3A] group-hover:text-white" />
              <span className="font-semibold">View Reports</span>
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
            <button
              onClick={() => navigate('/admin/orders')}
              className="text-[#8B3A3A] hover:underline font-semibold"
            >
              View All →
            </button>
          </div>
          
          {stats.totalOrders === 0 ? (
            <p className="text-gray-500 text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {JSON.parse(localStorage.getItem('orders') || '[]')
                    .slice(-5)
                    .reverse()
                    .map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">#{order.id.slice(-6)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{order.date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
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