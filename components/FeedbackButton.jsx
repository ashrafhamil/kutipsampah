'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import Swal from 'sweetalert2'
import { validateAndNormalizeFeedbackPayload, submitFeedback } from '@/services/feedbackService'

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetFeedbackForm = () => {
    setIsOpen(false)
    setName('')
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let payload
    try {
      payload = validateAndNormalizeFeedbackPayload({ name, message })
    } catch (error) {
      Swal.fire({ icon: 'warning', title: 'Feedback required', text: error?.message ?? 'Please enter your feedback.' })
      return
    }

    setIsSubmitting(true)
    try {
      await submitFeedback(payload)
      Swal.fire({ icon: 'success', title: 'Thank you', text: 'Your feedback has been sent.' })
      resetFeedbackForm()
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Failed to send', text: error?.message || 'Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors"
        aria-label="Send feedback"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Send feedback</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div>
              <label htmlFor="feedback-name" className="block text-sm font-semibold text-gray-700 mb-1">
                Name (optional)
              </label>
              <input
                id="feedback-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div>
              <label htmlFor="feedback-message" className="block text-sm font-semibold text-gray-700 mb-1">
                Your feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your feedback..."
                rows={3}
                required
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  )
}
