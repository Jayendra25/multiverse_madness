'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Users, DollarSign, Target, Waves, Mountain } from 'lucide-react'

interface ImpactAnalysisProps {
  data: {
    location: string;
    coordinates: { lat: number; lng: number };
    continent: string;
    casualties: number;
    economicDamage: number;
    craterSize: number;
    tsunamiRisk: boolean;
  } | null;
}

export default function ImpactAnalysisDisplay({ data }: ImpactAnalysisProps) {
  if (!data) {
    return (
      <div className="text-center text-gray-400 py-8">
        <Target className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <p className="text-lg">Click on the Earth to analyze impact zones</p>
        <p className="text-sm">Explore different continents and see real-time predictions</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={data.location}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Location Header */}
        <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 rounded-xl p-4 border border-red-500/30">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-6 h-6 text-red-400 mr-2" />
            <h3 className="text-xl font-bold text-red-300">Impact Analysis Complete</h3>
          </div>
          <p className="text-gray-300">
            <span className="font-semibold text-white">{data.location}</span>
          </p>
          <p className="text-sm text-gray-400">
            Coordinates: {data.coordinates.lat.toFixed(4)}°, {data.coordinates.lng.toFixed(4)}°
          </p>
        </div>

        {/* Impact Statistics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Casualties */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl p-4 border border-red-500/30"
          >
            <div className="flex items-center mb-3">
              <Users className="w-6 h-6 text-red-400 mr-2" />
              <h4 className="font-semibold text-red-300">Estimated Casualties</h4>
            </div>
            <div className="text-2xl font-bold text-red-400 mb-1">
              {data.casualties.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">
              Within 100km radius
            </div>
          </motion.div>

          {/* Economic Damage */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-4 border border-green-500/30"
          >
            <div className="flex items-center mb-3">
              <DollarSign className="w-6 h-6 text-green-400 mr-2" />
              <h4 className="font-semibold text-green-300">Economic Impact</h4>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              ${data.economicDamage}B
            </div>
            <div className="text-xs text-gray-400">
              Direct & indirect losses
            </div>
          </motion.div>

          {/* Crater Size */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 rounded-xl p-4 border border-orange-500/30"
          >
            <div className="flex items-center mb-3">
              <Mountain className="w-6 h-6 text-orange-400 mr-2" />
              <h4 className="font-semibold text-orange-300">Crater Diameter</h4>
            </div>
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {data.craterSize} km
            </div>
            <div className="text-xs text-gray-400">
              Primary impact zone
            </div>
          </motion.div>
        </div>

        {/* Special Risks */}
        <AnimatePresence>
          {data.tsunamiRisk && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl p-4 border border-cyan-500/30"
            >
              <div className="flex items-center mb-2">
                <Waves className="w-6 h-6 text-cyan-400 mr-2" />
                <h4 className="font-semibold text-cyan-300">⚠️ Tsunami Alert</h4>
              </div>
              <p className="text-cyan-200 text-sm">
                Ocean or coastal impact detected. Massive tsunamis would reach coastlines within hours,
                potentially affecting millions across the Pacific Rim.
              </p>
              <div className="mt-3 flex space-x-4 text-xs">
                <div className="text-cyan-300">
                  <span className="font-semibold">Wave Height:</span> 50-200m
                </div>
                <div className="text-cyan-300">
                  <span className="font-semibold">Range:</span> 5000+ km
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continental Impact Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-500/30"
        >
          <h4 className="font-semibold text-purple-300 mb-3">Regional Assessment</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-300">Target Region:</span>
              <span className="text-white ml-2 font-semibold">{data.continent}</span>
            </div>
            <div>
              <span className="text-gray-300">Threat Level:</span>
              <span className={`ml-2 font-semibold ${
                data.casualties > 5000000 ? 'text-red-400' :
                data.casualties > 1000000 ? 'text-orange-400' : 'text-yellow-400'
              }`}>
                {data.casualties > 5000000 ? 'CATASTROPHIC' :
                 data.casualties > 1000000 ? 'SEVERE' : 'HIGH'}
              </span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-400">
            💡 <strong>Defense Recommendation:</strong> {
              data.casualties > 5000000 
                ? 'Nuclear deflection mission required with 15+ year lead time'
                : data.casualties > 1000000
                ? 'Kinetic impactor mission with 10+ year lead time'
                : 'Multiple defense options available with 5+ year lead time'
            }
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg p-3 font-semibold transition-colors duration-200">
            🛡️ Plan Defense Mission
          </button>
          <button className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg p-3 font-semibold transition-colors duration-200">
            📊 Detailed Analysis
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}