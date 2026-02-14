'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Package, DollarSign } from 'lucide-react'
import { createJob } from '@/services/jobService'
import { PRICE_PER_BAG } from '@/constants/jobConstants'

// Helper function to get current time + 1 hour in HH:MM format
const getDefaultPickupTime = () => {
  const now = new Date()
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000) // Add 1 hour
  const hours = String(oneHourLater.getHours()).padStart(2, '0')
  const minutes = String(oneHourLater.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export default function PembuangForm({ userId, onJobCreated }) {
  const [formData, setFormData] = useState({
    pickupTime: getDefaultPickupTime(),
    address: '',
    bagCount: 1,
  })
  const [currentLocationGps, setCurrentLocationGps] = useState({ lat: null, lng: null })
  const [addressGps, setAddressGps] = useState({ lat: null, lng: null })
  const [locationMode, setLocationMode] = useState('current')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const [geocodingError, setGeocodingError] = useState(null)
  
  // Derive useCurrentLocation from locationMode
  const useCurrentLocation = locationMode === 'current'

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
        setAddressGps({
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        })
        setGeocodingError(null)
      } else {
        setGeocodingError('Address not found. Please try a more specific address.')
        setAddressGps({ lat: null, lng: null })
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      setGeocodingError('Failed to geocode address. Please try again.')
      setAddressGps({ lat: null, lng: null })
    } finally {
      setIsGeocoding(false)
    }
  }

  useEffect(() => {
    // Auto-fill GPS coordinates for current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocationGps({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationMode('current')
          setLocationError(null)
        },
        (error) => {
          setLocationError('Unable to get location. Please enter address and geocode it.')
          setLocationMode('different')
          console.error('Geolocation error:', error)
        }
      )
    } else {
      setLocationMode('different')
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Determine which GPS to use based on location mode
    const selectedGps = locationMode === 'current' ? currentLocationGps : addressGps
    
    // Validation: Ensure GPS coordinates are available
    if (!selectedGps.lat || !selectedGps.lng) {
      if (locationMode === 'current') {
        alert('Current location GPS is not available. Please allow location access or use different location.')
      } else {
        alert('Address GPS is not available. Please geocode the address first by clicking "Dapatkan GPS dari Alamat".')
      }
      return
    }
    
    // Validation: Ensure address is provided when using different location
    if (locationMode === 'different' && !formData.address.trim()) {
      alert('Please enter an address for the pickup location.')
      return
    }
    
    setIsSubmitting(true)

    try {
      // Use address from form, or default to "Current Location" when using current location
      const addressToSubmit = locationMode === 'current' 
        ? `Current Location (${selectedGps.lat.toFixed(4)}, ${selectedGps.lng.toFixed(4)})`
        : formData.address

      const jobId = await createJob({
        requesterId: userId,
        address: addressToSubmit,
        gps: selectedGps,
        pickupTime: formData.pickupTime,
        bagCount: formData.bagCount,
      })

      // Reset form
      setFormData({
        pickupTime: getDefaultPickupTime(),
        address: '',
        bagCount: 1,
      })
      setAddressGps({ lat: null, lng: null })
      setLocationMode(currentLocationGps.lat ? 'current' : 'different')
      setGeocodingError(null)

      if (onJobCreated) onJobCreated(jobId)
    } catch (error) {
      console.error('Error creating job:', error)
      alert('Failed to create job. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = formData.bagCount * PRICE_PER_BAG

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 z-40 max-w-md mx-auto">
      <div className="px-6 pt-4 pb-6">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Masa Kutip
            </label>
            <input
              type="time"
              value={formData.pickupTime}
              onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
              required
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="w-4 h-4" />
              Lokasi Kutip
            </label>
            
            {/* Location Selection Radio Buttons */}
            <div className="space-y-2 mb-4">
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50">
                <input
                  type="radio"
                  name="locationMode"
                  value="current"
                  checked={locationMode === 'current'}
                  onChange={(e) => setLocationMode('current')}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700 font-medium">Gunakan lokasi semasa saya</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-gray-50">
                <input
                  type="radio"
                  name="locationMode"
                  value="different"
                  checked={locationMode === 'different'}
                  onChange={(e) => setLocationMode('different')}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700 font-medium">Gunakan lokasi lain</span>
              </label>
            </div>
            
            {/* Address Field - Only shown when "different location" is selected */}
            {locationMode === 'different' && (
              <>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required={locationMode === 'different'}
                  rows={3}
                  placeholder="Masukkan alamat lengkap..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => geocodeAddress(formData.address)}
                    disabled={isGeocoding || !formData.address.trim()}
                    className="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeocoding ? 'Mencari...' : 'Dapatkan GPS dari Alamat'}
                  </button>
                </div>
                {geocodingError && (
                  <p className="text-xs text-red-500 mt-1">{geocodingError}</p>
                )}
              </>
            )}
            
            {locationError && (
              <p className="text-xs text-red-500 mt-1">{locationError}</p>
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
                      </a>
                    </div>
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full font-semibold">
                      Aktif
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
                      </a>
                    </div>
                    <span className="text-xs bg-primary text-white px-2 py-1 rounded-full font-semibold">
                      Aktif
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Package className="w-4 h-4" />
              Bilangan Beg
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bagCount: Math.max(1, formData.bagCount - 1) })}
                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                −
              </button>
              <span className="text-2xl font-bold text-gray-800 w-12 text-center">
                {formData.bagCount}
              </span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bagCount: formData.bagCount + 1 })}
                className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-700">Total Harga:</span>
            </div>
            <span className="text-2xl font-bold text-primary">RM {totalPrice}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Menghantar...' : 'Bayar & Hantar'}
          </button>
        </form>
      </div>
    </div>
  )
}
