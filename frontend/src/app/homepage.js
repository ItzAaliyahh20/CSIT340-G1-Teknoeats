
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
  { id: 17, name: "Hotcake", price: 10, category: "Snacks", image: "/snacks/hotcake.png" },
  { id: 18, name: "Mango Float", price: 55, category: "Snacks", image: "/snacks/mangoFloat.png" },
  { id: 19, name: "Meat Roll", price: 20, category: "Snacks", image: "/snacks/meatRoll.png" },
  { id: 20, name: "Banana Cue", price: 20, category: "Snacks", image: "/snacks/bananaCue.png" },
  { id: 21, name: "Nachos", price: 70, category: "Snacks", image: "/snacks/nachos.png" },
  { id: 22, name: "Bread Loaf", price: 85, category: "Snacks", image: "/snacks/breadLoaf.png" },
  { id: 23, name: "Kutsinta", price: 15, category: "Snacks", image: "/snacks/kutsinta.png" },
  { id: 24, name: "Popcorn", price: 40, category: "Snacks", image: "/snacks/popcorn.png" },

  // BEVERAGES
  { id: 25, name: "Iced Tea", price: 30, category: "Beverages", image: "/beverages/icedTea.png" },
  { id: 26, name: "Orange Juice", price: 35, category: "Beverages", image: "/beverages/orangeJuice.png" },
  { id: 27, name: "Coca Cola", price: 25, category: "Beverages", image: "/beverages/cola.png" },
  { id: 28, name: "Sprite", price: 25, category: "Beverages", image: "/beverages/sprite.png" },
  { id: 29, name: "Mango Shake", price: 50, category: "Beverages", image: "/beverages/mangoShake.png" },
  { id: 30, name: "Mountain Dew", price: 45, category: "Beverages", image: "/beverages/mountainDew.png" },
  { id: 31, name: "Coffee", price: 40, category: "Beverages", image: "/beverages/coffee.png" },
  { id: 32, name: "Bottled Water", price: 15, category: "Beverages", image: "/beverages/bottledWater.png" },
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
