'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Line } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useSprings, a } from '@react-spring/three' 
import * as THREE from 'three'
import { Edges } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import '@/styles/globals.css'
import '@/app/globals.css'
import Loader from '@/lib/components/Loader';

export const collections = [
  'tsiri_synthesis',
  'z220x11',
  'mutant',
  'termite',
  'bijou_pod_pulsers',
  'agora_market'
]

const spotlightImages = {
  mutant: [
    "/images/Clothes/mini_defiant_tee1.webp",
    "/images/Clothes/mini_sister_alma_tee1.webp",
    "/images/Clothes/mini_tsiri_tee1.webp",
  ],
  tsiri_synthesis: [
    "/images/Clothes/mini_transmute_neck_mutation1.webp",
    "/images/Clothes/mini_suffix_neck_mutation1.webp",
  ],
  termite: [
    "/images/Clothes/mini_termite_sweater1.webp",
    "/images/Clothes/mini_termite_jeans1.webp",
  ],
  z220x11: [
    "/images/Clothes/mini_pilot_boots1.webp",
    "/images/Clothes/mini_pilot_boots3.webp",
    "/images/Clothes/mini_pilot_boots4.webp",
  ],
  bijou_pod_pulsers: [
    "/images/Clothes/mini_bijou_pod_pulsers1.webp",
    "/images/Clothes/mini_bijou_pod_pulsers3.webp",
    "/images/Clothes/mini_bijou_pod_pulsers2.webp"
  ],
  agora_market: [
    "/images/Clothes/mini_n_root_respirator1.webp",
    "/images/Clothes/mini_n_root_respirator2.webp",
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
  const textRefs = useRef([])
  const { camera } = useThree()
  const router = useRouter()

  // Detect mobile
  const isMobile = useMemo(() => 
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent), []
  )

  // Track current spotlight image index for each collection
  const [currentIndices, setCurrentIndices] = useState(
    collections.reduce((acc, name) => {
      acc[name] = 0
      return acc
    }, {})
  )

  const [glitchingIndex, setGlitchingIndex] = useState(null)
  const glitchFrameRef = useRef(0)
  
  const glitchParams = useRef(collections.map(() => ({
    scaleX: 1,
    posX: 0,
    opacity: 1,
    color: 'white'
  })))
  
  // Initialize visibility as false to prevent initial glitch storm
  const visibilityRefs = useRef(collections.map(() => ({ isVisible: false, distance: 999 })))
  
  // Track if initial setup is done
  const initializedRef = useRef(false)

  // Preload spotlight textures once
  const spotlightTextures = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const loaded = {}
    for (const name of collections) {
      loaded[name] = spotlightImages[name].map((path) => {
        const tex = loader.load(path)
        tex.colorSpace = THREE.SRGBColorSpace
        tex.minFilter = THREE.LinearFilter
        tex.magFilter = THREE.LinearFilter
        return tex
      })
    }
    return loaded
  }, [])

  // Preload icons textures once
  const iconTextures = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const loaded = {}
    for (const name of collections) {
      const tex = loader.load(`/images/Icons/${name}.webp`)
      tex.colorSpace = THREE.SRGBColorSpace
      loaded[name] = tex
    }
    return loaded
  }, [])

  // Image open/close animation
  const [springs, api] = useSprings(collections.length, () => ({
    scaleY: 1,
    textY: 0,
    config: { duration: 800 },
  }))

  // Cycle images - only animate visible items with stricter conditions
  useEffect(() => {
    const intervals = collections.map((name, index) => {
      return setInterval(() => {
        // Wait for initialization
        if (!initializedRef.current) return
        
        // Only animate if item is visible AND not currently glitching
        const visibility = visibilityRefs.current[index]
        if (!visibility.isVisible || glitchingIndex !== null) return
        
        // STRICT: Only allow glitch on the CLOSEST visible item
        const closestVisibleIndex = visibilityRefs.current
          .map((v, i) => ({ ...v, index: i }))
          .filter(v => v.isVisible)
          .sort((a, b) => a.distance - b.distance)[0]?.index
        
        // Only proceed if this is the closest item
        if (closestVisibleIndex !== index) return
        
        // Start glitch
        setGlitchingIndex(index)
        glitchFrameRef.current = 0
        
        // Animate scaleY "closing then opening" with text movement
        api.start((i) =>
          i === index
            ? [
                { scaleY: 0, textY: -0.3 },
                { scaleY: 1, textY: 0 }
              ]
            : {}
        )

        // Change image after brief delay
        setTimeout(() => {
          setCurrentIndices((prev) => {
            const next = (prev[name] + 1) % spotlightTextures[name].length
            return { ...prev, [name]: next }
          })
        }, 100)
        
        // End glitch
        setTimeout(() => {
          setGlitchingIndex(null)
        }, isMobile ? 60 : 80) // Shorter on mobile
        
      }, 3000 + index * 400)
    })
    return () => intervals.forEach(clearInterval)
  }, [spotlightTextures, isMobile])

  // Border texture
  const borderTexture = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const tex = loader.load('/images/Borders/border3.webp')
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useFrame(() => {
    // Mark as initialized after first frame
    if (!initializedRef.current) {
      initializedRef.current = true
    }

    // Glitch effect - throttled and only when active
    if (glitchingIndex !== null) {
      glitchFrameRef.current += 1
    
      // Update every 2-3 frames on desktop, every 3-4 frames on mobile
      const skipFrames = isMobile ? 3 : 2
      if (glitchFrameRef.current % skipFrames !== 0) return
      
      const params = glitchParams.current[glitchingIndex]
      params.scaleX = Math.random() * 0.3 + 0.9
      params.posX = (Math.random() - 0.8) * 0.1
      params.opacity = 0.85 + Math.random() * 0.15
      
      // Fewer color variations on mobile
      const rand = Math.random()
      if (isMobile) {
        // Only 3 colors on mobile
        if (rand > 0.7) {
          params.color = '#000fff'
        } else if (rand > 0.4) {
          params.color = '#f000ff'
        } else {
          params.color = 'white'
        }
      } else {
        // Full color range on desktop
        if (rand > 0.9) {
          params.color = '#000fff'
        } else if (rand > 0.75) {
          params.color = '#f000ff'
        } else if (rand > 0.6) {
          params.color = '#9000ff'
        } else if (rand > 0.45) {
          params.color = '#00e5ff'
        } else if (rand > 0.3) {
          params.color = '#f066cc'
        } else {
          params.color = 'white'
        }
      }
    }

    // Stricter visibility threshold - only 1-2 items visible at a time
    const threshold = 4.5
    const lerpSpeed = 0.08

    groupRefs.current.forEach((ref, i) => {
      if (!ref) return
      ref.lookAt(camera.position)

      const dist = camera.position.distanceTo(ref.position)
      
      // Update visibility tracking
      const isVisible = dist <= threshold
      visibilityRefs.current[i].isVisible = isVisible
      visibilityRefs.current[i].distance = dist
      
      const targetFade = isVisible ? 1 : 0
      const targetBorderY = isVisible ? 1 : 0.4
      const targetBorderOpacity = isVisible ? 0 : 1
      const targetTextY = isVisible ? -0.75 : 0

      // Smooth fade for image opacity
      const image = imageRefs.current[i]
      if (image) {
        if (!image.userData.fade) image.userData.fade = 0 // Start at 0 instead of 1
        image.userData.fade = THREE.MathUtils.lerp(
          image.userData.fade,
          targetFade,
          lerpSpeed
        )
        image.material.opacity = image.userData.fade
        
        // Apply glitch effects ONLY to the currently glitching item
        const isGlitching = glitchingIndex === i && isVisible
        if (isGlitching) {
          const params = glitchParams.current[i]
          // image.scale.x = params.scaleX
          // image.position.x = params.posX
          // image.material.color.set(params.color)
        } else {
          // Reset immediately when not glitching
          image.scale.x = 1
          image.position.x = 0
          image.material.color.set('white')
        }
      }

      // Smooth shrink for border Y
      const border = borderRefs.current[i]
      if (border) {
        border.scale.y = THREE.MathUtils.lerp(
          border.scale.y,
          targetBorderY,
          lerpSpeed
        )
        border.material.opacity = THREE.MathUtils.lerp(
          border.material.opacity,
          targetBorderOpacity,
          lerpSpeed
        )
      }

      // Smooth text position movement
      const textGroup = textRefs.current[i]
      if (textGroup) {
        if (!textGroup.userData.targetY) textGroup.userData.targetY = 0
        textGroup.userData.targetY = THREE.MathUtils.lerp(
          textGroup.userData.targetY,
          targetTextY,
          lerpSpeed
        )
        textGroup.position.y = textGroup.userData.targetY
      }
    })
  })

  // Rest of the component remains the same...
  const linkPositions = useMemo(() => {
    return collections.map((_, index) => {
      const angle = (index / collections.length) * Math.PI * 2
      return { x: radius * Math.cos(angle), y: 0, z: radius * Math.sin(angle) }
    })
  }, [radius])

  return (
    <>
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
            <a.mesh
              scale-y={springs[index].scaleY}
              ref={(el) => (imageRefs.current[index] = el)}
            >
              <planeGeometry args={[2.2, 2.2]} />
              <a.meshBasicMaterial
                map={currentTex}
                transparent
              />
            </a.mesh>

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

            <a.group 
              position-y={springs[index].textY}
              ref={(el) => (textRefs.current[index] = el)}
            >
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
              <mesh position={[0, -0.5, 0.02]} onClick={() => router.push(`/shop/${name}`)}>
                <planeGeometry args={[0.6, 0.6]} />
                <meshBasicMaterial 
                  map={iconTextures[name]} 
                  transparent
                />
              </mesh>
            </a.group>
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

  if (hasSwiped) return null

  return (
    <img
      src="/swipe_icon.svg"
      alt="Swipe"
      className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700
        ${visible ? 'opacity-100 translate-x-0' : '-translate-x-10 opacity-0'}`}
      style={{ bottom: '-40px', width: '70px', height: '70px' }}
    />
  )
}

export default function ShopHome() {

  const [hasSwiped, setHasSwiped] = useState(false)

  return (
    <div className="w-screen h-screen text-white flex flex-col items-center justify-start">
      <h1 className="text-5xl font-bold mb-2 z-0">atmoxhere.</h1>
      <img src="/images/cyber_line.png" className="w-100 max-w-[90%] z-0"/>
      <div className="w-full h-[500px] relative">
        <Canvas camera={{ position: [0, 2, 5.5] }} onPointerDown={() => setHasSwiped(true)}>
          <Suspense fallback={<Loader />}>
            <ambientLight intensity={0.5} />
            <WireframeSphere />
            <RotatingLinks />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              // minPolarAngle={Math.PI / 3}
              // maxPolarAngle={Math.PI / 3}
            />
          </Suspense>
        </Canvas>
        <SwipeHint hasSwiped={hasSwiped} />

      </div>
      <a className="inline-block hover:scale-105 mt-14 border-4 border-white/70 p-2 rounded-3xl bg-gradient-to-b from-emerald-700 to-black-300 transition-all duration-300 ease-out " href="/shop/all">&gt;&gt; view all &lt;&lt;</a>
    </div>
  )
}