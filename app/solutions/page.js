import Link from 'next/link'

export const metadata = {
  title: 'Solutions | Kome Buang Kita Kutip',
  description: 'Who Kome Buang Kita Kutip is for - Community Waste Utility',
}

export default function SolutionsPage() {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Solutions</h1>

        <p className="text-gray-600 text-base mb-6 text-justify">
          Kome Buang Kita Kutip connects people who need waste picked up with people who can collect it—like Grab or Lalamove, but for waste. Pay a small fee, someone comes to collect. No need to drive to the big bin or wait for a lorry that never comes.
        </p>

        <h2 className="text-lg font-semibold text-gray-800 mb-3">Who it's for</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600 text-base text-justify mb-6">
          <li><strong>Kampung</strong> — No waste lorry? No problem. Request a pickup and someone can take your bags to the nearest big bin or disposal point.</li>
          <li><strong>Rumah flat / high-rise</strong> — Lazy to go down with heavy bags or bulky items (fan, table, washing machine, cabinet, bicycle)? Request a collector to take it from your door.</li>
          <li><strong>Anyone</strong> who'd rather pay a bit and have the problem gone than deal with the hassle and smell.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800 mb-3">Who it's not for</h2>
        <p className="text-gray-600 text-base mb-6 text-justify">
          If your area already has regular waste collection (lori sampah kutip), you might not need this. This is for places and situations where that doesn't exist or doesn't work—kampung, far from big bins, or high-rises where people don't want to lug stuff down.
        </p>

        <h2 className="text-lg font-semibold text-gray-800 mb-3">How we compare</h2>
        <p className="text-gray-600 text-base mb-4 text-justify">
          Other options either don't reach kampung, make you drive smelly waste yourself, or aren't meant for waste. We're built for it: on-demand, door-to-door, and affordable.
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-base border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-3 px-3 border-b border-gray-200 font-semibold text-gray-800">Criteria</th>
                <th className="text-center py-3 px-3 border-b border-gray-200 font-semibold text-primary bg-primary/10">Kome Buang Kita Kutip</th>
                <th className="text-center py-3 px-3 border-b border-gray-200 font-semibold text-gray-700">Lori sampah</th>
                <th className="text-center py-3 px-3 border-b border-gray-200 font-semibold text-gray-700">Send sendiri ke tong</th>
                <th className="text-center py-3 px-3 border-b border-gray-200 font-semibold text-gray-700">Bakar / buang sungai</th>
                <th className="text-center py-3 px-3 border-b border-gray-200 font-semibold text-gray-700">Lalamove / Grab</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">Works in kampung</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Rarely</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Yes, but you drive</td>
                <td className="text-center py-2.5 px-3 text-red-600">Illegal</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Often no</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">You don't drive (door-to-door)</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Curb only</td>
                <td className="text-center py-2.5 px-3 text-red-600">No</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Yes</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Yes</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">Built for waste</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Yes</td>
                <td className="text-center py-2.5 px-3 text-red-600">No</td>
                <td className="text-center py-2.5 px-3 text-red-600">No</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">Affordable (small fee)</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Petrol + time</td>
                <td className="text-center py-2.5 px-3 text-gray-400">—</td>
                <td className="text-center py-2.5 px-3 text-red-600">Expensive</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">On-demand (when you want)</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 text-red-600">Fixed schedule</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Yes</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Yes</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 px-3">Locals can earn (community income)</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Govt jobs only</td>
                <td className="text-center py-2.5 px-3 text-gray-400">No</td>
                <td className="text-center py-2.5 px-3 text-gray-400">No</td>
                <td className="text-center py-2.5 px-3 text-gray-400">Drivers earn (platform)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">Legal & safe for environment</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
                <td className="text-center py-2.5 px-3 text-red-600">No</td>
                <td className="text-center py-2.5 px-3 font-semibold text-green-600">Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-gray-600 text-base mb-6 text-justify italic">
          Kome Buang Kita Kutip is the only option that ticks all the boxes for kampung and high-rise: door-to-door, for waste, on-demand, affordable, and legal.
        </p>

        <h2 className="text-lg font-semibold text-gray-800 mb-3">Why it matters</h2>
        <p className="text-gray-600 text-base mb-2 text-justify">
          When there's no waste collection, rubbish doesn't disappear—it goes into rivers or the air we breathe. The numbers are real. We have to act step by step from now.
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-600 text-base text-justify mb-4">
          <li><strong>River pollution:</strong> In Malaysia, plastic makes up about <strong>68%</strong> of riverine litter in studied areas. Dozens of rivers in several states are classified as polluted; dumping is a major cause. Impact: contaminated water, dead fish, health risks for people who use the water. Plastic in the river can persist for centuries.</li>
          <li><strong>Open burning:</strong> When there's no collection, burning at home or in the open is often the only "solution". Impact: toxins and smoke go into the air we breathe. It's illegal in many places and damages health—especially for children and the elderly.</li>
          <li><strong>No lorry, no bin:</strong> In many kampung and remote areas the waste lorry never comes or the nearest big bin is kilometres away. Impact: rubbish piles up, washes into rivers when it rains or gets burned. The problem grows every day we don't change how we handle waste.</li>
        </ul>
        <p className="text-gray-600 text-base mb-4 text-justify">
          This isn't a future problem—it's happening now. Every bag dumped or burned adds to river and air pollution. We need to act step by step, starting today.
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2">What you can do now</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600 text-base text-justify mb-6">
          <li><strong>Today:</strong> Use proper collection (e.g. Kome Buang Kita Kutip) instead of dumping or burning. One request = one less bag in the river or in the air.</li>
          <li><strong>This week:</strong> Tell one neighbour or family member why you're using collection and that dumping or burning hurts everyone.</li>
          <li><strong>Ongoing:</strong> Keep using collection and encourage others. The more people who switch, the bigger the impact.</li>
        </ol>

        <Link href="/" className="inline-block mt-4 text-primary font-semibold hover:underline">
          Back to app
        </Link>
      </main>
    </div>
  )
}
