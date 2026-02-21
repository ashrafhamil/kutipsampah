'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { Edit3, UserCheck, CheckCircle } from 'lucide-react'
import { AuthProvider, useAuth } from './providers'
import UnifiedHeader from '@/components/UnifiedHeader'
import PembuangForm from '@/components/PembuangForm'
import PembuangStats from '@/components/PembuangStats'
import PembuangRequestsList from '@/components/PembuangRequestsList'
import PengutipMap from '@/components/PengutipMap'
import MyJobsList from '@/components/MyJobsList'
import CompletedJobsList from '@/components/CompletedJobsList'
import JobDrawer from '@/components/JobDrawer'
import Footer from '@/components/Footer'
import { USER_ROLES } from '@/constants/jobConstants'
import {
  getCachedVisitorCount,
  setCachedVisitorCount,
  syncVisitorCount,
} from '@/services/visitorCountService'

function KutipSampahApp() {
  const { user } = useAuth()
  const [visitorCount, setVisitorCount] = useState(null)

  useEffect(() => {
    const cached = getCachedVisitorCount()
    if (cached != null) setVisitorCount(cached)

    /** Single responsibility: apply a fresh count to UI and cache. */
    function applyFreshCount(count) {
      setVisitorCount(count)
      setCachedVisitorCount(count)
    }

    syncVisitorCount(applyFreshCount)
  }, [])

  const [currentRole, setCurrentRole] = useState(USER_ROLES.PEMBUANG)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('request')
  const [showForm, setShowForm] = useState(false)
  const [requestsFilter, setRequestsFilter] = useState(null) // null = All for My Requests list

  const handleJobCreated = (jobId) => {
    Swal.fire({ icon: 'success', title: 'Request sent', text: 'Waiting for collector...' })
  }

  const handleMarkerClick = (job) => {
    setSelectedJob(job)
    setIsDrawerOpen(true)
  }

  const handleJobClick = (job) => {
    setSelectedJob(job)
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedJob(null)
  }

  /** Navigate to My Requests tab with optional status filter (null = All). */
  const goToMyRequests = (filter) => {
    setRequestsFilter(filter)
    setActiveTab('myRequests')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UnifiedHeader 
        currentRole={currentRole} 
        onRoleChange={(role) => {
          setCurrentRole(role)
          setActiveTab(role === USER_ROLES.PEMBUANG ? 'request' : 'pending')
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {currentRole === USER_ROLES.PEMBUANG ? (
        <div className={showForm ? 'pb-80' : ''}>
          {activeTab === 'request' ? (
            <>
              <PembuangStats userId={user.uid} onStatClick={goToMyRequests} />
              <div className="max-w-md mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome, Pembuang Sampah!
                  </h1>
                  <p className="text-gray-600 text-sm mb-4">
                    Kome buang, bior deme yg kutip. Upoh jgn lupe.
                  </p>
                  {!showForm && (
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-primary-dark transition-colors"
                    >
                      Request Pengutip Sampah
                    </button>
                  )}
                </div>

                <div className="bg-primary/5 rounded-2xl p-6 shadow-sm border border-primary/10 mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">How it works</h2>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
                        <Edit3 className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="font-semibold text-gray-800">Request.</span>
                        <span className="text-gray-600 text-sm ml-1">Fill in the form with location, date, time and number of bags.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="font-semibold text-gray-800">Collector accepts.</span>
                        <span className="text-gray-600 text-sm ml-1">A pengutip will take your job and come to collect.</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 text-primary shrink-0">
                        <CheckCircle className="w-4 h-4" />
                      </span>
                      <div>
                        <span className="font-semibold text-gray-800">Done.</span>
                        <span className="text-gray-600 text-sm ml-1">They complete the job and your waste is taken away.</span>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-[3] min-w-0 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Learn more</h2>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link href="/about" className="text-primary font-medium hover:underline">
                          Story
                        </Link>
                        <span className="text-gray-500"> — Why we make this app</span>
                      </li>
                      <li>
                        <Link href="/instructions" className="text-primary font-medium hover:underline">
                          Instructions
                        </Link>
                        <span className="text-gray-500"> — Skip this if you hate reading instruction</span>
                      </li>
                      <li>
                        <Link href="/solutions" className="text-primary font-medium hover:underline">
                          Solutions
                        </Link>
                        <span className="text-gray-500"> — Only for those who like reading ai generated text</span>
                      </li>
                    </ul>
                  </div>
                  <div className="flex-[1] min-w-0 bg-primary/5 rounded-2xl p-6 shadow-sm border border-primary/10">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Visitors</h2>
                    <p className="text-gray-600 text-sm">
                      {visitorCount !== null ? `${visitorCount.toLocaleString()} visitors` : 'Loading...'}
                    </p>
                  </div>
                </div>
              </div>
              {showForm && (
                <PembuangForm 
                  userId={user.uid} 
                  onJobCreated={(jobId) => {
                    handleJobCreated(jobId)
                    setShowForm(false)
                  }}
                  onClose={() => setShowForm(false)}
                />
              )}
            </>
          ) : (
            <>
              <PembuangStats userId={user.uid} onStatClick={goToMyRequests} />
              <div className="max-w-md mx-auto px-4 pt-4 pb-8">
                <PembuangRequestsList
                  userId={user.uid}
                  onJobClick={handleJobClick}
                  statusFilter={requestsFilter}
                  onStatusFilterChange={setRequestsFilter}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="h-[calc(100vh-114px)] relative">
            {activeTab === 'pending' ? (
              <PengutipMap onMarkerClick={handleMarkerClick} />
            ) : activeTab === 'myJobs' ? (
              <MyJobsList userId={user.uid} onJobClick={handleJobClick} />
            ) : (
              <CompletedJobsList userId={user.uid} onJobClick={handleJobClick} />
            )}
        </div>
      )}

      <JobDrawer
        job={selectedJob}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        userId={user.uid}
        userRole={currentRole}
        activeTab={activeTab}
        onSwitchToMyJobs={() => {
          setActiveTab('myJobs')
          handleCloseDrawer()
        }}
      />

      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <KutipSampahApp />
    </AuthProvider>
  )
}
