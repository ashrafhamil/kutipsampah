import Link from 'next/link'

export const metadata = {
  title: 'Story | Kome Buang Kita Kutip',
  description: 'The story behind Kome Buang Kita Kutip - Community Food Waste Utility',
}

export default function AboutPage() {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Story</h1>
        <p className="text-gray-600 mb-4">
          Kome Buang Kita Kutip is a community food waste utility that connects people who want to dispose of waste (Pembuang Sampah) with collectors (Pengutip Sampah).
        </p>
        <p className="text-gray-600 mb-4">
          Request a pickup, set your location and time, and a collector can accept and complete the job. Simple and local.
        </p>

        <h2 className="text-lg font-semibold text-gray-800 mb-3 mt-6">The story behind it</h2>
        <p className="text-gray-600 mb-4">
          Share your story here—why you started this, what you saw in your community, or what you hope it becomes.
        </p>

        <Link href="/" className="inline-block mt-4 text-primary font-semibold hover:underline">
          Back to app
        </Link>
      </main>
    </div>
  )
}
