"use client"

export default function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-[#8B3A3A] to-amber-700 px-4 py-12 w-full rounded-lg mb-6">
      <div className="pl-4">
        <p className="text-white text-sm font-semibold mb-2">EFFORTLESS ORDERING</p>
        <h1 className="text-6xl font-bold text-[#FFD700] mb-2" style={{fontFamily: "'Marykate', sans-serif"}}>
          ANYTIME
          <br />
          ANYWHERE
        </h1>
        <p className="text-white text-sm font-semibold mb-6">ON CIT-U CAMPUS</p>
        <p className="bg-[#FFD700] text-[#8B3A3A] px-8 py-3 rounded-full text-sm font-bold inline-block">
          ORDER NOW
        </p>
      </div>
    </div>
  )
}
