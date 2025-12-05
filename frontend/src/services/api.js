import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Auth APIs using axios
export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
}

// Products
export const getProducts = (category) =>
  api.get(category ? `/products?category=${category}` : "/products").then((res) => res.data)

export const getProductById = (id) => api.get(`/products/${id}`).then((res) => res.data)

// Cart
export const addToCart = (userId, productId, quantity) =>
  api.post("/cart/add", { userId, productId, quantity }).then((res) => res.data)

export const getCart = (userId) => api.get(`/cart/${userId}`).then((res) => res.data)

export const removeFromCart = (userId, productId) =>
  api.post("/cart/remove", { userId, productId }).then((res) => res.data)

// Orders
export const createOrder = (userId, cartItems, paymentMethod, pickupTime) =>
  api.post("/orders/create", { userId, cartItems, paymentMethod, pickupTime }).then((res) => res.data)

export const getOrders = (userId) => api.get(`/orders/${userId}`).then((res) => res.data)

export const getOrderById = (orderId) => api.get(`/orders/detail/${orderId}`).then((res) => res.data)

// Users
export const getUserProfile = (userId) => api.get(`/users/${userId}`).then((res) => res.data)

export const getCurrentUser = () => {
  const userData = localStorage.getItem('user')
  if (userData) {
    const user = JSON.parse(userData)
    if (user && user.userId) {
      return api.get(`/users/${user.userId}`).then((res) => res.data)
    }
  }
  return Promise.reject(new Error('No user logged in'))
}

export const updateUserProfile = (userId, profileData) =>
  api.put(`/users/${userId}`, profileData).then((res) => res.data)

// Favorites
export const addToFavorites = (userId, productId) =>
  api.post("/favorites/add", { userId, productId }).then((res) => res.data)

export const removeFromFavorites = (userId, productId) =>
  api.post("/favorites/remove", { userId, productId }).then((res) => res.data)

export const getFavorites = (userId) => api.get(`/favorites/${userId}`).then((res) => res.data)


//
export default api
