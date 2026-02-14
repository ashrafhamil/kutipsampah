'use client'

import { useState } from 'react'
import { AuthProvider, useAuth } from './providers'
import RoleSwitcher from '@/components/RoleSwitcher'
import PembuangForm from '@/components/PembuangForm'
import PengutipMap from '@/components/PengutipMap'
import MyJobsList from '@/components/MyJobsList'
import CompletedJobsList from '@/components/CompletedJobsList'
import PengutipTabs from '@/components/PengutipTabs'
import PengutipStats from '@/components/PengutipStats'
import JobDrawer from '@/components/JobDrawer'
import { USER_ROLES } from '@/constants/jobConstants'

function KampungSapuApp() {
  const { user } = useAuth()
  const [currentRole, setCurrentRole] = useState(USER_ROLES.PEMBUANG)
  const [selectedJob, setSelectedJob] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')

  const handleJobCreated = (jobId) => {
    alert('Job berjaya dihantar! Menunggu pengutip...')
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

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Memuatkan...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />

      {currentRole === USER_ROLES.PEMBUANG ? (
        <div className="pb-80">
          <div className="max-w-md mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Selamat Datang, Pembuang Sampah!
              </h1>
              <p className="text-gray-600 text-sm">
                Isi borang di bawah untuk meminta kutipan sampah makanan.
              </p>
            </div>

          </div>

          <PembuangForm userId={user.uid} onJobCreated={handleJobCreated} />
        </div>
      ) : (
        <>
          <PengutipTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="h-[calc(100vh-146px)] relative">
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
        </>
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
