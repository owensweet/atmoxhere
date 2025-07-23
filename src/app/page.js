'use client';

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import { useRef } from 'react'
import Link from 'next/link'
import * as THREE from 'three'
import { Edges } from '@react-three/drei'
import '@/styles/globals.css'
import '@/app/globals.css'
import Image from "next/image";

const collections = ["mutant", "tsiri_synthesis", "termite", "z220x11", "bijou_pod_pulsers", "agora_market"]

function RotatingLinks() {
  const radius = 2.5

  return (
    <>
      {collections.map((name, index) => {
        const angle = (index / collections.length) * Math.PI * 2
        const x = radius * Math.cos(angle)
        const z = radius * Math.sin(angle)
        const y = 0 // or vary if you want vertical offset

        return (
          <Html
            key={name}
            position={[x, y, z]}
            // transform
            distanceFactor={4}
            style={{
              color: 'white',
              fontSize: '1rem',
              textDecoration: 'none',
              transition: 'transform 0.2s',
              width: '200px'
            }}
          >
            <div className="relative w-[100px] h-[1px] flex items-center justify-center">
              <Image 
                src="/images/borders/border4.png"
                width={100}
                height={100}
                alt="border image"
                className="object-contain scale-x-220 scale-y-159"
              />
              <Link 
                href={`/shop/${name}`} 
                className="absolute text-white text-center font-bold text-xl"
              >
                ⧼ {name} ⧽
              </Link>
            </div>

          </Html>
        )
      })}
    </>
  )
}


function WireframeSphere() {
  return (
    <mesh>
      <sphereGeometry args={[2, 10, 10]} />
      <meshBasicMaterial color="white" wireframe />\
      {/* Just to make it a bit thicker */}
      <Edges 
        scale={1.01}
        threshold={15}
        color="white"
      />
    </mesh>
  )
}

export default function ShopHome() {
  return (
    <div className="w-screen h-screen text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">ATMOXHERE SHOP</h1>
      <div className="w-full h-[500px]">
        <Canvas camera={{ position: [0, 0, 6] }}>
          <ambientLight intensity={0.5} />
          <WireframeSphere />
          <RotatingLinks />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
      <Link href="/shop/all" className="text-white mt-6 underline">
        shop_all
      </Link>
    </div>
)
}
