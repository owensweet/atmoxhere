'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import '@/styles/globals.css'
import '@/app/globals.css'

const collections = [
  'mutant',
  'tsiri_synthesis',
  'termite',
  'z220x11',
  'bijou_pod_pulsers',
  'agora_market'
]

const colors = {
  mutant: "black",
  tsiri_synthesis: "green",
  termite: "orange",
  z220x11: "grey",
  bijou_pod_pulsers: "white",
  agora_market: "cyan",
}

const spotlightImages = {
  mutant: [
    "/images/defiant_tee4.webp",
    "/images/sister_alma_tee9.webp",
    "/images/tsiri_tee1.webp",
  ],
  tsiri_synthesis: [
    "/images/transmute_neck_mutation4.webp",
    "/images/suffix_neck_mutation5.webp",
  ],
  termite: [
    "/images/termite_sweater6.webp",
    "/images/termite_arm_flesh4.webp",
  ],
  z220x11: [
    "/images/pilot_boots1.webp",
    "/images/pilot_boots3.webp",
  ],
  bijou_pod_pulsers: [
    "/images/bijou_pod_pulsers5.webp",
    "/images/bijou_pod_pulsers6.webp",
  ],
  agora_market: [
    "/images/n_root_respirator1.webp",
  ]
}

function RotatingLinks() {
  const radius = 2.5
  const groupRefs = useRef([])
  const { camera } = useThree()
  const router = useRouter()

  // Preload texture once
  const borderTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load('/images/Borders/border3.webp')
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useFrame(() => {
    groupRefs.current.forEach((ref) => {
      if (ref) {
        ref.lookAt(camera.position)
      }
    })
  })

  return (
    <>
      {collections.map((name, index) => {
        const angle = (index / collections.length) * Math.PI * 2
        const x = radius * Math.cos(angle)
        const z = radius * Math.sin(angle)
        const y = 0

        return (
          <group
            key={name}
            position={[x, y, z]}
            ref={(el) => (groupRefs.current[index] = el)}
          >
            {/* Border image as plane */}
            <mesh
              onClick={() => router.push(`/shop/${name}`)}
              onPointerOver={(e) => (document.body.style.cursor = 'pointer')}
              onPointerOut={(e) => (document.body.style.cursor = 'default')}
            >
              <planeGeometry args={[2.2, 1.6]} />
              <meshBasicMaterial
                map={borderTexture}
                transparent
                color={colors[name] || "white"}
              />
            </mesh>

            {/* Text label */}
            <Text
              position={[0, 0, 0.01]} // tiny offset so it doesn't z-fight with the plane
              fontSize={0.2}
              fontWeight={700}
              font="/fonts/Kode_Mono/static/KodeMono-Bold.ttf"
              outlineWidth={0.005}
              outlineColor="white"
              color="white"
              anchorX="center"
              anchorY="middle"
              onClick={() => router.push(`/shop/${name}`)}
            >
              ⧼ {name} ⧽
            </Text>
          </group>
        )
      })}
    </>
  )
}

function WireframeSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.6, 10, 10]} />
      <meshBasicMaterial color="white" wireframe />
      <Edges scale={1.01} threshold={15} color="white" />
    </mesh>
  )
}

export default function ShopHome() {
  return (
    <div className="w-screen h-screen text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">ATMOXHERE SHOP</h1>
      <div className="w-full h-[500px]">
        <Canvas camera={{ position: [0, 2, 5.5] }}>
          <ambientLight intensity={0.5} />
          <WireframeSphere />
          <RotatingLinks />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>
    </div>
  )
}
