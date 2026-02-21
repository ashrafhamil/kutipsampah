'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, MapPin, Package, DollarSign, X, User, Phone } from 'lucide-react'
import Swal from 'sweetalert2'
import { createJob } from '@/services/jobService'
import { PRICE_PER_BAG, VALIDATION } from '@/constants/jobConstants'
import { 
  validateName, 
  validatePhoneNumber, 
  validateBagCount,
  clampBagCount,
  truncateName
} from '@/utils/validation'

// Helper: current date/time in datetime-local format (YYYY-MM-DDTHH:MM) for min attribute
const getMinPickupTime = () => {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const h = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}`
}

// Helper: current date/time + 1 hour in datetime-local format for default value
const getDefaultPickupTime = () => {
  const now = new Date()
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
  const year = oneHourLater.getFullYear()
  const month = String(oneHourLater.getMonth() + 1).padStart(2, '0')
  const date = String(oneHourLater.getDate()).padStart(2, '0')
  const hours = String(oneHourLater.getHours()).padStart(2, '0')
  const minutes = String(oneHourLater.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${date}T${hours}:${minutes}`
}

/** Single responsibility: wrap browser geolocation in a Promise. Returns { lat, lng } or rejects. */
function getCurrentPositionAsync() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }),
      reject
    )
  })
}

/** Single responsibility: fetch city and state from coordinates via Nominatim. Returns { city, state }. */
async function fetchReverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    )
    const data = await response.json()
    if (data?.address) {
      const city = data.address.city ?? data.address.town ?? data.address.village ?? data.address.municipality ?? data.address.county ?? data.address.state_district ?? null
      const state = data.address.state ?? data.address.region ?? null
      return { city, state }
    }
    return { city: null, state: null }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return { city: null, state: null }
  }
}

export default function PembuangForm({ userId, onJobCreated, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    pickupTime: getDefaultPickupTime(),
    address: '',
    bagCount: 1,
  })
  const [currentLocationGps, setCurrentLocationGps] = useState({ lat: null, lng: null })
  const [addressGps, setAddressGps] = useState({ lat: null, lng: null })
  const [currentLocationCity, setCurrentLocationCity] = useState(null)
  const [currentLocationState, setCurrentLocationState] = useState(null)
  const [addressCity, setAddressCity] = useState(null)
  const [addressState, setAddressState] = useState(null)
  const [isAddressReverseGeocoding, setIsAddressReverseGeocoding] = useState(false)
  const [locationMode, setLocationMode] = useState('current')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [geocodingError, setGeocodingError] = useState(null)
  
  // Derive useCurrentLocation from locationMode
  const useCurrentLocation = locationMode === 'current'

  /** Single responsibility: apply coords to current-location state (GPS + mode + reverse geocode → city/state). */
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

  /** Single responsibility: orchestrate request current location (get position → apply or show error). */
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
        if (!silent) {
          Swal.fire({ icon: 'error', title: 'Location unavailable', text: 'Unable to get location. Please allow location access in browser settings or use a different location.' })
        }
      })
      .finally(() => setIsGettingCurrentLocation(false))
  }, [applyCurrentLocationCoords])

  // Geocoding function using Nominatim API
  const geocodeAddress = async (address) => {
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
  }

  useEffect(() => {
    requestCurrentLocation({ silent: true })
  }, [requestCurrentLocation])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation: Name
    const nameValidation = validateName(formData.name)
    if (!nameValidation.valid) {
      Swal.fire({ icon: 'warning', title: 'Invalid name', text: nameValidation.message })
      return
    }

    // Validation: Phone number
    const phoneValidation = validatePhoneNumber(formData.phoneNumber)
    if (!phoneValidation.valid) {
      Swal.fire({ icon: 'warning', title: 'Invalid phone number', text: phoneValidation.message })
      return
    }

    // Validation: Bag count
    const bagCountValidation = validateBagCount(formData.bagCount)
    if (!bagCountValidation.valid) {
      Swal.fire({ icon: 'warning', title: 'Invalid bag count', text: bagCountValidation.message })
      return
    }

    // Validation: pickup time must not be in the past
    if (new Date(formData.pickupTime) <= new Date()) {
      Swal.fire({ icon: 'warning', title: 'Invalid time', text: 'Please choose a future date and time for pickup.' })
      return
    }
    
    // Determine which GPS to use based on location mode
    const selectedGps = locationMode === 'current' ? currentLocationGps : addressGps
    
    // Validation: Ensure GPS coordinates are available
    if (!selectedGps.lat || !selectedGps.lng) {
      if (locationMode === 'current') {
        Swal.fire({ icon: 'error', title: 'Location needed', text: 'Current location GPS is not available. Please allow location access or use different location.' })
      } else {
        Swal.fire({ icon: 'error', title: 'Address GPS needed', text: 'Please geocode the address first by clicking "Dapatkan GPS dari Alamat".' })
      }
      return
    }
    
    // Validation: Ensure address is provided when using different location
    if (locationMode === 'different' && !formData.address.trim()) {
      Swal.fire({ icon: 'warning', title: 'Address required', text: 'Please enter an address for the pickup location.' })
      return
    }
    
    setIsSubmitting(true)

    try {
      // Use address from form, or default to "Current Location" when using current location
      let addressToSubmit
      if (locationMode === 'current') {
        // Build location parts: GPS, City, State
        const parts = [`${selectedGps.lat.toFixed(4)}, ${selectedGps.lng.toFixed(4)}`]
        if (currentLocationCity) {
          parts.push(currentLocationCity)
        }
        if (currentLocationState) {
          parts.push(currentLocationState)
        }
        addressToSubmit = `Current Location (${parts.join(', ')})`
      } else {
        addressToSubmit = formData.address
      }

      const jobId = await createJob({
        requesterId: userId,
        name: truncateName(formData.name.trim()),
        phoneNumber: phoneValidation.cleaned || formData.phoneNumber.trim(),
        address: addressToSubmit,
        gps: selectedGps,
        pickupTime: formData.pickupTime,
        bagCount: clampBagCount(formData.bagCount),
      })

      // Reset form (but keep default name and phoneNumber)
      setFormData({
        name: '',
        phoneNumber: '',
        pickupTime: getDefaultPickupTime(),
        address: '',
        bagCount: 1,
      })
      setAddressGps({ lat: null, lng: null })
      setAddressCity(null)
      setAddressState(null)
      setLocationMode(currentLocationGps.lat ? 'current' : 'different')
      setGeocodingError(null)

      if (onJobCreated) onJobCreated(jobId)
    } catch (error) {
      console.error('Error creating job:', error)
      Swal.fire({ icon: 'error', title: 'Request failed', text: 'Failed to create job. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = formData.bagCount * PRICE_PER_BAG

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl w-full max-w-md mx-auto max-h-[100vh] overflow-y-auto shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-4 pb-6">
        <div className="relative mb-4">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto"></div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-0 right-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4" />
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const value = truncateName(e.target.value)
                  setFormData({ ...formData, name: value })
                }}
                placeholder="Jebon"
                required
                maxLength={VALIDATION.NAME_MAX_LENGTH}
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Phone
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="0123456789"
                required
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Pickup Time
            </label>
            <input
              type="datetime-local"
              value={formData.pickupTime}
              min={getMinPickupTime()}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              required
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="w-4 h-4" />
              Pickup Location
            </label>
            
            {/* Location Selection Radio Buttons */}
            <div className="flex gap-2 mb-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 transition-all flex-1 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="locationMode"
                  value="current"
                  checked={locationMode === 'current'}
                  onChange={() => {
                    setLocationMode('current')
                    if (!currentLocationGps.lat && navigator.geolocation) {
                      requestCurrentLocation()
                    }
                  }}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700 font-medium">Current location</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50 flex-1">
                <input
                  type="radio"
                  name="locationMode"
                  value="different"
                  checked={locationMode === 'different'}
                  onChange={(e) => setLocationMode('different')}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700 font-medium">Different location</span>
              </label>
            </div>
            {!currentLocationGps.lat && locationMode === 'current' && (
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="text-xs text-amber-600">Location not available.</p>
                <button
                  type="button"
                  onClick={requestCurrentLocation}
                  disabled={isGettingCurrentLocation}
                  className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGettingCurrentLocation ? 'Getting location...' : 'Get my location'}
                </button>
              </div>
            )}
            
            {/* Address Field - Only shown when "different location" is selected */}
            {locationMode === 'different' && (
              <>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required={locationMode === 'different'}
                  rows={1}
                  placeholder="Enter full address..."
                  className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => geocodeAddress(formData.address)}
                    disabled={isGeocoding || !formData.address.trim()}
                    className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeocoding ? 'Searching...' : 'Get GPS from Address'}
                  </button>
                </div>
                {geocodingError && (
                  <p className="text-xs text-red-500 mt-1">{geocodingError}</p>
                )}
              </>
            )}
            
            {locationError && locationMode === 'current' && (
              <p className="text-xs text-amber-600 mt-1">{locationError}</p>
            )}
            
            {/* GPS Display Section */}
            <div className="mt-3 space-y-2">
              {/* Current Location GPS - Show when current location mode is selected */}
              {locationMode === 'current' && currentLocationGps.lat && (
                <div className="p-3 rounded-lg border-2 border-primary bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Current Location GPS</p>
                      <a
                        href={`https://www.google.com/maps?q=${currentLocationGps.lat},${currentLocationGps.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary underline hover:text-primary-dark font-semibold"
                      >
                        {currentLocationGps.lat.toFixed(4)}, {currentLocationGps.lng.toFixed(4)}
                        {isReverseGeocoding && ', Loading...'}
                        {!isReverseGeocoding && currentLocationCity && `, ${currentLocationCity}`}
                        {!isReverseGeocoding && !currentLocationCity && currentLocationState && `, ${currentLocationState}`}
                      </a>
                    </div>
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              )}
              
              {/* Address GPS - Show when different location mode is selected and geocoded */}
              {locationMode === 'different' && addressGps.lat && (
                <div className="p-3 rounded-lg border-2 border-primary bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Address GPS</p>
                      <a
                        href={`https://www.google.com/maps?q=${addressGps.lat},${addressGps.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary underline hover:text-primary-dark font-semibold"
                      >
                        {addressGps.lat.toFixed(4)}, {addressGps.lng.toFixed(4)}
                        {isAddressReverseGeocoding && ', Loading...'}
                        {!isAddressReverseGeocoding && addressCity && `, ${addressCity}`}
                        {!isAddressReverseGeocoding && !addressCity && addressState && `, ${addressState}`}
                      </a>
                    </div>
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full font-semibold">
                      Active
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Package className="w-4 h-4" />
              Number of Bags
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bagCount: clampBagCount(formData.bagCount - 1) })}
                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                −
              </button>
              <input
                type="number"
                min={VALIDATION.BAG_COUNT_MIN}
                max={VALIDATION.BAG_COUNT_MAX}
                value={formData.bagCount}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || VALIDATION.BAG_COUNT_MIN
                  const clamped = clampBagCount(value)
                  setFormData({ ...formData, bagCount: clamped })
                }}
                required
                className="w-20 h-10 px-3 text-center rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary font-bold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bagCount: clampBagCount(formData.bagCount + 1) })}
                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-700">Total:</span>
            </div>
            <span className="text-2xl font-bold text-primary">RM {totalPrice}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Pay & Submit'}
          </button>
        </form>
        </div>
      </div>
    </div>
  )
}
