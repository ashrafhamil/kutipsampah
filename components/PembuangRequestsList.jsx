'use client'

import { useEffect, useState } from 'react'
import { MapPin, Clock, Package, DollarSign, Inbox } from 'lucide-react'
import { subscribeToAllJobs } from '@/services/jobService'
import { JOB_STATUS } from '@/constants/jobConstants'
import { 
  sortJobsByStatusAndDate, 
  filterJobsByStatus,
  getStatusLabel,
  getStatusClass,
  getFilterButtonActiveClass
} from '@/utils/jobUtils'

export default function PembuangRequestsList({ userId, onJobClick }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(null) // null = all, or JOB_STATUS value

  useEffect(() => {
    const unsubscribe = subscribeToAllJobs((updatedJobs) => {
      const sorted = sortJobsByStatusAndDate(updatedJobs)
      setJobs(sorted)
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

  const formatPickupTime = (pickupTime) => {
    if (!pickupTime) return 'Not specified'
    try {
      if (/^\d{1,2}:\d{2}$/.test(pickupTime.trim())) return pickupTime
      const date = new Date(pickupTime)
      if (isNaN(date.getTime())) return pickupTime
      return date.toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return pickupTime
    }
  }

  const formatAddress = (address, gps) => {
    if (!address) return 'Not specified'
    if (address.startsWith('Current Location')) {
      const match = address.match(/Current Location\s*\(([^)]+)\)/)
      if (match && match[1]) {
        return match[1].split(',').map((p) => p.trim()).join(', ')
      }
      if (gps?.lat != null && gps?.lng != null) {
        return `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}`
      }
    }
    return address
  }

  // Filter and sort jobs
  const filteredJobs = filterJobsByStatus(jobs, statusFilter)
  const displayJobs = sortJobsByStatusAndDate(filteredJobs)

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pb-6">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex justify-between mb-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
              </div>
              <div className="h-3 w-full bg-gray-100 rounded mb-2" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
              <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-5 w-14 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">You haven&apos;t submitted any requests yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-800">My Requests</h2>
        <span className="text-sm text-gray-500">{displayJobs.length} {displayJobs.length === 1 ? 'job' : 'jobs'}</span>
      </div>
      
      {/* Status Filter Buttons */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setStatusFilter(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
            statusFilter === null
              ? getFilterButtonActiveClass(null)
              : 'bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter(JOB_STATUS.PENDING)}
          className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
            statusFilter === JOB_STATUS.PENDING
              ? getFilterButtonActiveClass(JOB_STATUS.PENDING)
              : 'bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
        >
          {getStatusLabel(JOB_STATUS.PENDING)}
        </button>
        <button
          onClick={() => setStatusFilter(JOB_STATUS.COLLECTING)}
          className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
            statusFilter === JOB_STATUS.COLLECTING
              ? getFilterButtonActiveClass(JOB_STATUS.COLLECTING)
              : 'bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
        >
          {getStatusLabel(JOB_STATUS.COLLECTING)}
        </button>
        <button
          onClick={() => setStatusFilter(JOB_STATUS.DONE)}
          className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
            statusFilter === JOB_STATUS.DONE
              ? getFilterButtonActiveClass(JOB_STATUS.DONE)
              : 'bg-gray-100 text-gray-600 hover:text-gray-800'
          }`}
        >
          {getStatusLabel(JOB_STATUS.DONE)}
        </button>
      </div>

      {displayJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">
            {statusFilter 
              ? `No ${getStatusLabel(statusFilter).toLowerCase()} requests found.`
              : "You haven't submitted any requests yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
        {displayJobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onJobClick(job)}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-semibold text-gray-800 line-clamp-2">
                  {formatAddress(job.address, job.gps)}
                </span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2 ${getStatusClass(job.status)}`}>
                {getStatusLabel(job.status)}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatPickupTime(job.pickupTime)}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>{formatDate(job.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5">
                <Package className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-gray-700">{job.bagCount} bag</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-lg font-bold text-primary">RM {job.totalPrice}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  )
}
