'use client';

import MouseFollower from '@/lib/components/MouseFollower.jsx'

export default function ClientWrapper({ children}) {
    return (
        <>
            <MouseFollower />
            {children}
        </>
    )
}