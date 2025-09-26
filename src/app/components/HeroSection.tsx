'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroContent from './HeroContent'

export default function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener('loadeddata', () => {
        setIsVideoLoaded(true)
      })
      
      // Ensure video plays on mobile
      video.play().catch((error) => {
        console.log('Video autoplay failed:', error)
      })
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          preload="metadata"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
          <source src="/Meteor.webm" type="video/webm" />
          {/* Fallback for browsers that don't support video */}
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black"></div>
        </video>
        
        {/* Video Loading Fallback */}
        {!isVideoLoaded && (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg">Loading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Animated Glass Overlay Effects */}
      <div className="absolute inset-0 z-10">
        {/* Primary Glass Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        
        {/* Dynamic Gradient Overlays */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-black/80"
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-red-900/10"
        />
        
        {/* Animated Glass Panels */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 backdrop-blur-sm rounded-full"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 6, delay: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 backdrop-blur-sm rounded-full"
        />
      </div>

      {/* Floating Glass Particles */}
      <div className="absolute inset-0 z-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              opacity: 0, 
              y: Math.random() * window.innerHeight,
              x: Math.random() * window.innerWidth 
            }}
            animate={{ 
              opacity: [0, 0.3, 0],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight - 200,
                Math.random() * window.innerHeight - 400
              ],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth + 100,
                Math.random() * window.innerWidth - 100
              ]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-white/20 rounded-full backdrop-blur-sm"
          />
        ))}
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-30">
        <HeroContent />
      </div>

      {/* Bottom Fade Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-40" />
      
      {/* Video Controls (Hidden but accessible for debugging) */}
      <div className="absolute bottom-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => {
            if (videoRef.current) {
              if (videoRef.current.paused) {
                videoRef.current.play()
              } else {
                videoRef.current.pause()
              }
            }
          }}
          className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded text-sm"
        >
          Play/Pause
        </button>
      </div>
    </section>
  )
}
