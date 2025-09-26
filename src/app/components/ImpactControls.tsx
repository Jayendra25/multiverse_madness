'use client'

import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Satellite } from 'lucide-react'
import { NASAAsteroid } from '../../../types/nasa'

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
    <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Satellite className="w-6 h-6 text-blue-400" />
          Impact Parameters
        </h2>
        <div className="flex gap-2">
          <button
            onClick={props.onSimulationToggle}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 ${
              props.isSimulating
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {props.isSimulating ? (
              <>
                <Pause className="w-4 h-4" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Simulate
              </>
            )}
          </button>
          <button
            onClick={props.onReset}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-blue-300">
          🛰️ NASA Near-Earth Objects
        </label>
        
        <select
          value={props.selectedAsteroid?.id || ''}
          onChange={(e) => {
            const asteroid = props.asteroids.find(a => a.id === e.target.value);
            if (asteroid) props.onAsteroidSelect(asteroid);
          }}
          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a real asteroid...</option>
          {props.asteroids.map(asteroid => (
            <option key={asteroid.id} value={asteroid.id}>
              {asteroid.name} ({asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)}m)
              {asteroid.is_potentially_hazardous_asteroid && ' ⚠️'}
            </option>
          ))}
        </select>

        {props.selectedAsteroid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3 text-sm"
          >
            <div className="text-blue-300 font-semibold mb-2">Selected Asteroid:</div>
            <div className="text-gray-300 space-y-1">
              <div>📏 Diameter: {props.selectedAsteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)}m</div>
              <div>🚀 Velocity: {parseFloat(props.selectedAsteroid.close_approach_data[0]?.relative_velocity.kilometers_per_second || '0').toFixed(1)} km/s</div>
              <div>⚠️ Hazardous: {props.selectedAsteroid.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}</div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Diameter: {props.diameter.toFixed(0)}m
          </label>
          <input
            type="range"
            min={10}
            max={2000}
            value={props.diameter}
            onChange={(e) => props.onDiameterChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Velocity: {props.speed.toFixed(1)} km/s
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
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Angle: {props.angle.toFixed(0)}°
          </label>
          <input
            type="range"
            min={10}
            max={90}
            value={props.angle}
            onChange={(e) => props.onAngleChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-yellow-300">
          🎯 Impact Location
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Latitude"
            value={props.impactSite.lat}
            onChange={(e) => props.onImpactSiteChange(Number(e.target.value), props.impactSite.lng)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={props.impactSite.lng}
            onChange={(e) => props.onImpactSiteChange(props.impactSite.lat, Number(e.target.value))}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'NYC', lat: 40.7, lng: -74.0 },
            { name: 'London', lat: 51.5, lng: -0.1 },
            { name: 'Tokyo', lat: 35.7, lng: 139.7 },
            { name: 'Pacific', lat: 0, lng: -150 }
          ].map(location => (
            <button
              key={location.name}
              onClick={() => props.onImpactSiteChange(location.lat, location.lng)}
              className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded-full transition-colors duration-200"
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
