
import { useState } from "react"
import Sidebar from '../components/sidebar'
import { LogOut } from "lucide-react"
import { Search } from "lucide-react"

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    username: "Trixie Ann V. Rentuma",
    email: "trixie@example.com",
    phone: "+63 9XX XXX XXXX",
    address: "CIT-U Campus",
  })

  const [isEditing, setIsEditing] = useState(false)

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
            <h3 className="text-xl font-bold text-[#8B3A3A] mb-6">Profile Information</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#8B3A3A] mb-1">Username</label>
                <input
                  type="text"
                  value={profileData.username}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded border border-gray-300 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8B3A3A] mb-1">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded border border-gray-300 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8B3A3A] mb-1">Phone</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded border border-gray-300 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#8B3A3A] mb-1">Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded border border-gray-300 disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full bg-white text-[#8B3A3A] py-2 rounded font-bold hover:bg-gray-100 transition"
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </button>

            </div>
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}
