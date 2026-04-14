// app/components/Canonical.tsx
'use client'

import { usePathname } from 'next/navigation'

export default function Canonical() {
  const pathname = usePathname()
  
  // Use www version as your preferred domain
  const baseUrl = 'https://wonderjoyai.com'
  const canonicalUrl = `${baseUrl}${pathname === '/' ? '' : pathname}`
  
  return (
    <link rel="canonical" href={canonicalUrl} />
  )
}