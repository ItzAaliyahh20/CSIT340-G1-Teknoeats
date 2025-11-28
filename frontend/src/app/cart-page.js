
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar'
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart, getCurrentUser } from '../services/api'

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("Gcash")
  const [pickupTime, setPickupTime] = useState("now")
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loadCart = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        if (currentUser) {
          const cartItems = await getCart(currentUser.id)
          setItems(cartItems.map(c => ({ ...c.product, quantity: c.quantity })))
        }
      } catch (error) {
        console.error("Error loading cart:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadCart()
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const updateQuantity = async (id, quantity) => {
    if (quantity <= 0) {
      await removeItem(id)
    } else {
      if (!user) return
      try {
        // Remove existing and add with new quantity
        await apiRemoveFromCart(user.id, id)
        // Assuming addToCart API adds the quantity
        // But since backend increments, we need to add with the new total quantity
        // For simplicity, refresh cart after remove and add
        await apiAddToCart(user.id, id, quantity)
        const cartItems = await getCart(user.id)
        setItems(cartItems.map(c => ({ ...c.product, quantity: c.quantity })))
      } catch (error) {
        console.error("Error updating quantity:", error)
      }
    }
  }

  const removeItem = async (id) => {
    if (!user) return
    try {
      await apiRemoveFromCart(user.id, id)
      const cartItems = await getCart(user.id)
      setItems(cartItems.map(c => ({ ...c.product, quantity: c.quantity })))
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const handleCheckout = () => {
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
      items: items,
      restaurant: "Counter A - CIT-U Canteen",
      total: total,
      paymentMethod: paymentMethod,
      pickupTime: pickupTime,
    }

    const existingOrders = localStorage.getItem("orders")
    const allOrders = existingOrders ? JSON.parse(existingOrders) : []
    allOrders.push(newOrder)
    localStorage.setItem("orders", JSON.stringify(allOrders))

    // Clear cart
    localStorage.setItem("cart", JSON.stringify([]))
    setItems([])

    // Show success and redirect
    alert("Order placed successfully! Your order is pending.")
    navigate("/order") // just call navigate directly, no .push
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='cart' onSelectCategory={(category) => navigate('/home?category=' + category)} />
        <div className="ml-[250px]">
          <div className="bg-[#FFD700] px-10 py-9"></div>
          <main className="max-w-4xl mx-auto px-4 py-8">
            <p className="text-center">Loading cart...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='cart' onSelectCategory={(category) => navigate('/home?category=' + category)} />
      <div className="ml-[250px]">
        <div className="bg-[#FFD700] px-10 py-12 shadow-lg"></div>
        <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#8B3A3A] text-center mb-8">Cart</h1>
        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center mb-8">
            <p className="text-gray-600 text-lg">Your cart is empty</p>
            <button
              onClick={() => navigate('/home?category=Dashboard')} // <-- go to Dashboard
              className="mt-4 bg-[#8B3A3A] text-white px-6 py-2 rounded font-bold hover:bg-[#6B2A2A] transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border-2 border-[#8B3A3A] p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 rounded" />
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-red-600">PHP {item.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2 border border-gray-300 rounded">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1">
                        −
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1">
                        +
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-red-500 font-bold hover:text-red-700">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-white rounded-lg p-4 mb-8 text-right">
              <p className="text-xl font-bold text-[#8B3A3A]">Total Price: PHP {total.toFixed(2)}</p>
            </div>
          </>
        )}

        {/* Payment Method */}
        {items.length > 0 && (
          <div className="bg-white rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-[#8B3A3A] mb-4 text-center">CHOOSE MODE OF PAYMENT</h2>
            <div className="flex gap-4 mb-6 justify-center">
              {["Gcash", "PayMaya", "Cash"].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-6 py-2 rounded-full font-bold transition ${
                    paymentMethod === method
                      ? "bg-[#FFD700] text-[#8B3A3A]"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            <h3 className="font-bold text-gray-800 mb-3 text-center">Pickup Time</h3>
            <div className="flex gap-4 mb-4 justify-center">
              <button
                onClick={() => setPickupTime("now")}
                className={`px-6 py-2 rounded-full font-bold transition ${
                  pickupTime === "now" ? "bg-[#FFD700] text-[#8B3A3A]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pick up now
              </button>
              <button
                onClick={() => setPickupTime("later")}
                className={`px-6 py-2 rounded-full font-bold transition ${
                  pickupTime === "later" ? "bg-[#FFD700] text-[#8B3A3A]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pick up later
              </button>
            </div>

            <p className="text-center text-[#8B3A3A] font-bold">Pick up within 5-10 minutes</p>
          </div>
        )}

        {/* Checkout Button */}
        {items.length > 0 && (
          <button
            onClick={handleCheckout}
            className="w-full bg-[#8B3A3A] text-white py-3 rounded-lg font-bold hover:bg-[#6B2A2A] transition"
          >
            Proceed to Checkout
          </button>
        )}
        </main>
      </div>
    </div>
  )
}
