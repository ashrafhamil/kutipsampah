'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export default function MapViewUpdater({ center, zoom }) {
  const map = useMap()
  
  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom || 13, { animate: true })
    }
  }, [center, zoom, map])
  
  return null
}
