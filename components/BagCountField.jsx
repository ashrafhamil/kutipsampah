'use client'

import { Package } from 'lucide-react'
import { VALIDATION } from '@/constants/jobConstants'
import { clampBagCount } from '@/utils/validation'

export default function BagCountField({ value, onChange }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        <Package className="w-4 h-4" />
        Number of Bags
      </label>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(clampBagCount(value - 1))}
          className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
        >
          −
        </button>
        <input
          type="number"
          min={VALIDATION.BAG_COUNT_MIN}
          max={VALIDATION.BAG_COUNT_MAX}
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value) || VALIDATION.BAG_COUNT_MIN
            onChange(clampBagCount(v))
          }}
          required
          className="w-20 h-10 px-3 text-center rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary font-bold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onChange(clampBagCount(value + 1))}
          className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
