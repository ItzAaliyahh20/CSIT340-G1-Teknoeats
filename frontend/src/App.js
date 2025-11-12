import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from "./layout";
import SignUp from './Signup';
import Login from './Login';

// User pages
import Home from './app/homepage';
import Order from './app/order-page';
import Cart from './app/cart-page';
import Favorites from './app/favorites-page';
import Profile from './app/profile-page';

// Admin pages
import AdminDashboard from './app/admin/dashboard';
import MenuManagement from './app/admin/menu-management';
import OrderManagement from './app/admin/order-management';
import UserManagement from './app/admin/user-management';

// Canteen Personnel pages
import CanteenDashboard from './app/canteen/dashboard';
import OrderQueue from './app/canteen/order-queue';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user.role) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          
          {/* Customer routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order" 
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <Order />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <Cart />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <Favorites />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['Customer']}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/menu" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <MenuManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <OrderManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Canteen Personnel routes */}
          <Route 
            path="/canteen/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Canteen Personnel']}>
                <CanteenDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/canteen/orders" 
            element={
              <ProtectedRoute allowedRoles={['Canteen Personnel']}>
                <OrderQueue />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 and Unauthorized */}
          <Route 
            path="/unauthorized" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                  <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
                  <p className="text-gray-600">You don't have permission to access this page.</p>
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="mt-4 bg-[#8B3A3A] text-white px-6 py-2 rounded hover:bg-[#6B2A2A]"
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;