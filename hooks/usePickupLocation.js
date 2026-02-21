'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCurrentPositionAsync, fetchReverseGeocode } from '@/utils/geocodingUtils'
import { showLocationUnavailableSwal } from '@/utils/locationHelpSwal'

export function usePickupLocation() {
  const [currentLocationGps, setCurrentLocationGps] = useState({ lat: null, lng: null })
  const [addressGps, setAddressGps] = useState({ lat: null, lng: null })
  const [currentLocationCity, setCurrentLocationCity] = useState(null)
  const [currentLocationState, setCurrentLocationState] = useState(null)
  const [addressCity, setAddressCity] = useState(null)
  const [addressState, setAddressState] = useState(null)
  const [isAddressReverseGeocoding, setIsAddressReverseGeocoding] = useState(false)
  const [locationMode, setLocationMode] = useState('current')
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [geocodingError, setGeocodingError] = useState(null)

  const applyCurrentLocationCoords = useCallback(async (lat, lng) => {
    setCurrentLocationGps({ lat, lng })
    setLocationMode('current')
    setLocationError(null)
    setIsReverseGeocoding(true)
    try {
      const { city, state } = await fetchReverseGeocode(lat, lng)
      setCurrentLocationCity(city)
      setCurrentLocationState(state)
    } finally {
      setIsReverseGeocoding(false)
    }
  }, [])

  const requestCurrentLocation = useCallback((options = {}) => {
    const { silent = false } = options
    setIsGettingCurrentLocation(true)
    setLocationError(null)
    getCurrentPositionAsync()
      .then(({ lat, lng }) => applyCurrentLocationCoords(lat, lng))
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Location service failed to return position (server/device issue):', error?.code, error?.message || '')
        }
        setLocationMode('different')
        if (!silent) showLocationUnavailableSwal()
      })
      .finally(() => setIsGettingCurrentLocation(false))
  }, [applyCurrentLocationCoords])

  const geocodeAddress = useCallback(async (address) => {
    if (!address.trim()) {
      setGeocodingError('Please enter an address')
      return
    }

    setIsGeocoding(true)
    setGeocodingError(null)

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=my`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const location = data[0]
        const lat = parseFloat(location.lat)
        const lng = parseFloat(location.lon)
        setAddressGps({ lat, lng })
        setGeocodingError(null)
        setAddressCity(null)
        setAddressState(null)
        setIsAddressReverseGeocoding(true)
        try {
          const { city, state } = await fetchReverseGeocode(lat, lng)
          setAddressCity(city)
          setAddressState(state)
        } finally {
          setIsAddressReverseGeocoding(false)
        }
      } else {
        setGeocodingError('Address not found. Please try a more specific address.')
        setAddressGps({ lat: null, lng: null })
        setAddressCity(null)
        setAddressState(null)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      setGeocodingError('Failed to geocode address. Please try again.')
      setAddressGps({ lat: null, lng: null })
      setAddressCity(null)
      setAddressState(null)
    } finally {
      setIsGeocoding(false)
    }
  }, [])

  /** Clear address-related state and set locationMode to 'current' if hasCurrentGps else 'different'. */
  const resetForNewJobWithCurrentGps = useCallback((hasCurrentGps) => {
    setAddressGps({ lat: null, lng: null })
    setAddressCity(null)
    setAddressState(null)
    setGeocodingError(null)
    setLocationMode(hasCurrentGps ? 'current' : 'different')
  }, [])

  useEffect(() => {
    requestCurrentLocation({ silent: true })
  }, [requestCurrentLocation])

  return {
    locationMode,
    setLocationMode,
    currentLocationGps,
    addressGps,
    currentLocationCity,
    currentLocationState,
    addressCity,
    addressState,
    isGettingCurrentLocation,
    isReverseGeocoding,
    isAddressReverseGeocoding,
    isGeocoding,
    locationError,
    geocodingError,
    requestCurrentLocation,
    geocodeAddress,
    resetForNewJobWithCurrentGps,
  }
}
