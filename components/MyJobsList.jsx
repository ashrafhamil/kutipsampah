'use client'

import { useEffect, useState } from 'react'
import { MapPin, Clock, Package, DollarSign, CheckCircle, Briefcase } from 'lucide-react'
import { subscribeToMyJobs, subscribeToAllCollectingJobs } from '@/services/jobService'

export default function MyJobsList({ userId, onJobClick }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to ALL collecting jobs (MVP: no user filtering for incognito compatibility)
    const unsubscribe = subscribeToAllCollectingJobs((updatedJobs) => {
      setJobs(updatedJobs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Component for individual job card with countdown
  function JobCard({ job, onJobClick, formatDate }) {
    const [timeRemaining, setTimeRemaining] = useState(null)

    useEffect(() => {
      if (!job.pickupTime) {
        setTimeRemaining(null)
        return
      }

      const calculateTimeRemaining = () => {
        try {
          if (!job.pickupTime || typeof job.pickupTime !== 'string') {
            setTimeRemaining(null)
            return
          }

          // Parse pickupTime - handle multiple formats
          let pickupTimeString = job.pickupTime.trim()
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
            console.warn('Invalid pickupTime:', job.pickupTime)
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
          console.error('Error calculating time remaining:', error, job.pickupTime)
          setTimeRemaining(null)
        }
      }

      calculateTimeRemaining()
      const interval = setInterval(calculateTimeRemaining, 1000)

      return () => clearInterval(interval)
    }, [job.pickupTime])

    return (
      <div
        onClick={() => onJobClick(job)}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              {job.address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-primary hover:underline"
                >
                  {job.address}
                </a>
              )}
              {job.gps?.lat && job.gps?.lng && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${job.gps.lat},${job.gps.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-primary hover:text-primary-dark hover:underline ml-2"
                >
                  📍
                </a>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{job.pickupTime || 'Not specified'}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>{formatDate(job.createdAt)}</span>
            </div>
            {timeRemaining && (
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                  {timeRemaining}
                </span>
              </div>
            )}
          </div>
          <div className="ml-2 flex-shrink-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              Active
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-gray-700">
                {job.bagCount} bag
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-lg font-bold text-primary">
              RM {job.totalPrice}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-full w-full overflow-y-auto bg-gray-50">
        <div className="bg-gray-50 pb-2 border-b border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="p-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="max-w-md mx-auto">
            <div className="space-y-3">
            {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="ml-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="h-full w-full overflow-y-auto bg-gray-50">
        <div className="bg-gray-50 pb-2 border-b border-gray-200">
          <div className="max-w-md mx-auto">
            <div className="p-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  <span className="text-xs text-gray-600 font-semibold">My Jobs</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">0</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Active Jobs</h3>
            <p className="text-sm text-gray-500">
              You haven't received any jobs. Switch to the "Pending Jobs" tab to see available jobs.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50">
      <div className="bg-gray-50 pb-2 border-b border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="p-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-xs text-gray-600 font-semibold">My Jobs</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{jobs.length}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onJobClick={onJobClick} formatDate={formatDate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
