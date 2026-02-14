'use client'

import { useEffect, useState } from 'react'
import { Package, CheckCircle, Clock } from 'lucide-react'
import { subscribeToRequesterJobs } from '@/services/jobService'
import { JOB_STATUS } from '@/constants/jobConstants'

export default function PembuangStats({ userId }) {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completed: 0,
    waitingForCollection: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    // Subscribe to all jobs created by this requester
    const unsubscribe = subscribeToRequesterJobs(userId, (jobs) => {
      const totalJobs = jobs.length
      const completed = jobs.filter(job => job.status === JOB_STATUS.DONE).length
      // Waiting includes both PENDING and COLLECTING (in progress)
      const waitingForCollection = jobs.filter(job => 
        job.status === JOB_STATUS.PENDING || job.status === JOB_STATUS.COLLECTING
      ).length
      
      setStats({
        totalJobs,
        completed,
        waitingForCollection,
      })
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  if (loading) {
    return (
      <div className="bg-gray-50 pb-2 border-b border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-3 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-20 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 pb-2 border-b border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-3 p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-xs text-gray-600 font-semibold">Total Jobs</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalJobs}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600 font-semibold">Completed</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-gray-600 font-semibold">Waiting</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.waitingForCollection}</p>
        </div>
      </div>
      </div>
    </div>
  )
}
