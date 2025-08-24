'use client'

import Link from 'next/link'
import { useState } from 'react'
import { collections } from '@/app/page.js'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white py-16 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 tracking-wider">ATMOXHERE</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Year 2077 AXH Spacesuit Factory
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
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5zm0 1.5a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5zm6 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
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

              <a
                href="https://x.com/atmoxhere"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition-colors duration-300"
                aria-label="X"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M17.53 3H21l-6.78 7.29L22.5 21h-4.95l-5.29-6.55L6.21 21H2l7.26-7.83L1.5 3h5.01l4.79 6.17L17.53 3z" />
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
              <li>
                <Link href="/lore" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Lore/Manga Placeholder
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Collections */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Collections</h3>
            <ul className="space-y-3">
              {collections.map((slug) => {
                // Convert slug to display name: 'tsiri_synthesis' → 'Tsiri Synthesis'
                const displayName = slug
                  .split('_')
                  .map(word => word[0].toUpperCase() + word.slice(1))
                  .join(' ');

                return (
                  <li key={slug}>
                    <Link
                      href={`/shop/${slug}`}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {displayName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Atmoxhere. All rights reserved.
          </p>
          
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors duration-300">
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
