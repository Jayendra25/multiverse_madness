"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  Home,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [key]);

  // Close mobile menu when resizing to larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsMobileMenuOpen(false);
  };

  const refreshSimulation = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Back Button & Title */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <Link
                href="/"
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-300 text-sm sm:text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back to DefendEarth</span>
                <span className="sm:hidden">Back</span>
              </Link>

              <div className="ml-2 sm:ml-0">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    NASA Meteor Simulation
                  </span>
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                  Real-time 3D visualization of near-Earth objects
                </p>
              </div>
            </div>

            {/* Desktop Controls (1024px+) */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={refreshSimulation}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-all duration-300"
                title="Refresh Simulation"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-all duration-300"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>

              <a
                href="https://eyes.nasa.gov/apps/asteroids/#/home"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-all duration-300"
                title="Open in New Tab"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Tablet Controls (768px - 1023px) */}
            <div className="hidden sm:flex lg:hidden items-center gap-2">
              <button
                onClick={refreshSimulation}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-all duration-300"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-all duration-300"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>

              <a
                href="https://eyes.nasa.gov/apps/asteroids/#/home"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-all duration-300"
                title="New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-all duration-300"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Controls Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden mt-3 p-4 bg-gray-900/90 rounded-lg border border-white/10"
            >
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={refreshSimulation}
                  className="flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-all duration-300 text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="flex items-center justify-center gap-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-all duration-300 text-sm"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                  {isFullscreen ? "Exit FS" : "Fullscreen"}
                </button>

                <a
                  href="https://eyes.nasa.gov/apps/asteroids/#/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-orange-600 hover:bg-orange-700 rounded-lg text-white transition-all duration-300 text-sm col-span-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in New Tab
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Simulation Container */}
      <div
        className={`relative ${
          isFullscreen ? "fixed inset-0 z-40 bg-black" : "min-h-screen"
        }`}
      >
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-50 p-3 bg-black/80 hover:bg-black/90 rounded-lg text-white transition-all duration-300"
          >
            <Minimize2 className="w-6 h-6" />
          </button>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center"
          >
            <div className="text-center px-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4 sm:mb-6"
              />
              <h3 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-2">
                Loading NASA Simulation
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Connecting to NASA Eyes on Asteroids...
              </p>

              <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* NASA Eyes on Asteroids Iframe */}
        <iframe
          key={key}
          src="https://eyes.nasa.gov/apps/asteroids/#/home"
          className={`w-full border-0 ${
            isFullscreen ? "h-full" : "h-screen sm:h-[70vh]"
          }`}
          title="NASA Eyes on Asteroids - Asteroid and Comet Watch"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen; web-share"
          loading="lazy"
        />
      </div>

      {/* Information Panel */}
      {!isFullscreen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 backdrop-blur-sm border-t border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700">
                <h3 className="text-lg sm:text-xl font-bold text-cyan-400 mb-2 sm:mb-3">
                  🛰️ Real NASA Data
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  This simulation uses actual NASA JPL data to show real
                  near-Earth objects, their orbits, and projected paths through
                  our solar system.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700">
                <h3 className="text-lg sm:text-xl font-bold text-emerald-400 mb-2 sm:mb-3">
                  🌍 Interactive 3D View
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Navigate through space to explore asteroids and comets. Use
                  touch/mouse controls to zoom, pan, and rotate the view.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700">
                <h3 className="text-lg sm:text-xl font-bold text-orange-400 mb-2 sm:mb-3">
                  ⚡ Live Tracking
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Watch real-time positions of potentially hazardous asteroids
                  and track their closest approach dates to Earth.
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-300 text-sm sm:text-base"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                Return to DefendEarth Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile Bottom Navigation Safe Area */}
      <div className="h-16 sm:hidden"></div>
    </div>
  );
}
