'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Clock, Package, DollarSign, CheckCircle } from 'lucide-react'
import { acceptJob, completeJob } from '@/services/jobService'
import { JOB_STATUS } from '@/constants/jobConstants'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function JobDrawer({ job, isOpen, onClose, userId, userRole, activeTab, onSwitchToMyJobs }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentJob, setCurrentJob] = useState(job)

  // Subscribe to real-time job updates
  useEffect(() => {
    if (!isOpen || !job?.id) return

    const jobRef = doc(db, 'jobs', job.id)
    const unsubscribe = onSnapshot(jobRef, (snapshot) => {
      if (snapshot.exists()) {
        setCurrentJob({ id: snapshot.id, ...snapshot.data() })
      }
    })

    return () => unsubscribe()
  }, [isOpen, job?.id])

  // Update currentJob when job prop changes
  useEffect(() => {
    if (job) {
      setCurrentJob(job)
    }
  }, [job])

  if (!isOpen || !currentJob) return null

  const isAccepted = currentJob.status === JOB_STATUS.COLLECTING && currentJob.collectorId === userId
  const isCompleted = currentJob.status === JOB_STATUS.DONE && currentJob.collectorId === userId
  const canAccept = currentJob.status === JOB_STATUS.PENDING && userRole === 'PENGUTIP'
  const canComplete = isAccepted && currentJob.status === JOB_STATUS.COLLECTING
  // Show "Go to My Jobs" button if job was just accepted from pending tab
  const showGoToMyJobs = isAccepted && activeTab === 'pending'

  const handleAccept = async () => {
    setIsProcessing(true)
    try {
      await acceptJob(currentJob.id, userId)
      // Real-time subscription will update the job status
    } catch (error) {
      console.error('Error accepting job:', error)
      alert('Failed to accept job. It may have been taken by someone else.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleComplete = async (success = true) => {
    setIsProcessing(true)
    try {
      await completeJob(currentJob.id, currentJob.requesterId, userId, success)
      if (success) {
        alert('Job completed successfully!')
      } else {
        alert('Job cancelled. Returning to pending status.')
      }
      onClose()
    } catch (error) {
      console.error('Error completing job:', error)
      alert('Failed to complete job: ' + error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Butiran Job</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-700">Bilangan Beg:</span>
              <span className="font-bold text-primary text-lg">{currentJob.bagCount}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span className="font-semibold text-gray-700">Harga:</span>
              <span className="font-bold text-primary text-lg">RM {currentJob.totalPrice}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <span className="font-semibold text-gray-700 block">Masa Kutip:</span>
                <span className="text-gray-600">{currentJob.pickupTime || 'Tidak dinyatakan'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-gray-700 block mb-1">Alamat:</span>
                {currentJob.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentJob.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 text-sm leading-relaxed hover:text-primary hover:underline block"
                  >
                    {currentJob.address}
                  </a>
                )}
                {currentJob.gps?.lat && currentJob.gps?.lng && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${currentJob.gps.lat},${currentJob.gps.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary-dark hover:underline mt-2 block"
                  >
                    📍 Navigate to GPS: {currentJob.gps.lat.toFixed(4)}, {currentJob.gps.lng.toFixed(4)}
                  </a>
                )}
              </div>
            </div>
          </div>

          {isAccepted && !isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">Anda telah menerima job ini</span>
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">Job ini telah selesai</span>
            </div>
          )}

          {!isCompleted && (
            <div className="space-y-3 pt-2">
              {canAccept && (
                <button
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Memproses...' : 'TERIMA JOB'}
                </button>
              )}

              {showGoToMyJobs && (
                <button
                  onClick={onSwitchToMyJobs}
                  className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-colors"
                >
                  Lihat My Jobs
                </button>
              )}

              {canComplete && !showGoToMyJobs && (
                <div className="space-y-3">
                  <button
                    onClick={() => handleComplete(true)}
                    disabled={isProcessing}
                    className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Memproses...' : 'Success'}
                  </button>
                  <button
                    onClick={() => handleComplete(false)}
                    disabled={isProcessing}
                    className="w-full h-12 bg-red-500 text-white rounded-xl font-bold shadow-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Memproses...' : 'Cancel'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
