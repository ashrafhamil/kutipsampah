'use client'

import { useState, useEffect } from 'react'
import { Clock, MapPin, Package, DollarSign } from 'lucide-react'
import { createJob } from '@/services/jobService'
import { PRICE_PER_BAG } from '@/constants/jobConstants'

export default function PembuangForm({ userId, onJobCreated }) {
  const [formData, setFormData] = useState({
    pickupTime: '',
    address: '',
    bagCount: 1,
    gps: { lat: null, lng: null },
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationError, setLocationError] = useState(null)

  useEffect(() => {
    // Auto-fill GPS coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            gps: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }))
          setLocationError(null)
        },
        (error) => {
          setLocationError('Unable to get location. Please enter address manually.')
          console.error('Geolocation error:', error)
        }
      )
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const jobId = await createJob({
        requesterId: userId,
        address: formData.address,
        gps: formData.gps,
        pickupTime: formData.pickupTime,
        bagCount: formData.bagCount,
      })

      // Reset form
      setFormData({
        pickupTime: '',
        address: '',
        bagCount: 1,
        gps: { lat: null, lng: null },
      })

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
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Alamat
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              rows={3}
              placeholder="Masukkan alamat lengkap..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {locationError && (
              <p className="text-xs text-red-500 mt-1">{locationError}</p>
            )}
            {formData.gps.lat && (
              <p className="text-xs text-green-600 mt-1">
                ✓ GPS:{' '}
                <a
                  href={`https://www.google.com/maps?q=${formData.gps.lat},${formData.gps.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-green-700 font-semibold"
                >
                  {formData.gps.lat.toFixed(4)}, {formData.gps.lng.toFixed(4)}
                </a>
              </p>
            )}
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
