import axios from "axios"
import { secureGet } from "../utils/secureStorage"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include JWT token (disabled for now)
api.interceptors.request.use(
  (config) => {
    // JWT authentication disabled - no token header needed
    // const userData = localStorage.getItem('user')
    // if (userData) {
    //   const user = JSON.parse(userData)
    //   if (user && user.token) {
    //     config.headers.Authorization = `Bearer ${user.token}`
    //   }
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth APIs using axios
export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  adminLogin: (credentials) => api.post("/auth/admin/login", credentials),
}

// Products
export const getProducts = (category) =>
  api.get(category ? `/products?category=${category}` : "/products").then((res) => res.data)

export const getProductById = (id) => api.get(`/products/${id}`).then((res) => res.data)

// Cart functionality removed - now handled locally in frontend

// Orders
export const createOrder = (userId, orderData) =>
  api.post(`/orders/create?userId=${userId}`, orderData).then((res) => res.data)

export const getOrders = (userId) => api.get(`/orders/user/${userId}`).then((res) => res.data)

export const getOrderById = (orderId) => api.get(`/orders/${orderId}`).then((res) => res.data)

// Users
export const getUserProfile = (userId) => api.get(`/users/${userId}`).then((res) => res.data)

export const getCurrentUser = () => {
  const user = secureGet('user')
  if (user && user.userId) {
    // Return the user data from secure storage instead of making API call
    // This avoids authentication issues and provides immediate user data
    return Promise.resolve(user)
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

// Admin Orders
export const getAllOrders = () => api.get('/admin/orders').then((res) => res.data)

export const updateOrderStatus = (orderId, status) => api.put(`/admin/orders/${orderId}/status?status=${status}`).then((res) => res.data)

export const updateDeliveredOrdersToPickedUp = () => api.post('/admin/orders/update-delivered-to-picked-up').then((res) => res.data)

// Canteen Orders
export const getActiveOrders = () => api.get('/canteen/orders/active').then((res) => res.data)

export const getAllCanteenOrders = () => api.get('/canteen/orders').then((res) => res.data)

export const updateCanteenOrderStatus = (orderId, status) => api.put(`/canteen/orders/${orderId}/status?status=${status}`).then((res) => res.data)

export const getCanteenStats = () => api.get('/canteen/dashboard/stats').then((res) => res.data)

//
export default api
