"use client"

export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-[#8B3A3A] to-amber-700 px-4 py-12 mx-4 rounded-lg my-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white text-sm font-semibold mb-2">EFFORTLESS ORDERING</p>
          <h1 className="text-5xl font-bold text-[#FFD700] mb-4">
            ANYTIME
            <br />
            ANYWHERE
          </h1>
          <p className="text-white text-lg mb-6">On CIT-U Campus</p>
          <button className="bg-[#FFD700] text-[#8B3A3A] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition">
            ORDER NOW
          </button>
        </div>
        <div className="flex-1 text-center">
          <img src="/food-delivery-scene.png" alt="Food" className="inline-block" />
        </div>
      </div>
    </div>
  )
}
