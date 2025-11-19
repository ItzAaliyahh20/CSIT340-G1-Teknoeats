"use client"

import { NavLink } from 'react-router-dom';
import { Heart, ShoppingCart, Clock, User, ChefHat, Apple, Cookie, Coffee, LayoutDashboard, LogOut } from "lucide-react"

export default function Sidebar({ categories, selectedCategory, onSelectCategory }) {
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
        <NavLink to="/" className="flex items-center justify-center">
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
                selectedCategory === category
                  ? "text-[#8B3A3A] pl-4"
                  : "text-gray-600 hover:text-[#8B3A3A] pl-2"
              }`}
            >
              {selectedCategory === category && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8B3A3A] to-[#FFD700] animate-pulse"></div>
              )}
              {getIcon(category)}
              {category}
            </button>
          ))}
          <NavLink to="/favorites" className="flex items-center gap-2 text-left font-semibold text-lg py-2 text-gray-600 hover:text-[#8B3A3A] pl-2">
            <Heart size={24} className="ml-2" />
            Favorites
          </NavLink>
          <NavLink to="/cart" className="flex items-center gap-2 text-left font-semibold text-lg py-2 text-gray-600 hover:text-[#8B3A3A] pl-2">
            <ShoppingCart size={24} className="ml-2" />
            Cart
          </NavLink>
          <NavLink to="/order" className="flex items-center gap-2 text-left font-semibold text-lg py-2 text-gray-600 hover:text-[#8B3A3A] pl-2">
            <Clock size={24} className="ml-2" />
            My Orders
          </NavLink>
          <div className="h-4"></div>
          <NavLink to="/profile" className="flex items-center gap-2 text-left font-semibold text-lg py-2 text-gray-600 hover:text-[#8B3A3A] pl-2">
            <User size={24} className="ml-2" />
            Profile
          </NavLink>
          <button className="flex items-center gap-2 text-left font-semibold text-lg py-2 text-gray-600 hover:text-[#8B3A3A] pl-2">
            <LogOut size={24} className="ml-2" />
            Log Out
          </button>
        </div>
      </nav>
    </div>
  )
}