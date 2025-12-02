import { useState, useEffect } from "react"
import Sidebar from '../components/sidebar'
import HeroBanner from '../components/hero-banner'
import ProductCard from '../components/product-card'
import { Search } from "lucide-react"
import { useSearchParams } from 'react-router-dom'
import { getFavorites, addToFavorites, removeFromFavorites, getCurrentUser, getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from '../services/api'

const API_BASE_URL = "http://localhost:8080/api";
const BACKEND_URL = "http://localhost:8080"; // Add this constant
const CATEGORIES = ["Dashboard", "Meals", "Food", "Snacks", "Beverages"]

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "Dashboard")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [favorites, setFavorites] = useState([])
  const [user, setUser] = useState(null)

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

  const filteredProducts = selectedCategory === "Dashboard" 
    ? products.filter((p) => p.category === "Meals")
    : products.filter((p) => p.category === selectedCategory)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar 
          categories={CATEGORIES} 
          selectedItem={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        <div className="ml-[250px] px-4 py-10">
          <p className="text-gray-600 text-lg">Loading products...</p>
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
          {selectedCategory === "Dashboard" && <HeroBanner />}
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white bg-[#8B3A3A] text-center py-3 mb-6 rounded">
              {selectedCategory === "Dashboard" ? "Popular Items" : selectedCategory}
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