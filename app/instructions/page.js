import Link from 'next/link'

export const metadata = {
  title: 'Instructions | Kome Buang Kita Kutip',
  description: 'How to use Kome Buang Kita Kutip',
}

export default function InstructionsPage() {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Instructions</h1>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Pembuang Sampah (Requester)</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Switch to <strong>Pembuang Sampah</strong> in the header.</li>
            <li>Tap <strong>Request Pengutip Sampah</strong> to open the form.</li>
            <li>Enter your name and phone number.</li>
            <li>Choose <strong>Current location</strong> or <strong>Different location</strong> and set your pickup address (use “Get GPS from Address” if you enter an address).</li>
            <li>Pick a future date and time for pickup.</li>
            <li>Set the number of bags and submit.</li>
            <li>Use the <strong>My Requests</strong> tab to see your requests and their status (Pending, Collecting, Done).</li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Pengutip Sampah (Collector)</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Switch to <strong>Pengutip Sampah</strong> in the header.</li>
            <li>Use <strong>Pending Jobs</strong> to see requests on the map; tap a marker to view details.</li>
            <li>Tap <strong>Accept job</strong> to take a job (it moves to <strong>My Jobs</strong>).</li>
            <li>Go to the pickup location and complete the job.</li>
            <li>In the job drawer, tap <strong>Complete job</strong> when done (or <strong>Cancel job</strong> to release it).</li>
            <li>View <strong>Completed</strong> tab for your finished jobs.</li>
          </ol>
        </section>

        <Link href="/" className="inline-block mt-4 text-primary font-semibold hover:underline">
          Back to app
        </Link>
      </main>
    </div>
  )
}
