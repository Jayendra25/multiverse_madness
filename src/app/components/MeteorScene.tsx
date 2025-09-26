'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Trail } from '@react-three/drei'
import * as THREE from 'three'

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.005
    }
  })

  return (
    <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, -2, -5]}>
      <meshStandardMaterial
        color="#4a9eff"
        roughness={0.8}
        metalness={0.1}
      />
    </Sphere>
  )
}

function Meteor({ position, delay = 0 }: { position: [number, number, number], delay?: number }) {
  const meteorRef = useRef<THREE.Mesh>(null)
  const trailRef = useRef<any>(null)

  useFrame((state) => {
    if (meteorRef.current) {
      const time = state.clock.elapsedTime - delay
      if (time > 0) {
        // Meteor trajectory towards Earth
        meteorRef.current.position.x = position[0] - time * 3
        meteorRef.current.position.y = position[1] - time * 2
        meteorRef.current.position.z = position[2] + time * 1.5
        
        // Add rotation for realism
        meteorRef.current.rotation.x += 0.1
        meteorRef.current.rotation.y += 0.05
        
        // Reset position when meteor goes too far
        if (time > 8) {
          meteorRef.current.position.set(...position)
        }
      }
    }
  })

  return (
    <Trail
      ref={trailRef}
      width={0.8}
      length={15}
      color="#ff4500"
      attenuation={(t) => t * t}
    >
      <Sphere ref={meteorRef} args={[0.1, 8, 8]} position={position}>
        <meshStandardMaterial
          color="#ff6b1a"
          emissive="#ff4500"
          emissiveIntensity={0.8}
        />
      </Sphere>
    </Trail>
  )
}

function MeteorShower() {
  const meteors = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      position: [
        Math.random() * 20 - 10,
        Math.random() * 10 + 5,
        -10 - Math.random() * 5
      ] as [number, number, number],
      delay: Math.random() * 4
    }))
  }, [])

  return (
    <>
      {meteors.map((meteor) => (
        <Meteor 
          key={meteor.id}
          position={meteor.position}
          delay={meteor.delay}
        />
      ))}
    </>
  )
}

export default function MeteorScene() {
  return (
    <>
      <Earth />
      <MeteorShower />
    </>
  )
}
