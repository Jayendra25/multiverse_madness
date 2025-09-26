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
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  // Make sure it's 'Page' not 'SatelliteSimulationPage'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, [key]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const refreshSimulation = () => {
    setIsLoading(true);
    setKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to DefendEarth
              </Link>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    NASA Meteor Simulation
                  </span>
                </h1>
                <p className="text-gray-400 text-sm">
                  Real-time 3D visualization of near-Earth objects
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
          </div>
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
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                Loading NASA Simulation
              </h3>
              <p className="text-gray-400">
                Connecting to NASA Eyes on Asteroids...
              </p>

              <div className="flex justify-center space-x-2 mt-6">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                <div
                  className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"
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
          className={`w-full border-0 ${isFullscreen ? "h-full" : "h-screen"}`}
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
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">
                  🛰️ Real NASA Data
                </h3>
                <p className="text-gray-300">
                  This simulation uses actual NASA JPL data to show real
                  near-Earth objects, their orbits, and projected paths through
                  our solar system.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-emerald-400 mb-3">
                  🌍 Interactive 3D View
                </h3>
                <p className="text-gray-300">
                  Navigate through space to explore asteroids and comets. Use
                  mouse controls to zoom, pan, and rotate the view for detailed
                  asteroid inspection.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-orange-400 mb-3">
                  ⚡ Live Tracking
                </h3>
                <p className="text-gray-300">
                  Watch real-time positions of potentially hazardous asteroids
                  and track their closest approach dates to Earth for impact
                  assessment.
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Return to DefendEarth Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
