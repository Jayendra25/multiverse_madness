'use client'

import React, { Suspense, useRef, useState, useCallback, useMemo } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Target } from 'lucide-react'

interface ImpactPoint {
  position: [number, number, number]
  coordinates: { lat: number; lng: number }
  continent: string
  isAnimating: boolean
}

// Realistic Earth with proper materials and textures
function ClickableEarth({ onSurfaceClick }: { onSurfaceClick: (point: any) => void }) {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Create realistic Earth texture
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    
    // Ocean background
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, 1024)
    oceanGradient.addColorStop(0, '#1a365d')
    oceanGradient.addColorStop(0.3, '#2563eb')
    oceanGradient.addColorStop(0.7, '#3b82f6')
    oceanGradient.addColorStop(1, '#1e40af')
    
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, 2048, 1024)
    
    // Helper function for continent drawing
    const drawContinent = (name: string, color: string, paths: any[]) => {
      ctx.fillStyle = color
      ctx.strokeStyle = '#0f4a3c'
      ctx.lineWidth = 2
      
      paths.forEach(path => {
        ctx.beginPath()
        if (path.type === 'polygon') {
          ctx.moveTo(path.points[0][0], path.points[0][1])
          for (let i = 1; i < path.points.length; i++) {
            ctx.lineTo(path.points[i][0], path.points[i][1])
          }
          ctx.closePath()
        } else if (path.type === 'ellipse') {
          ctx.ellipse(path.x, path.y, path.rx, path.ry, path.rotation || 0, 0, Math.PI * 2)
        }
        ctx.fill()
        ctx.stroke()
      })
    }
    
    // Draw continents
    drawContinent('ASIA', '#2d5a27', [{
      type: 'polygon',
      points: [
        [1100, 200], [1200, 180], [1300, 190], [1400, 200], [1500, 220], 
        [1600, 250], [1700, 280], [1750, 320], [1780, 360], [1770, 400],
        [1750, 430], [1700, 450], [1650, 440], [1600, 430], [1550, 420],
        [1500, 410], [1450, 400], [1400, 390], [1350, 380], [1300, 370],
        [1250, 360], [1200, 350], [1150, 340], [1120, 320], [1100, 280], [1090, 240]
      ]
    }])
    
    drawContinent('AFRICA', '#3d7c47', [{
      type: 'polygon',
      points: [
        [1000, 350], [1020, 300], [1040, 280], [1060, 290], [1080, 310],
        [1090, 340], [1095, 380], [1100, 420], [1095, 460], [1090, 500],
        [1080, 540], [1070, 580], [1055, 620], [1040, 650], [1020, 670],
        [1000, 675], [980, 670], [965, 650], [955, 620], [950, 580],
        [945, 540], [940, 500], [935, 460], [940, 420], [950, 380], [970, 360]
      ]
    }])
    
    drawContinent('NORTH AMERICA', '#4a7c59', [{
      type: 'polygon',
      points: [
        [200, 180], [300, 160], [400, 170], [500, 190], [600, 220], 
        [650, 260], [680, 300], [690, 340], [685, 380], [670, 410],
        [640, 430], [600, 440], [550, 435], [500, 430], [450, 425],
        [400, 420], [350, 410], [300, 395], [250, 375], [200, 350],
        [160, 320], [140, 280], [130, 240], [140, 200]
      ]
    }])
    
    drawContinent('SOUTH AMERICA', '#2d5a27', [{
      type: 'polygon',
      points: [
        [600, 450], [640, 430], [670, 450], [690, 480], [700, 520],
        [705, 560], [710, 600], [715, 640], [720, 680], [715, 720],
        [700, 760], [680, 790], [660, 810], [635, 820], [610, 815],
        [590, 800], [575, 780], [565, 750], [560, 720], [555, 690],
        [550, 660], [545, 630], [540, 600], [545, 570], [560, 540],
        [580, 510], [590, 480]
      ]
    }])
    
    drawContinent('ANTARCTICA', '#e2e8f0', [{
      type: 'ellipse',
      x: 1024, y: 950, rx: 400, ry: 60
    }])
    
    drawContinent('EUROPE', '#22543d', [{
      type: 'polygon',
      points: [
        [950, 220], [980, 200], [1010, 210], [1040, 225], [1060, 245],
        [1070, 270], [1065, 295], [1050, 315], [1030, 325], [1010, 330],
        [990, 325], [970, 315], [955, 295], [945, 275], [940, 250]
      ]
    }])
    
    drawContinent('AUSTRALIA', '#8b7355', [{
      type: 'ellipse',
      x: 1650, y: 720, rx: 80, ry: 45
    }])
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  // Cloud texture
  const cloudTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!
    
    ctx.clearRect(0, 0, 2048, 1024)
    
    const cloudRegions = [
      { x: 0, y: 400, width: 2048, height: 200, density: 120 },
      { x: 0, y: 250, width: 2048, height: 100, density: 60 },
      { x: 0, y: 650, width: 2048, height: 100, density: 60 }
    ]
    
    cloudRegions.forEach(region => {
      for (let i = 0; i < region.density; i++) {
        const x = region.x + Math.random() * region.width
        const y = region.y + Math.random() * region.height
        const radius = Math.random() * 40 + 15
        const opacity = Math.random() * 0.6 + 0.2
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
        gradient.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.5})`)
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    })
    
    return new THREE.CanvasTexture(canvas)
  }, [])

  const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    
    if (event.point && earthRef.current) {
      const point = event.point.clone().normalize()
      const lat = Math.asin(point.y) * (180 / Math.PI)
      const lng = Math.atan2(point.z, point.x) * (180 / Math.PI)
      
      const continent = getContinent(lat, lng)
      
      onSurfaceClick({
        position: [point.x * 2.1, point.y * 2.1, point.z * 2.1],
        coordinates: { lat, lng },
        continent,
        isAnimating: true
      })
    }
  }, [onSurfaceClick])

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.002
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.003
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001
    }
  })

  return (
    <group>
      <Sphere
        ref={earthRef}
        args={[2, 64, 64]}
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
      
      <Sphere ref={cloudsRef} args={[2.02, 32, 32]}>
        <meshLambertMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          color="#ffffff"
        />
      </Sphere>
      
      <Sphere ref={atmosphereRef} args={[2.08, 32, 32]}>
        <meshLambertMaterial
          color="#87ceeb"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
      
      <Sphere args={[2.2, 16, 16]}>
        <meshBasicMaterial
          color="#4a9fff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  )
}

// 3D Meteor Model with realistic geometry
function Animated3DMeteor({ target, isActive, onImpact }: { 
  target: [number, number, number]; 
  isActive: boolean;
  onImpact: () => void;
}) {
  const meteorGroupRef = useRef<THREE.Group>(null)
  const meteorBodyRef = useRef<THREE.Group>(null)
  const trailParticles = useRef<THREE.Group[]>([])
  const [hasImpacted, setHasImpacted] = useState(false)
  
  // Create irregular meteor shape
  const meteorGeometry = useMemo(() => {
    const geometry = new THREE.SphereGeometry(0.08, 12, 8)
    const positions = geometry.attributes.position.array as Float32Array
    
    // Deform sphere to make it look like an irregular rock
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      const z = positions[i + 2]
      
      // Add random deformations
      const noise = (Math.random() - 0.5) * 0.3
      const length = Math.sqrt(x * x + y * y + z * z)
      
      positions[i] = x + (x / length) * noise
      positions[i + 1] = y + (y / length) * noise
      positions[i + 2] = z + (z / length) * noise
    }
    
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    return geometry
  }, [])

  useFrame((state) => {
    if (meteorGroupRef.current && isActive && !hasImpacted) {
      const time = state.clock.elapsedTime
      
      const spaceDistance = 12
      const startPos: [number, number, number] = [
        target[0] * spaceDistance,
        target[1] * spaceDistance, 
        target[2] * spaceDistance
      ]
      
      const flightDuration = 4
      const t = Math.min((time % (flightDuration + 2)) / flightDuration, 1)
      
      if (t >= 1) {
        if (!hasImpacted) {
          setHasImpacted(true)
          onImpact()
        }
        return
      }
      
      // Realistic physics - quadratic acceleration
      const easedT = t * t * (3 - 2 * t) // Smooth step function
      
      // Current position
      const currentPos: [number, number, number] = [
        startPos[0] + (target[0] - startPos[0]) * easedT,
        startPos[1] + (target[1] - startPos[1]) * easedT,
        startPos[2] + (target[2] - startPos[2]) * easedT
      ]
      
      meteorGroupRef.current.position.set(currentPos[0], currentPos[1], currentPos[2])
      
      // Realistic tumbling rotation
      if (meteorBodyRef.current) {
        meteorBodyRef.current.rotation.x += 0.25 * (1 + t * 2)
        meteorBodyRef.current.rotation.y += 0.15 * (1 + t * 2)
        meteorBodyRef.current.rotation.z += 0.1 * (1 + t * 2)
        
        // Scale increases as it heats up in atmosphere
        const scale = 0.5 + t * 2.5
        meteorBodyRef.current.scale.set(scale, scale, scale)
      }
      
      // Update trail particles
      trailParticles.current.forEach((particle, index) => {
        if (particle) {
          const delay = index * 0.1
          const trailT = Math.max(easedT - delay, 0)
          
          if (trailT > 0) {
            const trailPos: [number, number, number] = [
              startPos[0] + (target[0] - startPos[0]) * trailT,
              startPos[1] + (target[1] - startPos[1]) * trailT,
              startPos[2] + (target[2] - startPos[2]) * trailT
            ]
            particle.position.set(trailPos[0], trailPos[1], trailPos[2])
            
            // Fade and shrink trail particles over distance
            const fadeAmount = Math.max(0.9 - index * 0.08, 0) * t
            const scaleAmount = Math.max(1 - index * 0.1, 0.2) * (0.5 + t * 1.5)
            
            particle.scale.set(scaleAmount, scaleAmount, scaleAmount)
            particle.children.forEach(child => {
              if (child instanceof THREE.Mesh) {
                const material = child.material as THREE.MeshBasicMaterial
                material.opacity = fadeAmount
              }
            })
          }
        }
      })
    }
  })

  React.useEffect(() => {
    setHasImpacted(false)
  }, [target, isActive])

  return (
    <group ref={meteorGroupRef} visible={isActive && !hasImpacted}>
      {/* Main 3D meteor body */}
      <group ref={meteorBodyRef}>
        {/* Rocky core */}
        <mesh geometry={meteorGeometry}>
          <meshStandardMaterial
            color="#654321"
            roughness={0.9}
            metalness={0.1}
            emissive="#331100"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Heated surface layer */}
        <mesh geometry={meteorGeometry} scale={[1.1, 1.1, 1.1]}>
          <meshBasicMaterial
            color="#ff4400"
            transparent
            opacity={0.7}
            emissive="#ff2200"
            emissiveIntensity={2}
          />
        </mesh>
        
        {/* Plasma glow */}
        <mesh>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            emissive="#ffff88"
            emissiveIntensity={3}
          />
        </mesh>
        
        {/* Atmospheric compression glow */}
        <mesh>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={0.3}
            emissive="#ff8800"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>
      
      {/* 3D Fire trail particles */}
      {Array.from({ length: 15 }).map((_, index) => (
        <group
          key={index}
          ref={(el) => {
            if (el) trailParticles.current[index] = el
          }}
        >
          {/* Fire core */}
          <mesh>
            <sphereGeometry args={[Math.max(0.06 - index * 0.003, 0.015), 8, 8]} />
            <meshBasicMaterial
              color={index < 5 ? "#ff0000" : index < 10 ? "#ff4400" : "#ff8800"}
              transparent
              opacity={0.9}
              emissive={index < 5 ? "#ff0000" : index < 10 ? "#ff2200" : "#ff6600"}
              emissiveIntensity={2}
            />
          </mesh>
          
          {/* Outer flame */}
          <mesh>
            <sphereGeometry args={[Math.max(0.08 - index * 0.004, 0.02), 6, 6]} />
            <meshBasicMaterial
              color={index < 5 ? "#ff4400" : index < 10 ? "#ff6600" : "#ffaa00"}
              transparent
              opacity={0.6}
              emissive={index < 5 ? "#ff2200" : index < 10 ? "#ff4400" : "#ff8800"}
              emissiveIntensity={1.5}
            />
          </mesh>
          
          {/* Smoke/heat distortion */}
          <mesh>
            <sphereGeometry args={[Math.max(0.1 - index * 0.005, 0.025), 4, 4]} />
            <meshBasicMaterial
              color="#666666"
              transparent
              opacity={Math.max(0.3 - index * 0.02, 0)}
              emissive="#333333"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Impact explosion effect
function ImpactMarker({ impact, onAnimationComplete }: { 
  impact: ImpactPoint; 
  onAnimationComplete: () => void 
}) {
  const markerRef = useRef<THREE.Group>(null)
  const explosionRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (markerRef.current && impact.isAnimating) {
      const time = state.clock.elapsedTime
      const pulseScale = 1 + Math.sin(time * 12) * 0.8
      markerRef.current.scale.set(pulseScale, pulseScale, pulseScale)
      
      if (explosionRef.current) {
        const growthScale = Math.min(time * 3, 5)
        explosionRef.current.scale.set(growthScale, growthScale, growthScale)
      }
      
      if (time > 6) {
        onAnimationComplete()
      }
    }
  })

  return (
    <group ref={markerRef} position={impact.position}>
      {/* Main explosion */}
      <Sphere ref={explosionRef} args={[0.1, 16, 16]}>
        <meshBasicMaterial
          color="#ff4500"
          emissive="#ff0000"
          emissiveIntensity={3}
        />
      </Sphere>
      
      {/* Shockwave rings */}
      {[0.2, 0.35, 0.5, 0.8].map((radius, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.04, 24]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={Math.max(0.9 - index * 0.2, 0.1)}
          />
        </mesh>
      ))}
      
      {/* Debris particles */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const radius = 0.4
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 0.7) * 0.15,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.02, 6, 6]} />
            <meshBasicMaterial 
              color="#ff8800" 
              emissive="#ff4400" 
              emissiveIntensity={2} 
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Enhanced starfield
function StarField() {
  const starsRef = useRef<THREE.Points>(null)
  
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const starCount = 6000
    const positions = new Float32Array(starCount * 3)
    
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 300
      positions[i + 1] = (Math.random() - 0.5) * 300
      positions[i + 2] = (Math.random() - 0.5) * 300
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [])
  
  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0002
    }
  })
  
  return (
    <points ref={starsRef} geometry={starGeometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.6}
        transparent
        opacity={0.8}
      />
    </points>
  )
}

// Main Interactive3DEarth component
export default function Interactive3DEarth({ onImpactAnalysis }: { 
  onImpactAnalysis: ( any) => void 
}) {
  const [impactPoints, setImpactPoints] = useState<ImpactPoint[]>([])
  const [activeMeteor, setActiveMeteor] = useState<[number, number, number] | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [impactLocation, setImpactLocation] = useState<string>('')

  const handleSurfaceClick = useCallback(async (clickData: any) => {
    setIsAnalyzing(true)
    setImpactLocation(`${clickData.continent} - ${clickData.coordinates.lat.toFixed(1)}°, ${clickData.coordinates.lng.toFixed(1)}°`)
    
    const newImpact: ImpactPoint = {
      ...clickData,
      isAnimating: true
    }
    
    setImpactPoints(prev => [...prev.slice(-2), newImpact])
    setActiveMeteor(clickData.position)
    
    setTimeout(async () => {
      const impactData = await analyzeImpactLocation(clickData.coordinates, clickData.continent)
      onImpactAnalysis({
        ...impactData,
        coordinates: clickData.coordinates,
        continent: clickData.continent
      })
      setIsAnalyzing(false)
      
      setTimeout(() => {
        setActiveMeteor(null)
        setImpactPoints([])
        setImpactLocation('')
      }, 4000)
    }, 4000)
  }, [onImpactAnalysis])

  const handleAnimationComplete = useCallback((index: number) => {
    setImpactPoints(prev => 
      prev.map((impact, i) => 
        i === index ? { ...impact, isAnimating: false } : impact
      )
    )
  }, [])

  const handleMeteorImpact = useCallback(() => {
    console.log("💥 3D Meteor has impacted Earth!")
  }, [])

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
              <p className="text-2xl font-bold text-orange-400 mb-2">🌠 3D Meteor Incoming!</p>
              <p className="text-lg text-gray-300 mb-4">Analyzing impact trajectory...</p>
              <div className="bg-red-900/40 border border-red-600 rounded-xl p-4 max-w-sm">
                <p className="text-sm text-red-200">
                  Processing atmospheric entry, 3D physics simulation, and regional damage assessment...
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
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* Enhanced lighting */}
          <ambientLight intensity={0.3} color="#ffffff" />
          <directionalLight
            position={[12, 8, 8]}
            intensity={1.5}
            color="#ffffff"
            castShadow
          />
          <pointLight position={[-12, -8, -8]} intensity={0.4} color="#4488ff" />
          <pointLight position={[0, 12, 0]} intensity={0.3} color="#ffaa88" />

          <StarField />
          <ClickableEarth onSurfaceClick={handleSurfaceClick} />

          {impactPoints.map((impact, index) => (
            <ImpactMarker
              key={`impact-${index}-${Date.now()}`}
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
            enablePan={false}
            enableZoom={true}
            minDistance={5}
            maxDistance={15}
            autoRotate={false}
            rotateSpeed={0.6}
            zoomSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Helper functions
function getContinent(lat: number, lng: number): string {
  if (lat > 75) return "Arctic Ocean"
  if (lat < -60) return "Antarctica"
  
  const normLng = lng < 0 ? lng + 360 : lng
  
  if (normLng >= 350 || normLng <= 60) {
    if (lat >= 35 && lat <= 75) {
      if (normLng >= 350 || normLng <= 40) return "Europe"
    }
  }
  
  if (normLng >= 340 || normLng <= 55) {
    if (lat >= -35 && lat <= 35) {
      return "Africa"
    }
  }
  
  if (normLng >= 60 && normLng <= 180 && lat >= 10 && lat <= 75) {
    return "Asia"
  }
  
  if (normLng >= 110 && normLng <= 180 && lat >= -50 && lat <= -10) {
    return "Australia/Oceania"
  }
  
  if ((normLng >= 180 && normLng <= 360) || normLng <= 330) {
    if (lat >= 15 && lat <= 75) {
      if (normLng >= 200 && normLng <= 330) return "North America"
    }
  }
  
  if (normLng >= 270 && normLng <= 330) {
    if (lat >= -60 && lat <= 15) {
      return "South America"
    }
  }
  
  return "Ocean"
}

async function analyzeImpactLocation(coordinates: { lat: number; lng: number }, continent: string) {
  const isOcean = continent === "Ocean"
  const isPopulated = !["Arctic Ocean", "Antarctica", "Ocean"].includes(continent)
  
  const baseMultiplier = isPopulated ? 1 : 0.1
  const tsunamiMultiplier = isOcean ? 3 : 1
  
  return {
    location: `${continent} (${Math.abs(coordinates.lat).toFixed(1)}°${coordinates.lat >= 0 ? 'N' : 'S'}, ${Math.abs(coordinates.lng).toFixed(1)}°${coordinates.lng >= 0 ? 'E' : 'W'})`,
    casualties: Math.floor((Math.random() * 8000000 + 500000) * baseMultiplier * tsunamiMultiplier),
    economicDamage: Math.floor((Math.random() * 800 + 100) * baseMultiplier),
    craterSize: Math.floor(Math.random() * 25) + 8,
    tsunamiRisk: isOcean || (Math.abs(coordinates.lat) < 60 && Math.random() > 0.6)
  }
}
