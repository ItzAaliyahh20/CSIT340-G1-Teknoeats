import { useState, useEffect } from "react"
import Sidebar from '../components/sidebar'
import { getUserProfile, updateUserProfile, getCurrentUser } from '../services/api'
import { User, Mail, Phone, Home, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
   const [editRipples, setEditRipples] = useState([])
   const [saveRipples, setSaveRipples] = useState([])
   const [originalProfileData, setOriginalProfileData] = useState({})
   const [showCancelModal, setShowCancelModal] = useState(false)
   const [toasts, setToasts] = useState([])
   const [phoneErrorType, setPhoneErrorType] = useState(false)
   const [emailErrorType, setEmailErrorType] = useState(false)
   const [firstNameError, setFirstNameError] = useState(false)
   const [lastNameError, setLastNameError] = useState(false)
   const [addressError, setAddressError] = useState(false)

   useEffect(() => {
     const fetchUserProfile = async () => {
       try {
         console.log('Starting to fetch user profile...')

         // Get current user
         const currentUser = await getCurrentUser()
         console.log('Current user:', currentUser)

         if (!currentUser || !currentUser.userId) {
           throw new Error('No user logged in')
         }

         const userId = currentUser.userId
         console.log('Fetching profile for user ID:', userId)

         const response = await getUserProfile(userId)
         console.log('API response received:', response)

         setProfileData({
           firstName: response.firstName || "",
           lastName: response.lastName || "",
           email: response.email || "",
           phoneNumber: formatPhone(response.phoneNumber || ""),
           address: response.address || "",
         })

         console.log('Profile data set successfully')
       } catch (err) {
         console.error('Error in fetchUserProfile:', err)
         console.error('Error details:', err.response || err)
         setError(`Failed to load profile data: ${err.message}`)
       } finally {
         setLoading(false)
       }
     }

     fetchUserProfile()
   }, [])

 // Global toast management functions
 const showToast = (content, type = 'success', duration = 3000) => {
   const id = Date.now()
   setToasts(prev => [...prev, { id, content, type }])
   setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
 }

 const removeToast = (id) => {
   setToasts(prev => prev.filter(t => t.id !== id))
 }

 const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalProfileData)

 const formatPhone = (value) => {
   const digits = value.replace(/\D/g, '').replace(/^0+/, '')
   if (digits.length <= 3) return digits
   if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
   return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`
 }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar categories={["Dashboard", "Meals", "Food", "Snacks", "Beverages"]} selectedItem='profile' onSelectCategory={(category) => window.location.href = '/home?category=' + category} />
      <div className="ml-[250px]">
        <main className="px-4 py-8">
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <img 
                src="/teknoeats-loading.png" 
                alt="Loading" 
                className="w-20 h-20 animate-pulse mx-auto mb-4"
              />
              <p className="text-gray-600 text-lg">Just a wild second...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-red-800 font-semibold text-lg mb-2">Oops! Something went wrong.</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}
        {!loading && !error && (
          <div className="flex justify-center items-start min-h-[calc(100vh-200px)] py-8">
            {/* Profile Section - Full Width */}
            <div className="w-full max-w-7xl">
              <h2 className="text-4xl font-bold text-white text-center py-3 mb-6 rounded" style={{
                background: 'linear-gradient(to right, #8B3A3A, #FFC107, #8B3A3A)',
                fontFamily: 'Marykate',
                boxShadow: 'inset 0 0 20px rgba(139, 58, 58, 0.06)',
                textShadow: '0 0 10px rgba(216, 5, 5, 0.4)'
              }}>
                PROFILE MANAGEMENT
              </h2>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition">
                {firstNameError && <div className="bg-red-50 border border-red-500 text-red-500 text-sm p-3 rounded mb-4">First name is required.</div>}
                {lastNameError && <div className="bg-red-50 border border-red-500 text-red-500 text-sm p-3 rounded mb-4">Last name is required.</div>}
                {emailErrorType === 'required' && <div className="bg-red-50 border border-red-500 text-red-500 text-sm p-3 rounded mb-4">Email address is required.</div>}
                {emailErrorType === 'invalid' && <div className="bg-red-50 border border-red-500 text-red-500 text-sm p-3 rounded mb-4">Email address is invalid.</div>}
                {phoneErrorType === 'required' && <div className="bg-red-50 border border-red-500 text-red-500 text-sm p-3 rounded mb-4">Phone number is required.</div>}
                {phoneErrorType === 'invalid' && <div className="bg-red-50 border border-red-500 text-red-500 text-sm p-3 rounded mb-4">Phone number is invalid.</div>}
                {addressError && <div className="bg-red-50 border border-red-500 text-red-500 text-sm p-3 rounded mb-4">Address is invalid.</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className={`block text-sm font-semibold ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'} mb-2`}>FIRST NAME</label>
                      <div className="relative">
                        <User size={20} strokeWidth={2} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'}`} />
                        <input
                          type="text"
                          value={profileData.firstName}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className={`w-full pl-12 pr-4 py-3 ${isEditing ? 'bg-gray-50' : 'bg-white'} rounded-lg border-2 border-gray-200 disabled:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-200 text-gray-800 font-semibold placeholder:font-normal`}
                          placeholder={isEditing ? "Enter your first name" : ""}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'} mb-2`}>LAST NAME</label>
                    <div className="relative">
                      <User size={20} strokeWidth={2} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        value={profileData.lastName}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 ${isEditing ? 'bg-gray-50' : 'bg-white'} rounded-lg border-2 border-gray-200 disabled:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-200 text-gray-800 font-semibold placeholder:font-normal`}
                        placeholder={isEditing ? "Enter your last name" : ""}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className={`block text-sm font-semibold ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'} mb-2`}>EMAIL ADDRESS</label>
                    <div className="relative">
                      <Mail size={20} strokeWidth={2} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'}`} />
                      <input
                        type="email"
                        value={profileData.email}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 ${isEditing ? 'bg-gray-50' : 'bg-white'} rounded-lg border-2 border-gray-200 disabled:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-200 text-gray-800 font-semibold placeholder:font-normal`}
                        placeholder={isEditing ? "Enter your email address" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'} mb-2`}>PHONE NUMBER</label>
                    <div className="relative">
                      <Phone size={20} strokeWidth={2} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'}`} />
                      <input
                        type="tel"
                        value={isEditing ? profileData.phoneNumber : formatPhone(profileData.phoneNumber)}
                        disabled={!isEditing}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value)
                          setProfileData({ ...profileData, phoneNumber: formatted })
                        }}
                        className={`w-full pl-12 pr-4 py-3 ${isEditing ? 'bg-gray-50' : 'bg-white'} rounded-lg border-2 border-gray-200 disabled:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-200 text-gray-800 font-semibold placeholder:font-normal`}
                        placeholder={isEditing ? "Enter your phone number" : ""}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'} mb-2`}>ADDRESS</label>
                    <div className="relative">
                      <Home size={20} strokeWidth={2} className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${isEditing ? 'text-[#8B3A3A]' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        value={profileData.address}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className={`w-full pl-12 pr-4 py-3 ${isEditing ? 'bg-gray-50' : 'bg-white'} rounded-lg border-2 border-gray-200 disabled:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent transition-all duration-200 text-gray-800 font-semibold placeholder:font-normal`}
                        placeholder={isEditing ? "Enter your address" : ""}
                      />
                    </div>
                  </div>

                </div>

                <div className="flex justify-end mt-8">
                {isEditing ? (
                  <div className="flex gap-4 w-full max-w-md">
                    <button
                      onClick={() => {
                        if (profileData.address === '') {
                          setAddressError(false)
                        }
                        if (JSON.stringify(profileData) !== JSON.stringify(originalProfileData)) {
                          setShowCancelModal(true)
                        } else {
                          setIsEditing(false)
                        }
                      }}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 text-lg rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async (e) => {
                        // Create ripple effect
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const y = e.clientY - rect.top
                        const rippleId = Date.now()

                        setSaveRipples(prev => [...prev, { id: rippleId, x, y }])

                        // Remove ripple after animation
                        setTimeout(() => {
                          setSaveRipples(prev => prev.filter(r => r.id !== rippleId))
                        }, 600)

                        if (!hasChanges) {
                          showToast("Start editing first to save your changes!", 'info')
                          return
                        }

                        let hasErrors = false

                        if (profileData.firstName.trim() === '') {
                          setFirstNameError(true)
                          hasErrors = true
                        } else {
                          setFirstNameError(false)
                        }

                        if (profileData.lastName.trim() === '') {
                          setLastNameError(true)
                          hasErrors = true
                        } else {
                          setLastNameError(false)
                        }

                        if (profileData.address !== '' && profileData.address.trim() === '') {
                          setAddressError(true)
                          hasErrors = true
                        } else {
                          setAddressError(false)
                        }

                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if (profileData.email.trim() === '') {
                          setEmailErrorType('required')
                          hasErrors = true
                        } else if (!emailRegex.test(profileData.email)) {
                          setEmailErrorType('invalid')
                          hasErrors = true
                        } else {
                          setEmailErrorType(false)
                        }

                        const phoneDigits = profileData.phoneNumber.replace(/\s/g, '')
                        if (phoneDigits === '') {
                          setPhoneErrorType('required')
                          hasErrors = true
                        } else if (phoneDigits.length !== 10) {
                          setPhoneErrorType('invalid')
                          hasErrors = true
                        } else {
                          setPhoneErrorType(false)
                        }

                        if (hasErrors) return
                        try {
                           // Get current user for the update
                           const currentUser = await getCurrentUser()
                           if (!currentUser || !currentUser.userId) {
                             throw new Error('No user logged in')
                           }

                           const userId = currentUser.userId
                           console.log('Updating profile for user ID:', userId)
                           console.log('Profile data to update:', profileData)

                           await updateUserProfile(userId, profileData)
                           showToast("Profile updated successfully!", 'success')
                           setIsEditing(false)
                         } catch (err) {
                           alert("Failed to update profile")
                           console.error('Update error:', err)
                         }
                      }}
                      className="flex-1 bg-[#8B3A3A] text-white py-3 px-6 text-lg rounded-lg font-bold hover:bg-[#6B2A2A] transition-all duration-200 relative overflow-hidden"
                      disabled={loading}
                    >
                    Save Changes

                    {/* Ripple effects */}
                    {saveRipples.map((ripple) => (
                      <motion.span
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.3 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full bg-white pointer-events-none z-0"
                        style={{
                          left: ripple.x - 15,
                          top: ripple.y - 15,
                          width: 30,
                          height: 30,
                        }}
                      />
                    ))}
                  </button>
                  </div>
                ) : (
                  <motion.button
                    onClick={(e) => {
                      // Create ripple effect
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      const rippleId = Date.now()

                      setEditRipples(prev => [...prev, { id: rippleId, x, y }])

                      // Remove ripple after animation
                      setTimeout(() => {
                        setEditRipples(prev => prev.filter(r => r.id !== rippleId))
                      }, 600)

                      setOriginalProfileData({ ...profileData })
                      setIsEditing(true)
                    }}
                    className="bg-[#8B3A3A] text-white py-3 px-8 text-lg rounded-lg font-bold hover:bg-[#6B2A2A] transition relative overflow-hidden"
                  >
                    Edit Profile

                    {/* Ripple effects */}
                    {editRipples.map((ripple) => (
                      <motion.span
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 0.3 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute rounded-full bg-white pointer-events-none z-0"
                        style={{
                          left: ripple.x - 15,
                          top: ripple.y - 15,
                          width: 30,
                          height: 30,
                        }}
                      />
                    ))}
                  </motion.button>
                )}
              </div>
              </motion.div>
            </div>
          </div>
        )}
        </main>
      </div>

      {/* Global Toast Container */}
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed px-4 py-2 rounded shadow-lg z-[60] flex items-center gap-4 bg-[#FFD700] text-black"
            style={{ bottom: `${16 + index * 60}px`, right: '16px' }}
          >
            {toast.content}
            <button onClick={() => removeToast(toast.id)} className="hover:bg-white/20 rounded p-1">
              <X size={16} strokeWidth={3} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4 text-center">Discard Changes?</h3>
            <p className="text-gray-600 mb-6 text-center">You have unsaved changes. Are you sure you want to cancel?</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setProfileData({ ...originalProfileData })
                  setIsEditing(false)
                  setShowCancelModal(false)
                  setFirstNameError(false)
                  setLastNameError(false)
                  setEmailErrorType(false)
                  setPhoneErrorType(false)
                  setAddressError(false)
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded font-bold hover:bg-gray-300 transition"
              >
                Yes, Discard
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-[#8B3A3A] text-white py-2 rounded font-bold hover:bg-[#6B2A2A] transition"
              >
                No, Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
