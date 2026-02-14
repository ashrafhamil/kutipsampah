'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, signInAnonymouslyAuth } from '@/lib/firebase'
import { createOrUpdateUser } from '@/services/jobService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Set user immediately, don't block on user document creation
        setUser(firebaseUser)
        setLoading(false)
        
        // Create/update user document in background (fire-and-forget)
        createOrUpdateUser(firebaseUser.uid, {
          displayName: `User ${firebaseUser.uid.slice(0, 8)}`,
        }).catch((error) => {
          console.error('Error creating/updating user:', error)
        })
      } else {
        // Sign in anonymously
        try {
          const newUser = await signInAnonymouslyAuth()
          // Set user immediately, don't block on user document creation
          setUser(newUser)
          setLoading(false)
          
          // Create/update user document in background (fire-and-forget)
          createOrUpdateUser(newUser.uid, {
            displayName: `User ${newUser.uid.slice(0, 8)}`,
          }).catch((error) => {
            console.error('Error creating/updating user:', error)
          })
        } catch (error) {
          console.error('Error signing in:', error)
          setLoading(false)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
