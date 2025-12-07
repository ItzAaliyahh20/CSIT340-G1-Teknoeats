
import { useState, useEffect } from "react"
import Sidebar from '../components/sidebar'
import ProductCard from '../components/product-card'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Clock, X, Heart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { getProducts, getFavorites, addToFavorites, removeFromFavorites, getCurrentUser, getCart, addToCart as apiAddToCart } from '../services/api'

const CATEGORIES = ["Meals", "Food", "Snacks", "Beverages", "Others"]

export default function FavoritesPage() {
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState("All Categories")
    const [cart, setCart] = useState([])
    const [products, setProducts] = useState([])
    const [favorites, setFavorites] = useState([])
    const [user, setUser] = useState(null)
    const [toasts, setToasts] = useState([])
    const [currentTime, setCurrentTime] = useState(new Date())
    const [loading, setLoading] = useState(true)

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

   useEffect(() => {
     const loadData = async () => {
       console.log("FavoritesPage: Starting loadData")
       setLoading(true)
       try {
         console.log("FavoritesPage: Calling getCurrentUser")
         const currentUser = await getCurrentUser()
         console.log("FavoritesPage: getCurrentUser result:", currentUser)
         setUser(currentUser)
         if (currentUser) {
           console.log("FavoritesPage: Calling getProducts")
           const prods = await getProducts()
           console.log("FavoritesPage: getProducts result length:", prods.length)
           setProducts(prods)
           console.log("FavoritesPage: Calling getFavorites for user:", currentUser.userId)
           const favs = await getFavorites(currentUser.userId)
           console.log("FavoritesPage: getFavorites result:", favs)
           setFavorites(favs.filter(f => f.product).map(f => f.product.id))
           console.log("FavoritesPage: Favorites set to:", favs.map(f => f.product.id))
         } else {
           console.log("FavoritesPage: No current user, skipping product/favorite load")
         }
       } catch (error) {
         console.error("FavoritesPage: Error loading data:", error)
       } finally {
         setLoading(false)
         console.log("FavoritesPage: loadData completed")
       }
     }
     loadData()
   }, [])

   // Update current time every second
   useEffect(() => {
     const timer = setInterval(() => {
       setCurrentTime(new Date());
     }, 1000);
     return () => clearInterval(timer);
   }, [])

   const filteredFavoriteProducts = favorites
     .map((id) => products.find((p) => p.id === id))
     .filter((p) => p !== undefined)
     .filter((p) => selectedCategory === "All Categories" || p.category === selectedCategory)
     .filter((p) => searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()))

   console.log("FavoritesPage: filteredFavoriteProducts length:", filteredFavoriteProducts.length, "favorites:", favorites.length, "products:", products.length)

   const addToCart = async (product, quantity = 1) => {
     if (!user) {
       alert("Please log in to add items to cart")
       return
     }
     try {
       await apiAddToCart(user.userId, product.id, quantity)
       // Refresh cart
       const cartItems = await getCart(user.userId)
       setCart(cartItems.map(c => ({ ...c.product, quantity: c.quantity })))
       // Toast is handled by ProductCard component
     } catch (error) {
       console.error("Error adding to cart:", error)
       alert("Failed to add item to cart")
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

   const toggleFavorite = async (productId) => {
     console.log("FavoritesPage: toggleFavorite called with productId:", productId)
     if (!user) {
       console.log("FavoritesPage: No user logged in")
       alert("Please log in to add favorites")
       return
     }
     try {
       const product = products.find(p => p.id === productId)
       const wasFavorite = favorites.includes(productId)
       console.log("FavoritesPage: Product found:", product, "wasFavorite:", wasFavorite)

       if (wasFavorite) {
         console.log("FavoritesPage: Removing from favorites")
         const response = await removeFromFavorites(user.userId, productId)
         if (response.success) {
           setFavorites(favorites.filter(id => id !== productId))
           console.log("FavoritesPage: Favorites updated after removal")
           showToast(`Removed ${product?.name || 'item'} from your favorites.`, 'success')
         } else {
           console.error("FavoritesPage: Failed to remove from favorites")
           alert("Failed to remove from favorites")
         }
       } else {
         console.log("FavoritesPage: Adding to favorites")
         const response = await addToFavorites(user.userId, productId)
         if (response.success) {
           setFavorites([...favorites, productId])
           console.log("FavoritesPage: Favorites updated after addition")
           showToast(`Added ${product?.name || 'item'} to your favorites!`, 'success')
         } else {
           console.error("FavoritesPage: Failed to add to favorites")
           alert("Failed to add to favorites")
         }
       }
     } catch (error) {
       console.error("FavoritesPage: Error toggling favorite:", error)
       alert("Failed to update favorite")
     }
   }

   return (
     <div className="min-h-screen bg-gray-100">
       <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages", "Others"]} selectedItem='favorites' onSelectCategory={(category) => {
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
             FAVORITES
           </h2>

         <div className="flex gap-4 mb-6 justify-center flex-wrap">
           {["All Categories", ...CATEGORIES].map((category) => (
             <button
               key={category}
               onClick={() => setSelectedCategory(category)}
               className={`px-4 py-2 rounded-full font-semibold transition ${
                 selectedCategory === category
                   ? "bg-[#8B3A3A] text-white"
                   : "bg-gray-100 text-[#8B3A3A] border-2 border-[#8B3A3A] hover:bg-white"
               }`}
               style={{ fontSize: '16px' }}
             >
               {category}
             </button>
           ))}
         </div>

         {loading ? (
           <div className="flex flex-col items-center justify-center space-y-4 py-12">
             <img 
               src="/teknoeats-loading.png" 
               alt="Loading" 
               className="w-20 h-20 animate-pulse"
             />
             <p className="text-gray-600 text-lg">Just a wild second...</p>
           </div>
         ) : filteredFavoriteProducts.length === 0 ? (
           <div className="flex flex-col items-center justify-center space-y-4 py-12">
             <Heart className="text-gray-600 animate-pulse" size={54} strokeWidth={1.1} />
             <p className="text-gray-600 text-lg">No favorite items yet. Add some delicious finds!</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {filteredFavoriteProducts.map((product, index) => (
               <motion.div
                 key={product.id}
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
