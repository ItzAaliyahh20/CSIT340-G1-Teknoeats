import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, X, RefreshCw } from 'lucide-react';
import { getAllCanteenOrders, updateCanteenOrderStatus } from '../../services/api';

export default function OrderQueue() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadOrders();
    // Auto-refresh every 15 seconds
    const interval = setInterval(() => {
      loadOrders();
      setLastRefresh(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      console.log('CANTEEN DEBUG: Loading all orders from API');
      const allOrders = await getAllCanteenOrders();
      console.log('CANTEEN DEBUG: Orders from API:', allOrders);
      console.log('CANTEEN DEBUG: Total orders loaded:', allOrders.length);

      // Count orders by status
      const statusCounts = allOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      console.log('CANTEEN DEBUG: Orders by status:', statusCounts);

      // Sort by date (newest first) - assuming orders have createdAt or date field
      const sortedOrders = allOrders.sort((a, b) =>
        new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      );
      setOrders(sortedOrders);
      console.log('CANTEEN DEBUG: Set orders state:', sortedOrders.length + ' orders');
    } catch (error) {
      console.error('CANTEEN DEBUG: Error loading orders from API:', error);
      // Fallback to empty array on error
      setOrders([]);
    }
  };

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('CANTEEN DEBUG: Updating order status via API', { orderId, newStatus });
      const updatedOrder = await updateCanteenOrderStatus(orderId, newStatus);
      console.log('CANTEEN DEBUG: Order updated via API:', updatedOrder);

      // Update the orders state with the updated order
      const updatedOrders = orders.map(order =>
        order.id === orderId ? updatedOrder : order
      );
      setOrders(updatedOrders);
      console.log('CANTEEN DEBUG: Updated orders state:', updatedOrders);

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

      // Show success message
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('CANTEEN DEBUG: Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
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

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return 'preparing';
      case 'preparing':
        return 'ready';
      case 'ready':
        return 'delivered';
      default:
        return currentStatus;
    }
  };

  const getNextStatusButton = (status) => {
    switch (status) {
      case 'pending':
        return { text: 'Start Preparing', color: 'bg-blue-600 hover:bg-blue-700' };
      case 'preparing':
        return { text: 'Mark as Ready', color: 'bg-green-600 hover:bg-green-700' };
      case 'ready':
        return { text: 'Complete Order', color: 'bg-gray-600 hover:bg-gray-700' };
      default:
        return null;
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleRefresh = () => {
    loadOrders();
    setLastRefresh(new Date());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#8B3A3A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/canteen/dashboard')}
                className="hover:bg-[#6B2A2A] p-2 rounded transition"
              >
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold">Order Queue</h1>
            </div>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-white text-[#8B3A3A] px-4 py-2 rounded-lg hover:bg-gray-100 transition font-semibold"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
          <p className="text-sm text-gray-200 mt-2">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {['All', 'pending', 'preparing', 'ready', 'delivered'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  statusFilter === status
                    ? 'bg-[#8B3A3A] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status === 'All' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'All' && (
                  <span className="ml-2 bg-white text-[#8B3A3A] px-2 py-0.5 rounded-full text-xs">
                    {orders.filter(o => o.status === status).length}
                  </span>
                )}
                {status === 'All' && (
                  <span className="ml-2 bg-white text-[#8B3A3A] px-2 py-0.5 rounded-full text-xs">
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No orders found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map(order => {
              const nextButton = getNextStatusButton(order.status);
              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg shadow-md border-l-4 ${
                    order.status === 'pending' ? 'border-yellow-500' :
                    order.status === 'preparing' ? 'border-blue-500' :
                    order.status === 'ready' ? 'border-green-500' :
                    'border-gray-500'
                  } overflow-hidden hover:shadow-lg transition`}
                >
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-mono text-lg font-bold text-gray-900">
                          #{String(order.id).slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="mb-4 pb-4 border-b">
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Location:</span> {order.restaurant}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">Payment:</span> {order.paymentMethod}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Pickup:</span> {order.pickupTime}
                      </p>
                    </div>

                    {/* Items Summary */}
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Items ({order.items?.length || 0}):</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.name} <span className="text-gray-500">x{item.quantity}</span>
                            </span>
                            <span className="text-gray-600 font-semibold">
                              ₱{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mb-4 pb-4 border-b">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total:</span>
                        <span className="text-xl font-bold text-[#8B3A3A]">
                          ₱{order.total?.toFixed(2) || '0.00'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition font-semibold"
                      >
                        <Eye size={16} />
                        Details
                      </button>
                      {nextButton && order.status !== 'delivered' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                          className={`flex-1 px-4 py-2 text-white rounded transition font-semibold ${nextButton.color}`}
                        >
                          {nextButton.text}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <p className="text-sm text-gray-600 mt-1">#{String(selectedOrder.id)}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {console.log('CANTEEN MODAL: selectedOrder', selectedOrder)}
              {/* Status and Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
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

              

              {/* Order Items */}
              <div>
                <p className="text-lg font-bold text-gray-800 mb-4">Order Items</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-20 h-20 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          ₱{item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#8B3A3A]">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t-2 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-gray-800">Total Amount</p>
                  <p className="text-3xl font-bold text-[#8B3A3A]">
                    ₱{selectedOrder.total?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              {/* Order Notes */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2 font-semibold">Order Notes</p>
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
              {selectedOrder.status !== 'delivered' && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-3 font-semibold">Update Order Status</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none font-semibold text-lg"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready for Pickup</option>
                    <option value="delivered">Delivered/Completed</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}