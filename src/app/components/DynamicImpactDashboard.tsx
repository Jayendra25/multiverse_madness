"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProfessionalImpactGlobe from "./ImpactGlobe";
import ImpactControlsPanel from "./ImpactControls";
import EmailAlertRegistration from "./EmailAlertRegistration"; // ← Updated import
import { NASAService } from "../../../lib/nasa-service";
import { NASAAsteroid } from "../../../types/nasa";

export default function DynamicImpactDashboard() {
  const [asteroids, setAsteroids] = useState<NASAAsteroid[]>([]);
  const [selectedAsteroid, setSelectedAsteroid] = useState<NASAAsteroid | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  const [diameter, setDiameter] = useState(300);
  const [speed, setSpeed] = useState(20);
  const [angle, setAngle] = useState(45);
  const [impactSite, setImpactSite] = useState({ lat: 40.7, lng: -74.0 });

  const [energyMt, setEnergyMt] = useState(0);
  const [craterRadius, setCraterRadius] = useState(0);
  const [seismicRadius, setSeismicRadius] = useState(0);
  const [tsunamiRadius, setTsunamiRadius] = useState(0);

  const nasaService = new NASAService();

  useEffect(() => {
    const loadAsteroids = async () => {
      setIsLoading(true);
      try {
        const data = await nasaService.getNearEarthObjects();
        setAsteroids(data);
        console.log("✅ Loaded asteroids:", data.length);
      } catch (error) {
        console.error("❌ Failed to load asteroids:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAsteroids();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enhanced physics calculations for energy and radii
  useEffect(() => {
    // diameter is in meters
    const d = diameter; // m
    const v = speed * 1000; // km/s to m/s
    const rho = 3000; // kg/m3 typical rocky asteroid
    const volume = (4 / 3) * Math.PI * Math.pow(d / 2, 3);
    const mass = volume * rho;
    const energyJ = 0.5 * mass * Math.pow(v, 2); // joules
    const energyMegatons = energyJ / 4.184e15;

    setEnergyMt(energyMegatons);

    // Enhanced crater diameter scaling (more realistic physics)
    const craterKm = Math.max(
      0.1,
      Math.min(200, 0.8 * Math.pow(energyMegatons, 0.3))
    );
    const seismicKm = Math.max(
      1,
      Math.min(1500, 25 * Math.pow(energyMegatons, 0.18))
    );
    const tsunamiKm = Math.max(
      1,
      Math.min(3000, 100 * Math.pow(energyMegatons, 0.23))
    );

    // Normalize for globe ring visualization
    const mapToDisplay = (km: number, maxKm = 3000) => {
      const normalized = Math.min(1, km / maxKm);
      return 0.2 + normalized * 2.8;
    };

    setCraterRadius(mapToDisplay(craterKm, 1000));
    setSeismicRadius(mapToDisplay(seismicKm, 2000));
    setTsunamiRadius(mapToDisplay(tsunamiKm, 3000));
  }, [diameter, speed, angle]);

  const handleAsteroidSelect = (asteroid: NASAAsteroid) => {
    setSelectedAsteroid(asteroid);
    setDiameter(asteroid.estimated_diameter.meters.estimated_diameter_max);
    setSpeed(
      parseFloat(
        asteroid.close_approach_data[0]?.relative_velocity
          .kilometers_per_second || "20"
      )
    );
  };

  const handleReset = () => {
    setIsSimulating(false);
    setDiameter(300);
    setSpeed(20);
    setAngle(45);
    setSelectedAsteroid(null);
    setImpactSite({ lat: 40.7, lng: -74.0 });
  };

  const asteroidParams = {
    diameter,
    speed,
    angle,
    name: selectedAsteroid?.name || "Custom Asteroid",
  };

  // Enhanced loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-white text-2xl font-bold mb-2">
            🛰️ Loading NASA Data
          </h2>
          <p className="text-gray-400">
            Fetching real-time asteroid information...
          </p>

          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
              Dynamic Impact
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              Visualization
            </span>
          </h1>

          <div className="flex flex-wrap justify-center gap-4 text-lg text-gray-300 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              Real NASA Data
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              Physics-Based Calculations
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              Interactive 3D Simulation
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Gmail Emergency Alerts
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Controls Panel - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <ImpactControlsPanel
              asteroids={asteroids}
              selectedAsteroid={selectedAsteroid}
              onAsteroidSelect={handleAsteroidSelect}
              diameter={diameter}
              speed={speed}
              angle={angle}
              onDiameterChange={setDiameter}
              onSpeedChange={setSpeed}
              onAngleChange={setAngle}
              isSimulating={isSimulating}
              onSimulationToggle={() => setIsSimulating(!isSimulating)}
              onReset={handleReset}
              impactSite={impactSite}
              onImpactSiteChange={(lat, lng) => setImpactSite({ lat, lng })}
            />
          </motion.div>

          {/* 3D Globe - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-3"
          >
            <ProfessionalImpactGlobe
              impactLat={impactSite.lat}
              impactLng={impactSite.lng}
              craterRadius={craterRadius}
              tsunamiRadius={tsunamiRadius}
              seismicRadius={seismicRadius}
              asteroidParams={asteroidParams}
              energyMt={energyMt}
              isSimulating={isSimulating}
            />
          </motion.div>
        </div>

        {/* Enhanced Statistics Panel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Crater Statistics */}
            <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-red-400 text-sm font-bold uppercase tracking-wide">
                  Crater Impact
                </h3>
                <div className="text-red-400 text-2xl">🔥</div>
              </div>
              <div className="text-white text-3xl font-black mb-2">
                {(craterRadius * 6371 * 2).toFixed(1)} km
              </div>
              <div className="text-gray-400 text-sm">
                Primary destruction zone
              </div>
              <div className="mt-3 w-full bg-red-900/30 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (craterRadius / 2) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Seismic Statistics */}
            <div className="bg-gradient-to-br from-yellow-900/40 to-orange-800/20 border border-yellow-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-yellow-400 text-sm font-bold uppercase tracking-wide">
                  Seismic Damage
                </h3>
                <div className="text-yellow-400 text-2xl">⚡</div>
              </div>
              <div className="text-white text-3xl font-black mb-2">
                {(seismicRadius * 6371 * 2).toFixed(0)} km
              </div>
              <div className="text-gray-400 text-sm">
                Earthquake damage radius
              </div>
              <div className="mt-3 w-full bg-yellow-900/30 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (seismicRadius / 3) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Tsunami Statistics */}
            <div className="bg-gradient-to-br from-blue-900/40 to-cyan-800/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-blue-400 text-sm font-bold uppercase tracking-wide">
                  Tsunami Range
                </h3>
                <div className="text-blue-400 text-2xl">🌊</div>
              </div>
              <div className="text-white text-3xl font-black mb-2">
                {(tsunamiRadius * 6371 * 2).toFixed(0)} km
              </div>
              <div className="text-gray-400 text-sm">
                Coastal inundation zone
              </div>
              <div className="mt-3 w-full bg-blue-900/30 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (tsunamiRadius / 4) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Energy Statistics */}
            <div className="bg-gradient-to-br from-purple-900/40 to-pink-800/20 border border-purple-500/30 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-purple-400 text-sm font-bold uppercase tracking-wide">
                  Total Energy
                </h3>
                <div className="text-purple-400 text-2xl">💥</div>
              </div>
              <div className="text-white text-3xl font-black mb-2">
                {energyMt.toFixed(1)} MT
              </div>
              <div className="text-gray-400 text-sm">
                TNT equivalent ({(energyMt / 0.015).toFixed(0)}x Hiroshima)
              </div>
              <div className="mt-3 w-full bg-purple-900/30 rounded-full h-2">
                <div
                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, Math.log10(energyMt + 1) * 20)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gmail Email Alert Registration Component */}
        <EmailAlertRegistration />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-8"
        ></motion.div>

        {/* Data Source Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Data: NASA NEO Web Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Physics: Impact scaling laws</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span>Visualization: React Three Fiber</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Alerts: Gmail SMTP + Nodemailer</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
