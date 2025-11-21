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
      className="bg-gradient-to-r from-[#8B3A3A] to-amber-700 px-4 py-12 w-full rounded-lg mb-6"
    >
      <div className="pl-4">

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white text-sm font-semibold mb-2"
        >
          EFFORTLESS ORDERING
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl font-bold text-[#FFD700] mb-2"
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
          className="text-white text-sm font-semibold mb-6"
        >
          ON CIT-U CAMPUS
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/cart")}
          className="bg-[#FFD700] text-[#8B3A3A] px-8 py-3 rounded-full text-sm font-bold inline-block cursor-pointer"
        >
          ORDER NOW
        </motion.button>

      </div>
    </motion.div>
  )
}
