import { collection, addDoc, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * Validates and normalizes feedback payload. Single responsibility: validate and return normalized payload.
 * @param {{ name?: string, message?: string }} payload
 * @returns {{ name: string | null, message: string }}
 * @throws {Error} If message is empty after trim
 */
export const validateAndNormalizeFeedbackPayload = ({ name, message }) => {
  const msg = typeof message === 'string' ? message.trim() : ''
  if (!msg) {
    throw new Error('Feedback message is required')
  }
  const nameVal = typeof name === 'string' ? name.trim() || null : null
  return { name: nameVal, message: msg }
}

/**
 * Maps one Firestore feedback doc to app shape. Single responsibility: map doc to object.
 * @param {import('firebase/firestore').QueryDocumentSnapshot} doc
 * @returns {{ id: string, name: string | null, message: string, createdAt: object }}
 */
export const mapFeedbackDoc = (doc) => {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name ?? null,
    message: data.message ?? '',
    createdAt: data.createdAt,
  }
}

/**
 * Persists feedback to Firestore. Single responsibility: write to DB. Call validateAndNormalizeFeedbackPayload first.
 * @param {{ name: string | null, message: string }} payload - Normalized payload
 * @returns {Promise<string>} The created document id
 */
export const submitFeedback = async (payload) => {
  try {
    const docRef = await addDoc(collection(db, 'feedback'), {
      ...payload,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error submitting feedback:', error)
    throw error
  }
}

/**
 * Fetches all feedback documents ordered by createdAt descending. Single responsibility: query and return mapped list.
 * @returns {Promise<Array<{ id: string, name: string | null, message: string, createdAt: object }>>}
 */
export const getFeedbackList = async () => {
  try {
    const q = query(
      collection(db, 'feedback'),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(mapFeedbackDoc)
  } catch (error) {
    console.error('Error fetching feedback:', error)
    throw error
  }
}
