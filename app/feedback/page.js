import Link from 'next/link'
import FeedbackList from '@/components/FeedbackList'
import { getFeedbackList, serializeFeedbackListForClient } from '@/services/feedbackService'

export const metadata = {
  title: 'Feedback | Kome Buang Kita Kutip',
  description: 'User feedback for Kome Buang Kita Kutip - Community Waste Utility',
}

export default async function FeedbackPage() {
  let initialData = []
  let initialError = null

  try {
    const rawItems = await getFeedbackList()
    initialData = serializeFeedbackListForClient(rawItems)
  } catch (err) {
    initialError = err?.message ?? 'Failed to load feedback'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/" className="text-lg font-bold text-gray-800 hover:text-primary">
            Kome Buang Kita Kutip
          </Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Feedback</h1>
        <FeedbackList initialData={initialData} initialError={initialError} />
        <Link href="/" className="inline-block mt-6 text-primary font-semibold hover:underline">
          Back to app
        </Link>
      </main>
    </div>
  )
}
