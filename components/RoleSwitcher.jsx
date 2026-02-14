'use client'

import { USER_ROLES } from '@/constants/jobConstants'

export default function RoleSwitcher({ currentRole, onRoleChange }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => onRoleChange(USER_ROLES.PEMBUANG)}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
              currentRole === USER_ROLES.PEMBUANG
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            Pembuang Sampah
          </button>
          <button
            onClick={() => onRoleChange(USER_ROLES.PENGUTIP)}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
              currentRole === USER_ROLES.PENGUTIP
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-600'
            }`}
          >
            Pengutip Sampah
          </button>
        </div>
      </div>
    </div>
  )
}
