import { useState, useEffect } from "react"
import Sidebar from '../components/sidebar'
import { getUserProfile, updateUserProfile, getCurrentUser } from '../services/api'

const API_BASE_URL = "http://localhost:8080/api";

export default function ProfilePage() {
   const [profileData, setProfileData] = useState({
     firstName: "",
     lastName: "",
     email: "",
     phoneNumber: "",
     address: "",
   })

   const [isEditing, setIsEditing] = useState(false)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)

   useEffect(() => {
        // In profile-page.js, replace the fetchUserProfile function:
        const fetchUserProfile = async () => {
            try {
                // The getCurrentUser function in api.js handles all the localStorage reading and parsing.
                console.log('Fetching current user profile...');
                
                // 🌟 FIX 1: Use the robust getCurrentUser() function
                const response = await getCurrentUser(); 
                
                console.log('API response received:', response);
                
                setProfileData({
                    firstName: response.firstName || "",
                    lastName: response.lastName || "",
                    email: response.email || "",
                    phoneNumber: response.phoneNumber || "",
                    address: response.address || "",
                });
                
                setLoading(false);

            } catch (err) {
                // This catch block will now handle "No user logged in" thrown by getCurrentUser()
                console.error('Error in fetchUserProfile:', err);
                // Use err.message to display the specific error (e.g., 'No user logged in')
                setError(`Failed to load profile data: ${err.message}`);
                setLoading(false);
            }
        }

        fetchUserProfile();
    }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='profile' onSelectCategory={(category) => window.location.href = '/home?category=' + category} />
      <div className="ml-[250px]">
        <div className="bg-[#FFD700] px-10 py-12 shadow-lg">
        </div>
        <main className="px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B3A3A] mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your profile...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-red-800 font-semibold text-lg mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}
        {!loading && !error && (
          <div className="flex justify-center items-start min-h-[calc(100vh-200px)] py-8">
            {/* Profile Section - Full Width */}
            <div className="w-full max-w-7xl">
              <div className="bg-gradient-to-br from-[#FFD700] to-[#FFC107] rounded-2xl shadow-2xl p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="w-32 h-32 bg-white rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <span className="text-4xl text-[#8B3A3A] font-bold">
                      {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#8B3A3A] mb-2">Profile Management</h2>
                  <p className="text-[#8B3A3A]/80 text-lg">Manage your account information</p>
                </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-[#8B3A3A] mb-6 text-center">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#8B3A3A] mb-2">First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition-all duration-200 text-gray-800"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#8B3A3A] mb-2">Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition-all duration-200 text-gray-800"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#8B3A3A] mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition-all duration-200 text-gray-800"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#8B3A3A] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phoneNumber}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition-all duration-200 text-gray-800"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#8B3A3A] mb-2">Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      disabled={!isEditing}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition-all duration-200 text-gray-800"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                {isEditing ? (
                  <div className="flex gap-4 w-full max-w-md">
                    <button
  onClick={async () => {
    try {
      // 🌟 FIX 2: Get the user ID from localStorage before updating
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const userId = user?.userId; // Use the userId field from your api.js definition

      if (!userId) {
        alert("Error: User is not logged in or ID is missing.");
        return;
      }
      
      console.log('Updating profile for user ID:', userId);
      console.log('Profile data to update:', profileData);

      // Pass the retrieved userId to the service function
      await updateUserProfile(userId, profileData); 
      
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile");
      console.error('Update error:', err);
    }
  }}
  className="flex-1 bg-[#8B3A3A] ..."
  disabled={loading}
>
  Save Changes
</button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-[#8B3A3A] py-3 px-8 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 border-2 border-[#8B3A3A] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
