import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  X
} from 'lucide-react';

const CATEGORIES = ["Meals", "Foods", "Snacks", "Beverages"];

// Initial products data
const INITIAL_PRODUCTS = [
  // MEALS
  { id: 1, name: "Chicken Meal", price: 95, category: "Meals", image: "/chicken-meal.jpg", stock: 20 },
  { id: 2, name: "Fish Meal", price: 85, category: "Meals", image: "/fish-meal.jpg", stock: 15 },
  { id: 3, name: "Beef Steak Meal", price: 120, category: "Meals", image: "/beef-steak-meal.jpg", stock: 10 },
  { id: 4, name: "Pork Combo Meal", price: 105, category: "Meals", image: "/pork-combo.jpg", stock: 12 },
  { id: 5, name: "Vegetarian Meal", price: 75, category: "Meals", image: "/colorful-vegetarian-meal.png", stock: 18 },
  { id: 6, name: "Seafood Platter", price: 130, category: "Meals", image: "/seafood-platter.png", stock: 8 },
  { id: 7, name: "Mixed Grill Meal", price: 125, category: "Meals", image: "/mixed-grill.png", stock: 10 },
  { id: 8, name: "Pasta Carbonara Meal", price: 90, category: "Meals", image: "/pasta-carbonara.png", stock: 15 },
  // FOODS
  { id: 9, name: "Rice", price: 50, category: "Foods", image: "/bowl-of-steamed-rice.jpg", stock: 50 },
  { id: 10, name: "Fried Rice", price: 60, category: "Foods", image: "/fried-rice.png", stock: 30 },
  { id: 11, name: "Panipat Biryani", price: 80, category: "Foods", image: "/flavorful-biryani.jpg", stock: 20 },
  { id: 12, name: "Sunny Side Up", price: 50, category: "Foods", image: "/assorted-eggs-fried.jpg", stock: 40 },
  { id: 13, name: "Spaghetti", price: 75, category: "Foods", image: "/classic-spaghetti.jpg", stock: 25 },
  { id: 14, name: "Chicken Adobo", price: 85, category: "Foods", image: "/chicken-adobo.jpg", stock: 20 },
  { id: 15, name: "Fried Chicken", price: 90, category: "Foods", image: "/crispy-fried-chicken.png", stock: 18 },
  { id: 16, name: "Vegetables", price: 40, category: "Foods", image: "/assorted-vegetables.png", stock: 35 },
  // SNACKS
  { id: 17, name: "French Fries", price: 45, category: "Snacks", image: "/golden-french-fries.jpg", stock: 30 },
  { id: 18, name: "Fried Spring Rolls", price: 55, category: "Snacks", image: "/crispy-spring-rolls.jpg", stock: 25 },
  { id: 19, name: "Chicken Wings", price: 65, category: "Snacks", image: "/spicy-chicken-wings.png", stock: 20 },
  { id: 20, name: "Mozzarella Sticks", price: 50, category: "Snacks", image: "/melted-mozzarella-sticks.jpg", stock: 22 },
  { id: 21, name: "Nachos", price: 70, category: "Snacks", image: "/loaded-nachos.png", stock: 18 },
  { id: 22, name: "Samosa", price: 35, category: "Snacks", image: "/spiced-samosa.jpg", stock: 30 },
  { id: 23, name: "Onion Rings", price: 40, category: "Snacks", image: "/crispy-onion-rings.png", stock: 25 },
  { id: 24, name: "Calamari Rings", price: 85, category: "Snacks", image: "/fried-calamari.png", stock: 15 },
  // BEVERAGES
  { id: 25, name: "Iced Tea", price: 30, category: "Beverages", image: "/refreshing-iced-tea.jpg", stock: 50 },
  { id: 26, name: "Orange Juice", price: 35, category: "Beverages", image: "/fresh-orange-juice.png", stock: 40 },
  { id: 27, name: "Coca Cola", price: 25, category: "Beverages", image: "/cola-drink-bottle.jpg", stock: 60 },
  { id: 28, name: "Sprite", price: 25, category: "Beverages", image: "/sprite-lemon-drink.jpg", stock: 55 },
  { id: 29, name: "Mango Shake", price: 50, category: "Beverages", image: "/placeholder.svg", stock: 30 },
  { id: 30, name: "Strawberry Lemonade", price: 45, category: "Beverages", image: "/placeholder.svg", stock: 28 },
  { id: 31, name: "Iced Coffee", price: 40, category: "Beverages", image: "/placeholder.svg", stock: 35 },
  { id: 32, name: "Bottled Water", price: 15, category: "Beverages", image: "/placeholder.svg", stock: 100 },
];

export default function MenuManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Meals',
    stock: '',
    image: ''
  });

  useEffect(() => {
    // Initialize products from localStorage or use default
    const savedProducts = localStorage.getItem('menuProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('menuProducts', JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: 'Meals',
      stock: '',
      image: '/placeholder.svg'
    });
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock || 0,
      image: product.image
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      localStorage.setItem('menuProducts', JSON.stringify(updatedProducts));
      alert('Product deleted successfully!');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) || 0 }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('menuProducts', JSON.stringify(updatedProducts));
      alert('Product updated successfully!');
    } else {
      // Add new product
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem('menuProducts', JSON.stringify(updatedProducts));
      alert('Product added successfully!');
    }

    setShowModal(false);
    setFormData({
      name: '',
      price: '',
      category: 'Meals',
      stock: '',
      image: '/placeholder.svg'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#8B3A3A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="hover:bg-[#6B2A2A] p-2 rounded transition"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Menu Management</h1>
          </div>
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-[#FFD700] text-[#8B3A3A] px-4 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold"
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === "All"
                    ? "bg-[#8B3A3A] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === category
                      ? "bg-[#8B3A3A] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-red-600">₱{product.price.toFixed(2)}</span>
                  <span className={`text-sm font-semibold ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                    Stock: {product.stock || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price (₱) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none"
                  placeholder="/placeholder.svg"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#8B3A3A] text-white rounded-lg hover:bg-[#6B2A2A] transition font-semibold"
                >
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}