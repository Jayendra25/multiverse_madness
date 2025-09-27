"use client";

import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Satellite } from "lucide-react";
import { NASAAsteroid } from "../../../types/nasa";

interface ControlsPanelProps {
  asteroids: NASAAsteroid[];
  selectedAsteroid: NASAAsteroid | null;
  onAsteroidSelect: (asteroid: NASAAsteroid) => void;
  diameter: number;
  speed: number;
  angle: number;
  onDiameterChange: (value: number) => void;
  onSpeedChange: (value: number) => void;
  onAngleChange: (value: number) => void;
  isSimulating: boolean;
  onSimulationToggle: () => void;
  onReset: () => void;
  impactSite: { lat: number; lng: number };
  onImpactSiteChange: (lat: number, lng: number) => void;
}

export default function ImpactControlsPanel(props: ControlsPanelProps) {
  return (
    <div className="bg-gray-900 rounded-lg md:rounded-2xl border border-gray-700 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Satellite className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          Impact Parameters
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={props.onSimulationToggle}
            className={`flex-1 sm:flex-none px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base ${
              props.isSimulating
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {props.isSimulating ? (
              <>
                <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Stop</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Simulate</span>
              </>
            )}
          </button>
          <button
            onClick={props.onReset}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200 text-sm sm:text-base"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* NASA Asteroids Section */}
      <div className="space-y-2 sm:space-y-3">
        <label className="block text-sm font-semibold text-blue-300">
          🛰️ NASA Near-Earth Objects
        </label>

        <select
          value={props.selectedAsteroid?.id || ""}
          onChange={(e) => {
            const asteroid = props.asteroids.find(
              (a) => a.id === e.target.value
            );
            if (asteroid) props.onAsteroidSelect(asteroid);
          }}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
        >
          <option value="">Select a real asteroid...</option>
          {props.asteroids.map((asteroid) => (
            <option key={asteroid.id} value={asteroid.id}>
              {asteroid.name} (
              {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(
                0
              )}
              m)
              {asteroid.is_potentially_hazardous_asteroid && " ⚠️"}
            </option>
          ))}
        </select>

        {props.selectedAsteroid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-2 sm:p-3 text-xs sm:text-sm"
          >
            <div className="text-blue-300 font-semibold mb-1 sm:mb-2">
              Selected Asteroid:
            </div>
            <div className="text-gray-300 space-y-0.5 sm:space-y-1">
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <span>
                  📏 Diameter:{" "}
                  {props.selectedAsteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(
                    0
                  )}
                  m
                </span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <span>
                  🚀 Velocity:{" "}
                  {parseFloat(
                    props.selectedAsteroid.close_approach_data[0]
                      ?.relative_velocity.kilometers_per_second || "0"
                  ).toFixed(1)}{" "}
                  km/s
                </span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <span>
                  ⚠️ Hazardous:{" "}
                  {props.selectedAsteroid.is_potentially_hazardous_asteroid
                    ? "Yes"
                    : "No"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Slider Controls */}
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-1 sm:mb-2">
            Diameter:{" "}
            <span className="text-blue-400">{props.diameter.toFixed(0)}m</span>
          </label>
          <input
            type="range"
            min={10}
            max={2000}
            value={props.diameter}
            onChange={(e) => props.onDiameterChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10m</span>
            <span>2000m</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-1 sm:mb-2">
            Velocity:{" "}
            <span className="text-green-400">
              {props.speed.toFixed(1)} km/s
            </span>
          </label>
          <input
            type="range"
            min={5}
            max={70}
            step={0.1}
            value={props.speed}
            onChange={(e) => props.onSpeedChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5km/s</span>
            <span>70km/s</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-1 sm:mb-2">
            Angle:{" "}
            <span className="text-yellow-400">{props.angle.toFixed(0)}°</span>
          </label>
          <input
            type="range"
            min={10}
            max={90}
            value={props.angle}
            onChange={(e) => props.onAngleChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>10°</span>
            <span>90°</span>
          </div>
        </div>
      </div>

      {/* Impact Location Section */}
      <div className="space-y-2 sm:space-y-3">
        <label className="block text-sm font-semibold text-yellow-300">
          🎯 Impact Location
        </label>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Latitude</label>
            <input
              type="number"
              placeholder="Latitude"
              value={props.impactSite.lat}
              onChange={(e) =>
                props.onImpactSiteChange(
                  Number(e.target.value),
                  props.impactSite.lng
                )
              }
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              min={-90}
              max={90}
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Longitude
            </label>
            <input
              type="number"
              placeholder="Longitude"
              value={props.impactSite.lng}
              onChange={(e) =>
                props.onImpactSiteChange(
                  props.impactSite.lat,
                  Number(e.target.value)
                )
              }
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
              min={-180}
              max={180}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2">
          {[
            { name: "NYC", lat: 40.7, lng: -74.0 },
            { name: "London", lat: 51.5, lng: -0.1 },
            { name: "Tokyo", lat: 35.7, lng: 139.7 },
            { name: "Pacific", lat: 0, lng: -150 },
          ].map((location) => (
            <button
              key={location.name}
              onClick={() =>
                props.onImpactSiteChange(location.lat, location.lng)
              }
              className="px-2 py-1 sm:px-3 sm:py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200 flex-shrink-0"
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Simulation Status */}
      {props.isSimulating && (
        <div className="sm:hidden bg-red-900/80 border border-red-500 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-2 text-white text-sm font-semibold">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            Simulation Active
          </div>
        </div>
      )}
    </div>
  );
}
