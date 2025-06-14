'use client'

import MouseFollower from '@/lib/components/MouseFollower'
import Image from 'next/image'

export default function ClientWrapper({ children }) {
  return (
    <div className='overscroll-none overflow-y-scroll'>
      <div className="fixed top-0 right-0 h-full w-[50%] z-[-10] pointer-events-none">
        <Image
          src="/images/gimpedit 1.png"
          alt="sigil"
          fill
          className="object-fill opacity-40"
          priority
        />
      </div>
      <div className="fixed top-0 left-0 h-full w-[50%] z-[-10] pointer-events-none">
        <Image
          src="/images/gimpedit 2.png"
          alt="sigil"
          fill
          className="object-fill opacity-40"
          priority
        />
      </div>
      <MouseFollower />
      {children}
    </div>
  )
}
