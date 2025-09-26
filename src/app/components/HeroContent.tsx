"use client";

import { motion } from "framer-motion";
import { ChevronDown, Shield, Zap } from "lucide-react";

export default function HeroContent() {
  const scrollToNext = () => {
    const nextSection = document.getElementById("visualizer");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative z-20 h-screen flex flex-col items-center justify-center px-4">
      {" "}
      {/* Changed to h-screen and justify-center for perfect centering */}
      <div className="text-center max-w-6xl mx-auto">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-2">
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
              DEFEND EARTH
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed font-medium"
        >
          Experience the ultimate asteroid defense simulation. Deploy
          cutting-edge technologies to protect humanity from cosmic threats.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-6 md:gap-8 mb-10 md:mb-12"
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500 mb-2">
              50,000+
            </div>
            <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wide">
              Near Earth Objects
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-400 mb-2">
              3
            </div>
            <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wide">
              Defense Strategies
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-400 mb-2">
              Real-Time
            </div>
            <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wide">
              NASA Data
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNext}
            className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/25 text-white"
          >
            <Shield className="inline-block w-5 h-5 md:w-6 md:h-6 mr-2" />
            Start Defense Simulation
            <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgb(96, 165, 250)",
              color: "black",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              document
                .getElementById("email-alerts")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group px-6 md:px-8 py-3 md:py-4 border-2 border-blue-400 rounded-lg font-semibold text-base md:text-lg transition-all duration-300 text-blue-400 hover:text-black"
          >
            <Zap className="inline-block w-5 h-5 md:w-6 md:h-6 mr-2" />
            View Impact Dashboard
          </motion.button>
        </motion.div>
      </div>
      {/* Scroll Indicator - Positioned absolutely at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        onClick={scrollToNext}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white/60 hover:text-white/80 transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
        >
          <ChevronDown size={28} className="md:w-8 md:h-8" />
        </motion.div>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-400 font-medium">Scroll Down</span>
        </div>
      </motion.div>
    </div>
  );
}
