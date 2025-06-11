'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function MouseFollower() {
  const followerRef = useRef(null)
  const [isTouching, setIsTouching] = useState(false)

  useEffect(() => {
    const follower = followerRef.current
    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const handleMove = (e) => {

      // pageX/pageY for document coordinates (includes scroll)
      const x = e.touches ? e.touches[0].pageX : e.pageX
      const y = e.touches ? e.touches[0].pageY : e.pageY
      mouseX = x
      mouseY = y
    }

     // Immediately position the follower for touch and click, and flag isTouching
    const handleTouchStart = (e) => {
      const x = e.touches[0].pageX
      const y = e.touches[0].pageY
      mouseX = x
      mouseY = y
      currentX = x - 40
      currentY = y - 40
      
     
      if (follower) {
        follower.style.transform = `translate(${currentX}px, ${currentY}px)`
      }
      
      setIsTouching(true)
    }

    const handleMouseDown = (e) => {
      const x = e.pageX
      const y = e.pageY
      mouseX = x
      mouseY = y
      currentX = x - 40
      currentY = y - 40
    
      if (follower) {
        follower.style.transform = `translate(${currentX}px, ${currentY}px)`
      }
      
      setIsTouching(true)
    }

    const handleTouchEnd = () => {
      setIsTouching(false)
    }

    const handleMouseUp = () => {
      setIsTouching(false)
    }

    const animate = () => {
      if (follower) {

        // linear interpolation for the floatyness
        const targetX = mouseX - 40
        const targetY = mouseY - 40
        
        currentX += (targetX - currentX) * 0.1
        currentY += (targetY - currentY) * 0.1

        follower.style.transform = `translate(${currentX}px, ${currentY}px)`
      }

      requestAnimationFrame(animate)
    }

    // Mouse events
    document.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mousedown', handleMouseDown, { passive: true })
    document.addEventListener('mouseup', handleMouseUp, { passive: true })

    // Touch events
    document.addEventListener('touchmove', handleMove, { passive: true })
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMove, { passive: true })
      document.removeEventListener('mousedown', handleMouseDown, { passive: true })
      document.removeEventListener('mouseup', handleMouseUp,{ passive: true })
      document.removeEventListener('touchmove', handleMove, { passive: true })
      document.removeEventListener('touchstart', handleTouchStart, { passive: true })
      document.removeEventListener('touchend', handleTouchEnd, { passive: true })
    }
  }, [])

  return (
    <div
      ref={followerRef}
      className={`fixed top-0 left-0 w-20 h-20 rounded-full z-50 pointer-events-none flex items-center justify-center relative transition-opacity duration-300 ease-in-out ${
        isTouching ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Image
      src={`/images/test2.png`}
      alt="test2"
      fill
      className="absolute inset-0 animate-[spin_4s_linear_infinite] brightness-125 drop-shadow-[0_0_10px_rgba(0,200,90,0.6)] pointer-events-none"
    />
    <Image
      src={`/images/test1.png`}
      alt="test1"
      width={60}
      height={60}
      className="relative z-10 animate-reverse-spin brightness-110 drop-shadow-[0_0_30px_rgba(0,200,80,0.3)] pointer-events-none"
    />
    </div>
  )
}