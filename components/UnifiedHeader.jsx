'use client'

import { USER_ROLES } from '@/constants/jobConstants'

export default function UnifiedHeader({ currentRole, onRoleChange, activeTab, onTabChange }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-4 lg:px-6 py-2.5">
        {/* Mobile: Stack vertically, Desktop: Keep horizontal */}
        <div className="flex flex-col lg:flex-row items-center gap-2">
          {/* Left - App name */}
          <div className="flex-1 flex items-center w-full lg:w-auto">
            <span className="text-lg font-bold text-gray-800">Kome Buang Kita Kutip</span>
          </div>
          
          {/* Role Switcher - Full width on mobile, centered on desktop */}
          <div className="flex bg-gray-100 rounded-xl p-1 flex-shrink-0 w-full lg:min-w-[420px] lg:w-auto">
            <button
              onClick={() => onRoleChange(USER_ROLES.PEMBUANG)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                currentRole === USER_ROLES.PEMBUANG
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pembuang Sampah
            </button>
            <button
              onClick={() => onRoleChange(USER_ROLES.PENGUTIP)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                currentRole === USER_ROLES.PENGUTIP
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pengutip Sampah
            </button>
          </div>

          {/* Tabs - Full width on mobile below role switcher, right-aligned on desktop */}
          <div className="flex-1 flex justify-end w-full lg:w-auto">
            {currentRole === USER_ROLES.PEMBUANG && (
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1 flex-shrink-0 w-full lg:w-auto">
                <button
                  onClick={() => onTabChange('request')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'request'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  New Request
                </button>
                <button
                  onClick={() => onTabChange('myRequests')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'myRequests'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  My Requests
                </button>
              </div>
            )}
            {currentRole === USER_ROLES.PENGUTIP && (
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1 flex-shrink-0 w-full lg:w-auto">
                <button
                  onClick={() => onTabChange('pending')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'pending'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Pending Jobs
                </button>
                <button
                  onClick={() => onTabChange('myJobs')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'myJobs'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  My Jobs
                </button>
                <button
                  onClick={() => onTabChange('completed')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold text-xs transition-all whitespace-nowrap ${
                    activeTab === 'completed'
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Completed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
