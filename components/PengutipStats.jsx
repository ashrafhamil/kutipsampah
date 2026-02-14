'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, DollarSign } from 'lucide-react'
import { subscribeToAllCompletedJobs } from '@/services/jobService'

export default function PengutipStats({ userId }) {
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalEarned: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Subscribe to ALL completed jobs (MVP: no user filtering)
    const unsubscribe = subscribeToAllCompletedJobs((jobs) => {
      const totalEarned = jobs.reduce((sum, job) => sum + (job.totalPrice || 0), 0)
      setStats({
        totalCompleted: jobs.length,
        totalEarned,
      })
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 pb-2 border-b border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-3 p-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 pb-2 border-b border-gray-200">
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3 p-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600 font-semibold">Total Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalCompleted}</p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-xs text-gray-600 font-semibold">Total Earned</span>
          </div>
          <p className="text-2xl font-bold text-primary">RM {stats.totalEarned}</p>
        </div>
      </div>
      </div>
    </div>
  )
}
