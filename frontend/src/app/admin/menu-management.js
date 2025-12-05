import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import AdminSidebar from '../../components/admin-sidebar';

const CATEGORIES = ["Meals", "Food", "Snacks", "Beverages"];
const API_BASE_URL = "http://localhost:8080/api";

export default function MenuManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Meals',
    stock: '',
    image: '',
    imageFile: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/menu/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        alert('Failed to load products from server');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

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
      image: '/placeholder.svg',
      imageFile: null
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
      image: product.image || product.imageUrl || '/placeholder.svg',
      imageFile: null
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/admin/menu/products/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Product deleted successfully!');
          fetchProducts();
        } else {
          const error = await response.text();
          alert('Failed to delete product: ' + error);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error connecting to server');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock || 0);

      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      } else if (editingProduct && formData.image) {
        formDataToSend.append('existingImage', formData.image);
      }

      let response;
      if (editingProduct) {
        response = await fetch(`${API_BASE_URL}/admin/menu/products/${editingProduct.id}`, {
          method: 'PUT',
          body: formDataToSend,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/admin/menu/products`, {
          method: 'POST',
          body: formDataToSend,
        });
      }

      if (response.ok) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        fetchProducts();
        setShowModal(false);
        setFormData({
          name: '',
          price: '',
          category: 'Meals',
          stock: '',
          image: '',
          imageFile: null
        });
      } else {
        const error = await response.text();
        alert('Failed to save product: ' + error);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="fixed left-0 top-0 h-screen z-50">
          <AdminSidebar currentPage="/admin/menu" />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A3A] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed */}
      <div className="fixed left-0 top-0 h-screen z-50">
        <AdminSidebar currentPage="/admin/menu" />
      </div>

      {/* Main Content - With left margin */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-[#8B3A3A] text-white shadow-lg sticky top-0 z-40">
          <div className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Menu Management</h1>
            </div>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-[#FFD700] text-[#8B3A3A] px-4 py-1 rounded-lg hover:bg-yellow-400 transition font-semibold"
              disabled={loading}
            >
              <Plus size={20} />
              Add New Item
            </button>
          </div>
        </header>

        <div className="px-6 py-8">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
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
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={product.image?.startsWith('/uploads')
                    ? `http://localhost:8080${product.image}`
                    : (product.image || "/placeholder.svg")}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-red-600">
                      ₱{product.price.toFixed(2)}
                    </span>
                    <span className={`text-sm font-semibold ${
                      product.stock > 10 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      Stock: {product.stock || 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                      disabled={loading}
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
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

                {/* Loading Indicator */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <img 
                                src="/teknoeats-loading.png" 
                                alt="Loading" 
                                className="w-20 h-20 animate-pulse"
                            />
                            <p className="text-gray-600">Loading...</p>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                        >
                            <img
                                src={product.image || product.imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-lg font-bold text-red-600">
                                        ₱{product.price.toFixed(2)}
                                    </span>
                                    <span className={`text-sm font-semibold ${
                                        product.stock > 10 ? 'text-green-600' : 'text-orange-600'
                                    }`}>
                                        Stock: {product.stock || 0}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEditProduct(product)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                                        disabled={loading}
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                                        disabled={loading}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          )}
        </div>
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
                disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({
                        ...formData,
                        imageFile: file,
                        image: URL.createObjectURL(file)
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#8B3A3A] focus:outline-none"
                  disabled={loading}
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={formData.image.startsWith('blob:')
                        ? formData.image
                        : `http://localhost:8080${formData.image}`}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border-2 border-gray-300"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#8B3A3A] text-white rounded-lg hover:bg-[#6B2A2A] transition font-semibold disabled:bg-gray-400"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update' : 'Add')} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}