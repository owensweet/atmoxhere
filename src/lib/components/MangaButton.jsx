"use client"

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

export default function MangaButton({ manga_name }) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const [dragOffset, setDragOffset] = useState(0)
    const containerRef = useRef(null)

    // Detect how many pages exist
    useEffect(() => {
        let pageCount = 1
        const checkPage = async (num) => {
            try {
                const response = await fetch(`/images/Manga/${manga_name}_${num}.webp`)
                return response.ok
            } catch {
                return false
            }
        }

        const detectPages = async () => {
            // Check up to 20 pages max
            for (let i = 1; i <= 20; i++) {
                const exists = await checkPage(i)
                if (exists) {
                    pageCount = i
                } else {
                    break
                }
            }
            setTotalPages(pageCount)
        }

        if (isOpen) {
            detectPages()
        }
    }, [isOpen, manga_name])

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextPage()
            if (e.key === 'ArrowLeft') prevPage()
            if (e.key === 'Escape') setIsOpen(false)
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, currentPage, totalPages])

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1)
        }
    }

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1)
        }
    }

    // Touch handlers for swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX)
        setTouchEnd(e.touches[0].clientX)
    }

    const handleTouchMove = (e) => {
        setTouchEnd(e.touches[0].clientX)
        const diff = touchStart - e.touches[0].clientX
        setDragOffset(-diff)
    }

    const handleTouchEnd = () => {
        const swipeDistance = touchStart - touchEnd
        const minSwipeDistance = 50

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                nextPage()
            } else {
                prevPage()
            }
        }

        setDragOffset(0)
        setTouchStart(0)
        setTouchEnd(0)
    }

    // Click on sides to navigate
    const handleClick = (e) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        const clickX = e.clientX - rect.left
        const containerWidth = rect.width

        // Change the denominator for skinnier hitboxes on either side of the page
        if (clickX < containerWidth / 3) {
            prevPage()
        } else if (clickX > (containerWidth * 2) / 3) {
            nextPage()
        }
    }

    // Generate ASCII page indicator
    const generatePageIndicator = () => {
        if (totalPages === 1) return '[ ■ ]'
        
        return '[' + Array.from({ length: totalPages }, (_, i) => {
            if (i === currentPage) return '■'
            return '□'
        }).join(' ') + ']'
    }

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded transition-all"
            >
                <p><span className = "font-black outline-black">DATA_LOG_0: </span>{manga_name}</p>
            </button>
        )
    }

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            {/* Exit button */}
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-50 text-white text-3xl hover:text-red-500 transition-colors"
            >
                ✕
            </button>

            {/* Page indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 text-white font-mono text-sm">
                {generatePageIndicator()}
            </div>

            {/* Image container */}
            <div
                ref={containerRef}
                className="relative w-full h-full overflow-hidden cursor-pointer"
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex h-full transition-transform duration-300 ease-out"
                    style={{
                        transform: `translateX(calc(-${currentPage * 100}% + ${dragOffset}px))`,
                    }}
                >
                    {Array.from({ length: totalPages }, (_, i) => (
                        <div
                            key={i}
                            className="min-w-full h-full flex items-center justify-center"
                        >
                            <Image
                                src={`/images/Manga/${manga_name}_${i + 1}.webp`}
                                alt={`${manga_name} page ${i + 1}`}
                                width={1200}
                                height={1600}
                                className="max-h-[95vh] w-auto object-contain"
                                priority={i === currentPage}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation hints */}
            {currentPage > 0 && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-4xl pointer-events-none">
                    ‹
                </div>
            )}
            {currentPage < totalPages - 1 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 text-4xl pointer-events-none">
                    ›
                </div>
            )}
        </div>
    )
}
