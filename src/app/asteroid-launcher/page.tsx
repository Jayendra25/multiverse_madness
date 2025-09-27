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
  Target,
  Zap,
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
    const timer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(timer);
  }, [key]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const refreshSimulation = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

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
                className="flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-semibold transition-all duration-300 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Back to DefendEarth</span>
                <span className="sm:hidden">Back</span>
              </Link>

              <div className="ml-2 sm:ml-0">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold">
                  <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                    Asteroid Impact
                  </span>
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
                  Interactive impact simulator & damage calculator
                </p>
              </div>
            </div>

            {/* Desktop Controls */}
            <div className="hidden md:flex items-center gap-3">
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
                href="https://www.killerasteroids.org/interactives/wiihmt/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all duration-300"
                title="Open in New Tab"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            {/* Tablet Controls (768px - 1023px) */}
            <div className="hidden sm:flex md:hidden items-center gap-2">
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
                href="https://www.killerasteroids.org/interactives/wiihmt/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all duration-300"
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
              className="md:hidden mt-3 p-4 bg-gray-900/90 rounded-lg border border-white/10"
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
                  href="https://www.killerasteroids.org/interactives/wiihmt/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all duration-300 text-sm col-span-2"
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
          isFullscreen ? "fixed inset-0 z-40 bg-black" : "h-screen"
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
                className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-orange-400 border-t-transparent rounded-full mx-auto mb-4 sm:mb-6"
              />
              <h3 className="text-xl sm:text-2xl font-bold text-orange-400 mb-2">
                Loading Asteroid Launcher
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Initializing impact simulation systems...
              </p>

              <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Asteroid Launcher Iframe */}
        <div
          className={`w-full ${
            isFullscreen ? "h-full" : "h-full"
          } relative overflow-hidden`}
        >
          <iframe
            key={key}
            src="https://www.killerasteroids.org/interactives/wiihmt/index.html"
            className={`w-full border-0 ${
              isFullscreen ? "h-[calc(100%+80px)]" : "h-[calc(100%+80px)]"
            } -mt-20`}
            title="Asteroid Impact Launcher - DefendEarth Simulation"
            onLoad={() => setIsLoading(false)}
            allow="fullscreen; web-share"
            loading="lazy"
            style={{
              transform: "translateY(-80px)",
            }}
          />

          {/* Overlay to hide original branding */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10"></div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Safe Area */}
      <div className="h-16 sm:hidden"></div>
    </div>
  );
}
