'use client'

import { useEffect, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { getFeedbackList } from '@/services/feedbackService'
import { formatTimestampForDisplay } from '@/utils/jobUtils'

function useFeedbackList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getFeedbackList()
      .then(setItems)
      .catch((err) => setError(err?.message || 'Failed to load feedback'))
      .finally(() => setLoading(false))
  }, [])

  return { items, loading, error }
}

export default function FeedbackList() {
  const { items, loading, error } = useFeedbackList()

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-full bg-gray-100 rounded mb-2" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <p className="text-red-600 text-sm">
        {error}
      </p>
    )
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">No feedback yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
        >
          <p className="text-gray-800 text-sm whitespace-pre-wrap">{item.message}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span>{item.name ? `— ${item.name}` : '— Anonymous'}</span>
            <span>·</span>
            <span>{formatTimestampForDisplay(item.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
