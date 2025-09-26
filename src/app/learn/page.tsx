"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Zap, Globe, Shield, Target, Waves, Mountain, BarChart3, TrendingUp, Star } from 'lucide-react';

const EducationPage = () => {
  const [visibleSection, setVisibleSection] = useState('');
  const [meteorShowers, setMeteorShowers] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('[data-section]').forEach((el) => {
      observer.observe(el);
    });

    // Generate random meteors
    const generateMeteors = () => {
      const meteors = [];
      for (let i = 0; i < 15; i++) {
        meteors.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 10,
          duration: 3 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.7
        });
      }
      setMeteorShowers(meteors);
    };

    generateMeteors();
    const meteorInterval = setInterval(generateMeteors, 15000);

    return () => {
      observer.disconnect();
      clearInterval(meteorInterval);
    };
  }, []);

  const AnimatedCard = ({ children, delay = 0, className = "" }) => {
    return (
      <div 
        className={`transform transition-all duration-1000 ease-out hover:scale-105 ${className}`}
        style={{ 
          animationDelay: `${delay}ms`,
          animation: 'slideUp 0.8s ease-out forwards'
        }}
      >
        {children}
      </div>
    );
  };

  const FloatingElement = ({ children, className = "" }) => {
    return (
      <div className={`animate-bounce ${className}`} style={{
        animation: 'float 3s ease-in-out infinite'
      }}>
        {children}
      </div>
    );
  };

  const StatCard = ({ value, label, change, trend, delay = 0 }) => {
    return (
      <AnimatedCard delay={delay} className="group">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {value}
            </div>
            {trend && (
              <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
                {change}
              </div>
            )}
          </div>
          <div className="text-gray-400 text-sm">{label}</div>
        </div>
      </AnimatedCard>
    );
  };

  const ProgressBar = ({ label, percentage, color = "blue", delay = 0 }) => {
    return (
      <AnimatedCard delay={delay}>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-sm">{label}</span>
            <span className="text-gray-400 text-sm">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r from-${color}-500 to-${color}-400 h-2 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%`, animationDelay: `${delay}ms` }}
            ></div>
          </div>
        </div>
      </AnimatedCard>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden relative">
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes meteor {
          0% {
            transform: translateX(-100px) translateY(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 100px)) translateY(calc(100vh + 100px));
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
        
        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-rotate {
          animation: rotate 10s linear infinite;
        }

        .meteor {
          position: absolute;
          width: 2px;
          height: 2px;
          background: linear-gradient(45deg, #ffffff, #60a5fa, #3b82f6);
          border-radius: 50%;
          box-shadow: 
            0 0 6px #60a5fa,
            -100px -100px 10px rgba(96, 165, 250, 0.3);
          animation: meteor linear infinite;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle ease-in-out infinite;
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Stars */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}

        {/* Meteors */}
        {meteorShowers.map((meteor) => (
          <div
            key={meteor.id}
            className="meteor"
            style={{
              left: `${meteor.left}%`,
              top: `${meteor.top}%`,
              animationDelay: `${meteor.delay}s`,
              animationDuration: `${meteor.duration}s`,
              opacity: meteor.opacity
            }}
          />
        ))}

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <FloatingElement key={i} className={`absolute text-gray-600`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              <div className="w-1 h-1 bg-white rounded-full animate-pulse-custom" />
            </FloatingElement>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent z-10"></div>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
          <AnimatedCard>
            <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              COSMIC
            </h1>
            <h2 className="text-3xl md:text-5xl font-thin mb-8 text-gray-300">
              Threats & Wonders
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Understanding meteors, asteroids, and their impact on our planet through science and visualization
            </p>
          </AnimatedCard>
          
          <AnimatedCard delay={500}>
            <ChevronDown className="w-8 h-8 mx-auto animate-bounce text-gray-400" />
          </AnimatedCard>
        </div>
      </section>

      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 space-y-4">
        {['basics', 'statistics', 'types', 'impacts', 'defense'].map((section, index) => (
          <div
            key={section}
            className={`w-3 h-3 rounded-full border-2 border-white cursor-pointer transition-all duration-300 ${
              visibleSection === section ? 'bg-white' : 'bg-transparent'
            }`}
            onClick={() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })}
          />
        ))}
      </div>

      {/* Statistics Section */}
      <section id="statistics" data-section className="py-20 px-6 bg-gradient-to-r from-gray-900/30 to-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-5xl font-light text-center mb-16 text-gray-200 flex items-center justify-center gap-4">
              <BarChart3 className="w-12 h-12 text-blue-400" />
              Live Statistics
            </h2>
          </AnimatedCard>

          {/* Key Statistics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <StatCard 
              value="28,743" 
              label="Known Near-Earth Objects" 
              change="+12%" 
              trend="up" 
              delay={100}
            />
            <StatCard 
              value="3,094" 
              label="Potentially Hazardous Asteroids" 
              change="+8%" 
              trend="up" 
              delay={200}
            />
            <StatCard 
              value="0" 
              label="Imminent Threats (Next 100 Years)" 
              change="0%" 
              trend="stable" 
              delay={300}
            />
            <StatCard 
              value="25M" 
              label="Daily Meteors Entering Atmosphere" 
              change="+2%" 
              trend="up" 
              delay={400}
            />
          </div>

          {/* Detection Progress */}
          <AnimatedCard delay={500}>
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-10 mb-12">
              <h3 className="text-3xl font-light mb-8 text-gray-200 text-center">Detection Progress by Size</h3>
              <div className="space-y-6">
                <ProgressBar label="Asteroids > 1 km diameter" percentage={95} color="green" delay={600} />
                <ProgressBar label="Asteroids > 500 m diameter" percentage={78} color="blue" delay={700} />
                <ProgressBar label="Asteroids > 140 m diameter" percentage={42} color="yellow" delay={800} />
                <ProgressBar label="Asteroids > 50 m diameter" percentage={18} color="red" delay={900} />
              </div>
            </div>
          </AnimatedCard>

          {/* Impact Frequency Chart */}
          <div className="grid lg:grid-cols-2 gap-8">
            <AnimatedCard delay={600}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-8">
                <h3 className="text-2xl font-light mb-6 text-gray-200">Impact Frequency</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30">
                    <span className="text-gray-300">1m objects</span>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold">Daily</div>
                      <div className="text-xs text-gray-500">~25 million/day</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/40">
                    <span className="text-gray-300">10m objects</span>
                    <div className="text-right">
                      <div className="text-yellow-400 font-semibold">Every few years</div>
                      <div className="text-xs text-gray-500">Tunguska-class</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
                    <span className="text-gray-300">100m objects</span>
                    <div className="text-right">
                      <div className="text-orange-400 font-semibold">Every 10,000 years</div>
                      <div className="text-xs text-gray-500">Regional damage</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/60">
                    <span className="text-gray-300">1km+ objects</span>
                    <div className="text-right">
                      <div className="text-red-400 font-semibold">Every 500,000 years</div>
                      <div className="text-xs text-gray-500">Global catastrophe</div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={700}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-8">
                <h3 className="text-2xl font-light mb-6 text-gray-200">Famous Impact Events</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-gray-800/30 border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold">Chicxulub Impact</h4>
                      <span className="text-xs text-gray-500">66 million years ago</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">10-15 km asteroid ended dinosaur era</p>
                    <div className="text-xs text-red-400">Energy: ~100 million MT TNT</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-gray-800/40 border-l-4 border-orange-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold">Tunguska Event</h4>
                      <span className="text-xs text-gray-500">1908</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">~60m object flattened 2,000 km² forest</p>
                    <div className="text-xs text-orange-400">Energy: ~12 MT TNT</div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-800/50 border-l-4 border-yellow-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold">Chelyabinsk Meteor</h4>
                      <span className="text-xs text-gray-500">2013</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">~20m object injured 1,500+ people</p>
                    <div className="text-xs text-yellow-400">Energy: ~0.5 MT TNT</div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Basic Understanding Section */}
      <section id="basics" data-section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-5xl font-light text-center mb-16 text-gray-200">The Basics</h2>
          </AnimatedCard>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedCard delay={200} className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 h-full hover:border-gray-600/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Mountain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-light text-gray-200">Asteroids</h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Rocky remnants from the solar system's formation, primarily orbiting between Mars and Jupiter.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>• Size: 1m to 1000km diameter</div>
                  <div>• Composition: Rock, metal, carbon</div>
                  <div>• Location: Asteroid belt, NEOs</div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400} className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 h-full hover:border-gray-600/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-light text-gray-200">Meteoroids</h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Small rocky or metallic bodies in outer space, smaller than asteroids.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>• Size: Grain of sand to 1m</div>
                  <div>• Origin: Asteroids, comets</div>
                  <div>• Billions in space</div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={600} className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 h-full hover:border-gray-600/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-light text-gray-200">Meteors</h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">
                  The bright streaks of light when meteoroids enter Earth's atmosphere.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div>• Also called "shooting stars"</div>
                  <div>• Burn up at 50-120km altitude</div>
                  <div>• 25 million daily</div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Types and Classification */}
      <section id="types" data-section className="py-20 px-6 bg-gradient-to-r from-gray-900/30 to-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-5xl font-light text-center mb-16 text-gray-200">Classification</h2>
          </AnimatedCard>

          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedCard delay={200}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-10">
                <h3 className="text-3xl font-light mb-8 text-gray-200">Asteroid Types</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-300 mb-2">C-type (Carbonaceous)</h4>
                      <p className="text-gray-400">75% of asteroids. Dark, carbon-rich composition. Found in outer asteroid belt.</p>
                      <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-gray-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-300 mb-2">S-type (Silicaceous)</h4>
                      <p className="text-gray-400">17% of asteroids. Rocky, silicate composition. Inner asteroid belt.</p>
                      <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-gray-400 h-2 rounded-full" style={{ width: '17%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-300 mb-2">M-type (Metallic)</h4>
                      <p className="text-gray-400">8% of asteroids. Nickel-iron composition. Middle asteroid belt.</p>
                      <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
                        <div className="bg-gray-300 h-2 rounded-full" style={{ width: '8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-10">
                <h3 className="text-3xl font-light mb-8 text-gray-200">Size Distribution</h3>
                <div className="space-y-8">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300">Small (&lt; 1km)</span>
                      <span className="text-gray-500">~1M objects</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-600 to-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300">Medium (1-10km)</span>
                      <span className="text-gray-500">~1,000 objects</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300">Large (&gt; 10km)</span>
                      <span className="text-gray-500">~200 objects</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full" style={{ width: '3%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Impact Effects */}
      <section id="impacts" data-section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-5xl font-light text-center mb-16 text-gray-200">Impact Effects</h2>
          </AnimatedCard>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <AnimatedCard delay={200} className="group">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/20 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-light mb-4 text-gray-200">Crater Formation</h3>
                <p className="text-gray-400 mb-4">Direct excavation of Earth's surface creating circular depressions.</p>
                <div className="text-sm text-gray-500">
                  Crater diameter ≈ 20x impactor diameter
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400} className="group">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/20 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Waves className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-light mb-4 text-gray-200">Seismic Waves</h3>
                <p className="text-gray-400 mb-4">Earthquake-like vibrations propagating through Earth's crust.</p>
                <div className="text-sm text-gray-500">
                  Can trigger landslides globally
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={600} className="group">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/20 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Globe className="w-10 h-10 text-white animate-rotate" />
                </div>
                <h3 className="text-2xl font-light mb-4 text-gray-200">Atmospheric Effects</h3>
                <p className="text-gray-400 mb-4">Dust and debris injected into atmosphere causing climate changes.</p>
                <div className="text-sm text-gray-500">
                  Can cause global cooling
                </div>
              </div>
            </AnimatedCard>
          </div>

          <AnimatedCard delay={800}>
            <div className="bg-gradient-to-r from-gray-800/20 to-gray-900/20 backdrop-blur-sm border border-gray-700/10 rounded-3xl p-10">
              <h3 className="text-3xl font-light mb-8 text-center text-gray-200">Energy Scale Comparison</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30">
                  <span className="text-gray-300">10m asteroid</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{ width: '1%' }}></div>
                    </div>
                  </div>
                  <span className="text-gray-500">≈ Hiroshima bomb (15 kt TNT)</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/40">
                  <span className="text-gray-300">100m asteroid</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <span className="text-gray-500">≈ 100 Mt TNT (regional damage)</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
                  <span className="text-gray-300">1km asteroid</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <span className="text-gray-500">≈ 100,000 Mt TNT (global effects)</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/60">
                  <span className="text-gray-300">10km asteroid</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <span className="text-gray-500">≈ 100M Mt TNT (mass extinction)</span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Defense Strategies */}
      <section id="defense" data-section className="py-20 px-6 bg-gradient-to-r from-gray-900/40 to-gray-800/40">
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-5xl font-light text-center mb-16 text-gray-200">Planetary Defense</h2>
          </AnimatedCard>

          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedCard delay={200} className="group">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-10 h-full">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-light text-gray-200">Kinetic Impactor</h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Spacecraft crashes into asteroid at high speed, changing its velocity and orbital path.
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Effectiveness:</span>
                    <span className="text-gray-400">High for small-medium asteroids</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead time needed:</span>
                    <span className="text-gray-400">Years to decades</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technology readiness:</span>
                    <span className="text-green-400">Proven (DART mission)</span>
                  </div>
                  <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400} className="group">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-10 h-full">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-light text-gray-200">Nuclear Deflection</h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Nuclear explosive detonated near asteroid surface, vaporizing material to create thrust.
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Effectiveness:</span>
                    <span className="text-gray-400">Very high for large asteroids</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead time needed:</span>
                    <span className="text-gray-400">Months to years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technology readiness:</span>
                    <span className="text-yellow-400">Theoretical</span>
                  </div>
                  <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={600} className="group">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-10 h-full">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-8 h-8 text-white animate-rotate" />
                  </div>
                  <h3 className="text-3xl font-light text-gray-200">Gravity Tractor</h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Spacecraft hovers near asteroid, using gravitational attraction to slowly alter its trajectory.
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Effectiveness:</span>
                    <span className="text-gray-400">Low but precise</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead time needed:</span>
                    <span className="text-gray-400">Decades</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technology readiness:</span>
                    <span className="text-blue-400">Current technology</span>
                  </div>
                  <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={800} className="group">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-10 h-full">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-light text-gray-200">Early Warning Systems</h3>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Ground and space-based telescopes continuously scan for potentially hazardous objects.
                </p>
                <div className="space-y-3 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Current capability:</span>
                    <span className="text-gray-400">&gt;90% of 1km+ asteroids</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Future goal:</span>
                    <span className="text-gray-400">90% of 140m+ asteroids</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warning time:</span>
                    <span className="text-gray-400">Years to decades</span>
                  </div>
                  <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedCard>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Understanding these cosmic threats is the first step toward protecting our planet. 
              Through science, technology, and international cooperation, we can defend Earth from asteroid impacts.
            </p>
            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <div className="text-center">
                <div className="text-2xl font-light text-white">28,743</div>
                <div className="text-sm">Known NEOs</div>
              </div>
              <div className="w-px h-12 bg-gray-700"></div>
              <div className="text-center">
                <div className="text-2xl font-light text-white">3,094</div>
                <div className="text-sm">PHAs tracked</div>
              </div>
              <div className="w-px h-12 bg-gray-700"></div>
              <div className="text-center">
                <div className="text-2xl font-light text-white">0</div>
                <div className="text-sm">Known imminent threats</div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </footer>
    </div>
  );
};

export default EducationPage;
