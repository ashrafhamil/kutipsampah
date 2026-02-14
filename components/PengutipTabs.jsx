'use client'

export default function PengutipTabs({ activeTab, onTabChange }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-[73px] z-40">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          <button
            onClick={() => onTabChange('pending')}
            className={`flex-1 py-2 px-2 rounded-lg font-bold text-xs transition-all ${
              activeTab === 'pending'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            Pending Jobs
          </button>
          <button
            onClick={() => onTabChange('myJobs')}
            className={`flex-1 py-2 px-2 rounded-lg font-bold text-xs transition-all ${
              activeTab === 'myJobs'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            My Jobs
          </button>
          <button
            onClick={() => onTabChange('completed')}
            className={`flex-1 py-2 px-2 rounded-lg font-bold text-xs transition-all ${
              activeTab === 'completed'
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            Completed
          </button>
        </div>
      </div>
    </div>
  )
}
