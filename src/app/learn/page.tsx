"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Zap,
  Globe,
  Shield,
  Target,
  Waves,
  Mountain,
  BarChart3,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

interface MeteorShower {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

interface StatCardProps {
  value: string;
  label: string;
  change?: string;
  trend?: "up" | "down" | "stable";
  delay?: number;
}

interface ProgressBarProps {
  label: string;
  percentage: number;
  color?: "blue" | "green" | "yellow" | "red";
  delay?: number;
}

const EducationPage = () => {
  const [visibleSection, setVisibleSection] = useState("");
  const [meteorShowers, setMeteorShowers] = useState<MeteorShower[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

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

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((el) => {
      observer.observe(el);
    });

    // Generate random meteors
    const generateMeteors = () => {
      const meteors: MeteorShower[] = [];
      for (let i = 0; i < 15; i++) {
        meteors.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 10,
          duration: 3 + Math.random() * 4,
          opacity: 0.3 + Math.random() * 0.7,
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
  }, [isClient]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const AnimatedCard = ({
    children,
    delay = 0,
    className = "",
  }: AnimatedCardProps) => {
    return (
      <div
        className={`transform transition-all duration-1000 ease-out hover:scale-105 opacity-0 ${className}`}
        style={{
          animation: `slideUp 0.8s ease-out ${delay}ms forwards`,
        }}
      >
        {children}
      </div>
    );
  };

  const StatCard = ({
    value,
    label,
    change,
    trend,
    delay = 0,
  }: StatCardProps) => {
    return (
      <AnimatedCard delay={delay} className="group">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-4 sm:p-6 hover:border-blue-500/50 transition-all duration-500">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
              {value}
            </div>
            {trend && trend !== "stable" && (
              <div
                className={`flex items-center text-xs sm:text-sm ${
                  trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                <TrendingUp
                  className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 transition-transform ${
                    trend === "down" ? "rotate-180" : ""
                  }`}
                />
                {change}
              </div>
            )}
          </div>
          <div className="text-gray-400 text-xs sm:text-sm">{label}</div>
        </div>
      </AnimatedCard>
    );
  };

  const ProgressBar = ({
    label,
    percentage,
    color = "blue",
    delay = 0,
  }: ProgressBarProps) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-400",
      green: "from-green-500 to-green-400",
      yellow: "from-yellow-500 to-yellow-400",
      red: "from-red-500 to-red-400",
    };

    return (
      <AnimatedCard delay={delay}>
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-xs sm:text-sm">{label}</span>
            <span className="text-gray-400 text-xs sm:text-sm">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
            <div
              className={`bg-gradient-to-r ${colorClasses[color]} h-1.5 sm:h-2 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </AnimatedCard>
    );
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-white"></div>
      </div>
    );
  }

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
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
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
            transform: translateX(calc(100vw + 100px))
              translateY(calc(100vh + 100px));
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%,
          100% {
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
          box-shadow: 0 0 6px #60a5fa;
          animation: meteor linear infinite;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle ease-in-out infinite;
        }
      `}</style>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 lg:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-6 p-6">
            {["basics", "statistics", "types", "impacts", "defense"].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="text-2xl text-white font-light uppercase tracking-wider hover:text-blue-400 transition-colors py-3"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              )
            )}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 text-white p-2"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

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
              animationDuration: `${2 + Math.random() * 2}s`,
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
              opacity: meteor.opacity,
            }}
          />
        ))}

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float 3s ease-in-out ${
                  Math.random() * 3
                }s infinite`,
              }}
            >
              <div className="w-1 h-1 bg-white rounded-full animate-pulse-custom" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-40 p-2 bg-gray-800/80 backdrop-blur-sm rounded-lg text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent z-10"></div>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-4 sm:px-6">
          <AnimatedCard>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light tracking-wider mb-4 sm:mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              COSMIC
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-thin mb-6 sm:mb-8 text-gray-300">
              Threats & Wonders
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
              Understanding meteors, asteroids, and their impact on our planet
              through science and visualization
            </p>
          </AnimatedCard>

          <AnimatedCard delay={500}>
            <div className="animate-bounce">
              <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400" />
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Navigation Dots - Hidden on mobile */}
      <div className="hidden lg:flex fixed right-8 top-1/2 transform -translate-y-1/2 z-30 space-y-4">
        {["basics", "statistics", "types", "impacts", "defense"].map(
          (section) => (
            <button
              key={section}
              className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
                visibleSection === section ? "bg-white" : "bg-transparent"
              }`}
              onClick={() => scrollToSection(section)}
              aria-label={`Scroll to ${section} section`}
            />
          )
        )}
      </div>

      {/* Basic Understanding Section */}
      <section
        id="basics"
        data-section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-8 sm:mb-12 lg:mb-16 text-gray-200">
              The Basics
            </h2>
          </AnimatedCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <AnimatedCard delay={200} className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full hover:border-gray-600/50 transition-all duration-500">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Mountain className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-200">
                    Asteroids
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm">
                  Rocky remnants from the solar system's formation, primarily
                  orbiting between Mars and Jupiter.
                </p>
                <div className="space-y-1 sm:space-y-2 text-xs text-gray-500">
                  <div>• Size: 1m to 1000km diameter</div>
                  <div>• Composition: Rock, metal, carbon</div>
                  <div>• Location: Asteroid belt, NEOs</div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400} className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full hover:border-gray-600/50 transition-all duration-500">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-200">
                    Meteoroids
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm">
                  Small rocky or metallic bodies in outer space, smaller than
                  asteroids.
                </p>
                <div className="space-y-1 sm:space-y-2 text-xs text-gray-500">
                  <div>• Size: Grain of sand to 1m</div>
                  <div>• Origin: Asteroids, comets</div>
                  <div>• Billions in space</div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={600} className="group">
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 h-full hover:border-gray-600/50 transition-all duration-500">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-200">
                    Meteors
                  </h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-3 sm:mb-4 text-xs sm:text-sm">
                  The bright streaks of light when meteoroids enter Earth's
                  atmosphere.
                </p>
                <div className="space-y-1 sm:space-y-2 text-xs text-gray-500">
                  <div>• Also called "shooting stars"</div>
                  <div>• Burn up at 50-120km altitude</div>
                  <div>• 25 million daily</div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section
        id="statistics"
        data-section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-r from-gray-900/30 to-gray-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-8 sm:mb-12 lg:mb-16 text-gray-200 flex items-center justify-center gap-3 sm:gap-4">
              <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-400" />
              Live Statistics
            </h2>
          </AnimatedCard>

          {/* Key Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
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
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 text-gray-200 text-center">
                Detection Progress by Size
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <ProgressBar
                  label="Asteroids > 1 km diameter"
                  percentage={95}
                  color="green"
                  delay={600}
                />
                <ProgressBar
                  label="Asteroids > 500 m diameter"
                  percentage={78}
                  color="blue"
                  delay={700}
                />
                <ProgressBar
                  label="Asteroids > 140 m diameter"
                  percentage={42}
                  color="yellow"
                  delay={800}
                />
                <ProgressBar
                  label="Asteroids > 50 m diameter"
                  percentage={18}
                  color="red"
                  delay={900}
                />
              </div>
            </div>
          </AnimatedCard>

          {/* Impact Frequency Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <AnimatedCard delay={600}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-light mb-4 sm:mb-6 text-gray-200">
                  Impact Frequency
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-800/30">
                    <span className="text-gray-300 text-sm">1m objects</span>
                    <div className="text-right">
                      <div className="text-green-400 font-semibold text-sm">
                        Daily
                      </div>
                      <div className="text-xs text-gray-500">
                        ~25 million/day
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-800/40">
                    <span className="text-gray-300 text-sm">10m objects</span>
                    <div className="text-right">
                      <div className="text-yellow-400 font-semibold text-sm">
                        Every few years
                      </div>
                      <div className="text-xs text-gray-500">
                        Tunguska-class
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-800/50">
                    <span className="text-gray-300 text-sm">100m objects</span>
                    <div className="text-right">
                      <div className="text-orange-400 font-semibold text-sm">
                        Every 10,000 years
                      </div>
                      <div className="text-xs text-gray-500">
                        Regional damage
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-800/60">
                    <span className="text-gray-300 text-sm">1km+ objects</span>
                    <div className="text-right">
                      <div className="text-red-400 font-semibold text-sm">
                        Every 500,000 years
                      </div>
                      <div className="text-xs text-gray-500">
                        Global catastrophe
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={700}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-light mb-4 sm:mb-6 text-gray-200">
                  Famous Impact Events
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 sm:p-4 rounded-xl bg-gray-800/30 border-l-4 border-red-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold text-sm sm:text-base">
                        Chicxulub Impact
                      </h4>
                      <span className="text-xs text-gray-500">
                        66 million years ago
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2">
                      10-15 km asteroid ended dinosaur era
                    </p>
                    <div className="text-xs text-red-400">
                      Energy: ~100 million MT TNT
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl bg-gray-800/40 border-l-4 border-orange-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold text-sm sm:text-base">
                        Tunguska Event
                      </h4>
                      <span className="text-xs text-gray-500">1908</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2">
                      ~60m object flattened 2,000 km² forest
                    </p>
                    <div className="text-xs text-orange-400">
                      Energy: ~12 MT TNT
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl bg-gray-800/50 border-l-4 border-yellow-500">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold text-sm sm:text-base">
                        Chelyabinsk Meteor
                      </h4>
                      <span className="text-xs text-gray-500">2013</span>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2">
                      ~20m object injured 1,500+ people
                    </p>
                    <div className="text-xs text-yellow-400">
                      Energy: ~0.5 MT TNT
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Types and Classification */}
      <section
        id="types"
        data-section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-r from-gray-900/30 to-gray-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-8 sm:mb-12 lg:mb-16 text-gray-200">
              Classification
            </h2>
          </AnimatedCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <AnimatedCard delay={200}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 text-gray-200">
                  Asteroid Types
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-300 mb-1 sm:mb-2">
                        C-type (Carbonaceous)
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        75% of asteroids. Dark, carbon-rich composition. Found
                        in outer asteroid belt.
                      </p>
                      <div className="mt-2 sm:mt-3 w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-gray-500 h-1.5 sm:h-2 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-300 mb-1 sm:mb-2">
                        S-type (Silicaceous)
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        17% of asteroids. Rocky, silicate composition. Inner
                        asteroid belt.
                      </p>
                      <div className="mt-2 sm:mt-3 w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-gray-400 h-1.5 sm:h-2 rounded-full"
                          style={{ width: "17%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-base sm:text-lg lg:text-xl font-medium text-gray-300 mb-1 sm:mb-2">
                        M-type (Metallic)
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        8% of asteroids. Nickel-iron composition. Middle
                        asteroid belt.
                      </p>
                      <div className="mt-2 sm:mt-3 w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                        <div
                          className="bg-gray-300 h-1.5 sm:h-2 rounded-full"
                          style={{ width: "8%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 text-gray-200">
                  Size Distribution
                </h3>
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-gray-300 text-sm">
                        Small (&lt; 1km)
                      </span>
                      <span className="text-gray-500 text-sm">~1M objects</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-green-600 to-green-500 h-2 sm:h-3 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-gray-300 text-sm">
                        Medium (1-10km)
                      </span>
                      <span className="text-gray-500 text-sm">
                        ~1,000 objects
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 sm:h-3 rounded-full"
                        style={{ width: "12%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-gray-300 text-sm">
                        Large (&gt; 10km)
                      </span>
                      <span className="text-gray-500 text-sm">
                        ~200 objects
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-400 h-2 sm:h-3 rounded-full"
                        style={{ width: "3%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Impact Effects */}
      <section
        id="impacts"
        data-section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6"
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-8 sm:mb-12 lg:mb-16 text-gray-200">
              Impact Effects
            </h2>
          </AnimatedCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
            <AnimatedCard delay={200} className="group">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-light mb-3 sm:mb-4 text-gray-200">
                  Crater Formation
                </h3>
                <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                  Direct excavation of Earth's surface creating circular
                  depressions.
                </p>
                <div className="text-xs text-gray-500">
                  Crater diameter ≈ 20x impactor diameter
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400} className="group">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Waves className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-light mb-3 sm:mb-4 text-gray-200">
                  Seismic Waves
                </h3>
                <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                  Earthquake-like vibrations propagating through Earth's crust.
                </p>
                <div className="text-xs text-gray-500">
                  Can trigger landslides globally
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={600} className="group">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white animate-rotate" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-light mb-3 sm:mb-4 text-gray-200">
                  Atmospheric Effects
                </h3>
                <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">
                  Dust and debris injected into atmosphere causing climate
                  changes.
                </p>
                <div className="text-xs text-gray-500">
                  Can cause global cooling
                </div>
              </div>
            </AnimatedCard>
          </div>

          <AnimatedCard delay={800}>
            <div className="bg-gradient-to-r from-gray-800/20 to-gray-900/20 backdrop-blur-sm border border-gray-700/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-light mb-6 sm:mb-8 text-center text-gray-200">
                Energy Scale Comparison
              </h3>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-800/30">
                  <span className="text-gray-300 text-sm">10m asteroid</span>
                  <div className="flex-1 mx-3 sm:mx-4">
                    <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 sm:h-2 rounded-full"
                        style={{ width: "1%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    ≈ Hiroshima bomb (15 kt TNT)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-800/40">
                  <span className="text-gray-300 text-sm">100m asteroid</span>
                  <div className="flex-1 mx-3 sm:mx-4">
                    <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-1.5 sm:h-2 rounded-full"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    ≈ 100 Mt TNT (regional damage)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-800/50">
                  <span className="text-gray-300 text-sm">1km asteroid</span>
                  <div className="flex-1 mx-3 sm:mx-4">
                    <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-orange-400 h-1.5 sm:h-2 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    ≈ 100,000 Mt TNT (global effects)
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-gray-800/60">
                  <span className="text-gray-300 text-sm">10km asteroid</span>
                  <div className="flex-1 mx-3 sm:mx-4">
                    <div className="w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-red-400 h-1.5 sm:h-2 rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    ≈ 100M Mt TNT (mass extinction)
                  </span>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </section>

      {/* Defense Strategies */}
      <section
        id="defense"
        data-section
        className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-r from-gray-900/40 to-gray-800/40"
      >
        <div className="max-w-7xl mx-auto">
          <AnimatedCard>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-center mb-8 sm:mb-12 lg:mb-16 text-gray-200">
              Planetary Defense
            </h2>
          </AnimatedCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            <AnimatedCard delay={200} className="group">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 h-full">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-gray-200">
                    Kinetic Impactor
                  </h3>
                </div>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm">
                  Spacecraft crashes into asteroid at high speed, changing its
                  velocity and orbital path.
                </p>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Effectiveness:</span>
                    <span className="text-gray-400">
                      High for small-medium asteroids
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead time needed:</span>
                    <span className="text-gray-400">Years to decades</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technology readiness:</span>
                    <span className="text-green-400">
                      Proven (DART mission)
                    </span>
                  </div>
                  <div className="mt-3 sm:mt-4 w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-green-500 h-1.5 sm:h-2 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400} className="group">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 h-full">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-gray-200">
                    Nuclear Deflection
                  </h3>
                </div>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm">
                  Nuclear explosive detonated near asteroid surface, vaporizing
                  material to create thrust.
                </p>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Effectiveness:</span>
                    <span className="text-gray-400">
                      Very high for large asteroids
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lead time needed:</span>
                    <span className="text-gray-400">Months to years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Technology readiness:</span>
                    <span className="text-yellow-400">Theoretical</span>
                  </div>
                  <div className="mt-3 sm:mt-4 w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-yellow-500 h-1.5 sm:h-2 rounded-full"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={600} className="group">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 h-full">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white animate-rotate" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-gray-200">
                    Gravity Tractor
                  </h3>
                </div>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm">
                  Spacecraft hovers near asteroid, using gravitational
                  attraction to slowly alter its trajectory.
                </p>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-500">
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
                  <div className="mt-3 sm:mt-4 w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-blue-500 h-1.5 sm:h-2 rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={800} className="group">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 h-full">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-gray-200">
                    Early Warning Systems
                  </h3>
                </div>
                <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm">
                  Ground and space-based telescopes continuously scan for
                  potentially hazardous objects.
                </p>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Current capability:</span>
                    <span className="text-gray-400">
                      &gt;90% of 1km+ asteroids
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Future goal:</span>
                    <span className="text-gray-400">
                      90% of 140m+ asteroids
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warning time:</span>
                    <span className="text-gray-400">Years to decades</span>
                  </div>
                  <div className="mt-3 sm:mt-4 w-full bg-gray-800 rounded-full h-1.5 sm:h-2">
                    <div
                      className="bg-purple-500 h-1.5 sm:h-2 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-gray-800/30">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedCard>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
              Understanding these cosmic threats is the first step toward
              protecting our planet. Through science, technology, and
              international cooperation, we can defend Earth from asteroid
              impacts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-gray-500">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-light text-white">
                  28,743
                </div>
                <div className="text-xs sm:text-sm">Known NEOs</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-700"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-light text-white">
                  3,094
                </div>
                <div className="text-xs sm:text-sm">PHAs tracked</div>
              </div>
              <div className="hidden sm:block w-px h-8 bg-gray-700"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-light text-white">
                  0
                </div>
                <div className="text-xs sm:text-sm">Known imminent threats</div>
              </div>
            </div>
          </AnimatedCard>
        </div>
      </footer>
    </div>
  );
};

export default EducationPage;
