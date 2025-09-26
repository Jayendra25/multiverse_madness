'use client'

import { motion } from 'framer-motion'
import { Shield, Globe, Satellite, Mail, Zap, Users, Github, ExternalLink } from 'lucide-react'

export default function AboutSection() {
  const features = [
    {
      icon: Satellite,
      title: 'Real NASA Data',
      description: 'Integration with NASA NEO Web Service for live asteroid tracking and threat assessment.',
    },
    {
      icon: Globe,
      title: '3D Visualization',
      description: 'Interactive 3D globe with real-time impact simulation using React Three Fiber.',
    },
    {
      icon: Zap,
      title: 'Physics Engine',
      description: 'Advanced impact calculations using real physics scaling laws and energy formulas.',
    },
    {
      icon: Mail,
      title: 'Email Alerts',
      description: 'Beautiful HTML email notifications via Gmail SMTP for emergency situations.',
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Location-based user registration and targeted alert distribution system.',
    },
    {
      icon: Shield,
      title: 'Planetary Defense',
      description: 'Comprehensive early warning system for asteroid impact threats.',
    },
  ]

  const techStack = [
    { name: 'Next.js 15', color: 'from-gray-600 to-gray-800' },
    { name: 'React Three Fiber', color: 'from-blue-600 to-cyan-600' },
    { name: 'TypeScript', color: 'from-blue-500 to-blue-700' },
    { name: 'Tailwind CSS', color: 'from-cyan-500 to-blue-500' },
    { name: 'Framer Motion', color: 'from-purple-500 to-pink-500' },
    { name: 'NASA API', color: 'from-orange-500 to-red-500' },
    { name: 'Gmail SMTP', color: 'from-red-500 to-red-700' },
    { name: 'Nodemailer', color: 'from-green-500 to-emerald-500' },
  ]

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gradient-to-b from-gray-900 to-black"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              About DefendEarth
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            DefendEarth is an advanced planetary defense simulation system that combines real NASA data, 
            physics-based calculations, and beautiful 3D visualization to create an early warning system 
            for asteroid impact threats.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-blue-900/40 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 mb-16 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            To create an accessible, educational, and functional asteroid impact simulation system that raises 
            awareness about planetary defense while demonstrating the power of modern web technologies. 
            DefendEarth serves as both an educational tool and a proof-of-concept for real-world early warning systems.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg">{feature.title}</h4>
                </div>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-12">Technology Stack</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`bg-gradient-to-br ${tech.color} p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <span className="text-white font-bold">{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Project Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">Project Resources</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-gray-600 hover:border-gray-500"
            >
              <Github className="w-5 h-5" />
              GitHub Repository
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://api.nasa.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5" />
              NASA API
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
