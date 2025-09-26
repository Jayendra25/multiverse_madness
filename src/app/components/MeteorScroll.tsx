import React, { useMemo } from "react"; // Changed useRef to useMemo
import { ScrollControls, Stars, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Meteor } from "./Meteor";
import { Overlay } from "./Overlay";

const meteorData = [
  {
    title: "Perseid Meteor",
    description:
      "The Perseids are a prolific meteor shower associated with the comet Swift–Tuttle. The meteors are called the Perseids because the point from which they appear to hail lies in the constellation Perseus.",
    color: "#ffaaaa",
  },
  {
    title: "Geminid Meteor",
    description:
      "The Geminids are a prolific meteor shower caused by the object 3200 Phaethon. The meteors from this shower are slow-moving, can be bold, white, and bright.",
    color: "#aaffaa",
  },
  {
    title: "Orionid Meteor",
    description:
      "The Orionid meteor shower is the most prolific meteor shower associated with Halley's Comet. Orionids are known for their brightness and for their speed.",
    color: "#aaaaff",
  },
  {
    title: "Leonid Meteor",
    description:
      "The Leonids are a prolific meteor shower associated with the comet Tempel-Tuttle. They are known for their periodic storms of thousands of meteors per hour.",
    color: "#ffffaa",
  },
];

const OverlayController: React.FC<{
  sectionRefs: React.RefObject<HTMLDivElement>[];
  numSections: number;
}> = ({ sectionRefs, numSections }) => {
  const scrollData = useScroll();

  useFrame(() => {
    sectionRefs.forEach((ref, index) => {
      if (!ref.current) return;

      const start = index / numSections;
      const length = 1 / numSections;
      const progress = scrollData.range(start, length);

      // Timings are now perfectly synchronized with the meteor's center stage (0.4 to 0.6)
      const fadeInStart = 0.45; // thoda late start
      const fadeInEnd = 0.5; // center ke pass full visible
      const fadeOutStart = 0.6; // hold thoda short
      const fadeOutEnd = 0.65; // jaldi fade out

      let visibility = 0;

      if (progress >= fadeInStart && progress < fadeInEnd) {
        // Phase 1: Fade In
        const fadeInProgress =
          (progress - fadeInStart) / (fadeInEnd - fadeInStart);
        visibility = fadeInProgress;
      } else if (progress >= fadeInEnd && progress < fadeOutStart) {
        // Phase 2: Hold (Fully visible)
        visibility = 1;
      } else if (progress >= fadeOutStart && progress < fadeOutEnd) {
        // Phase 3: Fade Out
        const fadeOutProgress =
          (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
        visibility = 1 - fadeOutProgress;
      }

      const easedVisibility = Math.sin((visibility * Math.PI) / 2);
      ref.current.style.opacity = `${easedVisibility}`;

      const scale = 0.9 + easedVisibility * 0.1; // Scale from 0.9 to 1.0
      ref.current.style.transform = `scale(${scale})`;

      ref.current.style.pointerEvents = easedVisibility > 0.1 ? "auto" : "none";
    });
  });

  return null; // This component does not render any visible elements
};

export const MeteorScroll: React.FC = () => {
  const numMeteors = meteorData.length;

  // FIX: Use useMemo to create the array of refs only once.
  const sectionRefs = useMemo(
    () =>
      Array.from({ length: numMeteors }, () =>
        React.createRef<HTMLDivElement>()
      ),
    [numMeteors]
  );

  return (
    <ScrollControls pages={numMeteors} damping={0.1}>
      {/* 3D Scene */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <Stars
        radius={300}
        depth={100}
        count={10000}
        factor={7}
        saturation={0}
        fade
        speed={2}
      />

      {meteorData.map((meteor, index) => (
        <Meteor
          key={index}
          index={index}
          numMeteors={numMeteors}
          color={meteor.color}
        />
      ))}

      {/* Controller for HTML animations */}
      <OverlayController
        // FIX: Pass the memoized array directly
        sectionRefs={sectionRefs}
        numSections={numMeteors}
      />

      {/* HTML Overlay */}
      <Overlay
        meteorData={meteorData}
        // FIX: Pass the memoized array directly
        sectionRefs={sectionRefs}
      />
    </ScrollControls>
  );
};
import React, { useState, useEffect } from 'react';
import { ChevronDown, Zap, Globe, Shield, Target, Waves, Mountain } from 'lucide-react';

const EducationPage = () => {
  const [visibleSection, setVisibleSection] = useState('');

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

    return () => observer.disconnect();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
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
        
        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .animate-rotate {
          animation: rotate 10s linear infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent z-10"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <FloatingElement className="absolute top-20 left-10 text-gray-600">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse-custom"></div>
          </FloatingElement>
          <FloatingElement className="absolute top-40 right-20 text-gray-600">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse-custom" style={{ animationDelay: '1s' }}></div>
          </FloatingElement>
          <FloatingElement className="absolute bottom-40 left-1/4 text-gray-600">
            <div className="w-1 h-1 bg-white rounded-full animate-pulse-custom" style={{ animationDelay: '2s' }}></div>
          </FloatingElement>
        </div>

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
        {['basics', 'types', 'impacts', 'defense'].map((section, index) => (
          <div
            key={section}
            className={`w-3 h-3 rounded-full border-2 border-white cursor-pointer transition-all duration-300 ${
              visibleSection === section ? 'bg-white' : 'bg-transparent'
            }`}
            onClick={() => document.getElementById(section).scrollIntoView({ behavior: 'smooth' })}
          />
        ))}
      </div>

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
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-300 mb-2">S-type (Silicaceous)</h4>
                      <p className="text-gray-400">17% of asteroids. Rocky, silicate composition. Inner asteroid belt.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-300 mb-2">M-type (Metallic)</h4>
                      <p className="text-gray-400">8% of asteroids. Nickel-iron composition. Middle asteroid belt.</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400}>
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/20 rounded-3xl p-10">
                <h3 className="text-3xl font-light mb-8 text-gray-200">Size Categories</h3>
                <div className="space-y-8">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300">Small Asteroids</span>
                      <span className="text-gray-500">&lt; 1km</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-gray-600 to-gray-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300">Medium Asteroids</span>
                      <span className="text-gray-500">1-10km</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-gray-500 to-gray-400 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300">Large Asteroids</span>
                      <span className="text-gray-500">&gt; 10km</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-gray-400 to-gray-300 h-2 rounded-full" style={{ width: '70%' }}></div>
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
                  <span className="text-gray-500">≈ Hiroshima bomb (15 kt TNT)</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/40">
                  <span className="text-gray-300">100m asteroid</span>
                  <span className="text-gray-500">≈ 100 Mt TNT (regional damage)</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/50">
                  <span className="text-gray-300">1km asteroid</span>
                  <span className="text-gray-500">≈ 100,000 Mt TNT (global effects)</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/60">
                  <span className="text-gray-300">10km asteroid</span>
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
                    <span className="text-gray-400">Proven (DART mission)</span>
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
                    <span className="text-gray-400">Theoretical</span>
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
                    <span className="text-gray-400">Current technology</span>
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
                <div className="text-2xl font-light text-white">28,000+</div>
                <div className="text-sm">Known NEOs</div>
              </div>
              <div className="w-px h-12 bg-gray-700"></div>
              <div className="text-center">
                <div className="text-2xl font-light text-white">3,000+</div>
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