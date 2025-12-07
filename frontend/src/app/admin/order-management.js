import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import AdminSidebar from '../../components/admin-sidebar';
import { getAllOrders, updateOrderStatus } from '../../services/api';
export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ------------------------------------
  // ✔ FIX: Define filterOrders BEFORE useEffect
  // ------------------------------------
  const filterOrders = useCallback(() => {
    let filtered = orders;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  // ------------------------------------

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrders();
      console.log('Orders from API:', data);
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Now this works — filterOrders exists before this is called
  useEffect(() => {
    filterOrders();
  }, [filterOrders]);

  const updateOrderStatusAdmin = async (orderId, newStatus) => {
    try {
      const data = await updateOrderStatus(orderId, newStatus);
      console.log('Order status updated:', data);
      // Update the order in the list
      const updatedOrders = orders.map(o =>
        o.id === orderId ? data : o
      );
      setOrders(updatedOrders);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(data);
      }
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };
  if (loading) {
      return (
        <div className="flex-1 ml-64">
          <div className="w-64 fixed left-0 top-0 h-screen">
            <AdminSidebar currentPage="/admin/orders" />
          </div>
          <div className="flex-1 ml-64 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A3A] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading menu...</p>
            </div>
          </div>
        </div>
      );
    }

  return (
    <div className="flex-1 ml-64">
      <div className="fixed left-0 top-0 h-screen z-50">
            <AdminSidebar currentPage="/admin/orders" />
      </div>
      <div className="flex-1 ml-64"></div>
      {/* Header */}
      <header className="bg-[#8B3A3A] text-white shadow-lg sticky top-0 z-40">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">       
            <h1 className="text-2xl font-bold">Order Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Total Orders:</span>
            <span className="bg-white text-[#8B3A3A] px-3 py-1 rounded-full font-bold">
              {orders.length}
            </span>
          </div>
        </div>
      </header>



      <div className="px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
            <button
              onClick={loadOrders}
              className="mt-2 text-red-700 hover:text-red-900 font-semibold"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Search + Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none font-semibold"
              >
                <option value="All">All Status</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#8B3A3A] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Total</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-semibold text-gray-900">
                          #{order.id.toString().slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.createdAt || order.date}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatusAdmin(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                        ₱{order.total?.toFixed(2) || '0.00'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#8B3A3A] text-white rounded hover:bg-[#6B2A2A] transition text-sm font-semibold"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
            <p className="text-3xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Preparing</p>
            <p className="text-3xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'preparing').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Ready</p>
            <p className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.status === 'ready').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-600">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            {console.log('ADMIN MODAL: selectedOrder', selectedOrder)}

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order ID</p>
                  <p className="font-mono font-bold">#{selectedOrder.id.toString().slice(-8)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="font-semibold">{selectedOrder.createdAt || selectedOrder.date}</p>
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
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.toUpperCase()}
                </span>
              </div>

              {/* Items */}
              <div>
                <p className="text-sm text-gray-600 mb-3 font-semibold">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
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

              {/* Order Notes */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Order Notes</p>
                {console.log('DEBUG: selectedOrder.notes =', selectedOrder.notes, 'trimmed =', selectedOrder.notes?.trim(), 'condition =', selectedOrder.notes && selectedOrder.notes.trim() !== '')}
                {selectedOrder.notes && selectedOrder.notes.trim() !== '' ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 cursor-pointer" onClick={() => setExpandedNotes(prev => ({ ...prev, [selectedOrder.id]: !prev[selectedOrder.id] }))}>
                    <p className="text-sm text-gray-700">
                      {expandedNotes[selectedOrder.id] || selectedOrder.notes.length <= 100
                        ? selectedOrder.notes
                        : `${selectedOrder.notes.substring(0, 100)}...`}
                      {selectedOrder.notes.length > 100 && (
                        <span className="ml-2 text-[#8B3A3A] hover:text-[#6B2A2A] font-semibold text-xs">
                          {expandedNotes[selectedOrder.id] ? 'Show less' : 'Show more'}
                        </span>
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">None</p>
                )}
              </div>

              {/* Update Status */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Update Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatusAdmin(selectedOrder.id, e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none font-semibold"
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready for Pickup</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
