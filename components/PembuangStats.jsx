'use client'

import { useEffect, useState } from 'react'
import { Package, CheckCircle, Clock, Briefcase } from 'lucide-react'
import { subscribeToAllJobs } from '@/services/jobService'
import { JOB_STATUS } from '@/constants/jobConstants'

const STAT_CARD_BASE_CLASS =
  'bg-white rounded-xl p-3 shadow-sm border border-gray-100 w-full text-left hover:shadow-md hover:border-gray-200 active:scale-[0.98] transition-all cursor-pointer'

/**
 * Renders a single stat card. Only responsible for presentation.
 */
function StatCard({ label, value, icon: Icon, valueClassName, onClick }) {
  return (
    <button type="button" onClick={onClick} className={STAT_CARD_BASE_CLASS}>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${valueClassName || 'text-primary'}`} />
        <span className="text-xs text-gray-600 font-semibold min-w-0 truncate" title={label}>
          {label}
        </span>
      </div>
      <p className={`text-2xl font-bold ${valueClassName || 'text-gray-800'}`}>{value}</p>
    </button>
  )
}

/**
 * Computes stat counts from a job array. Pure function; no side effects.
 */
function computeStatsFromJobs(jobs) {
  const totalJobs = jobs.length
  const completed = jobs.filter((job) => job.status === JOB_STATUS.DONE).length
  const pending = jobs.filter((job) => job.status === JOB_STATUS.PENDING).length
  const collecting = jobs.filter((job) => job.status === JOB_STATUS.COLLECTING).length
  return {
    totalJobs: totalJobs || 0,
    completed: completed || 0,
    pending: pending || 0,
    collecting: collecting || 0,
  }
}

const STAT_CARDS_CONFIG = [
  {
    id: 'request',
    label: 'Request',
    statKey: 'totalJobs',
    icon: Package,
    valueClassName: 'text-gray-800',
    filterValue: null,
  },
  {
    id: 'completed',
    label: 'Completed',
    statKey: 'completed',
    icon: CheckCircle,
    valueClassName: 'text-green-600',
    filterValue: JOB_STATUS.DONE,
  },
  {
    id: 'pending',
    label: 'Pending',
    statKey: 'pending',
    icon: Clock,
    valueClassName: 'text-amber-600',
    filterValue: JOB_STATUS.PENDING,
  },
  {
    id: 'collecting',
    label: 'Collecting',
    statKey: 'collecting',
    icon: Briefcase,
    valueClassName: 'text-blue-600',
    filterValue: JOB_STATUS.COLLECTING,
  },
]

export default function PembuangStats({ userId, onStatClick }) {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completed: 0,
    pending: 0,
    collecting: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAllJobs((jobs) => {
      setStats(computeStatsFromJobs(jobs))
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
                  <div className="w-3.5 h-3.5 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
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
          {STAT_CARDS_CONFIG.map((config) => (
            <StatCard
              key={config.id}
              label={config.label}
              value={stats[config.statKey] ?? 0}
              icon={config.icon}
              valueClassName={config.valueClassName}
              onClick={() => onStatClick?.(config.filterValue)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
