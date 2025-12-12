import React, { createContext, useContext, useState } from 'react';
import { LogOut } from 'lucide-react';
import { secureRemove } from '../utils/secureStorage';

const LogoutContext = createContext();

export const useLogout = () => {
  const context = useContext(LogoutContext);
  if (!context) {
    throw new Error('useLogout must be used within a LogoutProvider');
  }
  return context;
};

export const LogoutProvider = ({ children }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCustomerLogoutModal, setShowCustomerLogoutModal] = useState(false);

  const handleLogout = () => {
    secureRemove('user');
    window.location.href = '/login';
  };

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  const openCustomerLogoutModal = () => setShowCustomerLogoutModal(true);
  const closeCustomerLogoutModal = () => setShowCustomerLogoutModal(false);

  return (
    <LogoutContext.Provider value={{ openLogoutModal, openCustomerLogoutModal }}>
      {children}

      {/* Global Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <LogOut size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeLogoutModal}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  closeLogoutModal();
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Logout Modal */}
      {showCustomerLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-center w-16 h-16 bg-[#a0505033] rounded-full mx-auto mb-4">
              <LogOut size={32} className="text-[#8B3A3A]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeCustomerLogoutModal}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  closeCustomerLogoutModal();
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#8B3A3A] to-[#8B3A3A] text-white rounded-lg font-semibold hover:from-[#7f1d1d] hover:to-[#7a3232] transition shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </LogoutContext.Provider>
  );
};