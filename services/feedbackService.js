import { collection, addDoc, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { formatTimestampForDisplay } from '@/utils/jobUtils'

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

/**
 * Serializes a feedback list for server-to-client (JSON-safe createdAt + preformatted date string). Single responsibility: serialize for SSR/hydration.
 * @param {Array<{ id: string, name: string | null, message: string, createdAt: object }>} rawItems
 * @returns {Array<{ id: string, name: string | null, message: string, createdAt: number|null, createdAtDisplay: string }>}
 */
export const serializeFeedbackListForClient = (rawItems) => {
  return rawItems.map((item) => ({
    ...item,
    createdAt: item.createdAt?.toMillis?.() ?? item.createdAt ?? null,
    createdAtDisplay: formatTimestampForDisplay(item.createdAt),
  }))
}

/**
 * Returns the date display string for a feedback item (preformatted or computed). Single responsibility: one place for "how to show item date".
 * @param {{ createdAt?: unknown, createdAtDisplay?: string }} item
 * @returns {string}
 */
export const getFeedbackItemDateDisplay = (item) => {
  return item.createdAtDisplay ?? formatTimestampForDisplay(item.createdAt)
}
