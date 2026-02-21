'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Clock, Package, DollarSign, CheckCircle, User, Phone } from 'lucide-react'
import Swal from 'sweetalert2'
import { acceptJob, completeJob } from '@/services/jobService'
import { JOB_STATUS } from '@/constants/jobConstants'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function JobDrawer({ job, isOpen, onClose, userId, userRole, activeTab, onSwitchToMyJobs }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentJob, setCurrentJob] = useState(job)
  const [timeRemaining, setTimeRemaining] = useState(null)

  // Subscribe to real-time job updates
  useEffect(() => {
    if (!isOpen || !job?.id) return

    const jobRef = doc(db, 'jobs', job.id)
    const unsubscribe = onSnapshot(jobRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentJob({ id: snapshot.id, ...snapshot.data() })
      }
    })

    return () => unsubscribe()
  }, [isOpen, job?.id])

  // Update currentJob when job prop changes
  useEffect(() => {
    if (job) {
      setCurrentJob(job)
    }
  }, [job])

  // Calculate and update countdown timer
  useEffect(() => {
    if (!currentJob?.pickupTime) {
      setTimeRemaining(null)
      return
    }

    const calculateTimeRemaining = () => {
      try {
        if (!currentJob.pickupTime || typeof currentJob.pickupTime !== 'string') {
          setTimeRemaining(null)
          return
        }

        // Parse pickupTime - handle multiple formats
        let pickupTimeString = currentJob.pickupTime.trim()
        let pickupDate
        
        // Check if it's just time format (HH:MM) - need to combine with today's date
        if (/^\d{1,2}:\d{2}$/.test(pickupTimeString)) {
          // Format is "HH:MM" - combine with today's date
          const today = new Date()
          const [hours, minutes] = pickupTimeString.split(':')
          pickupDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), parseInt(hours), parseInt(minutes))
          
          // If the time has already passed today, assume it's for tomorrow
          if (pickupDate.getTime() < Date.now()) {
            pickupDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, parseInt(hours), parseInt(minutes))
          }
        } else {
          // Try parsing as full datetime format (YYYY-MM-DDTHH:MM)
          pickupDate = new Date(pickupTimeString)
        }
        
        // Check if date is valid
        if (isNaN(pickupDate.getTime())) {
          console.warn('Invalid pickupTime:', currentJob.pickupTime)
          setTimeRemaining(null)
          return
        }

        const now = new Date()
        const diff = pickupDate.getTime() - now.getTime()

        if (isNaN(diff)) {
          setTimeRemaining(null)
          return
        }

        if (diff <= 0) {
          setTimeRemaining('Time passed')
          return
        }

        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        // Ensure all values are valid numbers
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
          setTimeRemaining(null)
          return
        }

        // Ensure values are non-negative
        const safeHours = Math.max(0, hours)
        const safeMinutes = Math.max(0, minutes)
        const safeSeconds = Math.max(0, seconds)

        if (safeHours > 0) {
          setTimeRemaining(`${safeHours}h ${safeMinutes}m ${safeSeconds}s`)
        } else if (safeMinutes > 0) {
          setTimeRemaining(`${safeMinutes}m ${safeSeconds}s`)
        } else {
          setTimeRemaining(`${safeSeconds}s`)
        }
      } catch (error) {
        console.error('Error calculating time remaining:', error, currentJob.pickupTime)
        setTimeRemaining(null)
      }
    }

    // Calculate immediately
    calculateTimeRemaining()

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [currentJob?.pickupTime])

  const formatPickupTime = (pickupTime) => {
    if (!pickupTime) return 'Not specified'
    
    try {
      // Handle different formats
      let date
      
      // Check if it's just time format (HH:MM)
      if (/^\d{1,2}:\d{2}$/.test(pickupTime.trim())) {
        return pickupTime // Return as-is for simple time format
      }
      
      // Try parsing as full datetime format
      date = new Date(pickupTime)
      
      if (isNaN(date.getTime())) {
        return pickupTime // Return original if can't parse
      }
      
      // Format as human-readable date
      return date.toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      return pickupTime // Return original on error
    }
  }

  // Format address to show GPS, City, State instead of "Current Location"
  const formatAddress = (address, gps) => {
    if (!address) return 'Not specified'
    
    // Check if address starts with "Current Location"
    if (address.startsWith('Current Location')) {
      // Extract all parts from address
      // Format: "Current Location (lat, lng, city, state)" or variations
      const match = address.match(/Current Location\s*\(([^)]+)\)/)
      if (match && match[1]) {
        // Split by comma and trim each part
        const parts = match[1].split(',').map(part => part.trim())
        // Return all parts joined: "GPS, City, State"
        return parts.join(', ')
      }
      
      // Fallback: return GPS coordinates if available
      if (gps?.lat && gps?.lng) {
        return `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}`
      }
    }
    
    // Return original address if not "Current Location"
    return address
  }

  if (!isOpen || !currentJob) return null

  // MVP: Remove userId checks - anyone can accept/complete jobs
  const isAccepted = currentJob.status === JOB_STATUS.COLLECTING
  const isCompleted = currentJob.status === JOB_STATUS.DONE
  const canAccept = currentJob.status === JOB_STATUS.PENDING && userRole === 'PENGUTIP'
  const canComplete = currentJob.status === JOB_STATUS.COLLECTING
  // Show "Go to My Jobs" button if job was just accepted from pending tab
  const showGoToMyJobs = isAccepted && activeTab === 'pending'

  const handleAccept = async () => {
    setIsProcessing(true)
    try {
      await acceptJob(currentJob.id, userId)
      // Real-time subscription will update the job status
    } catch (error) {
      console.error('Error accepting job:', error)
      Swal.fire({ icon: 'error', title: 'Accept failed', text: 'Failed to accept job. It may have been taken by someone else.' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleComplete = async (success = true) => {
    setIsProcessing(true)
    try {
      await completeJob(currentJob.id, currentJob.requesterId, userId, success)
      if (success) {
        Swal.fire({ icon: 'success', title: 'Job completed', text: 'Job completed successfully!' })
      } else {
        Swal.fire({ icon: 'info', title: 'Job cancelled', text: 'Returning to pending status.' })
      }
      onClose()
    } catch (error) {
      console.error('Error completing job:', error)
      Swal.fire({ icon: 'error', title: 'Complete failed', text: 'Failed to complete job: ' + error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Job Details</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {(currentJob.name || currentJob.phoneNumber) && (
            <div className="bg-gray-50 rounded-xl p-4">
              {currentJob.name && (
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-gray-700">Name:</span>
                  <span className="text-gray-800">{currentJob.name}</span>
                </div>
              )}
              {currentJob.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-gray-700">Phone:</span>
                  <span className="text-gray-800">{currentJob.phoneNumber}</span>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-700">Number of Bags:</span>
              <span className="font-bold text-primary text-lg">{currentJob.bagCount}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-700">Price:</span>
              <span className="font-bold text-primary text-lg">RM {currentJob.totalPrice}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-gray-700 block">Pickup Time:</span>
                <span className="text-gray-600">{formatPickupTime(currentJob.pickupTime)}</span>
                {timeRemaining && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                      {timeRemaining}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                {currentJob.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentJob.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm leading-relaxed hover:text-primary-dark hover:underline block font-semibold"
                  >
                    {formatAddress(currentJob.address, currentJob.gps)}
                  </a>
                )}
              </div>
            </div>
          </div>

          {isAccepted && !isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">This job is being collected</span>
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">This job has been completed</span>
            </div>
          )}

          {!isCompleted && (
            <div className="space-y-3 pt-2">
              {canAccept && (
                <button
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'ACCEPT JOB'}
                </button>
              )}

              {showGoToMyJobs && (
                <button
                  onClick={onSwitchToMyJobs}
                  className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-colors"
                >
                  View My Jobs
                </button>
              )}

              {canComplete && !showGoToMyJobs && (
                <div className="space-y-3">
                  <button
                    onClick={() => handleComplete(true)}
                    disabled={isProcessing}
                    className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Trash Collected'}
                  </button>
                  <button
                    onClick={() => handleComplete(false)}
                    disabled={isProcessing}
                    className="w-full h-12 bg-red-500 text-white rounded-xl font-bold shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Cancel Job'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
