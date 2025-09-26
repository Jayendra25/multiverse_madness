'use client'

import { motion } from 'framer-motion'
import { 
  Target, 
  Brain, 
  Globe, 
  Zap, 
  Shield, 
  Cpu, 
  Eye, 
  Users,
  Rocket,
  BarChart3,
  Map,
  Atom
} from 'lucide-react'

export default function Features() {
  const features = [
    {
      category: "Defense Strategies",
      items: [
        {
          icon: Rocket,
          title: "Kinetic Impactor",
          description: "High-speed spacecraft collision to alter asteroid trajectory through momentum transfer",
          detail: "Based on NASA's successful DART mission technology"
        },
        {
          icon: Atom,
          title: "Nuclear Deflection",
          description: "Stand-off nuclear detonation to vaporize surface material and create thrust",
          detail: "100-megaton energy range with 20m+ safe distance"
        },
        {
          icon: Target,
          title: "Gravity Tractor",
          description: "Long-term gravitational pull using spacecraft positioned near the asteroid",
          detail: "Effective for 10+ year lead time scenarios"
        }
      ]
    },
    {
      category: "Real-Time Analytics",
      items: [
        {
          icon: Brain,
          title: "AI Risk Prediction",
          description: "Machine learning models predict casualties based on population density maps",
          detail: "Processes millions of impact scenarios using physics-based damage analysis"
        },
        {
          icon: BarChart3,
          title: "Impact Probability",
          description: "Dynamic calculation of deflection success rates and mission parameters",
          detail: "Accounts for asteroid composition, size, and trajectory uncertainties"
        },
        {
          icon: Eye,
          title: "Live NASA Data",
          description: "Real-time integration with NASA's Near Earth Object Web Service",
          detail: "50,000+ tracked asteroids with updated orbital parameters"
        }
      ]
    },
    {
      category: "Visualization Engine",
      items: [
        {
          icon: Globe,
          title: "3D Earth Simulation",
          description: "Interactive globe with realistic asteroid trajectories and impact zones",
          detail: "Three.js powered with atmospheric entry physics"
        },
        {
          icon: Map,
          title: "Damage Modeling",
          description: "Crater radius, seismic waves, and tsunami propagation visualization",
          detail: "USGS topographic and bathymetric data integration"
        },
        {
          icon: Zap,
          title: "Energy Visualization",
          description: "TNT equivalent displays and blast wave propagation modeling",
          detail: "From Hiroshima-scale to multi-gigaton impact scenarios"
        }
      ]
    },
    {
      category: "Interactive Scenarios",
      items: [
        {
          icon: Shield,
          title: "Defend Earth Mode",
          description: "Gamified asteroid defense with multiple difficulty levels",
          detail: "Choose strategies, deploy systems, and save humanity"
        },
        {
          icon: Cpu,
          title: "What-If Explorer",
          description: "Simulate different impact locations and asteroid parameters",
          detail: "Pacific tsunamis, urban impacts, and deflection timing"
        },
        {
          icon: Users,
          title: "Educational Overlays",
          description: "Accessible explanations of orbital mechanics and defense technologies",
          detail: "Tooltips, infographics, and guided simulation narratives"
        }
      ]
    }
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Platform Features
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Cutting-edge simulation technology meets real-world asteroid defense strategies
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-16">
          {features.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
            >
              <h3 className="text-3xl font-bold text-center mb-12 text-blue-400">
                {category.category}
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: (categoryIndex * 0.2) + (index * 0.1) }}
                    className="group bg-gray-800/30 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 hover:border-orange-500/50 transition-all duration-500 hover:transform hover:scale-105"
                  >
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl mr-4 group-hover:from-orange-500/30 group-hover:to-red-500/30 transition-all duration-300">
                        <feature.icon className="w-8 h-8 text-orange-400" />
                      </div>
                      <h4 className="text-xl font-semibold text-white group-hover:text-orange-300 transition-colors duration-300">
                        {feature.title}
                      </h4>
                    </div>
                    
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <div className="text-sm text-blue-400 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                      {feature.detail}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-3xl p-12 border border-gray-700/50 backdrop-blur-sm"
        >
          <h3 className="text-3xl font-bold text-center mb-12 text-purple-400">
            Technical Specifications
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">15 Years</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm mb-2">Maximum Lead Time</div>
              <div className="text-xs text-gray-500">Optimal deflection window</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">1000+</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm mb-2">Fragment Tracking</div>
              <div className="text-xs text-gray-500">Real-time debris modeling</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">4 Gt</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm mb-2">Max Impact Energy</div>
              <div className="text-xs text-gray-500">Apophis-class scenarios</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">60 FPS</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm mb-2">Simulation Rate</div>
              <div className="text-xs text-gray-500">Smooth 3D rendering</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
