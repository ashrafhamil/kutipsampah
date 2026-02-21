'use client'

import { useState } from 'react'
import { Clock, DollarSign, X, User, Phone } from 'lucide-react'
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
import { getMinPickupTime, getDefaultPickupTime } from '@/utils/dateTimeUtils'
import { usePickupLocation } from '@/hooks/usePickupLocation'
import PickupLocationField from '@/components/PickupLocationField'
import BagCountField from '@/components/BagCountField'

export default function PembuangForm({ userId, onJobCreated, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    pickupTime: getDefaultPickupTime(),
    address: '',
    bagCount: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
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
  } = usePickupLocation()

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
      resetForNewJobWithCurrentGps(!!currentLocationGps?.lat)

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

          <PickupLocationField
            locationMode={locationMode}
            setLocationMode={setLocationMode}
            currentLocationGps={currentLocationGps}
            addressGps={addressGps}
            currentLocationCity={currentLocationCity}
            currentLocationState={currentLocationState}
            addressCity={addressCity}
            addressState={addressState}
            isGettingCurrentLocation={isGettingCurrentLocation}
            isReverseGeocoding={isReverseGeocoding}
            isAddressReverseGeocoding={isAddressReverseGeocoding}
            isGeocoding={isGeocoding}
            locationError={locationError}
            geocodingError={geocodingError}
            requestCurrentLocation={requestCurrentLocation}
            geocodeAddress={geocodeAddress}
            address={formData.address}
            onAddressChange={(value) => setFormData((prev) => ({ ...prev, address: value }))}
          />

          <BagCountField
            value={formData.bagCount}
            onChange={(bagCount) => setFormData((prev) => ({ ...prev, bagCount }))}
          />

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
