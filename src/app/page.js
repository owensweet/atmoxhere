'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { useSprings, a } from '@react-spring/three' 
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

function ConnectingLines({ linkPositions, sphereRadius = 1.3 }) {
  const lineRefs = useRef([])

  const lineData = useMemo(() => {
    return linkPositions.map((linkPos, index) => {
      // Calculate the point on the sphere's surface closest to the link
      const linkVector = new THREE.Vector3(linkPos.x, linkPos.y, linkPos.z)
      const spherePoint = linkVector.clone().normalize().multiplyScalar(sphereRadius)
      const startPoint = new THREE.Vector3(0, -sphereRadius, 0)
      
      // Create 2D angular path: down -> straight -> up
      // Point 1: Go down from sphere
      const downPoint = new THREE.Vector3(
        spherePoint.x,
        spherePoint.y - 2.5, // Go down
        spherePoint.z
      )
      
      // Point 2: Move horizontally towards link while staying low
      const straightPoint = new THREE.Vector3(
        linkPos.x,
        spherePoint.y - 1.8, // Stay at same low height
        linkPos.z
      )
      
      // Point 3: Go up to link position
      const linkPoint = new THREE.Vector3(linkPos.x, linkPos.y - 1, linkPos.z)

      return {
        points: [startPoint, downPoint, straightPoint, linkPoint],
        color: "white"
      }
    })
  }, [linkPositions, sphereRadius])

  return (
    <>
      {lineData.map((line, index) => (
        <Line
          key={index}
          points={line.points}
          color={line.color}
          lineWidth={2}
          // transparent
          opacity={0.8}
        />
      ))}
    </>
  )
}

function RotatingLinks() {
  const radius = 2.5
  const groupRefs = useRef([])
  const borderRefs = useRef([])
  const imageRefs = useRef([])
  const { camera } = useThree()
  const router = useRouter()

  // Track current spotlight image index for each collection
  const [currentIndices, setCurrentIndices] = useState(
    collections.reduce((acc, name) => {
      acc[name] = 0
      return acc
    }, {})
  )

  // Preload spotlight textures once
  const spotlightTextures = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const loaded = {}
    for (const name of collections) {
      loaded[name] = spotlightImages[name].map((path) => {
        const tex = loader.load(path)
        tex.colorSpace = THREE.SRGBColorSpace
        return tex
      })
    }
    return loaded
  }, [])

  // Image open/close animation
  const [springs, api] = useSprings(collections.length, () => ({
    scaleY: 1,
    config: { duration: 800 },
  }))

  // Cycle images
  useEffect(() => {
    const intervals = collections.map((name, index) => {
      return setInterval(() => {
        setCurrentIndices((prev) => {
          const next = (prev[name] + 1) % spotlightTextures[name].length
          return { ...prev, [name]: next }
        })

        // animate scaleY "closing then opening"
        api.start((i) =>
          i === index
            ? [{ scaleY: 0 }, { scaleY: 1 }]
            : {}
        )
      }, 3000 + index * 400)
    })
    return () => intervals.forEach(clearInterval)
  }, [spotlightTextures, api])

  // Border texture
  const borderTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load('/images/Borders/border3.webp')
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  // Billboarding + distance-based fade (for image) and shrink (for border)
  useFrame(() => {
    const threshold = 4.5
    const lerpSpeed = 0.08

    groupRefs.current.forEach((ref, i) => {
      if (!ref) return
      ref.lookAt(camera.position)

      const dist = camera.position.distanceTo(ref.position)
      const targetFade = dist > threshold ? 0 : 1
      const targetBorderY = dist > threshold ? 0.4 : 1

      // Smooth fade for image opacity
      const image = imageRefs.current[i]
      if (image) {
        if (!image.userData.fade) image.userData.fade = 1
        image.userData.fade = THREE.MathUtils.lerp(
          image.userData.fade,
          targetFade,
          lerpSpeed
        )
        image.material.opacity = image.userData.fade
      }

      // Smooth shrink for border Y
      const border = borderRefs.current[i]
      if (border) {
        border.scale.y = THREE.MathUtils.lerp(
          border.scale.y,
          targetBorderY,
          lerpSpeed
        )
      }
    })
  })

  // Link positions
  const linkPositions = useMemo(() => {
    return collections.map((_, index) => {
      const angle = (index / collections.length) * Math.PI * 2
      return { x: radius * Math.cos(angle), y: 0, z: radius * Math.sin(angle) }
    })
  }, [radius])

  return (
    <>
      <ConnectingLines linkPositions={linkPositions} />

      {collections.map((name, index) => {
        const { x, y, z } = linkPositions[index]
        const texArray = spotlightTextures[name]
        const currentTex = texArray[currentIndices[name]]

        return (
          <group
            key={name}
            position={[x, y, z]}
            ref={(el) => (groupRefs.current[index] = el)}
          >
            {/* Spotlight image */}
            <a.mesh
              scale-y={springs[index].scaleY}
              ref={(el) => (imageRefs.current[index] = el)}
            >
              <planeGeometry args={[2.2, 2.2]} />
              <a.meshBasicMaterial
                map={currentTex}
                transparent
                opacity={1} // controlled by useFrame fade
              />
            </a.mesh>

            {/* Border overlay */}
            <mesh
              position={[0, 0, 0.01]}
              ref={(el) => (borderRefs.current[index] = el)}
            >
              <planeGeometry args={[2.3, 2.3]} />
              <meshBasicMaterial
                map={borderTexture}
                transparent
                color={'white'}
              />
            </mesh>

            {/* Text label */}
            <Text
              position={[0, 0, 0.02]}
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
      <sphereGeometry args={[1.3, 10, 10]} />
      <meshBasicMaterial color="white" wireframe/>
      <Edges scale={1.01} threshold={15} color="white" />
    </mesh>
  )
}

function SwipeHint ({ hasSwiped }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (hasSwiped) {
      setVisible(false)
      return
    }

    const interval = setInterval(() => {
      setVisible((v) => !v) // Toggle on and off
    }, 1000)

    return () => clearInterval(interval)
  }, [hasSwiped])

  return (
    <img
      src="/swipe_icon.svg"
      alt="Swipe"
      className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700
        ${visible ? 'opacity-100 translate-x-0' : '-translate-x-10 opacity-0'}`}
      style={{ bottom: '-60px', width: '70px', height: '70px' }}
    />
  )
}

export default function ShopHome() {

  const [hasSwiped, setHasSwiped] = useState(false)

  return (
    <div className="w-screen h-screen text-white flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">atmoxhere.</h1>
      <div className="w-full h-[500px] relative">
        <Canvas camera={{ position: [0, 2, 5.5] }} onPointerDown={() => setHasSwiped(true)}>
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
        <SwipeHint hasSwiped={hasSwiped} />

      </div>
    </div>
  )
}