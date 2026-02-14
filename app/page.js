'use client'

import { useState } from 'react'
import { AuthProvider, useAuth } from './providers'
import UnifiedHeader from '@/components/UnifiedHeader'
import PembuangForm from '@/components/PembuangForm'
import PembuangStats from '@/components/PembuangStats'
import PengutipMap from '@/components/PengutipMap'
import MyJobsList from '@/components/MyJobsList'
import CompletedJobsList from '@/components/CompletedJobsList'
import PengutipStats from '@/components/PengutipStats'
import JobDrawer from '@/components/JobDrawer'
import { USER_ROLES } from '@/constants/jobConstants'

function KampungSapuApp() {
  const { user } = useAuth()
  const [currentRole, setCurrentRole] = useState(USER_ROLES.PEMBUANG)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [showForm, setShowForm] = useState(false)

  const handleJobCreated = (jobId) => {
    alert('Job sent successfully! Waiting for collector...')
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

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader 
        currentRole={currentRole} 
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {currentRole === USER_ROLES.PEMBUANG ? (
        <div className={showForm ? 'pb-80' : ''}>
          <PembuangStats userId={user.uid} />
          <div className="max-w-md mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome, Pembuang Sampah!
              </h1>
              <p className="text-gray-600 text-sm mb-4">
                Fill in the form below to request trash collection.
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
        </div>
      ) : (
        <div className="h-[calc(100vh-120px)] relative">
            {activeTab === 'pending' ? (
              <PengutipMap onMarkerClick={handleMarkerClick} />
            ) : activeTab === 'myJobs' ? (
              <MyJobsList userId={user.uid} onJobClick={handleJobClick} />
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-shrink-0">
                  <PengutipStats userId={user.uid} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <CompletedJobsList userId={user.uid} onJobClick={handleJobClick} />
                </div>
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
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <KampungSapuApp />
    </AuthProvider>
  )
}
