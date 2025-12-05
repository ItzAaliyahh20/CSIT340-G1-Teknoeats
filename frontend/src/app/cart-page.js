import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/sidebar'
import { Search, Clock, Trash2, X, Banknote, ShoppingBasket, Calendar, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, getCurrentUser, getOrderById } from '../services/api'

const BACKEND_URL = "http://localhost:8080"; // Add this constant

export default function CartPage() {
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = useSearchParams();
   const viewOrderId = searchParams.get('viewOrder');
   const reorderId = searchParams.get('reorder');
   const [items, setItems] = useState([])
   const [paymentMethod, setPaymentMethod] = useState(null)
   const [pickupTime, setPickupTime] = useState(null)
   const [isLoading, setIsLoading] = useState(true)
   const [user, setUser] = useState(null)
   const [currentTime, setCurrentTime] = useState(new Date())
   const [toasts, setToasts] = useState([])
   const [minusClicked, setMinusClicked] = useState({})
   const [plusClicked, setPlusClicked] = useState({})
   const [quantityScaled, setQuantityScaled] = useState({})
   const [showModal, setShowModal] = useState(false)
   const [selectedDate, setSelectedDate] = useState('')
   const [selectedTime, setSelectedTime] = useState('7:30 AM')
   const [bottomText, setBottomText] = useState(<span>Please select a payment method and pick-up time.</span>)
   const [checkoutRipples, setCheckoutRipples] = useState([])
   const [viewOrder, setViewOrder] = useState(null)

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

  // Generate time options from 7:30 AM to 5:30 PM in 15-minute intervals
  const timeOptions = []
  let current = new Date()
  current.setHours(7, 30, 0, 0)
  const end = new Date()
  end.setHours(17, 30, 0, 0)
  while (current < end) {
    const next = new Date(current)
    next.setMinutes(next.getMinutes() + 15)
    const startTime = current.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    const endTime = next.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    timeOptions.push({ value: startTime, label: `${startTime} - ${endTime}` })
    current = next
  }
  useEffect(() => {
    const loadCart = async () => {
      console.log("loadCart started, viewOrderId:", viewOrderId, "reorderId:", reorderId)
      try {
        const currentUser = await getCurrentUser()
        console.log("Current user:", currentUser)
        setUser(currentUser)
        if (viewOrderId) {
          try {
            const order = await getOrderById(viewOrderId)
            console.log("View order:", order)
            if (order) {
              setViewOrder(order)
              setItems(order.items.map(i => ({ ...i, quantity: i.quantity })))
            }
          } catch (error) {
            console.error("Error fetching order:", error)
          }
        } else if (reorderId) {
          const orders = JSON.parse(localStorage.getItem('orders') || '[]')
          const order = orders.find(o => o.id === reorderId)
          console.log("Reorder order:", order)
          if (order && currentUser) {
            // Add items to cart
            for (const item of order.items) {
              await apiAddToCart(currentUser.id, item.id, item.quantity)
            }
            setItems(order.items.map(i => ({ ...i, quantity: i.quantity })))
            setPaymentMethod(null)
            setPickupTime(null)
          }
        } else if (currentUser) {
          const cartItems = await getCart(currentUser.id)
          console.log("Raw cart items from API:", cartItems)
          // FIX: Add full URL to image paths
          const cartItemsWithFixedImages = cartItems.map(c => ({
            ...c.product,
            quantity: c.quantity,
            image: c.product.image?.startsWith('/uploads')
              ? `${BACKEND_URL}${c.product.image}`
              : c.product.image
          }))
          console.log("Cart items with fixed images:", cartItemsWithFixedImages)
          setItems(cartItemsWithFixedImages)
        }
      } catch (error) {
        console.error("Error loading cart:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadCart()
  }, [viewOrderId, reorderId])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const filteredItems = items.filter((item) =>
    searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const updateQuantity = async (id, quantity) => {
    console.log("updateQuantity called for id:", id, "quantity:", quantity)
    if (quantity <= 0) {
      await removeItem(id)
    } else {
      if (!user) {
        console.log("No user, returning")
        return
      }

      // Check if quantity exceeds maximum limit
      if (quantity > 20) {
        alert("Maximum quantity per item is 20")
        return
      }

      try {
        console.log("Updating local state")
        // Update local state first to maintain order
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        )

        console.log("Updating backend")
        // Then update backend
        await apiRemoveFromCart(user.id, id)
        await apiAddToCart(user.id, id, quantity)
        console.log("Backend updated successfully")
      } catch (error) {
        console.error("Error updating quantity:", error)
        // Revert local state on error
        const cartItems = await getCart(user.id)
        setItems(cartItems.map(c => ({ ...c.product, quantity: c.quantity })))
      }
    }
  }

  const removeItem = async (id) => {
    console.log("removeItem called for id:", id)
    if (!user) {
      console.log("No user, returning")
      return
    }
    try {
      // Get item details before removing for toast message
      const itemToRemove = items.find(item => item.id === id)
      console.log("Item to remove:", itemToRemove)

      console.log("Updating local state")
      // Update local state first to maintain order
      setItems(prevItems => prevItems.filter(item => item.id !== id))

      console.log("Removing from backend")
      // Then update backend
      await apiRemoveFromCart(user.id, id)

      // Show toast message
      if (itemToRemove) {
        showToast(`${itemToRemove.name} x${itemToRemove.quantity} removed from your cart.`, 'success')
      }
    } catch (error) {
      console.error("Error removing item:", error)
      // Revert local state on error
      const cartItems = await getCart(user.id)
      setItems(cartItems.map(c => ({ ...c.product, quantity: c.quantity })))
    }
  }

  // Global toast management functions
  const showToast = (content, type = 'success', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, content, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const handleContinueShopping = (e) => {
    navigate('/home?category=Dashboard')
  }

  const handleCheckout = async () => {
    console.log("handleCheckout started")
    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "pending",
      items: items.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: item.category,
        image: item.image
      })),
      restaurant: "Counter A - CIT-U Canteen",
      total: total,
      paymentMethod: paymentMethod,
      pickupTime: pickupTime === 'now' ? 'Pick up within 5-10 minutes' : 'Pick up later'
    };
    console.log("New order object:", newOrder)

    // Create order in backend
    const response = await fetch(`http://localhost:8080/api/orders/create?userId=${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOrder)
    });
    console.log("Order creation response:", response)

    // Clear cart from backend
    for (const item of items) {
      await apiRemoveFromCart(user.id, item.id)
    }

    // Clear local state and storage
    localStorage.setItem("cart", JSON.stringify([]))
    setItems([])

    // Show success and redirect
    showToast("Order placed successfully! Your order is pending.", 'success')
    setTimeout(() => navigate("/order"), 1000) // Delay navigation to allow toast to show
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar 
          categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} 
          selectedItem='cart' 
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='cart' onSelectCategory={(category) => {
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
          {viewOrder ? 'ORDER DETAILS' : 'CART'}
        </h2>
        {filteredItems.length === 0 ? (
          <div className="text-center space-y-4 py-12">
            <ShoppingBasket size={64} strokeWidth={1.1} className="text-gray-400 mb-4 mx-auto animate-pulse" />
            <p className="text-gray-600 text-lg">Your cart is empty. Fill it with your cravings!</p>
            <motion.button
              onClick={handleContinueShopping}
              className="mt-4 bg-[#8B3A3A] text-white px-6 py-2 text-lg rounded font-bold hover:bg-[#6B2A2A] transition relative overflow-hidden"
            >
              Continue Shopping
            </motion.button>
          </div>
        ) : (
          <div className="flex gap-8">
            {/* Left Column - Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                {/* Column Labels */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="font-bold text-gray-700 text-sm">Item</span>
                  </div>
                  <div className="flex items-center gap-[42px]">
                    <span className="font-bold text-gray-700 text-sm mr-[1px]">Item Price</span>
                    <span className="font-bold text-gray-700 text-sm mr-[37px]">Quantity</span>
                    <div className="w-14"></div> {/* Spacer for trash button */}
                  </div>
                </div>

                {filteredItems.map((item, index) => (
                   <motion.div
                     key={item.id}
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                   >
                     <div
                       className={`flex items-center justify-between ${index < items.length - 1 ? 'pb-4 mb-4 border-b border-gray-200' : ''}`}
                     >
                    <div className="flex items-center gap-4 flex-1">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 rounded" />
                      <div>
                        <h3 className="font-bold text-black text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-11">
                      <span className="font-bold text-black">PHP {item.price.toFixed(2)}</span>
                      <div className={`flex items-center justify-between gap-0 border border-gray-300 rounded w-24 ${viewOrder ? 'mr-[92px]' : ''}`}>
                        <motion.button
                          onClick={() => {
                            updateQuantity(item.id, item.quantity - 1)
                            setMinusClicked(prev => ({ ...prev, [item.id]: true }))
                            setQuantityScaled(prev => ({ ...prev, [item.id]: true }))
                            setTimeout(() => {
                              setMinusClicked(prev => ({ ...prev, [item.id]: false }))
                              setQuantityScaled(prev => ({ ...prev, [item.id]: false }))
                            }, 200)
                          }}
                          disabled={viewOrder || item.quantity <= 1}
                          className={`flex-1 px-2 py-1 hover:font-bold hover:bg-gray-100 transition text-center ${viewOrder ? 'cursor-not-allowed opacity-50' : ''}`}
                          style={minusClicked[item.id] ? { backgroundColor: 'rgba(139, 58, 58, 0.2)' } : {}}
                        >
                          <motion.span
                            animate={{
                              fontWeight: minusClicked[item.id] ? 900 : 400,
                              color: minusClicked[item.id] ? '#8B3A3A' : '#000000'
                            }}
                            transition={{ duration: 0.1 }}
                          >
                            −
                          </motion.span>
                        </motion.button>
                        <div className="flex-1 px-2 py-1 text-center">
                          <motion.span
                            animate={{
                              scale: quantityScaled[item.id] ? 1.2 : 1,
                              fontWeight: quantityScaled[item.id] ? 600 : 400
                            }}
                            transition={{ duration: 0.1 }}
                            className="inline-block"
                          >
                            {item.quantity}
                          </motion.span>
                        </div>
                        <motion.button
                          onClick={() => {
                            updateQuantity(item.id, item.quantity + 1)
                            setPlusClicked(prev => ({ ...prev, [item.id]: true }))
                            setQuantityScaled(prev => ({ ...prev, [item.id]: true }))
                            setTimeout(() => {
                              setPlusClicked(prev => ({ ...prev, [item.id]: false }))
                              setQuantityScaled(prev => ({ ...prev, [item.id]: false }))
                            }, 200)
                          }}
                          disabled={viewOrder || item.quantity >= 20}
                          className={`flex-1 px-2 py-1 hover:font-bold hover:bg-gray-100 transition text-center ${viewOrder ? 'cursor-not-allowed opacity-50' : ''}`}
                          style={plusClicked[item.id] ? { backgroundColor: 'rgba(255, 215, 0, 0.2)' } : {}}
                        >
                          <motion.span
                            animate={{
                              fontWeight: plusClicked[item.id] ? 900 : 400,
                              color: plusClicked[item.id] ? '#FFD700' : '#000000'
                            }}
                            transition={{ duration: 0.1 }}
                          >
                            +
                          </motion.span>
                        </motion.button>
                      </div>
                      {!viewOrder && (
                        <button onClick={() => removeItem(item.id)} className="text-[#8B3A3A] hover:text-[#7A3232] hover:bg-[#a0505033] hover:rounded-full mr-2 p-2 transition-all duration-300 ease-in-out">
                          <Trash2 size={25} />
                        </button>
                      )}
                    </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Checkout Section */}
            <div className="w-96">
              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                {/* Summary Title */}
                <h3 className="text-left text-xl font-bold mb-0">Order Summary</h3>
                {viewOrder && (
                  <p className="text-left text-sm text-[#8B3A3A] mb-4">Order ID: {viewOrder.id}</p>
                )}

                {/* Itemized List */}
                <div className="space-y-2 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{item.name} x{item.quantity}</span>
                      <span className="font-semibold text-gray-500">PHP {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-lg font-lg text-gray-700" style={{ fontFamily: 'Marykate' }}>SUBTOTAL</span>
                  <span className="font-semibold text-gray-700">PHP {total.toFixed(2)}</span>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[#8B3A3A]" style={{ fontFamily: 'Marykate' }}>TOTAL PRICE</span>
                  <span className="text-xl font-bold text-[#8B3A3A]">PHP {total.toFixed(2)}</span>
                </div>
              </motion.div>

              {!viewOrder && (
                <div className="space-y-6 mt-6">
                  {/* Payment Method */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                  >
                    <h2 className="text-xl font-bold text-black mb-4 text-left">Payment Options</h2>
                    <div className="flex gap-4 mb-6 justify-center">
                      {["GCash", "Maya", "Cash"].map((method) => (
                        <button
                          key={method}
                          onClick={() => setPaymentMethod(method)}
                          className={`${method === "GCash" ? "px-6 py-0" : "px-6 py-2"} rounded-full font-bold transition ${
                            paymentMethod === method
                              ? method === "GCash"
                                ? "bg-[#007CFF] text-white"
                                : method === "Maya"
                                ? "bg-black text-white"
                                : "bg-[#FFD700] text-[#8B3A3A]"
                              : "bg-white text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {method === "GCash" ? (
                            <img src={paymentMethod === "GCash" ? "/gcash-click.png" : "/gcash-unclick.png"} alt="Gcash" className="h-4 w-23 mx-auto" />
                          ) : method === "Maya" ? (
                            <img src="/maya.png" alt="Maya" className="h-4 mx-auto" />
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <Banknote size={16} /> {method}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-black mb-3 text-left border-t pt-4">Pick-up Time</h3>
                    <div className="flex gap-4 mb-2 justify-center">
                      <button
                        onClick={() => {
                          setPickupTime("now")
                          setBottomText(<span>Ready for pick-up within <span style={{fontFamily: 'Marykate', color: '#8B3A3A', fontWeight: 'bold'}}>10 MINS</span></span>)
                        }}
                        className={`px-6 py-2 rounded-full font-bold transition ${
                          pickupTime === "now" ? "bg-[#FFD700] text-[#8B3A3A]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Pick-up now
                      </button>
                      <button
                        onClick={() => setShowModal(true)}
                        className={`px-6 py-2 rounded-full font-bold transition ${
                          pickupTime && pickupTime !== "now" ? "bg-[#FFD700] text-[#8B3A3A]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Pick-up later
                      </button>
                    </div>

                    <p className="text-center text-sm font-normal text-black mt-2 pt-1">
                      {bottomText}
                    </p>
                  </motion.div>

                  {/* Checkout Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    onClick={(e) => {
                      // Create ripple effect
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      const rippleId = Date.now()

                      setCheckoutRipples(prev => [...prev, { id: rippleId, x, y }])

                      // Remove ripple after animation
                      setTimeout(() => {
                        setCheckoutRipples(prev => prev.filter(r => r.id !== rippleId))
                      }, 600)

                      if (!paymentMethod && !pickupTime) {
                        showToast("Payment method and pick-up option missing.", 'error')
                      } else if (!paymentMethod) {
                        showToast("Payment method missing.", 'error')
                      } else if (!pickupTime) {
                        showToast("Pick-up option missing.", 'error')
                      } else {
                        handleCheckout()
                      }
                    }}
                    className="w-full bg-[#8B3A3A] text-white py-3 text-lg rounded-lg font-bold hover:bg-[#6B2A2A] transition relative overflow-hidden"
                  >
                    Proceed to Checkout

                    {/* Ripple effects */}
                    {checkoutRipples.map((ripple) => (
                      <motion.span
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.3 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full bg-white pointer-events-none z-0"
                        style={{
                          left: ripple.x - 15,
                          top: ripple.y - 15,
                          width: 30,
                          height: 30,
                        }}
                      />
                    ))}
                  </motion.button>
                </div>
              )}
            </div>
        </div>
        )}
        </main>

        {/* Global Toast Container */}
        <AnimatePresence>
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="fixed px-4 py-2 rounded shadow-lg z-[60] flex items-center gap-4 bg-[#FFD700] text-black"
              style={{ bottom: `${16 + index * 60}px`, right: '16px' }}
            >
              {toast.content}
              <button onClick={() => removeToast(toast.id)} className="hover:bg-white/20 rounded p-1">
                <X size={16} strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Pickup Time Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4 text-center">Select Pick-up Time</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#8B3A3A] text-lg font-medium mb-1" style={{fontFamily: 'Marykate'}}>DATE</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 pr-10 appearance-none border border-gray-300 rounded focus:outline-none"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Calendar size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#8B3A3A] text-lg font-medium mb-1" style={{fontFamily: 'Marykate'}}>TIME</label>
                  <div className="relative">
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-3 py-2 pr-10 appearance-none border border-gray-300 rounded focus:outline-none"
                    >
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-bold hover:bg-gray-300 transition relative overflow-hidden"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!selectedDate && !selectedTime) {
                      showToast("Please select date and time for pick-up.", 'error')
                      return
                    } else if (!selectedDate) {
                      showToast("Please select date for pick-up.", 'error')
                      return
                    } else if (!selectedTime) {
                      showToast("Please select time for pick-up.", 'error')
                      return
                    }
                    const time24 = new Date(`1970-01-01 ${selectedTime}`).toTimeString().slice(0, 5)
                    const pickupDateTime = `${selectedDate}T${time24}`
                    setPickupTime(pickupDateTime)
                    const formatted = new Date(pickupDateTime).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })
                    setBottomText(<span>Scheduled for <span style={{fontFamily: 'Marykate', color: '#8B3A3A', fontWeight: 'bold'}}>{formatted.toUpperCase()}</span></span>)
                    setShowModal(false)
                  }}
                  className="flex-1 bg-[#8B3A3A] text-white py-2 rounded font-bold hover:bg-[#6B2A2A] transition relative overflow-hidden"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}