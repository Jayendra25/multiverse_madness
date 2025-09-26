'use client'

import { motion } from 'framer-motion'
import { Target, Brain, Globe, Zap, AlertTriangle, Telescope } from 'lucide-react'

export default function ProjectInfo() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mission Overview
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            The world's most advanced asteroid defense simulation platform, combining real NASA data 
            with cutting-edge visualization technology to prepare humanity for cosmic threats.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl p-8 mb-16 border border-orange-500/20"
        >
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-400 mr-4" />
            <h3 className="text-2xl font-bold text-orange-300">The Asteroid Threat</h3>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            Asteroid impacts are the only natural disasters we can predict and prevent. With over 50,000 
            Near Earth Objects tracked by NASA, the question isn't if an impact will happen, but when.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Our platform transforms complex orbital mechanics and defense strategies into an interactive 
            experience, allowing users to explore real-world scenarios and test humanity's response options.
          </p>
        </motion.div>

        {/* Key Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Telescope,
              title: "Real-Time Detection",
              description: "Live integration with NASA's Near Earth Object Web Service, tracking orbital parameters of 50,000+ asteroids with continuous updates.",
              highlight: "Live NASA Data"
            },
            {
              icon: Brain,
              title: "AI-Powered Analysis",
              description: "Machine learning models process millions of impact scenarios, predicting casualties, economic damage, and deflection success rates.",
              highlight: "Predictive Intelligence"
            },
            {
              icon: Globe,
              title: "Global Impact Modeling",
              description: "Visualize tsunamis reaching Asia from Pacific impacts, crater formation in urban areas, and atmospheric shock wave propagation.",
              highlight: "Worldwide Effects"
            },
            {
              icon: Target,
              title: "Defense Testing",
              description: "Test kinetic impactors, nuclear deflection, and gravity tractor technologies with realistic physics simulations.",
              highlight: "Proven Technologies"
            },
            {
              icon: Zap,
              title: "Energy Visualization",
              description: "Compare impact energies from Hiroshima-scale events to multi-gigaton scenarios with intuitive TNT equivalents.",
              highlight: "Scale Understanding"
            },
            {
              icon: Target,
              title: "Scenario Planning",
              description: "Explore 'what-if' situations: Pacific impacts, urban strikes, and the critical timing of deflection missions.",
              highlight: "Strategic Preparation"
            }
          ].map((capability, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                <capability.icon className="w-10 h-10 text-blue-400 mr-3 group-hover:text-blue-300 transition-colors duration-300" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{capability.title}</h3>
                  <div className="text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                    {capability.highlight}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">{capability.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Scientific Foundation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm"
        >
          <h3 className="text-3xl font-bold text-center mb-8 text-green-400">Scientific Foundation</h3>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">NASA ATAP</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm mb-2">Asteroid Threat Assessment</div>
              <div className="text-xs text-gray-500">High-fidelity impact simulations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">DART Mission</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm mb-2">Proven Deflection</div>
              <div className="text-xs text-gray-500">Successful kinetic impact test</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">USGS Data</div>
              <div className="text-gray-400 uppercase tracking-wide text-sm mb-2">Geological Modeling</div>
              <div className="text-xs text-gray-500">Topographic & tsunami maps</div>
            </div>
          </div>
          
          <p className="text-gray-300 text-center leading-relaxed">
            Built on decades of NASA research, our simulations use the same physics models that guide 
            real planetary defense missions. From Project Icarus (1967) to today's DART mission, 
            we implement proven scientific methodologies in an accessible interactive format.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
