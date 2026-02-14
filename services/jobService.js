import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { JOB_STATUS, PRICE_PER_BAG } from '@/constants/jobConstants'

/**
 * Normalizes GPS coordinates to numbers (SRP: Data Normalization)
 * Ensures GPS coordinates are always numbers, not strings
 */
const normalizeJobData = (jobData) => {
  const normalized = { ...jobData }
  
  // Normalize GPS coordinates if they exist
  if (normalized.gps && typeof normalized.gps === 'object') {
    normalized.gps = {
      lat: normalized.gps.lat != null ? Number(normalized.gps.lat) : null,
      lng: normalized.gps.lng != null ? Number(normalized.gps.lng) : null,
    }
  }
  
  return normalized
}

/**
 * Creates a new job request (SRP: Job Creation)
 */
export const createJob = async (jobData) => {
  try {
    const totalPrice = jobData.bagCount * PRICE_PER_BAG
    const jobRef = await addDoc(collection(db, 'jobs'), {
      ...jobData,
      totalPrice,
      status: JOB_STATUS.PENDING,
      createdAt: serverTimestamp(),
    })
    return jobRef.id
  } catch (error) {
    console.error('Error creating job:', error)
    throw error
  }
}

/**
 * Fetches all pending jobs (SRP: Job Retrieval)
 */
export const getPendingJobs = async () => {
  try {
    const q = query(
      collection(db, 'jobs'),
      where('status', '==', JOB_STATUS.PENDING)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => normalizeJobData({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching pending jobs:', error)
    throw error
  }
}

/**
 * Subscribes to pending jobs in real-time (SRP: Real-time Updates)
 */
export const subscribeToPendingJobs = (callback) => {
  const q = query(
    collection(db, 'jobs'),
    where('status', '==', JOB_STATUS.PENDING)
  )
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map((doc) => normalizeJobData({
      id: doc.id,
      ...doc.data(),
    }))
    callback(jobs)
  })
}

/**
 * Subscribes to collector's accepted jobs in real-time (SRP: My Jobs Updates)
 */
export const subscribeToMyJobs = (collectorId, callback) => {
  const q = query(
    collection(db, 'jobs'),
    where('status', '==', JOB_STATUS.COLLECTING),
    where('collectorId', '==', collectorId)
  )
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map((doc) => normalizeJobData({
      id: doc.id,
      ...doc.data(),
    }))
    callback(jobs)
  })
}

/**
 * Subscribes to collector's completed jobs in real-time (SRP: Completed Jobs Updates)
 */
export const subscribeToCompletedJobs = (collectorId, callback) => {
  const q = query(
    collection(db, 'jobs'),
    where('status', '==', JOB_STATUS.DONE),
    where('collectorId', '==', collectorId)
  )
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map((doc) => normalizeJobData({
      id: doc.id,
      ...doc.data(),
    }))
    // Sort by createdAt descending (newest first)
    jobs.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0
      const aTime = a.createdAt.toMillis ? a.createdAt.toMillis() : a.createdAt
      const bTime = b.createdAt.toMillis ? b.createdAt.toMillis() : b.createdAt
      return bTime - aTime
    })
    callback(jobs)
  })
}

/**
 * Subscribes to all jobs created by a requester in real-time (SRP: Requester Jobs Updates)
 */
export const subscribeToRequesterJobs = (requesterId, callback) => {
  const q = query(
    collection(db, 'jobs'),
    where('requesterId', '==', requesterId)
  )
  return onSnapshot(q, (snapshot) => {
    const jobs = snapshot.docs.map((doc) => normalizeJobData({
      id: doc.id,
      ...doc.data(),
    }))
    callback(jobs)
  })
}

/**
 * Accepts a job with ACID transaction (SRP: Job Acceptance)
 */
export const acceptJob = async (jobId, collectorId) => {
  try {
    await runTransaction(db, async (transaction) => {
      const jobRef = doc(db, 'jobs', jobId)
      const jobSnap = await transaction.get(jobRef)

      if (!jobSnap.exists()) {
        throw new Error('Job does not exist')
      }

      const jobData = jobSnap.data()

      if (jobData.status !== JOB_STATUS.PENDING) {
        throw new Error('Job is no longer available')
      }

      // Update job status
      transaction.update(jobRef, {
        status: JOB_STATUS.COLLECTING,
        collectorId,
      })
    })

    return { success: true }
  } catch (error) {
    console.error('Error accepting job:', error)
    throw error
  }
}

/**
 * Completes a job with ACID transaction (SRP: Job Completion)
 * Dummy payment - no wallet balance checks
 */
export const completeJob = async (jobId, requesterId, collectorId, success = true) => {
  try {
    await runTransaction(db, async (transaction) => {
      const jobRef = doc(db, 'jobs', jobId)
      const jobSnap = await transaction.get(jobRef)

      if (!jobSnap.exists()) {
        throw new Error('Job does not exist')
      }

      const jobData = jobSnap.data()

      if (jobData.status !== JOB_STATUS.COLLECTING) {
        throw new Error('Job cannot be completed')
      }

      if (jobData.collectorId !== collectorId) {
        throw new Error('Unauthorized collector')
      }

      // Update job status - DONE for success, back to PENDING for cancel
      transaction.update(jobRef, {
        status: success ? JOB_STATUS.DONE : JOB_STATUS.PENDING,
        collectorId: success ? collectorId : null,
      })
    })

    return { success: true }
  } catch (error) {
    console.error('Error completing job:', error)
    throw error
  }
}

/**
 * Gets user data (SRP: User Data Retrieval)
 */
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

/**
 * Creates or updates user data (SRP: User Data Management)
 */
export const createOrUpdateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      await updateDoc(userRef, userData)
    } else {
      await setDoc(userRef, {
        ...userData,
      })
    }
  } catch (error) {
    console.error('Error creating/updating user:', error)
    throw error
  }
}
