
import { useState, useEffect } from "react"
import Header from '../components/header'
import Navigation from '../components/navigation'
import HeroBanner from '../components/hero-banner'
import ProductCard from '../components/product-card'


const CATEGORIES = ["Meals", "Foods", "Snacks", "Beverages"]

const PRODUCTS = [
  // MEALS
  { id: 1, name: "Chicken Meal", price: 95, category: "Meals", image: "/chicken-meal.jpg" },
  { id: 2, name: "Fish Meal", price: 85, category: "Meals", image: "/fish-meal.jpg" },
  { id: 3, name: "Beef Steak Meal", price: 120, category: "Meals", image: "/beef-steak-meal.jpg" },
  { id: 4, name: "Pork Combo Meal", price: 105, category: "Meals", image: "/pork-combo.jpg" },
  { id: 5, name: "Vegetarian Meal", price: 75, category: "Meals", image: "/colorful-vegetarian-meal.png" },
  { id: 6, name: "Seafood Platter", price: 130, category: "Meals", image: "/seafood-platter.png" },
  { id: 7, name: "Mixed Grill Meal", price: 125, category: "Meals", image: "/mixed-grill.png" },
  { id: 8, name: "Pasta Carbonara Meal", price: 90, category: "Meals", image: "/pasta-carbonara.png" },

  // FOODS
  { id: 9, name: "Rice", price: 50, category: "Foods", image: "/bowl-of-steamed-rice.jpg" },
  { id: 10, name: "Fried Rice", price: 60, category: "Foods", image: "/fried-rice.png" },
  { id: 11, name: "Panipat Biryani", price: 80, category: "Foods", image: "/flavorful-biryani.jpg" },
  { id: 12, name: "Sunny Side Up", price: 50, category: "Foods", image: "/assorted-eggs-fried.jpg" },
  { id: 13, name: "Spaghetti", price: 75, category: "Foods", image: "/classic-spaghetti.jpg" },
  { id: 14, name: "Chicken Adobo", price: 85, category: "Foods", image: "/chicken-adobo.jpg" },
  { id: 15, name: "Fried Chicken", price: 90, category: "Foods", image: "/crispy-fried-chicken.png" },
  { id: 16, name: "Vegetables", price: 40, category: "Foods", image: "/assorted-vegetables.png" },

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

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("Foods")
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

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const filteredProducts = PRODUCTS.filter((p) => p.category === selectedCategory)

  const addToCart = (product, quantity) => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existing = existingCart.find((item) => item.id === product.id)

    let updatedCart
    if (existing) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      )
    } else {
      updatedCart = [...existingCart, { ...product, quantity }]
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart))
    setCart(updatedCart)
  }

  const toggleFavorite = (id) => {
    setFavorites(
      favorites.includes(id)
        ? favorites.filter((f) => f !== id)
        : [...favorites, id]
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <Navigation
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      {selectedCategory === "Meals" && <HeroBanner />}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white bg-[#8B3A3A] text-center py-3 mb-6 rounded">
            {selectedCategory}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={favorites.includes(product.id)}
                onAddToCart={(quantity) => addToCart(product, quantity)}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
