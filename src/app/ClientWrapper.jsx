'use client'

import MouseFollower from '@/lib/components/MouseFollower'
import CountryButton from '@/lib/components/CountryButton'
import Image from 'next/image'

export default function ClientWrapper({ children }) {

  const handleCountry = (countryCode) => {
    console.log("country = ", countryCode)
    localStorage.setItem("shipping_country", countryCode)
  }

  return (
    <div className='overscroll-none'>
      <div className="fixed top-0 right-0 h-screen w-[50%] z-[-10] pointer-events-none">
        <Image
          src="/images/gimpedit-3.webp"
          alt="sigil"
          fill
          className="object-fill opacity-40"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="fixed top-0 left-0 h-screen w-[50%] z-[-10] pointer-events-none">
        <Image
          src="/images/gimpedit-4.webp"
          alt="sigil2"
          fill
          className="object-fill opacity-40"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <MouseFollower />
      <CountryButton onCountrySelect={handleCountry} className='absolute top-4 right-4 z-1' />
      <a id="loreButton" className="border-2 w-9 h-9 absolute top-6.5 left-4.5 rounded-full z-1 flex justify-center" href="/lore">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 mt-1">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
        </svg>
      </a>
      <Image 
        src="/images/Components/corner.png"
        alt="corner sigil"
        className="absolute z-[0] top-1 right-[-5] h-auto"
        priority
        width = {120}
        height = {100}
      />
      <Image 
        src="/images/Components/corner_left.png"
        alt="corner sigil"
        className="absolute z-[0] top-1 left-[-5] h-auto"
        priority
        width = {100}
        height = {100}
      />
      {children}
    </div>
  )
}
