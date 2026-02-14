'use client'

import { USER_ROLES } from '@/constants/jobConstants'

export default function UnifiedHeader({ currentRole, onRoleChange, activeTab, onTabChange }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-md mx-auto">
        {/* Role Switcher - More compact */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => onRoleChange(USER_ROLES.PEMBUANG)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all ${
                currentRole === USER_ROLES.PEMBUANG
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pembuang Sampah
            </button>
            <button
              onClick={() => onRoleChange(USER_ROLES.PENGUTIP)}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all ${
                currentRole === USER_ROLES.PENGUTIP
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pengutip Sampah
            </button>
          </div>
        </div>

        {/* Pengutip Tabs - Only show when Pengutip role is active */}
        {currentRole === USER_ROLES.PENGUTIP && (
          <div className="px-4 pb-3 pt-1">
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => onTabChange('pending')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs transition-all ${
                  activeTab === 'pending'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Pending Jobs
              </button>
              <button
                onClick={() => onTabChange('myJobs')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs transition-all ${
                  activeTab === 'myJobs'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                My Jobs
              </button>
              <button
                onClick={() => onTabChange('completed')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-semibold text-xs transition-all ${
                  activeTab === 'completed'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
