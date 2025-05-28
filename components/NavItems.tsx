'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const data = [
    { label: 'Home', href: '/' },
    { label: 'Companions', href: '/companions' },
    { label: 'My Journey', href: '/my-journey' },
]

export default function NavItems() {
    const pathname = usePathname()

    return (
        <nav className="flex items-center gap-4">
            {data.map(({ label, href }) => (
                <Link
                    href={href}
                    key={label}
                    className={cn(
                        pathname === href && 'text-primary font-semibold'
                    )}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}
