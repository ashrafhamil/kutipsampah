'use client'

import FeedbackButton from './FeedbackButton'

export default function LayoutWithFeedback({ children }) {
  return (
    <>
      {children}
      <FeedbackButton />
    </>
  )
}
