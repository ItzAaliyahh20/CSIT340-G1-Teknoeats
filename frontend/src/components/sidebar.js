"use client"

import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Clock, User, ChefHat, Apple, Cookie, Coffee, LayoutDashboard, LogOut } from "lucide-react"

export default function Sidebar({ categories, selectedItem, onSelectCategory }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Here you can add logout logic, like clearing localStorage
    navigate('/');
  };

  const getIcon = (category) => {
    switch (category) {
      case 'Dashboard': return <LayoutDashboard size={24} className="ml-2" />;
      case 'Meals': return <ChefHat size={24} className="ml-2" />;
      case 'Food': return <Apple size={24} className="ml-2" />;
      case 'Snacks': return <Cookie size={24} className="ml-2" />;
      case 'Beverages': return <Coffee size={24} className="ml-2" />;
      default: return null;
    }
  };

  return (
    <div className="fixed left-0 top-0 w-[250px] h-screen bg-white border-r flex flex-col z-10">
      {/* Logo */}
      <div className="p-4 pt-8 pb-8">
        <NavLink to="/home?category=Dashboard" className="flex items-center justify-center">
          <img src="/teknoeats-logo.png" alt="TeknoEats" className="h-10 w-auto" />
        </NavLink>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <div className="flex flex-col gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`relative flex items-center gap-2 text-left font-semibold text-lg py-2 transition-colors ${
                selectedItem === category
                  ? "text-[#8B3A3A] pl-4"
                  : "text-gray-600 hover:text-[#8B3A3A] pl-2"
              }`}
            >
              {selectedItem === category && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B3A3A] to-[#FFD700] animate-pulse"></div>
              )}
              {getIcon(category)}
              {category}
            </button>
          ))}
          <NavLink to="/favorites" className={`relative flex items-center gap-2 text-left font-semibold text-lg py-2 transition-colors ${
            selectedItem === 'favorites'
              ? "text-[#8B3A3A] pl-4"
              : "text-gray-600 hover:text-[#8B3A3A] pl-2"
          }`}>
            {selectedItem === 'favorites' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B3A3A] to-[#FFD700] animate-pulse"></div>
            )}
            <Heart size={24} className="ml-2" />
            Favorites
          </NavLink>
          <NavLink to="/cart" className={`relative flex items-center gap-2 text-left font-semibold text-lg py-2 transition-colors ${
            selectedItem === 'cart'
              ? "text-[#8B3A3A] pl-4"
              : "text-gray-600 hover:text-[#8B3A3A] pl-2"
          }`}>
            {selectedItem === 'cart' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B3A3A] to-[#FFD700] animate-pulse"></div>
            )}
            <ShoppingCart size={24} className="ml-2" />
            Cart
          </NavLink>
          <NavLink to="/order" className={`relative flex items-center gap-2 text-left font-semibold text-lg py-2 transition-colors ${
            selectedItem === 'orders'
              ? "text-[#8B3A3A] pl-4"
              : "text-gray-600 hover:text-[#8B3A3A] pl-2"
          }`}>
            {selectedItem === 'orders' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B3A3A] to-[#FFD700] animate-pulse"></div>
            )}
            <Clock size={24} className="ml-2" />
            My Orders
          </NavLink>
          <div className="h-4"></div>
          <NavLink to="/profile" className={`relative flex items-center gap-2 text-left font-semibold text-lg py-2 transition-colors ${
            selectedItem === 'profile'
              ? "text-[#8B3A3A] pl-4"
              : "text-gray-600 hover:text-[#8B3A3A] pl-2"
          }`}>
            {selectedItem === 'profile' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B3A3A] to-[#FFD700] animate-pulse"></div>
            )}
            <User size={24} className="ml-2" />
            Profile
          </NavLink>
          <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-2 text-left font-semibold text-lg py-2 text-gray-600 hover:text-[#8B3A3A] pl-2">
            <LogOut size={24} className="ml-2" />
            Log Out
          </button>
        </div>
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-[#8B3A3A] mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-[#8B3A3A] text-white py-2 rounded font-bold hover:bg-[#6B2A2A] transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}