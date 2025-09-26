'use client'

import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, Html, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// ✅ Fallback-safe postprocessing import
let EffectComposer: any = ({ children }: { children: React.ReactNode }) => <>{children}</>
let Bloom: any = () => null
try {
  // @ts-ignore
  const mod = require('@react-three/postprocessing')
  EffectComposer = mod.EffectComposer
  Bloom = mod.Bloom
} catch {
  console.warn('⚠️ @react-three/postprocessing not installed. Skipping bloom effects.')
}

interface ImpactGlobeProps {
  impactLat: number;
  impactLng: number;
  craterRadius: number;
  tsunamiRadius: number;
  seismicRadius: number;
  asteroidParams: { diameter: number; speed: number; angle: number; name: string };
  energyMt: number;
  isSimulating: boolean;
}

function degToVec3(lat: number, lng: number, radius = 2.02) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

/* ---------- Earth with Texture Options ---------- */
function EarthSphere({ impacted, impactTime, textureMode }: any) {
  const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useTexture([
    '/earth_daymap.jpg',
    '/earth_nightmap.jpg',
    '/earth_normal_map.png',
    '/earth_specular_map.png',
    '/earth_clouds.png',
  ])

  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  const originalRotation = useRef({ x: 0, z: 0 })
  const shakeOffset = useRef({ x: 0, y: 0, z: 0 })

  useFrame((state) => {
    const time = state.clock.elapsedTime
    let rotSpeed = 0.0006 + Math.sin(time * 0.05) * 0.00005
    
    // Enhanced Impact shake effect
    if (impacted && earthRef.current) {
      const shakeTime = time - impactTime
      if (shakeTime < 12) {
        const intensity = Math.exp(-shakeTime * 0.4) * 0.025
        const frequency = 30 - shakeTime * 2
        const shakeX = Math.sin(shakeTime * frequency) * intensity
        const shakeZ = Math.cos(shakeTime * frequency * 0.7) * intensity * 0.6
        const shakeY = Math.sin(shakeTime * frequency * 1.3) * intensity * 0.3
        
        shakeOffset.current = { x: shakeX, y: shakeY, z: shakeZ }
        earthRef.current.rotation.x = originalRotation.current.x + shakeX
        earthRef.current.rotation.z = originalRotation.current.z + shakeZ
        earthRef.current.position.y = shakeY
        rotSpeed += Math.abs(shakeX) * 0.2
      } else {
        shakeOffset.current = { x: 0, y: 0, z: 0 }
        earthRef.current.position.y = 0
      }
    }
    
    earthRef.current && (earthRef.current.rotation.y += rotSpeed)
    cloudsRef.current && (cloudsRef.current.rotation.y += rotSpeed * 1.4)
  })

  // Select texture based on mode
  const getEarthMaterial = () => {
    switch (textureMode) {
      case 'night':
        return <meshPhongMaterial map={nightMap} emissive="#001122" emissiveIntensity={0.3} />
      case 'realistic':
        return <meshPhongMaterial map={dayMap} normalMap={normalMap} specularMap={specularMap} shininess={12} />
      case 'hybrid':
        return (
          <>
            <meshPhongMaterial map={dayMap} normalMap={normalMap} specularMap={specularMap} shininess={12} />
            <mesh>
              <sphereGeometry args={[2.001, 64, 64]} />
              <meshBasicMaterial map={nightMap} blending={THREE.AdditiveBlending} transparent opacity={0.25} />
            </mesh>
          </>
        )
      default:
        return <meshPhongMaterial map={dayMap} normalMap={normalMap} specularMap={specularMap} shininess={12} />
    }
  }

  return (
    <group>
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        {getEarthMaterial()}
      </Sphere>

      {textureMode === 'hybrid' && (
        <mesh>
          <sphereGeometry args={[2.001, 64, 64]} />
          <meshBasicMaterial map={nightMap} blending={THREE.AdditiveBlending} transparent opacity={0.25} />
        </mesh>
      )}

      <Sphere ref={cloudsRef} args={[2.03, 64, 64]}>
        <meshPhongMaterial map={cloudsMap} transparent opacity={0.45} depthWrite={false} side={THREE.DoubleSide} />
      </Sphere>

      <mesh>
        <sphereGeometry args={[2.12, 64, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

/* ---------- Stars ---------- */
function StarField({ count = 800 }: { count?: number }) {
  const group = useRef<THREE.Group>(null)
  const positions = useMemo(() => {
    const arr: number[] = []
    for (let i = 0; i < count; i++) {
      const r = 8 + Math.random() * 25
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr.push(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi))
    }
    return new Float32Array(arr)
  }, [count])

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.0002
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.003
    }
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} opacity={0.8} transparent color="#ffffff" />
      </points>
    </group>
  )
}

/* ---------- Enhanced Impact Rings ---------- */
function ImpactRings({ lat, lng, craterRadius, seismicRadius, tsunamiRadius, isActive, impactTriggered, impactTime }: any) {
  const ringsRef = useRef<THREE.Group>(null)
  const shockwaveRefs = useRef<THREE.Mesh[]>([])
  const worldPos = degToVec3(lat, lng, 2.02)

  useFrame((state) => {
    if (!ringsRef.current) return
    
    const time = state.clock.elapsedTime
    
    if (impactTriggered) {
      const shockTime = time - impactTime
      
      // Explosive expansion with smooth easing
      if (shockTime < 4) {
        const scale = 1 + Math.pow(shockTime / 4, 1.5) * 3
        ringsRef.current.scale.set(scale, scale, scale)
      }
      
      // Multiple expanding shockwaves
      shockwaveRefs.current.forEach((wave, i) => {
        if (wave && shockTime < 8) {
          const delay = i * 0.5
          const waveTime = Math.max(0, shockTime - delay)
          const waveScale = 0.1 + waveTime * 1.2
          wave.scale.set(waveScale, waveScale, waveScale)
          wave.material.opacity = Math.max(0, (0.6 - i * 0.2) - waveTime * 0.1)
        }
      })
    } else {
      const base = 1 + Math.sin(time * 2.5) * 0.025
      ringsRef.current.scale.set(base, base, base)
    }
  })

  if (!isActive) return null

  return (
    <group ref={ringsRef} position={[worldPos.x, worldPos.y, worldPos.z]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[craterRadius * 0.6, craterRadius, 64]} />
        <meshStandardMaterial color="#ff2200" transparent opacity={0.9} side={THREE.DoubleSide} emissive="#ff4400" emissiveIntensity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[seismicRadius * 0.7, seismicRadius, 64]} />
        <meshStandardMaterial color="#ffaa00" transparent opacity={0.6} side={THREE.DoubleSide} emissive="#ff6600" emissiveIntensity={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[tsunamiRadius * 0.75, tsunamiRadius, 64]} />
        <meshStandardMaterial color="#0088ff" transparent opacity={0.5} side={THREE.DoubleSide} emissive="#0066cc" emissiveIntensity={0.15} />
      </mesh>
      
      {/* Multiple expanding shockwaves */}
      {[0, 1, 2].map(i => (
        <mesh key={i} ref={el => shockwaveRefs.current[i] = el!} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0, 0.08, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      ))}
      
      <Html distanceFactor={8} center>
        <div className="bg-red-900/80 text-white px-3 py-2 rounded-lg text-sm font-bold border border-red-500 backdrop-blur-sm">
          🎯 IMPACT ZONE
        </div>
      </Html>
    </group>
  )
}

/* ---------- Enhanced Asteroid with Smooth Trajectory ---------- */
function AnimatedAsteroid({ targetLat, targetLng, asteroidParams, isSimulating, onImpact }: any) {
  const groupRef = useRef<THREE.Group>(null)
  const trailRef = useRef<THREE.Line>(null)
  const flameRef = useRef<THREE.Mesh>(null)
  const [impacted, setImpacted] = useState(false)
  const [trajectoryPoints, setTrajectoryPoints] = useState<THREE.Vector3[]>([])

  const targetPos = useMemo(() => degToVec3(targetLat, targetLng, 2.02), [targetLat, targetLng])
  const startPos = useMemo(() => {
    const dir = targetPos.clone().normalize().multiplyScalar(-1)
    const offset = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 1.5 + 1,
      (Math.random() - 0.5) * 2
    )
    return dir.multiplyScalar(12).add(offset)
  }, [targetPos])

  const duration = Math.max(6, 150 / Math.max(5, asteroidParams.speed / 1.5))
  const startTimeRef = useRef<number | null>(null)

  // Generate smooth trajectory curve
  const generateTrajectory = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 100
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const eased = 1 - Math.pow(1 - t, 2.5)
      const arcHeight = Math.sin(eased * Math.PI) * 3.5
      const cur = new THREE.Vector3().lerpVectors(startPos, targetPos, eased)
      cur.y += arcHeight
      points.push(cur)
    }
    return points
  }, [startPos, targetPos])

  useFrame((state) => {
    if (!isSimulating || !groupRef.current) {
      if (startTimeRef.current !== null) {
        startTimeRef.current = null
        setImpacted(false)
        setTrajectoryPoints([])
      }
      return
    }
    
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime
      setTrajectoryPoints(generateTrajectory)
    }

    const elapsed = state.clock.elapsedTime - startTimeRef.current
    const t = Math.min(1, elapsed / duration)
    const eased = 1 - Math.pow(1 - t, 2.5)
    
    // Smooth position interpolation
    const segmentIndex = Math.floor(eased * (generateTrajectory.length - 1))
    const segmentT = (eased * (generateTrajectory.length - 1)) - segmentIndex
    const nextIndex = Math.min(segmentIndex + 1, generateTrajectory.length - 1)
    
    const currentPos = new THREE.Vector3().lerpVectors(
      generateTrajectory[segmentIndex],
      generateTrajectory[nextIndex],
      segmentT
    )
    
    groupRef.current.position.copy(currentPos)

    // Enhanced rotation with acceleration
    const spinFactor = 0.05 + t * t * 0.25
    groupRef.current.rotation.x += spinFactor
    groupRef.current.rotation.y += spinFactor * 0.8
    groupRef.current.rotation.z += spinFactor * 0.4

    // Dynamic flame effect
    if (flameRef.current) {
      const intensity = 0.6 + t * 2 + Math.sin(state.clock.elapsedTime * 20) * 0.15
      const scale = intensity * (1 + Math.sin(state.clock.elapsedTime * 8) * 0.1)
      flameRef.current.scale.set(scale, scale, scale)
    }

    // Dynamic trail visualization
    if (trailRef.current && trajectoryPoints.length > 0) {
      const visiblePoints = trajectoryPoints.slice(0, Math.floor(eased * trajectoryPoints.length))
      const geometry = new THREE.BufferGeometry().setFromPoints(visiblePoints)
      trailRef.current.geometry = geometry
    }

    // Impact detection
    if (!impacted && currentPos.length() <= 2.05) {
      setImpacted(true)
      onImpact && onImpact()
    }
  })

  const asteroidSize = 0.08 + Math.min(1.2, asteroidParams.diameter / 2500)

  return (
    <group>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[asteroidSize, 20, 16]} />
          <meshStandardMaterial 
            color="#654321" 
            emissive="#ff4422" 
            emissiveIntensity={3.5} 
            metalness={0.1} 
            roughness={0.9} 
          />
        </mesh>
        
        {/* Enhanced flame aura */}
        <mesh ref={flameRef}>
          <sphereGeometry args={[asteroidSize * 3, 16, 12]} />
          <meshBasicMaterial 
            color="#ff3300" 
            transparent 
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        
        {/* Inner core glow */}
        <mesh>
          <sphereGeometry args={[asteroidSize * 1.8, 12, 10]} />
          <meshBasicMaterial 
            color="#ffaa00" 
            transparent 
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      
      {/* Smooth trajectory trail */}
      <line ref={trailRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#ff6633" transparent opacity={0.8} linewidth={3} />
      </line>
    </group>
  )
}

/* ---------- Enhanced Camera Shake ---------- */
function CameraShake({ trigger, impactTime }: { trigger: boolean, impactTime: number }) {
  const { camera } = useThree()
  const originalPos = useRef(camera.position.clone())
  const originalTarget = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    if (trigger) {
      originalPos.current = camera.position.clone()
    }
  }, [trigger, camera])

  useFrame((state) => {
    if (!trigger) return
    
    const elapsed = state.clock.elapsedTime - impactTime
    if (elapsed > 5) return
    
    const intensity = Math.max(0, (5 - elapsed) / 5) * 0.15
    const frequency = 35 - elapsed * 3
    
    // Multi-directional shake
    const shakeX = Math.sin(elapsed * frequency) * intensity
    const shakeY = Math.cos(elapsed * frequency * 1.3) * intensity * 0.7
    const shakeZ = Math.sin(elapsed * frequency * 0.8) * intensity * 0.5
    
    camera.position.x = originalPos.current.x + shakeX
    camera.position.y = originalPos.current.y + shakeY
    camera.position.z = originalPos.current.z + shakeZ
    
    // Add rotation shake
    camera.rotation.z = Math.sin(elapsed * frequency * 2) * intensity * 0.02
  })

  return null
}

/* ---------- Enhanced Impact Flash Effects ---------- */
function ImpactFlash({ active, impactTime }: { active: boolean, impactTime: number }) {
  const [flashIntensity, setFlashIntensity] = useState(0)
  const flashRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!active) {
      setFlashIntensity(0)
      return
    }
    
    const elapsed = state.clock.elapsedTime - impactTime
    
    if (elapsed < 0.3) {
      setFlashIntensity(1.2 * (1 - elapsed / 0.3))
    } else if (elapsed < 2) {
      const pulse = Math.sin((elapsed - 0.3) * 12) * 0.3
      setFlashIntensity(Math.max(0, pulse * (1 - (elapsed - 0.3) / 1.7)))
    } else {
      setFlashIntensity(0)
    }
    
    // Scale animation
    if (flashRef.current && flashIntensity > 0) {
      const scale = 3.5 + flashIntensity * 0.5
      flashRef.current.scale.set(scale, scale, scale)
    }
  })

  if (!active || flashIntensity <= 0) return null

  return (
    <mesh ref={flashRef}>
      <sphereGeometry args={[3.5, 32, 32]} />
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={flashIntensity * 0.8} 
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/* ---------- Main Component ---------- */
export default function ProfessionalImpactGlobe(props: ImpactGlobeProps) {
  const { impactLat, impactLng, craterRadius, seismicRadius, tsunamiRadius, asteroidParams, energyMt, isSimulating } = props
  const [impactTriggered, setImpactTriggered] = useState(false)
  const [impactTime, setImpactTime] = useState(0)
  const [textureMode, setTextureMode] = useState('realistic')

  function handleImpact() {
    const time = Date.now() / 1000
    setImpactTriggered(true)
    setImpactTime(time)
    setTimeout(() => setImpactTriggered(false), 12000)
  }

  // Reset when simulation stops
  useEffect(() => {
    if (!isSimulating) {
      setImpactTriggered(false)
    }
  }, [isSimulating])

  const textureOptions = [
    { value: 'realistic', label: 'Day', icon: '☀️' },
    { value: 'night', label: 'Night', icon: '🌙' },
    { value: 'hybrid', label: 'Hybrid', icon: '🌍' }
  ]

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden border border-gray-700 h-96">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={textureMode === 'night' ? 0.15 : 0.35} />
          <directionalLight position={[8, 4, 4]} intensity={textureMode === 'night' ? 0.8 : 1.2} />
          <pointLight position={[-10, -5, -5]} intensity={textureMode === 'night' ? 0.2 : 0.3} />

          <EffectComposer>
            <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} intensity={1.2} />
          </EffectComposer>

          <StarField />
          <EarthSphere impacted={impactTriggered} impactTime={impactTime} textureMode={textureMode} />

          <ImpactRings 
            lat={impactLat} 
            lng={impactLng} 
            craterRadius={craterRadius} 
            seismicRadius={seismicRadius} 
            tsunamiRadius={tsunamiRadius} 
            isActive={isSimulating} 
            impactTriggered={impactTriggered}
            impactTime={impactTime}
          />

          <AnimatedAsteroid 
            targetLat={impactLat} 
            targetLng={impactLng} 
            asteroidParams={asteroidParams} 
            isSimulating={isSimulating} 
            onImpact={handleImpact} 
          />

          <ImpactFlash active={impactTriggered} impactTime={impactTime} />
          <CameraShake trigger={impactTriggered} impactTime={impactTime} />

          <OrbitControls 
            enablePan={false} 
            minDistance={3.5} 
            maxDistance={15} 
            autoRotate={!isSimulating} 
            autoRotateSpeed={0.3} 
            enableDamping 
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* Enhanced HUD */}
      <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md rounded-xl p-4 text-white border border-gray-600">
        <div className="text-3xl font-bold text-orange-400 mb-1">💥 {energyMt.toFixed(1)} MT</div>
        <div className="text-sm text-gray-300">{(energyMt / 0.015).toFixed(0)}x Hiroshima</div>
        <div className="text-xs text-gray-400 mt-3 font-mono">{asteroidParams.name}</div>
        <div className="text-xs text-blue-400 mt-1">Ø {asteroidParams.diameter}m • {asteroidParams.speed} km/s</div>
      </div>

      {/* Texture Controls */}
      <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md rounded-xl p-3 border border-gray-600">
        <div className="text-xs text-gray-300 mb-2 font-semibold">Earth View</div>
        <div className="flex gap-1">
          {textureOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTextureMode(option.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                textureMode === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {option.icon} {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="absolute bottom-4 left-4 bg-black/90 backdrop-blur-md rounded-xl p-4 text-xs border border-gray-600">
        <div className="text-gray-300 font-semibold mb-3">Impact Zones</div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full ring-2 ring-red-300"></div>
            <span className="text-gray-200">Crater Zone</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-400 rounded-full ring-2 ring-yellow-200"></div>
            <span className="text-gray-200">Seismic Damage</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-cyan-400 rounded-full ring-2 ring-cyan-200"></div>
            <span className="text-gray-200">Tsunami Risk</span>
          </div>
        </div>
      </div>

      {/* Enhanced Impact Alert */}
      {impactTriggered && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl font-black text-red-500 animate-pulse mb-2 drop-shadow-lg">
              IMPACT!
            </div>
            <div className="text-xl text-white font-bold bg-red-600/80 px-6 py-2 rounded-full">
              Global Catastrophe Event
            </div>
          </div>
        </div>
      )}

      {/* Simulation Status */}
      {isSimulating && (
        <div className="absolute bottom-4 right-4 bg-red-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-red-500">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            SIMULATION ACTIVE
          </div>
        </div>
      )}
    </div>
  )
}