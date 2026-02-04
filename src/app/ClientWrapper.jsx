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
    <div className='overscroll-none hide-scrollbar'>
      <div className="fixed top-0 right-0 h-full w-[50%] z-[-10] pointer-events-none">
        <Image
          src="/images/gimpedit 3.webp"
          alt="sigil"
          fill
          className="object-fill opacity-40"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="fixed top-0 left-0 h-full w-[50%] z-[-10] pointer-events-none">
        <Image
          src="/images/gimpedit 4.webp"
          alt="sigil"
          fill
          className="object-fill opacity-40"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <MouseFollower />
      <CountryButton onCountrySelect={handleCountry} className='absolute top-4 right-4' />
      {children}
    </div>
  )
}
