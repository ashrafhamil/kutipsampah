'use client'

import { useEffect, useState } from 'react'
import { MapPin, Clock, Package, DollarSign, CheckCircle } from 'lucide-react'
import { subscribeToMyJobs } from '@/services/jobService'

export default function MyJobsList({ userId, onJobClick }) {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    // Subscribe to my jobs
    const unsubscribe = subscribeToMyJobs(userId, (updatedJobs) => {
      setJobs(updatedJobs)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">No Active Jobs</h3>
          <p className="text-sm text-gray-500">
            Anda belum menerima sebarang job. Tukar ke tab "Pending Jobs" untuk melihat job yang tersedia.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
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
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{job.pickupTime || 'Tidak dinyatakan'}</span>
                  </div>
                </div>
              </div>
              <div className="ml-2 flex-shrink-0">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
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
        ))}
      </div>
    </div>
  )
}
