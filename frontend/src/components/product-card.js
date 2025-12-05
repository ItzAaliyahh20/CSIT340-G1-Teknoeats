"use client"
import { useState } from "react"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function ProductCard({ product, isFavorite, onAddToCart, onToggleFavorite, cartQuantity = 0, showToast }) {
  const [quantity, setQuantity] = useState(1)
  const [minusClicked, setMinusClicked] = useState(false)
  const [plusScaled, setPlusScaled] = useState(false)
  const [plusColored, setPlusColored] = useState(false)
  const [plusHovered, setPlusHovered] = useState(false)
  const [quantityScaled, setQuantityScaled] = useState(false)
  const [lastClicked, setLastClicked] = useState('')
  const [ripples, setRipples] = useState([])
  const [heartScaled, setHeartScaled] = useState(false)

  const handleAddToCart = (e) => {
    if (cartQuantity > 20) {
      showToast(`Maximum quantity amount for ${product.name} reached!`, 'max')
      return
    }
    
    if (cartQuantity + quantity > 20) {
      showToast(`Cannot add ${quantity} items. Maximum limit (20) would be exceeded. Current cart quantity: ${cartQuantity}`, 'max')
      return
    }
    
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rippleId = Date.now()
    
    setRipples(prev => [...prev, { id: rippleId, x, y }])
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId))
    }, 600)
    
    onAddToCart(quantity)
    setQuantity(1)
    showToast(`Successfully added ${quantity} ${quantity === 1 ? 'item' : 'items'} of ${product.name} to your cart.`, 'success')
  }

  return ( 
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"> 
      <div className="relative"> 
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-40 object-contain"
        />
        <button
          onClick={() => {
            setHeartScaled(true)
            setTimeout(() => setHeartScaled(false), 200)
            onToggleFavorite()
          }}
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition"
        >
          <motion.div
            animate={{ scale: heartScaled ? 1.3 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Heart
              size={20}
              fill={isFavorite ? "#8B3A3A" : "none"}
              color={isFavorite ? "#8B3A3A" : "#ccc"}
            />
          </motion.div>
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-#212529 mb-0 text-center" style={{ fontSize: '19px' }}>{product.name}</h3>
        <p className="text-gray-500 font-bold mb-4 text-center">PHP {product.price.toFixed(2)}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-between gap-0 border border-gray-300 rounded flex-1">
            <button
              onClick={() => {
                if (quantity <= 1) return
                setQuantity(Math.max(1, quantity - 1))
                setMinusClicked(true)
                setQuantityScaled(true)
                setLastClicked('minus')
                setTimeout(() => {
                  setMinusClicked(false)
                  setQuantityScaled(false)
                }, 200)
              }}
              disabled={quantity <= 1}
              className={`flex-1 px-3 py-2 font-bold bg-gradient-to-tl from-gray-100 to-gray-300 transition text-center ${
                quantity > 1 ? 'hover:from-[#8B3A3A]/20 hover:to-[#8B3A3A]/40' : ''
              }`}
            >
              <motion.span
                animate={{
                  scale: minusClicked ? 1.2 : 1,
                  color: quantity === 1 ? "#9CA3AF" : "#8B3A3A"
                }}
                transition={{ duration: 0.1 }}
                className="inline-block font-bold text-lg"
              >
                −
              </motion.span>
            </button>
            <div className="flex-1 px-3 py-2 text-center border-l border-r border-gray-300">
              <motion.span
                animate={{
                  scale: quantityScaled ? 1.2 : 1,
                  color: cartQuantity + quantity >= 20 ? '#9CA3AF' : quantityScaled ? (lastClicked === 'plus' ? '#FFD700' : '#8B3A3A') : '#000000',
                  fontWeight: cartQuantity + quantity >= 20 ? 900 : quantityScaled ? 900 : 400
                }}
                transition={{ duration: 0.1 }}
                className="inline-block"
              >
                {quantity}
              </motion.span>
            </div>
            <button
              onClick={() => {
                if (cartQuantity + quantity >= 20) {
                  showToast(`Cannot increment quantity. Adding ${quantity + 1} items would exceed maximum limit (20). Current cart quantity: ${cartQuantity}`, 'max')
                  return
                }
                const newQuantity = quantity + 1
                setQuantity(newQuantity)
                setPlusScaled(true)
                setPlusColored(true)
                setQuantityScaled(true)
                setLastClicked('plus')
                setTimeout(() => {
                  setPlusScaled(false)
                  setQuantityScaled(false)
                }, 200)
                if (cartQuantity + newQuantity >= 20) {
                  showToast(`Cannot increment quantity further. Adding ${newQuantity + 1} items would exceed maximum limit (20). Current cart quantity: ${cartQuantity}`, 'max')
                }
              }}
              onMouseEnter={() => setPlusHovered(true)}
              onMouseLeave={() => {
                setPlusColored(false)
                setPlusHovered(false)
              }}
              disabled={cartQuantity + quantity >= 20}
              className={`flex-1 px-3 py-2 font-bold bg-gradient-to-tr from-gray-100 to-gray-300 transition text-center ${
                cartQuantity + quantity < 20 ? 'hover:from-[#FFD700]/20 hover:to-[#FFD700]/40' : ''
              }`}
            >
              <motion.span
                animate={{
                  scale: plusScaled ? 1.2 : 1,
                  color: cartQuantity + quantity >= 20 ? "#9CA3AF" : plusColored ? "#FFD700" : plusHovered ? "#FFD700" : "#8B3A3A"
                }}
                transition={{ duration: 0.1 }}
                className="inline-block font-bold text-lg"
              >
                +
              </motion.span>
            </button>
          </div>
        </div>

        <div className="relative bg-gray-100">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 rounded font-bold text-lg transition relative overflow-hidden ${
              cartQuantity + quantity > 20
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-[#8B3A3A] text-white hover:bg-[#7A3232]'
            }`}
          >
            Add to Cart
            
            {/* Ripple effects */}
            {ripples.map((ripple) => (
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
      </div>
    </div>
  )
}