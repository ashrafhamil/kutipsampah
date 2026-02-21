'use client'

import { useEffect, useState } from 'react'
import { Package, CheckCircle, Clock, Briefcase } from 'lucide-react'
import { subscribeToAllJobs } from '@/services/jobService'
import { JOB_STATUS } from '@/constants/jobConstants'

export default function PembuangStats({ userId }) {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completed: 0,
    pending: 0,
    collecting: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to ALL jobs (MVP: no user filtering)
    const unsubscribe = subscribeToAllJobs((jobs) => {
      const totalJobs = jobs.length
      const completed = jobs.filter(job => job.status === JOB_STATUS.DONE).length
      const pending = jobs.filter(job => job.status === JOB_STATUS.PENDING).length
      const collecting = jobs.filter(job => job.status === JOB_STATUS.COLLECTING).length
      
      setStats({
        totalJobs: totalJobs || 0,
        completed: completed || 0,
        pending: pending || 0,
        collecting: collecting || 0,
      })
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 pb-2 border-b border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-2 p-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-2 p-3">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Package className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-xs text-gray-600 font-semibold min-w-0 truncate" title="Request">Request</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalJobs}</p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
            <span className="text-xs text-gray-600 font-semibold min-w-0 truncate" title="Completed">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="text-xs text-gray-600 font-semibold min-w-0 truncate" title="Pending">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.pending || 0}</p>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Briefcase className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="text-xs text-gray-600 font-semibold min-w-0 truncate" title="Collecting">Collecting</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.collecting || 0}</p>
        </div>
      </div>
      </div>
    </div>
  )
}
