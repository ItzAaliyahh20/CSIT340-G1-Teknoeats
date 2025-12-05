import { useState, useEffect } from "react"
import Sidebar from '../components/sidebar'
import HeroBanner from '../components/hero-banner'
import ProductCard from '../components/product-card'
import { Search, Clock, X } from "lucide-react"
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "framer-motion"
import { getFavorites, addToFavorites, removeFromFavorites, getCurrentUser, getCart, addToCart as apiAddToCart } from '../services/api'

const API_BASE_URL = "http://localhost:8080/api";
const BACKEND_URL = "http://localhost:8080"; // Add this constant
const CATEGORIES = ["Dashboard", "Meals", "Food", "Snacks", "Beverages"]

export default function HomePage() {
   const [searchParams, setSearchParams] = useSearchParams()
   const navigate = useNavigate()
   const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "Dashboard")
   const [animationKey, setAnimationKey] = useState(0)

   // ⭐ New states from old homepage
   const [products, setProducts] = useState([])
   const [loading, setLoading] = useState(true)

   const [cart, setCart] = useState([])
   const [favorites, setFavorites] = useState([])
   const [user, setUser] = useState(null)
   const [currentTime, setCurrentTime] = useState(new Date())
   const [toasts, setToasts] = useState([])

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

  // FETCH PRODUCTS FROM BACKEND
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (response.ok) {
          const data = await response.json();
          console.log("✓ Products fetched:", data.length);
          
          // Fix image URLs for each product
          const productsWithFixedImages = data.map(product => ({
            ...product,
            // If image starts with /uploads, prepend backend URL
            image: product.image?.startsWith('/uploads') 
              ? `${BACKEND_URL}${product.image}` 
              : product.image
          }));
          
          setProducts(productsWithFixedImages);
        } else {
          console.error("✖ Failed to fetch products");
          alert("Failed to load products from server");
        }
      } catch (error) {
        console.error("✖ Error fetching products:", error);
        alert("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [])

  // FETCH USER, FAVORITES AND CART
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          const favs = await getFavorites(currentUser.id);
          setFavorites(favs.map(f => f.product.id));
          const cartItems = await getCart(currentUser.id);
          setCart(cartItems.map(c => ({ ...c.product, quantity: c.quantity })));
        }
      } catch (error) {
        console.error("✖ Error fetching user data:", error);
      }
    };
    loadUserData();
  }, [])

  // Trigger animation on category change or mount
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [selectedCategory])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [])



  // ⭐ Filtering now uses products fetched from backend
  const filteredProducts = (
    selectedCategory === "Dashboard"
      ? products.filter((p) => p.category === "Meals")
      : products.filter((p) => p.category === selectedCategory)
  ).filter((p) =>
    searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const addToCart = async (product, quantity) => {
    if (!user) {
      alert("Please log in to add to cart")
      return
    }
    try {
      await apiAddToCart(user.id, product.id, quantity)
      const cartItems = await getCart(user.id)
      setCart(cartItems.map(c => ({ ...c.product, quantity: c.quantity })))
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert("Failed to add to cart")
    }
  }

  const toggleFavorite = async (productId) => {
    if (!user) {
      alert("Please log in to add favorites")
      return
    }
    try {
      const product = products.find(p => p.id === productId)
      const wasFavorite = favorites.includes(productId)
      
      if (wasFavorite) {
        await removeFromFavorites(user.id, productId)
        setFavorites(favorites.filter(id => id !== productId))
        showToast(`Removed ${product?.name || 'item'} from your favorites.`, 'success')
      } else {
        await addToFavorites(user.id, productId)
        setFavorites([...favorites, productId])
        showToast(`Added ${product?.name || 'item'} to your favorites!`, 'success')
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      alert("Failed to update favorite")
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

  // ⭐ Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar categories={CATEGORIES} selectedItem={selectedCategory} onSelectCategory={setSelectedCategory} />

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

          <div className="px-4 py-10">
            <div className="flex flex-col items-center justify-center space-y-4">
              <img
                src="/teknoeats-loading.png"
                alt="Loading"
                className="w-20 h-20 animate-pulse"
              />
              <p className="text-gray-600 text-lg text-center">Just a wild second...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar 
        categories={CATEGORIES} 
        selectedItem={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
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
          {selectedCategory === "Dashboard" && <HeroBanner />}
          
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-white text-center py-3 mb-6 rounded" style={{
              background: 'linear-gradient(to bottom right, #f3f4f6, #FFC107, #f3f4f6)',
              fontFamily: 'Marykate',
              boxShadow: 'inset 0 0 20px rgba(139, 58, 58, 0.06)',
              textShadow: '0 0 10px rgba(216, 5, 5, 0.4)'
            }}>
              {selectedCategory === "Dashboard" ? "POPULAR ITEMS" : selectedCategory.toUpperCase()}
            </h2>

            {filteredProducts.length === 0 && searchQuery ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-12">
                <Search className="text-gray-600 animate-pulse" size={54} strokeWidth={1.1} />
                <p className="text-gray-600 text-lg">Couldn't track down what you're looking for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id + '-' + animationKey}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onAddToCart={(quantity) => addToCart(product, quantity)}
                      onToggleFavorite={() => toggleFavorite(product.id)}
                      cartQuantity={cart.find(item => item.id === product.id)?.quantity || 0}
                      showToast={showToast}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
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
              className={`fixed px-4 py-2 rounded shadow-lg z-50 flex items-center gap-4 ${
                toast.type === 'success' ? 'bg-[#FFD700] text-black' : 'bg-[#8B3A3A] text-white'
              }`}
              style={{ bottom: `${16 + index * 60}px`, right: '16px' }}
            >
              {toast.content}
              <button onClick={() => removeToast(toast.id)} className="hover:bg-white/20 rounded p-1">
                <X size={16} strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}