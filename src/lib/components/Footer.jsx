'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white py-16 px-8 mt-150">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 tracking-wider">ATMOXHERE</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Placeholder Description
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/atmoxhere" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a 
                href="https://pinterest.com/atmoxhere" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-colors duration-300"
                aria-label="Pinterest"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.626 0 12 0zm0 19c-.721 0-1.418-.109-2.073-.312.286-.465.713-1.227.87-1.835l.437-1.664c.229.436.895.801 1.604.801 2.111 0 3.633-1.941 3.633-4.354 0-2.312-1.888-4.042-4.316-4.042-3.021 0-4.625 2.003-4.625 4.137 0 1.096.567 2.093 1.455 2.093.319 0 .615-.154.615-.499 0-.265-.214-.543-.214-.965 0-.757.598-1.326 1.347-1.326.847 0 1.479.608 1.479 1.468 0 1.555-.665 2.853-1.733 2.853-.47 0-.827-.31-.827-.731 0-.577.326-1.355.326-1.932 0-.43-.222-.79-.677-.79-.538 0-.97.572-.97 1.334 0 .486.164.814.164.814s-.562 2.395-.662 2.828c-.131.564-.071 1.257-.019 1.797C5.617 17.207 4 14.798 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                </svg>
              </a>

              {/* Placeholder for additional social media */}
              <div className="bg-gray-800 p-3 rounded-full opacity-50">
                <div className="w-5 h-5 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Navigate</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link href="/vault" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Vault
                </Link>
              </li>
              <li>
                <Link href="/shop/all" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Collections */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Collections</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop/mutant" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Mutant
                </Link>
              </li>
              <li>
                <Link href="/shop/tsiri_synthesis" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Tsiri Synthesis
                </Link>
              </li>
              <li>
                <Link href="/shop/termite" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Termite
                </Link>
              </li>
              <li>
                <Link href="/shop/z220x11" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Z220X11
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Atmoxhere. All rights reserved.
          </p>
          
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors duration-300">
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
