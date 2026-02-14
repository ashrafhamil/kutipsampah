'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Search, X, Navigation } from 'lucide-react'
import { subscribeToPendingJobs } from '@/services/jobService'

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false })
const MapViewUpdater = dynamic(() => import('./MapViewUpdater'), { ssr: false })

export default function PengutipMap({ onMarkerClick }) {
  const [jobs, setJobs] = useState([])
  const defaultLocation = [3.1390, 101.6869] // Kuala Lumpur
  const [userLocation, setUserLocation] = useState(defaultLocation)
  const [locationLoading, setLocationLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [mapCenter, setMapCenter] = useState(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const searchTimeoutRef = useRef(null)

  // Geocoding function using OpenStreetMap Nominatim API
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=my`
      )
      const data = await response.json()
      
      if (data && data.length > 0) {
        setSearchResults(data)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search input with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(searchQuery)
      }, 500) // 500ms debounce
    } else {
      setSearchResults([])
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Handle location selection
  const handleLocationSelect = (location) => {
    const coords = [parseFloat(location.lat), parseFloat(location.lon)]
    setMapCenter(coords)
    setSearchQuery(location.display_name)
    setSearchResults([])
  }

  // Handle get current location button click
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude]
        setUserLocation(coords)
        setMapCenter(coords)
        setIsGettingLocation(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setIsGettingLocation(false)
        alert('Unable to get your location. Please allow location access in browser settings.')
      }
    )
  }

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude]
          setUserLocation(coords)
          setMapCenter(coords)
          setLocationLoading(false)
        },
        (error) => {
          // If location access denied, use default (Kuala Lumpur)
          console.error('Geolocation error:', error)
          const defaultCoords = [3.1390, 101.6869]
          setUserLocation(defaultCoords)
          setMapCenter(defaultCoords)
          setLocationLoading(false)
        }
      )
    } else {
      // Geolocation not supported, use default
      const defaultCoords = [3.1390, 101.6869]
      setUserLocation(defaultCoords)
      setMapCenter(defaultCoords)
      setLocationLoading(false)
    }

    // Subscribe to pending jobs
    const unsubscribe = subscribeToPendingJobs((updatedJobs) => {
      setJobs(updatedJobs)
    })

    return () => unsubscribe()
  }, [])

  // Use default location if user location not available yet
  const displayCenter = mapCenter || userLocation

  return (
    <div className="h-full w-full relative">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[20] max-w-md mx-auto">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find location or city..."
              className="w-full h-12 pl-12 pr-12 rounded-xl border border-gray-200 shadow-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSearchResults([])
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-[1001]">
              {searchResults.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(location)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <p className="text-sm font-semibold text-gray-800">{location.display_name}</p>
                </button>
              ))}
            </div>
          )}
          
          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-[1001]">
              <p className="text-sm text-gray-600 text-center">Mencari...</p>
            </div>
          )}
        </div>
      </div>

      <MapContainer
        key={`map-${displayCenter[0]}-${displayCenter[1]}`}
        center={displayCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <MapViewUpdater center={mapCenter} zoom={13} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {jobs.map((job) => {
          // Validate GPS coordinates - check for null/undefined (not falsy, to allow 0 coordinates)
          if (job.gps?.lat == null || job.gps?.lng == null) return null
          
          // Explicitly convert to numbers to ensure proper type
          const lat = Number(job.gps.lat)
          const lng = Number(job.gps.lng)
          
          // Validate that conversion resulted in valid numbers
          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Invalid GPS coordinates for job ${job.id}:`, job.gps)
            return null
          }
          
          return (
            <Marker
              key={job.id}
              position={[lat, lng]}
              eventHandlers={{
                click: () => onMarkerClick(job),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-bold">{job.bagCount} bag</p>
                  <p className="text-gray-600">{job.address}</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {/* Current Location Button */}
      <button
        onClick={handleGetCurrentLocation}
        disabled={isGettingLocation}
        className="absolute bottom-6 right-4 z-[30] w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Get current location"
      >
        {isGettingLocation ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Navigation className="w-6 h-6" />
        )}
      </button>
    </div>
  )
}
