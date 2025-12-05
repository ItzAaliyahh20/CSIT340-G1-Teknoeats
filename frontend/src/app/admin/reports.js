import { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin-sidebar';
import { Download, TrendingUp, DollarSign, ShoppingBag, Users, Calendar, Package } from 'lucide-react';

const API_BASE_URL = "http://localhost:8080/api";

export default function AdminReports() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch stats from backend
      const statsRes = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch all orders from backend
      const ordersRes = await fetch(`${API_BASE_URL}/admin/orders`);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }

      // Fetch all products from backend
      const productsRes = await fetch(`${API_BASE_URL}/admin/menu/products`);
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load reports data from server');
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByDate = (orders) => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      switch(dateRange) {
        case 'today':
          return orderDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const calculateFilteredStats = () => {
    const filteredOrders = filterOrdersByDate(orders);
    const revenue = filteredOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      orders: filteredOrders.length,
      revenue: revenue,
      completed: filteredOrders.filter(o => o.status === 'delivered').length,
      pending: filteredOrders.filter(o => o.status === 'pending').length
    };
  };

  const filteredStats = calculateFilteredStats();

  // Get top selling products from actual orders
  const getTopProducts = () => {
    const productSales = {};
    
    orders.forEach(order => {
      if (order.status === 'delivered' && order.items) {
        order.items.forEach(item => {
          const productId = item.product?.id || item.productId;
          const productName = item.product?.name || item.name;
          
          if (productId) {
            if (!productSales[productId]) {
              productSales[productId] = {
                name: productName,
                quantity: 0,
                revenue: 0
              };
            }
            productSales[productId].quantity += item.quantity || 0;
            productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
          }
        });
      }
    });

    return Object.entries(productSales)
      .map(([id, data]) => ({ ...data, id }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  };

  const topProducts = getTopProducts();

  // Get category breakdown
  const getCategoryBreakdown = () => {
    const categoryData = {};
    
    products.forEach(product => {
      if (!categoryData[product.category]) {
        categoryData[product.category] = {
          count: 0,
          totalStock: 0
        };
      }
      categoryData[product.category].count++;
      categoryData[product.category].totalStock += product.stock || 0;
    });

    return Object.entries(categoryData).map(([category, data]) => ({
      category,
      ...data
    }));
  };

  const categoryBreakdown = getCategoryBreakdown();

  // Export to CSV
  const exportToCSV = () => {
    const csvData = [
      ['TeknoEats Sales Report'],
      ['Generated:', new Date().toLocaleString()],
      ['Date Range:', dateRange.toUpperCase()],
      [''],
      ['SUMMARY STATISTICS'],
      ['Total Orders:', filteredStats.orders],
      ['Total Revenue:', `₱${filteredStats.revenue.toFixed(2)}`],
      ['Completed Orders:', filteredStats.completed],
      ['Pending Orders:', filteredStats.pending],
      ['Total Products:', stats.totalProducts],
      ['Total Users:', stats.totalUsers],
      [''],
      ['TOP SELLING PRODUCTS'],
      ['Product Name', 'Quantity Sold', 'Revenue'],
      ...topProducts.map(p => [p.name, p.quantity, `₱${p.revenue.toFixed(2)}`]),
      [''],
      ['CATEGORY BREAKDOWN'],
      ['Category', 'Product Count', 'Total Stock'],
      ...categoryBreakdown.map(c => [c.category, c.count, c.totalStock])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teknoeats-report-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <div className="w-64 fixed left-0 top-0 h-screen">
          <AdminSidebar currentPage="/admin/reports" />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A3A] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 top-0 h-screen">
        <AdminSidebar currentPage="/admin/reports" />
      </div>
      
      <div className="flex-1 ml-64">
       <header className="bg-[#8B3A3A] text-white shadow-lg sticky top-0 z-40">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4"></div>
              <div>
                <h1 className="text-2xl font-bold">Sales Reports</h1>
                
              </div>
          
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-[#FFD700] text-[#8B3A3A] px-4 py-1 rounded-lg hover:bg-yellow-400 transition font-semibold"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </header>
        

        <div className="px-6 py-8">
          {/* Date Range Selector */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-4">
              <Calendar className="text-[#8B3A3A]" size={24} />
              <h3 className="font-bold text-gray-800">Date Range:</h3>
              <div className="flex gap-2">
                {['today', 'week', 'month', 'all'].map(range => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      dateRange === range
                        ? 'bg-[#8B3A3A] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <ShoppingBag size={32} />
                <TrendingUp size={24} />
              </div>
              <p className="text-white/80 text-sm mb-1">Total Orders</p>
              <p className="text-4xl font-bold">{filteredStats.orders}</p>
              <p className="text-white/70 text-xs mt-2">{filteredStats.completed} completed</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <DollarSign size={32} />
                <TrendingUp size={24} />
              </div>
              <p className="text-white/80 text-sm mb-1">Revenue</p>
              <p className="text-4xl font-bold">₱{filteredStats.revenue.toFixed(0)}</p>
              <p className="text-white/70 text-xs mt-2">From completed orders</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <Users size={32} />
                <TrendingUp size={24} />
              </div>
              <p className="text-white/80 text-sm mb-1">Total Users</p>
              <p className="text-4xl font-bold">{stats.totalUsers}</p>
              <p className="text-white/70 text-xs mt-2">Registered customers</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center justify-between mb-4">
                <Package size={32} />
                <TrendingUp size={24} />
              </div>
              <p className="text-white/80 text-sm mb-1">Products</p>
              <p className="text-4xl font-bold">{stats.totalProducts}</p>
              <p className="text-white/70 text-xs mt-2">In menu</p>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h3>
            {topProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No sales data available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Rank</th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Product</th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-gray-700">Quantity Sold</th>
                      <th className="px-6 py-3 text-right text-sm font-bold text-gray-700">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topProducts.map((product, index) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-bold text-[#8B3A3A]">#{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 text-right">{product.quantity}</td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600 text-right">
                          ₱{product.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Product Category Breakdown</h3>
            {categoryBreakdown.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No product categories available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categoryBreakdown.map(category => (
                  <div
                    key={category.category}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#8B3A3A] transition"
                  >
                    <h4 className="font-bold text-[#8B3A3A] mb-2">{category.category}</h4>
                    <p className="text-sm text-gray-600">
                      Products: <span className="font-semibold">{category.count}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Stock: <span className="font-semibold">{category.totalStock}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}