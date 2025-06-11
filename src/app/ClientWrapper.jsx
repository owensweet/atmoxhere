'use client';

import MouseFollower from '@/lib/components/MouseFollower'

export default function ClientWrapper({ children}) {
    return (
        <>
            <MouseFollower />
            {children}
        </>
    )
}