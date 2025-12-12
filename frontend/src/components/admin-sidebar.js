import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../contexts/LogoutContext';
import { secureGet } from '../utils/secureStorage';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Users,
  TrendingUp,
  LogOut
} from 'lucide-react';

export default function AdminSidebar({ currentPage }) {
  const [isCollapsed] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const { openLogoutModal } = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    const user = secureGet('user') || {};
    setAdminData(user);
  }, []);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/menu', icon: UtensilsCrossed, label: 'Menu' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/reports', icon: TrendingUp, label: 'Reports' },
  ];

  return (
    <>
      <div className={`h-full bg-white border-r border-gray-200 shadow-lg transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Header */}
        <div className="p-4 pt-5 pb-6 border-b border-gray-200 bg-gradient-to-r from-[#8B3A3A] to-[#6B2A2A] flex-shrink-0">
          <div className="flex items-center justify-center">
            {!isCollapsed && (
              <div 
                className="flex items-center gap-2 cursor-pointer" 
                onClick={() => navigate('/admin/dashboard')}
              >
                <img 
                  src="/teknoeats-logo.png" 
                  alt="TeknoEats" 
                  className="h-10 w-auto" 
                />
              </div>
            )}
            
          </div>
        </div>

        {/* Admin Profile - Expanded */}
        {!isCollapsed && (
          <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-[#FFD700]/10 to-[#FFC107]/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B3A3A] to-[#6B2A2A] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {adminData?.firstName?.charAt(0) || 'A'}{adminData?.lastName?.charAt(0) || 'D'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate text-sm">
                  {adminData?.firstName || 'Admin'} {adminData?.lastName || 'User'}
                </p>
                <p className="text-xs text-[#8B3A3A] font-semibold">Administrator</p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Profile - Collapsed */}
        {isCollapsed && (
          <div className="p-3 border-b border-gray-200 flex justify-center bg-gradient-to-br from-[#FFD700]/10 to-[#FFC107]/10 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-[#8B3A3A] to-[#6B2A2A] rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {adminData?.firstName?.charAt(0) || 'A'}{adminData?.lastName?.charAt(0) || 'D'}
            </div>
          </div>
        )}

        {/* Navigation Menu - Scrollable */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPage === item.path;
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B3A3A] to-[#6B2A2A] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon size={22} className={isActive ? 'text-[#FFFFFF]' : ''} />
                  {!isCollapsed && (
                    <span className="font-semibold">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={openLogoutModal}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-semibold ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Log Out' : ''}
          >
            <LogOut size={22} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

    </>
  );
}