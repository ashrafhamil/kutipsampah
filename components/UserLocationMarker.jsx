'use client'

import { useMemo } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'

export default function UserLocationMarker({ position, hasRealLocation }) {
  // Only render if we have a real user location (not default)
  if (!hasRealLocation || !position || !Array.isArray(position) || position.length !== 2) return null

  // Create custom icon for user location using useMemo to avoid recreating on each render
  const userLocationIcon = useMemo(() => {
    if (typeof window === 'undefined' || !L) return null
    
    return L.divIcon({
      className: 'user-location-marker',
      html: `<div class="user-location-pulse"></div><div class="user-location-dot"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }, [])

  if (!userLocationIcon) return null

  return (
    <Marker
      position={position}
      icon={userLocationIcon}
      interactive={false}
    />
  )
}
