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

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);

    // Calculate today's stats
    const today = new Date().toLocaleDateString();
    const todayOrders = savedOrders.filter(order => 
      new Date(order.date).toLocaleDateString() === today
    );

    setStats({
      pendingOrders: savedOrders.filter(o => o.status === 'pending').length,
      preparingOrders: savedOrders.filter(o => o.status === 'preparing').length,
      readyOrders: savedOrders.filter(o => o.status === 'ready').length,
      completedToday: todayOrders.filter(o => o.status === 'delivered').length,
      revenueToday: todayOrders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0)
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    loadOrders(); // Refresh stats
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
      <header className="bg-[#8B3A3A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ChefHat size={32} />
            <div>
              <h1 className="text-2xl font-bold">Canteen Dashboard</h1>
              <p className="text-sm text-gray-200">Order Management System</p>
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
            Welcome, Canteen Personnel
          </h2>
          <p className="text-gray-600">
            Manage incoming orders and update their status
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={AlertCircle}
            label="Pending Orders"
            value={stats.pendingOrders}
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={Clock}
            label="Preparing"
            value={stats.preparingOrders}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={CheckCircle}
            label="Ready for Pickup"
            value={stats.readyOrders}
            color="text-green-600"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={TrendingUp}
            label="Completed Today"
            value={stats.completedToday}
            color="text-purple-600"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={DollarSign}
            label="Revenue Today"
            value={`₱${stats.revenueToday.toFixed(0)}`}
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
            <button
              onClick={() => navigate('/canteen/order')}
              className="text-[#8B3A3A] hover:underline font-semibold"
            >
              View All Orders →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/canteen/order')}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white p-6 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition shadow-md"
            >
              <div className="text-4xl font-bold mb-2">{stats.pendingOrders}</div>
              <div className="text-sm font-semibold">New Pending Orders</div>
            </button>
            <button
              onClick={() => navigate('/canteen/order')}
              className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-6 rounded-lg hover:from-blue-500 hover:to-blue-600 transition shadow-md"
            >
              <div className="text-4xl font-bold mb-2">{stats.preparingOrders}</div>
              <div className="text-sm font-semibold">Currently Preparing</div>
            </button>
            <button
              onClick={() => navigate('/canteen/order')}
              className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-lg hover:from-green-500 hover:to-green-600 transition shadow-md"
            >
              <div className="text-4xl font-bold mb-2">{stats.readyOrders}</div>
              <div className="text-sm font-semibold">Ready for Pickup</div>
            </button>
          </div>
        </div>

        {/* Active Orders Queue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Active Orders Queue</h3>
          
          {activeOrders.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No active orders at the moment</p>
              <p className="text-gray-400 text-sm">New orders will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeOrders.slice(0, 6).map(order => (
                <div
                  key={order.id}
                  className={`border-2 rounded-lg p-4 ${getStatusColor(order.status)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-mono text-sm font-bold text-gray-700">
                        Order #{order.id.slice(-6)}
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
                    <p className="text-sm text-gray-700 font-semibold mb-1">Items:</p>
                    <div className="space-y-1">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          • {item.name} x{item.quantity}
                        </p>
                      ))}
                      {order.items?.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{order.items.length - 3} more items...
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