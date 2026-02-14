import Link from 'next/link'

export const metadata = {
  title: 'Plans | Kome Buang Kita Kutip',
  description: 'Plans for Kome Buang Kita Kutip - no login by design for easy testing',
}

export default function PlansPage() {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Plans</h1>

        <p className="text-gray-600 mb-4 text-justify">
          This is just an MVP to test the idea. Intentionally no SSO, sign up, or login as it adds an extra step for you to test the app, and without it we can still test the full functionality.
        </p>
        <p className="text-gray-600 mb-6 text-justify">
          Just come here, test the app, give feedback, then leave. No extra steps.
        </p>

        <Link href="/" className="inline-block mt-4 text-primary font-semibold hover:underline">
          Back to app
        </Link>
      </main>
    </div>
  )
}
