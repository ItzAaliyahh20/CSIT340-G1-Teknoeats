
import { useState, useEffect } from "react"
import Sidebar from '../components/sidebar'
import { Search } from "lucide-react"
import { getUserProfile, updateUserProfile } from '../services/api'

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
     const fetchUserProfile = async () => {
       try {
         const user = JSON.parse(localStorage.getItem('user'))
         if (user && user.id) {
           const response = await getUserProfile(user.id)
           setProfileData({
             firstName: response.firstName || "",
             lastName: response.lastName || "",
             email: response.email || "",
             phoneNumber: response.phoneNumber || "",
             address: response.address || "",
           })
         } else {
           setError("User not logged in")
         }
       } catch (err) {
         setError("Failed to load profile data")
         console.error(err)
       } finally {
         setLoading(false)
       }
     }

     fetchUserProfile()
   }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='profile' onSelectCategory={(category) => window.location.href = '/home?category=' + category} />
      <div className="ml-[250px]">
        <div className="bg-[#FFD700] px-8 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Looking for something?"
              className="w-full px-4 py-2 pl-10 rounded-full bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} strokeWidth={3} />
          </div>
        </div>
        <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading profile...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders Section */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#8B3A3A] mb-6">My Orders</h2>
              <div className="bg-white rounded-lg p-6">
                <div className="flex gap-4 mb-6">
                  {["All", "Active", "Past"].map((tab) => (
                    <button key={tab} className="px-4 py-2 text-gray-600 hover:text-[#8B3A3A] font-semibold">
                      {tab}
                    </button>
                  ))}
                </div>
                <p className="text-gray-600">No orders yet</p>
              </div>
            </div>

            {/* Profile Section */}
            <div className="bg-[#FFD700] rounded-lg p-6 h-fit">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-600 font-bold">
                    {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#8B3A3A]">Profile Information</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#8B3A3A] mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded border border-gray-300 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#8B3A3A] mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded border border-gray-300 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#8B3A3A] mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded border border-gray-300 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#8B3A3A] mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded border border-gray-300 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#8B3A3A] mb-1">Address</label>
                  <input
                    type="text"
                    value={profileData.address}
                    disabled={!isEditing}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white rounded border border-gray-300 disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#8B3A3A] focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {isEditing ? (
                  <div className="flex gap-3">
                    <button
                      onClick={async () => {
                        try {
                          const user = JSON.parse(localStorage.getItem('user'))
                          if (user && user.id) {
                            await updateUserProfile(user.id, profileData)
                            alert("Profile updated successfully!")
                            setIsEditing(false)
                          }
                        } catch (err) {
                          alert("Failed to update profile")
                          console.error(err)
                        }
                      }}
                      className="flex-1 bg-[#8B3A3A] text-white py-2 rounded font-bold hover:bg-[#6B2A2A] transition"
                      disabled={loading}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 rounded font-bold hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-white text-[#8B3A3A] py-2 rounded font-bold hover:bg-gray-100 transition border-2 border-[#8B3A3A]"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
