"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Shield, Zap, Target, Home, X } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSystems = () => {
    const element = document.getElementById("defense-systems");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const deploySystem = (systemType: string) => {
    const systemNames = {
      kinetic: "Kinetic Impactor",
      firefly: "Firefly Light Array",
      plasma: "Plasma Shield Defense",
    };

    if (
      confirm(
        `Authorize deployment of ${
          systemNames[systemType as keyof typeof systemNames]
        }?\n\nThis action will initiate the defense sequence.`
      )
    ) {
      alert(
        `${
          systemNames[systemType as keyof typeof systemNames]
        } deployment authorized.\nSystem initializing...`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 opacity-90" />

        {/* Grid Overlay */}
        <motion.div
          style={{ y: scrollY * 0.1 }}
          className="absolute inset-0 opacity-30"
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center px-6 md:px-10 relative">
          {/* Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-gray-800/90 backdrop-blur-md px-8 py-3 rounded-lg border border-gray-700"
          >
            <div className="flex items-center gap-2 text-red-400 font-mono text-sm font-medium uppercase tracking-wider">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              Threat Level: Critical
            </div>
            <div className="text-gray-400">|</div>
            <div className="text-gray-300 font-mono text-sm">
              Systems: Online
            </div>
            <div className="text-gray-400">|</div>
            <div className="text-gray-300 font-mono text-sm">
              Command: Active
            </div>
          </motion.div>

          {/* Back Button */}
          <Link
            href="/"
            className="absolute top-20 left-10 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to DefendEarth
          </Link>

          {/* Earth Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative mb-16"
          >
            <div className="w-44 h-44 relative">
              {/* Earth */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-full shadow-2xl relative"
                style={{
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.1),
                    0 20px 60px rgba(0,0,0,0.5),
                    inset 0 0 30px rgba(255,255,255,0.05)
                  `,
                }}
              >
                {/* Continents */}
                <div className="absolute top-8 left-10 w-9 h-6 bg-gray-500 rounded-full opacity-60" />
                <div className="absolute bottom-9 right-6 w-11 h-8 bg-gray-500 rounded-full opacity-60" />
              </motion.div>

              {/* Trajectory Line */}
              <div className="absolute top-1/2 -right-24 w-48 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent rotate-[-25deg] animate-pulse" />

              {/* Asteroid */}
              <motion.div
                initial={{ x: 180, y: -80, scale: 0.3, opacity: 0.4 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-5 right-5 w-3 h-3 bg-gray-300 rounded-full shadow-lg"
                style={{ boxShadow: "0 0 10px rgba(255,255,255,0.5)" }}
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold text-center text-white mb-6 uppercase tracking-wider font-mono"
            style={{ textShadow: "0 0 30px rgba(255,255,255,0.1)" }}
          >
            Earth Defense Command
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-gray-400 text-center text-sm md:text-base uppercase tracking-widest font-mono mb-12"
          >
            Planetary Protection Protocol
          </motion.p>

          {/* Mission Brief */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="max-w-3xl text-center bg-gray-800/60 backdrop-blur-md p-10 rounded-2xl border border-gray-700"
          >
            <p className="text-lg leading-relaxed mb-8">
              Asteroid designation "Firefly" has been detected on direct
              collision trajectory with Earth. Multiple defense systems are
              operational and awaiting deployment authorization. Command
              decision required for immediate threat neutralization.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-700">
              <div className="text-center font-mono">
                <div className="text-3xl font-bold text-white">72H</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                  Time to Impact
                </div>
              </div>
              <div className="text-center font-mono">
                <div className="text-3xl font-bold text-white">3</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                  Systems Ready
                </div>
              </div>
              <div className="text-center font-mono">
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
                  Mission Success
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
            onClick={scrollToSystems}
            className="mt-12 px-12 py-5 bg-white text-black font-mono font-semibold text-sm uppercase tracking-wider rounded-lg hover:bg-gray-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
            Initialize Defense Systems
          </motion.button>
        </section>

        {/* Defense Systems Section */}
        <section
          id="defense-systems"
          className="py-32 px-6 md:px-10 bg-gradient-to-b from-black to-gray-900"
        >
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider font-mono mb-5">
                Defense Systems
              </h2>
              <p className="text-gray-400 text-sm uppercase tracking-widest font-mono">
                Available Threat Neutralization Protocols
              </p>
            </motion.div>

            {/* Systems Grid */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-10">
              {/* System 1: Kinetic Impactor */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-11 hover:border-gray-500 hover:bg-gray-800/70 transition-all duration-400 relative group"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">
                    System 001
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-mono uppercase tracking-wide">
                    Operational
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white uppercase tracking-wide font-mono mb-5">
                  <Target className="inline-block w-6 h-6 mr-2" />
                  Kinetic Impactor
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                  High-velocity spacecraft collision system engineered for
                  precise trajectory modification through kinetic energy
                  transfer. Proven technology based on NASA's DART mission
                  architecture with enhanced targeting capabilities and improved
                  impact efficiency.
                </p>

                <motion.div
                  whileHover={{ scale: 2, zIndex: 10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-48 bg-black border border-gray-700 rounded-lg flex items-center justify-center text-white font-mono text-sm relative mb-6 cursor-pointer"
                >
                  <video
                    src="/media1.webm"
                    muted
                    loop
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Specs */}
                <div className="bg-gray-900/80 p-6 rounded-lg border-l-2 border-gray-500 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">
                        Success Rate
                      </span>
                      <span className="text-white font-semibold">87%</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">Lead Time</span>
                      <span className="text-white font-semibold">
                        6-12 Months
                      </span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">
                        Energy Req.
                      </span>
                      <span className="text-white font-semibold">High</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">Precision</span>
                      <span className="text-white font-semibold">Extreme</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deploySystem("kinetic")}
                  className="w-full py-4 bg-transparent border border-gray-500 text-white font-mono font-semibold text-sm uppercase tracking-wide rounded-lg hover:bg-white hover:text-black transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400 -z-10" />
                  Deploy System
                </button>
              </motion.div>

              {/* System 2: Firefly Lights */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ y: -8 }}
                className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-11 hover:border-gray-500 hover:bg-gray-800/70 transition-all duration-400 relative group"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">
                    System 002
                  </span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-mono uppercase tracking-wide">
                    Development
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white uppercase tracking-wide font-mono mb-5">
                  <Zap className="inline-block w-6 h-6 mr-2" />
                  Firefly Light Array
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                  Distributed satellite constellation deploying concentrated
                  photon beams for precision thermal manipulation. Advanced
                  targeting algorithms create asymmetric heating patterns to
                  induce rotational instability and structural compromise in
                  target objects.
                </p>

                <motion.div
                  whileHover={{ scale: 2, zIndex: 10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-48 bg-black border border-gray-700 rounded-lg flex items-center justify-center text-white font-mono text-sm relative mb-6 cursor-pointer"
                >
                  <video
                    src="/media2.webm"
                    muted
                    loop
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Specs */}
                <div className="bg-gray-900/80 p-6 rounded-lg border-l-2 border-gray-500 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">
                        Satellites
                      </span>
                      <span className="text-white font-semibold">50-100</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">
                        Deployment
                      </span>
                      <span className="text-white font-semibold">
                        3-6 Months
                      </span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">
                        Effectiveness
                      </span>
                      <span className="text-white font-semibold">Gradual</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">Precision</span>
                      <span className="text-white font-semibold">Maximum</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deploySystem("firefly")}
                  className="w-full py-4 bg-transparent border border-gray-500 text-white font-mono font-semibold text-sm uppercase tracking-wide rounded-lg hover:bg-white hover:text-black transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400 -z-10" />
                  Deploy System
                </button>
              </motion.div>

              {/* System 3: Plasma Shield */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                whileHover={{ y: -8 }}
                className="bg-gray-800/40 backdrop-blur-md border border-gray-700 rounded-2xl p-11 hover:border-gray-500 hover:bg-gray-800/70 transition-all duration-400 relative group lg:col-span-2 xl:col-span-1"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                <div className="flex justify-between items-center mb-8">
                  <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">
                    System 003
                  </span>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-mono uppercase tracking-wide">
                    Experimental
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white uppercase tracking-wide font-mono mb-5">
                  <Shield className="inline-block w-6 h-6 mr-2" />
                  Plasma Shield Defense
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6 text-sm">
                  Next-generation plasma field generation utilizing magnetic
                  confinement technology. Creates high-energy barriers capable
                  of material vaporization and trajectory deflection through
                  controlled electromagnetic field manipulation and plasma
                  injection systems.
                </p>

                <motion.div
                  whileHover={{ scale: 2, zIndex: 10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-48 bg-black border border-gray-700 rounded-lg flex items-center justify-center text-white font-mono text-sm relative mb-6 cursor-pointer"
                >
                  <video
                    src="/media3.webm"
                    muted
                    loop
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Specs */}
                <div className="bg-gray-900/80 p-6 rounded-lg border-l-2 border-gray-500 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">
                        Power Req.
                      </span>
                      <span className="text-white font-semibold">Maximum</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">
                        Field Range
                      </span>
                      <span className="text-white font-semibold">1000km</span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">
                        Technology
                      </span>
                      <span className="text-white font-semibold">
                        Prototype
                      </span>
                    </div>
                    <div className="flex justify-between font-mono text-xs">
                      <span className="text-gray-400 uppercase">Readiness</span>
                      <span className="text-white font-semibold">75%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deploySystem("plasma")}
                  className="w-full py-4 bg-transparent border border-gray-500 text-white font-mono font-semibold text-sm uppercase tracking-wide rounded-lg hover:bg-white hover:text-black transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400 -z-10" />
                  Deploy System
                </button>
              </motion.div>
            </div>

            {/* Return Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center mt-16"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white font-semibold hover:scale-105 transition-all duration-300"
              >
                <Home className="w-5 h-5" />
                Return to DefendEarth Dashboard
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
