
import { useState, useEffect } from "react"
import Sidebar from '../components/sidebar'
import ProductCard from '../components/product-card'
import { useNavigate } from 'react-router-dom';
import { Search } from "lucide-react"
import { getProducts, getFavorites, addToFavorites, removeFromFavorites, getCurrentUser } from '../services/api'

const CATEGORIES = ["Meals", "Food", "Snacks", "Beverages"]

export default function FavoritesPage() {
  const navigate = useNavigate();
   const [selectedCategory, setSelectedCategory] = useState("All")
   const [cart, setCart] = useState([])
   const [products, setProducts] = useState([])
   const [favorites, setFavorites] = useState([])
   const [user, setUser] = useState(null)

   useEffect(() => {
     const loadData = async () => {
       try {
         const currentUser = await getCurrentUser()
         setUser(currentUser)
         if (currentUser) {
           const prods = await getProducts()
           setProducts(prods)
           const favs = await getFavorites(currentUser.id)
           setFavorites(favs.map(f => f.product.id))
         }
       } catch (error) {
         console.error("Error loading data:", error)
       } finally {
         
       }
     }
     loadData()
   }, [])

   const filteredFavoriteProducts = favorites
     .map((id) => products.find((p) => p.id === id))
     .filter((p) => p !== undefined)
     .filter((p) => selectedCategory === "All" || p.category === selectedCategory)

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id)
    if (existing) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const toggleFavorite = async (productId) => {
    if (!user) {
      alert("Please log in to add favorites")
      return
    }
    try {
      if (favorites.includes(productId)) {
        await removeFromFavorites(user.id, productId)
        setFavorites(favorites.filter(id => id !== productId))
      } else {
        await addToFavorites(user.id, productId)
        setFavorites([...favorites, productId])
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      alert("Failed to update favorite")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='favorites' onSelectCategory={(category) => navigate('/home?category=' + category)} />

      <div className="ml-[250px]">
        <div className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] px-8 py-6 shadow-lg">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Looking for something?"
              className="w-full px-6 py-3 pl-12 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] shadow-md"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} strokeWidth={2} />
          </div>
        </div>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-[#8B3A3A] text-center mb-6">Favorites</h2>

        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          {["All", ...CATEGORIES].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                selectedCategory === category
                  ? "bg-[#8B3A3A] text-white"
                  : "bg-white text-[#8B3A3A] border-2 border-[#8B3A3A] hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredFavoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No favorite items yet. Start adding your favorite foods!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFavoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onAddToCart={() => addToCart(product)}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
