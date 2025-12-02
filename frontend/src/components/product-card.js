"use client"
import { useState } from "react"
import { Heart } from "lucide-react"

export default function ProductCard({ product, isFavorite, onAddToCart, onToggleFavorite }) { 
  const [quantity, setQuantity] = useState(1) 
  
  // FIX: Properly construct the image URL
  const imageUrl = product.image?.startsWith('/uploads') 
    ? `http://localhost:8080${product.image}` 
    : (product.image || "/placeholder.svg");

  const handleAddToCart = () => { 
    onAddToCart(quantity) 
    setQuantity(1) 
  }

  return ( 
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"> 
      <div className="relative"> 
        <img
          src={imageUrl}
          alt={product.name} 
          className="w-full h-40 object-contain" 
        />
        <button 
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition" 
        > 
          <Heart 
            size={20}
            fill={isFavorite ? "#8B3A3A" : "none"} 
            color={isFavorite ? "#8B3A3A" : "#ccc"} 
          /> 
        </button> 
      </div> 
      <div className="p-4"> 
        <h3 className="font-bold text-gray-800 mb-1 text-center">{product.name}</h3> 
        <p className="text-red-600 font-bold mb-4 text-center">PHP {product.price.toFixed(2)}</p> 
        <div className="flex items-center justify-between mb-4"> 
          <div className="flex items-center justify-between gap-0 border border-gray-300 rounded flex-1">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))} 
              className="flex-1 px-3 py-2 text-[#8B3A3A] font-bold hover:bg-gray-100 transition text-center" 
            > 
              -
            </button> 
            <div className="flex-1 px-3 py-2 text-center border-l border-r border-gray-300">{quantity}</div> 
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex-1 px-3 py-2 text-[#8B3A3A] font-bold hover:bg-gray-100 transition text-center" 
            > 
              +
            </button>
          </div> 
        </div> 
        <button
          onClick={handleAddToCart} 
          className="w-full bg-[#8B3A3A] text-white py-2 rounded font-bold hover:bg-[#6B2A2A] transition" 
        > 
          Add to Cart 
        </button> 
      </div> 
    </div> 
  )
}