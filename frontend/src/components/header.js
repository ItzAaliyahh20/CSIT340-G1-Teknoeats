"use client"

import { NavLink } from 'react-router-dom';
import { Heart, ShoppingCart, Clock, User } from "lucide-react"

export default function Header() {
  return (
    <div className="bg-white border-b">
      {/* Top bar */}
      <div className="bg-[#8B3A3A] text-white px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex gap-6">
          <NavLink to="#" className="hover:underline">
            About us
          </NavLink>
          <NavLink to="#" className="hover:underline">
            Customer Service
          </NavLink>
        </div>
        <NavLink to="/profile" className="flex items-center gap-2 hover:underline">
          <User size={16} />
          <span>Trixie Ann V. Rentuma</span>
        </NavLink>
      </div>

      {/* Main header */}
      <div className="bg-[#FFD700] px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-3xl font-bold text-[#8B3A3A]">
          TeknoEats
        </NavLink>

        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Search a product"
            className="w-full px-4 py-2 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="flex gap-4 items-center">
          <NavLink to="/favorites" className="text-[#8B3A3A] hover:scale-110 transition">
            <Heart size={24} />
          </NavLink>
          <NavLink to="/cart" className="text-[#8B3A3A] hover:scale-110 transition">
            <ShoppingCart size={24} />
          </NavLink>
          <NavLink to="/order" className="text-[#8B3A3A] hover:scale-110 transition">
            <Clock size={24} />
          </NavLink>
        </div>
      </div>
    </div>
  )
}
