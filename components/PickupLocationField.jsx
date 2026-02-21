'use client'

import { MapPin } from 'lucide-react'

export default function PickupLocationField({
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
  address,
  onAddressChange,
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
        <MapPin className="w-4 h-4" />
        Pickup Location
      </label>

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
            onChange={() => setLocationMode('different')}
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

      {locationMode === 'different' && (
        <>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address
          </label>
          <textarea
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            required={locationMode === 'different'}
            rows={1}
            placeholder="Enter full address..."
            className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => geocodeAddress(address)}
              disabled={isGeocoding || !address.trim()}
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

      <div className="mt-3 space-y-2">
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
  )
}
