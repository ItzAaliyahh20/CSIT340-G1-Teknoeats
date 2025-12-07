"use client"

import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function HeroBanner() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{ backgroundImage: "url('/hero-banner.png')" }}
      className="w-full rounded-lg mb-6 bg-cover bg-right bg-no-repeat overflow-hidden relative shadow-lg"
    >
      <div className="w-full md:w-[45%] h-full pl-10 py-12 flex flex-col justify-center">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white text-sm font-semibold mb-2.5 drop-shadow-md"
        >
          EFFORTLESS ORDERING
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold text-[#FFD700] mb-2 leading-[1] drop-shadow-md"
          style={{ fontFamily: "'Marykate', sans-serif" }}
        >
          ANYTIME
          <br />
          ANYWHERE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white text-sm font-semibold mb-6 drop-shadow-md"
        >
          ON CIT-U CAMPUS
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/cart")}
          className="bg-[#FFD700] text-[#8B3A3A] px-8 py-3 rounded-full text-sm font-bold inline-block cursor-pointer w-fit shadow-md"
        >
          ORDER NOW
        </motion.button>
      </div>
    </motion.div>
  )
}