"use client";

import React, { Suspense, useRef, useState, useCallback, useMemo } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Target } from "lucide-react";

interface ImpactPoint {
  position: [number, number, number];
  coordinates: { lat: number; lng: number };
  continent: string;
  isAnimating: boolean;
  id: string; // Added unique identifier
}

// Realistic Earth with proper materials and textures
function ClickableEarth({
  onSurfaceClick,
}: {
  onSurfaceClick: (point: any) => void;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Create realistic Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Ocean background
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGradient.addColorStop(0, "#1a365d");
    oceanGradient.addColorStop(0.3, "#2563eb");
    oceanGradient.addColorStop(0.7, "#3b82f6");
    oceanGradient.addColorStop(1, "#1e40af");

    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 2048, 1024);

    // Helper function for continent drawing
    const drawContinent = (name: string, color: string, paths: any[]) => {
      ctx.fillStyle = color;
      ctx.strokeStyle = "#0f4a3c";
      ctx.lineWidth = 2;

      paths.forEach((path) => {
        ctx.beginPath();
        if (path.type === "polygon") {
          ctx.moveTo(path.points[0][0], path.points[0][1]);
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i][0], path.points[i][1]);
          }
          ctx.closePath();
        } else if (path.type === "ellipse") {
          ctx.ellipse(
            path.x,
            path.y,
            path.rx,
            path.ry,
            path.rotation || 0,
            0,
            Math.PI * 2
          );
        }
        ctx.fill();
        ctx.stroke();
      });
    };

    // Draw continents (simplified for better performance)
    drawContinent("ASIA", "#2d5a27", [
      {
        type: "polygon",
        points: [
          [1100, 200],
          [1200, 180],
          [1300, 190],
          [1400, 200],
          [1500, 220],
          [1600, 250],
          [1700, 280],
          [1750, 320],
          [1780, 360],
          [1770, 400],
          [1750, 430],
          [1700, 450],
          [1650, 440],
          [1600, 430],
          [1550, 420],
          [1500, 410],
          [1450, 400],
          [1400, 390],
          [1350, 380],
          [1300, 370],
          [1250, 360],
          [1200, 350],
          [1150, 340],
          [1120, 320],
          [1100, 280],
          [1090, 240],
        ],
      },
    ]);

    drawContinent("AFRICA", "#3d7c47", [
      {
        type: "polygon",
        points: [
          [1000, 350],
          [1020, 300],
          [1040, 280],
          [1060, 290],
          [1080, 310],
          [1090, 340],
          [1095, 380],
          [1100, 420],
          [1095, 460],
          [1090, 500],
          [1080, 540],
          [1070, 580],
          [1055, 620],
          [1040, 650],
          [1020, 670],
          [1000, 675],
          [980, 670],
          [965, 650],
          [955, 620],
          [950, 580],
          [945, 540],
          [940, 500],
          [935, 460],
          [940, 420],
          [950, 380],
          [970, 360],
        ],
      },
    ]);

    drawContinent("NORTH AMERICA", "#4a7c59", [
      {
        type: "polygon",
        points: [
          [200, 180],
          [300, 160],
          [400, 170],
          [500, 190],
          [600, 220],
          [650, 260],
          [680, 300],
          [690, 340],
          [685, 380],
          [670, 410],
          [640, 430],
          [600, 440],
          [550, 435],
          [500, 430],
          [450, 425],
          [400, 420],
          [350, 410],
          [300, 395],
          [250, 375],
          [200, 350],
          [160, 320],
          [140, 280],
          [130, 240],
          [140, 200],
        ],
      },
    ]);

    drawContinent("SOUTH AMERICA", "#2d5a27", [
      {
        type: "polygon",
        points: [
          [600, 450],
          [640, 430],
          [670, 450],
          [690, 480],
          [700, 520],
          [705, 560],
          [710, 600],
          [715, 640],
          [720, 680],
          [715, 720],
          [700, 760],
          [680, 790],
          [660, 810],
          [635, 820],
          [610, 815],
          [590, 800],
          [575, 780],
          [565, 750],
          [560, 720],
          [555, 690],
          [550, 660],
          [545, 630],
          [540, 600],
          [545, 570],
          [560, 540],
          [580, 510],
          [590, 480],
        ],
      },
    ]);

    drawContinent("ANTARCTICA", "#e2e8f0", [
      {
        type: "ellipse",
        x: 1024,
        y: 950,
        rx: 400,
        ry: 60,
      },
    ]);

    drawContinent("EUROPE", "#22543d", [
      {
        type: "polygon",
        points: [
          [950, 220],
          [980, 200],
          [1010, 210],
          [1040, 225],
          [1060, 245],
          [1070, 270],
          [1065, 295],
          [1050, 315],
          [1030, 325],
          [1010, 330],
          [990, 325],
          [970, 315],
          [955, 295],
          [945, 275],
          [940, 250],
        ],
      },
    ]);

    drawContinent("AUSTRALIA", "#8b7355", [
      {
        type: "ellipse",
        x: 1650,
        y: 720,
        rx: 80,
        ry: 45,
      },
    ]);

    return new THREE.CanvasTexture(canvas);
  }, []);

  // Cloud texture
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, 2048, 1024);

    const cloudRegions = [
      { x: 0, y: 400, width: 2048, height: 200, density: 80 }, // Reduced density for performance
      { x: 0, y: 250, width: 2048, height: 100, density: 40 },
      { x: 0, y: 650, width: 2048, height: 100, density: 40 },
    ];

    cloudRegions.forEach((region) => {
      for (let i = 0; i < region.density; i++) {
        const x = region.x + Math.random() * region.width;
        const y = region.y + Math.random() * region.height;
        const radius = Math.random() * 30 + 10; // Reduced radius
        const opacity = Math.random() * 0.4 + 0.2; // Reduced opacity

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    return new THREE.CanvasTexture(canvas);
  }, []);

  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();

      if (event.point && earthRef.current) {
        const point = event.point.clone().normalize();
        const lat = Math.asin(point.y) * (180 / Math.PI);
        const lng = Math.atan2(point.z, point.x) * (180 / Math.PI);

        const continent = getContinent(lat, lng);

        onSurfaceClick({
          position: [point.x * 2.1, point.y * 2.1, point.z * 2.1],
          coordinates: { lat, lng },
          continent,
          isAnimating: true,
          id: `${Date.now()}-${Math.random()}`, // Add unique ID
        });
      }
    },
    [onSurfaceClick]
  );

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.003;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <Sphere
        ref={earthRef}
        args={[2, 32, 32]} // Reduced segments for better performance
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshLambertMaterial
          map={earthTexture}
          color={hovered ? "#ffffff" : "#e6f3ff"}
          emissive="#001122"
          emissiveIntensity={0.1}
        />
      </Sphere>

      <Sphere ref={cloudsRef} args={[2.02, 24, 24]}>
        {" "}
        {/* Reduced segments */}
        <meshLambertMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          color="#ffffff"
          depthWrite={false} // Fix transparency issues
        />
      </Sphere>

      <Sphere ref={atmosphereRef} args={[2.08, 24, 24]}>
        {" "}
        {/* Reduced segments */}
        <meshLambertMaterial
          color="#87ceeb"
          transparent
          opacity={0.15} // Reduced opacity
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>

      <Sphere args={[2.2, 16, 16]}>
        <meshBasicMaterial
          color="#4a9fff"
          transparent
          opacity={0.03} // Reduced opacity
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>
    </group>
  );
}

// 3D Meteor Model with realistic geometry
function Animated3DMeteor({
  target,
  isActive,
  onImpact,
}: {
  target: [number, number, number];
  isActive: boolean;
  onImpact: () => void;
}) {
  const meteorGroupRef = useRef<THREE.Group>(null);
  const meteorBodyRef = useRef<THREE.Group>(null);
  const trailParticles = useRef<(THREE.Group | null)[]>([]);
  const [hasImpacted, setHasImpacted] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  // Create irregular meteor shape
  const meteorGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.08, 8, 6); // Reduced complexity
    const positions = geometry.attributes.position.array as Float32Array;

    // Deform sphere to make it look like an irregular rock
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      // Add random deformations
      const noise = (Math.random() - 0.5) * 0.2; // Reduced noise
      const length = Math.sqrt(x * x + y * y + z * z);

      if (length > 0) {
        // Avoid division by zero
        positions[i] = x + (x / length) * noise;
        positions[i + 1] = y + (y / length) * noise;
        positions[i + 2] = z + (z / length) * noise;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  useFrame((state) => {
    if (!isActive || hasImpacted) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const currentTime = state.clock.elapsedTime;
    const elapsed = currentTime - startTimeRef.current;
    const flightDuration = 3; // Reduced duration

    if (elapsed > flightDuration) {
      if (!hasImpacted) {
        setHasImpacted(true);
        onImpact();
      }
      return;
    }

    const t = Math.min(elapsed / flightDuration, 1);

    // Quadratic easing for more realistic motion
    const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    if (meteorGroupRef.current) {
      const spaceDistance = 8; // Reduced distance
      const startPos: [number, number, number] = [
        target[0] * spaceDistance,
        target[1] * spaceDistance,
        target[2] * spaceDistance,
      ];

      // Current position
      const currentPos: [number, number, number] = [
        startPos[0] + (target[0] - startPos[0]) * easedT,
        startPos[1] + (target[1] - startPos[1]) * easedT,
        startPos[2] + (target[2] - startPos[2]) * easedT,
      ];

      meteorGroupRef.current.position.set(
        currentPos[0],
        currentPos[1],
        currentPos[2]
      );

      // Realistic tumbling rotation
      if (meteorBodyRef.current) {
        meteorBodyRef.current.rotation.x += 0.2 * (1 + t * 2);
        meteorBodyRef.current.rotation.y += 0.1 * (1 + t * 2);
        meteorBodyRef.current.rotation.z += 0.05 * (1 + t * 2);

        // Scale increases as it heats up in atmosphere
        const scale = 0.5 + t * 1.5; // Reduced scale
        meteorBodyRef.current.scale.set(scale, scale, scale);
      }

      // Update trail particles
      trailParticles.current.forEach((particle, index) => {
        if (particle) {
          const delay = index * 0.08; // Reduced delay
          const trailT = Math.max(easedT - delay, 0);

          if (trailT > 0) {
            const trailPos: [number, number, number] = [
              startPos[0] + (target[0] - startPos[0]) * trailT,
              startPos[1] + (target[1] - startPos[1]) * trailT,
              startPos[2] + (target[2] - startPos[2]) * trailT,
            ];
            particle.position.set(trailPos[0], trailPos[1], trailPos[2]);

            // Fade and shrink trail particles over distance
            const fadeAmount = Math.max(0.9 - index * 0.1, 0.1) * (1 - trailT);
            const scaleAmount =
              Math.max(0.8 - index * 0.08, 0.2) * (0.3 + trailT);

            particle.scale.set(scaleAmount, scaleAmount, scaleAmount);

            // Update material opacity for all children
            particle.children.forEach((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                const material = child.material as THREE.MeshBasicMaterial;
                if (material.transparent) {
                  material.opacity = fadeAmount;
                  material.needsUpdate = true;
                }
              }
            });
          } else {
            // Hide particle if not active
            particle.visible = false;
          }
        }
      });
    }
  });

  // Reset when target changes
  React.useEffect(() => {
    setHasImpacted(false);
    startTimeRef.current = null;
    trailParticles.current.forEach((particle) => {
      if (particle) particle.visible = true;
    });
  }, [target, isActive]);

  if (!isActive) return null;

  return (
    <group ref={meteorGroupRef}>
      {/* Main 3D meteor body */}
      <group ref={meteorBodyRef}>
        {/* Rocky core */}
        <mesh geometry={meteorGeometry}>
          <meshStandardMaterial
            color="#654321"
            roughness={0.9}
            metalness={0.1}
            emissive="#331100"
            emissiveIntensity={0.3} // Reduced intensity
          />
        </mesh>

        {/* Heated surface layer */}
        <mesh geometry={meteorGeometry} scale={[1.05, 1.05, 1.05]}>
          {" "}
          {/* Reduced scale */}
          <meshBasicMaterial
            color="#ff4400"
            transparent
            opacity={0.5} // Reduced opacity
            side={THREE.BackSide}
          />
        </mesh>
      </group>

      {/* Trail particles with reduced count */}
      {Array.from({ length: 8 }).map(
        (
          _,
          index // Reduced particle count
        ) => (
          <group
            key={index}
            ref={(el) => {
              if (el) trailParticles.current[index] = el;
            }}
          >
            <mesh>
              <sphereGeometry args={[0.03, 6, 6]} /> {/* Simplified geometry */}
              <meshBasicMaterial
                color={index < 3 ? "#ff4400" : "#ff8800"}
                transparent
                opacity={0.7}
              />
            </mesh>
          </group>
        )
      )}
    </group>
  );
}

// Impact explosion effect
function ImpactMarker({
  impact,
  onAnimationComplete,
}: {
  impact: ImpactPoint;
  onAnimationComplete: () => void;
}) {
  const markerRef = useRef<THREE.Group>(null);
  const explosionRef = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef<number | null>(null);

  useFrame((state) => {
    if (!impact.isAnimating) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime;
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current;

    if (markerRef.current) {
      const pulseScale = 1 + Math.sin(elapsed * 8) * 0.3; // Reduced pulse
      markerRef.current.scale.set(pulseScale, pulseScale, pulseScale);

      if (explosionRef.current) {
        const growthScale = Math.min(elapsed * 2, 3); // Reduced growth
        explosionRef.current.scale.set(growthScale, growthScale, growthScale);

        // Fade out
        if (elapsed > 2) {
          const material = explosionRef.current
            .material as THREE.MeshBasicMaterial;
          material.opacity = Math.max(0, 1 - (elapsed - 2) / 2);
          material.transparent = true;
        }
      }

      if (elapsed > 4) {
        // Reduced animation duration
        onAnimationComplete();
      }
    }
  });

  if (!impact.isAnimating) return null;

  return (
    <group ref={markerRef} position={impact.position}>
      {/* Main explosion */}
      <Sphere ref={explosionRef} args={[0.1, 12, 12]}>
        {" "}
        {/* Reduced segments */}
        <meshBasicMaterial color="#ff4500" transparent opacity={1} />
      </Sphere>

      {/* Reduced number of shockwave rings */}
      {[0.2, 0.35].map((radius, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.03, 16]} />{" "}
          {/* Reduced segments */}
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={Math.max(0.7 - index * 0.3, 0.1)}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// Enhanced starfield
function StarField() {
  const starsRef = useRef<THREE.Points>(null);

  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const starCount = 2000; // Reduced star count for performance
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200; // Reduced range
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001; // Slower rotation
    }
  });

  return (
    <points ref={starsRef} geometry={starGeometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.8}
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
}

// Main Interactive3DEarth component
export default function Interactive3DEarth({
  onImpactAnalysis,
}: {
  onImpactAnalysis: (data: any) => void;
}) {
  const [impactPoints, setImpactPoints] = useState<ImpactPoint[]>([]);
  const [activeMeteor, setActiveMeteor] = useState<
    [number, number, number] | null
  >(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [impactLocation, setImpactLocation] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handleSurfaceClick = useCallback(
    async (clickData: any) => {
      // Prevent multiple clicks during analysis
      if (isAnalyzing) return;

      setIsAnalyzing(true);
      setImpactLocation(
        `${clickData.continent} - ${clickData.coordinates.lat.toFixed(
          1
        )}°, ${clickData.coordinates.lng.toFixed(1)}°`
      );

      const newImpact: ImpactPoint = {
        ...clickData,
        isAnimating: true,
      };

      setImpactPoints((prev) => [...prev.slice(-1), newImpact]); // Only keep last impact
      setActiveMeteor(clickData.position);

      // Clear any existing timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(async () => {
        try {
          const impactData = await analyzeImpactLocation(
            clickData.coordinates,
            clickData.continent
          );
          onImpactAnalysis({
            ...impactData,
            coordinates: clickData.coordinates,
            continent: clickData.continent,
          });
        } catch (error) {
          console.error("Impact analysis error:", error);
          onImpactAnalysis({
            location: `${clickData.continent} (${Math.abs(
              clickData.coordinates.lat
            ).toFixed(1)}°${
              clickData.coordinates.lat >= 0 ? "N" : "S"
            }, ${Math.abs(clickData.coordinates.lng).toFixed(1)}°${
              clickData.coordinates.lng >= 0 ? "E" : "W"
            })`,
            casualties: Math.floor(Math.random() * 1000000),
            economicDamage: Math.floor(Math.random() * 500),
            craterSize: Math.floor(Math.random() * 20) + 5,
            tsunamiRisk: Math.random() > 0.5,
          });
        } finally {
          setIsAnalyzing(false);

          // Clear impact after delay
          timeoutRef.current = setTimeout(() => {
            setActiveMeteor(null);
            setImpactPoints([]);
            setImpactLocation("");
          }, 3000);
        }
      }, 3000); // Reduced delay
    },
    [onImpactAnalysis, isAnalyzing]
  );

  const handleAnimationComplete = useCallback((index: number) => {
    setImpactPoints((prev) =>
      prev.map((impact, i) =>
        i === index ? { ...impact, isAnimating: false } : impact
      )
    );
  }, []);

  const handleMeteorImpact = useCallback(() => {
    console.log("💥 3D Meteor has impacted Earth!");
  }, []);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-96 bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Impact Zone Notification - Top Right */}
      {impactLocation && (
        <div className="absolute top-4 right-4 z-10 bg-red-900/90 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm font-bold shadow-lg border border-red-600 max-w-xs">
          🔥 Impact Zone: {impactLocation}
        </div>
      )}

      {/* Analysis overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-black/85 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="text-center text-white">
              <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-6" />
              <p className="text-2xl font-bold text-orange-400 mb-2">
                🌠 3D Meteor Incoming!
              </p>
              <p className="text-lg text-gray-300 mb-4">
                Analyzing impact trajectory...
              </p>
              <div className="bg-red-900/40 border border-red-600 rounded-xl p-4 max-w-sm">
                <p className="text-sm text-red-200">
                  Processing atmospheric entry, 3D physics simulation, and
                  regional damage assessment...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute top-4 left-4 z-10 bg-blue-900/90 backdrop-blur-sm rounded-xl p-4 text-white text-sm shadow-xl border border-blue-600">
        <Target className="w-6 h-6 inline mr-3 text-blue-300" />
        <span className="font-bold text-lg">Click Earth for 3D Meteor</span>
        <div className="text-xs text-blue-200 mt-2">
          🪨 Watch realistic 3D meteors with physics-based trails
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Limit pixel ratio
      >
        <Suspense fallback={null}>
          {/* Enhanced lighting */}
          <ambientLight intensity={0.4} color="#ffffff" />
          <directionalLight
            position={[10, 5, 5]}
            intensity={1.2}
            color="#ffffff"
          />
          <pointLight
            position={[-10, -5, -5]}
            intensity={0.3}
            color="#4488ff"
          />

          <StarField />
          <ClickableEarth onSurfaceClick={handleSurfaceClick} />

          {impactPoints.map((impact, index) => (
            <ImpactMarker
              key={impact.id}
              impact={impact}
              onAnimationComplete={() => handleAnimationComplete(index)}
            />
          ))}

          {/* 3D Meteor */}
          {activeMeteor && (
            <Animated3DMeteor
              target={activeMeteor}
              isActive={true}
              onImpact={handleMeteorImpact}
            />
          )}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={4}
            maxDistance={12}
            autoRotate={false}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Helper functions
function getContinent(lat: number, lng: number): string {
  // Simplified continent detection
  if (lat > 75) return "Arctic Ocean";
  if (lat < -60) return "Antarctica";
  if (lat > 10 && lng > 60 && lng < 180) return "Asia";
  if (lat > -35 && lat < 35 && lng > -20 && lng < 55) return "Africa";
  if (lat > 15 && lat < 75 && lng > -170 && lng < -50) return "North America";
  if (lat > -55 && lat < 15 && lng > -80 && lng < -35) return "South America";
  if (lat > 35 && lat < 75 && lng > -10 && lng < 60) return "Europe";
  if (lat > -50 && lat < -10 && lng > 110 && lng < 180)
    return "Australia/Oceania";

  return "Ocean";
}

async function analyzeImpactLocation(
  coordinates: { lat: number; lng: number },
  continent: string
) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const isOcean = continent === "Ocean";
  const isPopulated = !["Arctic Ocean", "Antarctica", "Ocean"].includes(
    continent
  );

  const baseMultiplier = isPopulated ? 1 : 0.1;
  const tsunamiMultiplier = isOcean ? 2 : 1;

  return {
    location: `${continent} (${Math.abs(coordinates.lat).toFixed(1)}°${
      coordinates.lat >= 0 ? "N" : "S"
    }, ${Math.abs(coordinates.lng).toFixed(1)}°${
      coordinates.lng >= 0 ? "E" : "W"
    })`,
    casualties: Math.floor(
      (Math.random() * 5000000 + 500000) * baseMultiplier * tsunamiMultiplier
    ),
    economicDamage: Math.floor((Math.random() * 500 + 100) * baseMultiplier),
    craterSize: Math.floor(Math.random() * 20) + 5,
    tsunamiRisk:
      isOcean || (Math.abs(coordinates.lat) < 60 && Math.random() > 0.7),
  };
}
