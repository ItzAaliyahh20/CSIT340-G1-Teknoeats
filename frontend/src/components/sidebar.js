import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, ShoppingCart, Clock, User, ChefHat, Apple, Cookie, Coffee, LayoutDashboard, LogOut, UserCheck, IceCream } from "lucide-react"
import { getCurrentUser } from '../services/api'
import { useLogout } from '../contexts/LogoutContext'

export default function Sidebar({ categories, selectedItem, onSelectCategory, shadow }) {
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { openLogoutModal } = useLogout();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get current search parameter to preserve it in navigation
    const currentSearch = searchParams.get('search');
    const searchParam = currentSearch ? `?search=${encodeURIComponent(currentSearch)}` : '';

   useEffect(() => {
     const fetchUserData = async () => {
       try {
         // Check if user is logged in first
         const userData = localStorage.getItem('user')
         if (!userData) {
           setIsLoggedIn(false)
           setUserName('')
           return
         }

         const user = JSON.parse(userData)
         if (!user || !user.id) {
           setIsLoggedIn(false)
           setUserName('')
           return
         }

         // User appears to be logged in, fetch fresh data from API
         const freshUserData = await getCurrentUser()

         // Update with fresh data
         const fullName = `${freshUserData.firstName || ''} ${freshUserData.lastName || ''}`.trim()
         const displayName = fullName || freshUserData.email || 'User'
         setUserName(displayName)
         setIsLoggedIn(true)

       } catch (error) {
         console.error('Error fetching user data for greeting:', error)
         // If API call fails, user might not be logged in or there's a network issue
         setIsLoggedIn(false)
         setUserName('')
       }
     }

     fetchUserData()
   }, [])


  const getIcon = (category) => {
    switch (category) {
      case 'Dashboard': return <LayoutDashboard size={24} className="ml-2" />;
      case 'Meals': return <ChefHat size={24} className="ml-2" />;
      case 'Food': return <Apple size={24} className="ml-2" />;
      case 'Snacks': return <Cookie size={24} className="ml-2" />;
      case 'Beverages': return <Coffee size={24} className="ml-2" />;
      case 'Others': return <IceCream size={24} className="ml-2" />;
      default: return null;
    }
  };

  return (
    <div className={`fixed left-0 top-0 w-[250px] h-screen bg-white border-r flex flex-col z-10 ${shadow ? 'shadow-xl' : ''}`}>
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
          <NavLink to={`/favorites${searchParam}`} className={`relative flex items-center gap-2 text-left font-semibold text-lg py-2 transition-colors ${
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
          <NavLink to={`/cart${searchParam}`} className={`relative flex items-center gap-2 text-left font-semibold text-lg py-2 transition-colors ${
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
          <NavLink to={`/order${searchParam}`} className={`relative flex items-center gap-2 text-left font-semibold text-lg py-2 transition-colors ${
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
          <button onClick={openLogoutModal} className="flex items-center gap-2 text-left font-semibold text-lg py-2 text-gray-600 hover:text-[#8B3A3A] pl-2">
            <LogOut size={24} className="ml-2" />
            Log Out
          </button>
        </div>
      </nav>

      {/* Welcome User Section - Only show when logged in */}
      {isLoggedIn && (
        <div className="px-4 pb-4 mt-auto">
          <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFC107]/20 rounded-lg p-3 border border-[#FFD700]/30">
            <div className="flex items-center gap-2">
              <UserCheck size={20} className="text-[#8B3A3A] flex-shrink-0" />
              <p className="text-sm font-semibold text-[#8B3A3A] truncate">
                Welcome! {userName}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}