'use client'

import { motion } from 'framer-motion'
import { Play, Shield, BarChart3, Users } from 'lucide-react'

export default function CallToAction() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent">
              Ready to Defend Earth?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the ultimate test of human ingenuity against cosmic threats. 
            Can you save civilization when the clock is ticking?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <button className="group bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25">
            <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-bold mb-2">Defense Simulation</h3>
            <p className="text-orange-100 text-sm">Deploy strategies and save humanity</p>
          </button>

          <button className="group bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-bold mb-2">Impact Dashboard</h3>
            <p className="text-blue-100 text-sm">Visualize global consequences</p>
          </button>

          <button className="group bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25">
            <Users className="w-12 h-12 mx-auto mb-4 text-white" />
            <h3 className="text-xl font-bold mb-2">Educational Mode</h3>
            <p className="text-green-100 text-sm">Learn planetary defense science</p>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button className="group relative px-12 py-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full font-bold text-2xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/30">
            <Play className="inline-block w-8 h-8 mr-3" />
            Launch Simulation
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
