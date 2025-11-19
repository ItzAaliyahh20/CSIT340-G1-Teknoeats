
import { useState, useEffect } from "react"
import Sidebar from '../components/sidebar'
import HeroBanner from '../components/hero-banner'
import ProductCard from '../components/product-card'


const CATEGORIES = ["Dashboard", "Meals", "Food", "Snacks", "Beverages"]

const PRODUCTS = [
  // MEALS
  { id: 1, name: "Canteen Special", price: 130, category: "Meals", image: "/meals/canteenSpecial.png" },
  { id: 2, name: "Tapa", price: 85, category: "Meals", image: "/meals/tapa.png" },
  { id: 3, name: "Lechon Kawali", price: 120, category: "Meals", image: "/meals/lechonKawali.png" },
  { id: 4, name: "Longganisa", price: 95, category: "Meals", image: "/meals/longganisa.png" },
  { id: 5, name: "Tocino", price: 100, category: "Meals", image: "/meals/tocino.png" },
  { id: 6, name: "Corned Beef", price: 95, category: "Meals", image: "/meals/cornedBeef.png" },
  { id: 7, name: "Ham", price: 95, category: "Meals", image: "/meals/ham.png" },
  { id: 8, name: "Siomai", price: 85, category: "Meals", image: "/meals/siomai.png" },

  // FOOD
  { id: 9, name: "Rice", price: 50, category: "Food", image: "/food/rice.png" },
  { id: 10, name: "Fried Rice", price: 60, category: "Food", image: "/food/friedRice.png" },
  { id: 11, name: "Pancit Bihon", price: 80, category: "Food", image: "/food/pancitBihon.png" },
  { id: 12, name: "Sunny Side Up", price: 50, category: "Food", image: "/food/sunnySideUp.png" },
  { id: 13, name: "Spaghetti", price: 75, category: "Food", image: "/food/spaghetti.png" },
  { id: 14, name: "Pork Adobo", price: 85, category: "Food", image: "/food/porkAdobo.png" },
  { id: 15, name: "Fried Chicken", price: 90, category: "Food", image: "/food/friedChicken.png" },
  { id: 16, name: "Baguio Beans", price: 40, category: "Food", image: "/food/baguioBeans.png" },

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
  const [selectedCategory, setSelectedCategory] = useState("Dashboard")
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

  const filteredProducts = selectedCategory === "Dashboard" ? PRODUCTS.filter((p) => p.category === "Meals") : PRODUCTS.filter((p) => p.category === selectedCategory)

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
      <Sidebar categories={CATEGORIES} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <div className="ml-[250px]">
        <div className="bg-[#FFD700] px-4 py-4">
          <input
            type="text"
            placeholder="Search a product"
            className="w-full px-4 py-2 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>
        {(selectedCategory === "Meals" || selectedCategory === "Dashboard") && <HeroBanner />}
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
    </div>
  )
}
