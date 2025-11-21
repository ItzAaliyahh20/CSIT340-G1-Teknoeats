
import { useState, useEffect } from "react"
import Sidebar from '../components/sidebar'
import ProductCard from '../components/product-card'
import { useNavigate } from 'react-router-dom';
import { Search } from "lucide-react"

const CATEGORIES = ["Meals", "Food", "Snacks", "Beverages"]

// All products from the main page
const ALL_PRODUCTS = [
  // MEALS
  { id: 1, name: "Chicken Meal", price: 95, category: "Meals", image: "/chicken-meal.jpg" },
  { id: 2, name: "Fish Meal", price: 85, category: "Meals", image: "/fish-meal.jpg" },
  { id: 3, name: "Beef Steak Meal", price: 120, category: "Meals", image: "/beef-steak-meal.jpg" },
  { id: 4, name: "Pork Combo Meal", price: 105, category: "Meals", image: "/pork-combo.jpg" },
  { id: 5, name: "Vegetarian Meal", price: 75, category: "Meals", image: "/colorful-vegetarian-meal.png" },
  { id: 6, name: "Seafood Platter", price: 130, category: "Meals", image: "/seafood-platter.png" },
  { id: 7, name: "Mixed Grill Meal", price: 125, category: "Meals", image: "/mixed-grill.png" },
  { id: 8, name: "Pasta Carbonara Meal", price: 90, category: "Meals", image: "/pasta-carbonara.png" },

  // FOOD
  { id: 9, name: "Rice", price: 50, category: "Food", image: "/bowl-of-steamed-rice.jpg" },
  { id: 10, name: "Fried Rice", price: 60, category: "Food", image: "/fried-rice.png" },
  { id: 11, name: "Panipat Biryani", price: 80, category: "Food", image: "/flavorful-biryani.jpg" },
  { id: 12, name: "Sunny Side Up", price: 50, category: "Food", image: "/assorted-eggs-fried.jpg" },
  { id: 13, name: "Spaghetti", price: 75, category: "Food", image: "/classic-spaghetti.jpg" },
  { id: 14, name: "Chicken Adobo", price: 85, category: "Food", image: "/chicken-adobo.jpg" },
  { id: 15, name: "Fried Chicken", price: 90, category: "Food", image: "/crispy-fried-chicken.png" },
  { id: 16, name: "Vegetables", price: 40, category: "Food", image: "/assorted-vegetables.png" },

  // SNACKS
  { id: 17, name: "French Fries", price: 45, category: "Snacks", image: "/golden-french-fries.jpg" },
  { id: 18, name: "Fried Spring Rolls", price: 55, category: "Snacks", image: "/crispy-spring-rolls.jpg" },
  { id: 19, name: "Chicken Wings", price: 65, category: "Snacks", image: "/spicy-chicken-wings.png" },
  { id: 20, name: "Mozzarella Sticks", price: 50, category: "Snacks", image: "/melted-mozzarella-sticks.jpg" },
  { id: 21, name: "Nachos", price: 70, category: "Snacks", image: "/loaded-nachos.png" },
  { id: 22, name: "Samosa", price: 35, category: "Snacks", image: "/spiced-samosa.jpg" },
  { id: 23, name: "Onion Rings", price: 40, category: "Snacks", image: "/crispy-onion-rings.png" },
  { id: 24, name: "Calamari Rings", price: 85, category: "Snacks", image: "/fried-calamari.png" },

  // BEVERAGES
  { id: 25, name: "Iced Tea", price: 30, category: "Beverages", image: "/refreshing-iced-tea.jpg" },
  { id: 26, name: "Orange Juice", price: 35, category: "Beverages", image: "/fresh-orange-juice.png" },
  { id: 27, name: "Coca Cola", price: 25, category: "Beverages", image: "/cola-drink-bottle.jpg" },
  { id: 28, name: "Sprite", price: 25, category: "Beverages", image: "/sprite-lemon-drink.jpg" },
  { id: 29, name: "Mango Shake", price: 50, category: "Beverages", image: "/placeholder.svg?height=200&width=200" },
  { id: 30, name: "Strawberry Lemonade", price: 45, category: "Beverages", image: "/placeholder.svg?height=200&width=200" },
  { id: 31, name: "Iced Coffee", price: 40, category: "Beverages", image: "/placeholder.svg?height=200&width=200" },
  { id: 32, name: "Bottled Water", price: 15, category: "Beverages", image: "/placeholder.svg?height=200&width=200" },
]

export default function FavoritesPage() {
 const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites])

  const filteredFavoriteProducts = favorites
    .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
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

  const toggleFavorite = (id) => {
    setFavorites(favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id])
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
