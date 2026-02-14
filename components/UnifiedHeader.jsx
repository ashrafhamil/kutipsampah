'use client'

import { USER_ROLES } from '@/constants/jobConstants'

export default function UnifiedHeader({ currentRole, onRoleChange, activeTab, onTabChange }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="w-full px-4 lg:px-6 py-2.5">
        <div className="flex items-center gap-2">
          {/* Left spacer - Equal width to right side for centering */}
          <div className={`flex-1 ${currentRole === USER_ROLES.PENGUTIP ? '' : 'flex'}`}></div>
          
          {/* Role Switcher - Centered */}
          <div className="flex bg-gray-100 rounded-xl p-1 flex-shrink-0 min-w-[420px]">
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

          {/* Right side - Tabs or spacer for balance */}
          <div className="flex-1 flex justify-end">
            {currentRole === USER_ROLES.PENGUTIP && (
              <div className="flex bg-gray-100 rounded-xl p-1 gap-1 flex-shrink-0">
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
