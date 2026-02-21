import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const VISITOR_COUNT_REF = doc(db, 'stats', 'visitorCount')

const VISITOR_COUNT_CACHE_KEY = 'kutip_sampah_visitor_count'
const VISITOR_COUNT_CACHE_AT_KEY = 'kutip_sampah_visitor_count_at'
const VISITOR_COUNT_CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes
const VISITED_THIS_SESSION_KEY = 'kutip_sampah_visited'

/** Single responsibility: parse total from a Firestore visitorCount snapshot. Returns 0 if missing or invalid. */
function parseTotalFromSnapshot(snapshot) {
  if (!snapshot?.exists()) return 0
  const data = snapshot.data()
  return typeof data?.total === 'number' ? data.total : 0
}

/**
 * Single responsibility: answer whether the user has already been counted this session (sessionStorage).
 * @returns {boolean}
 */
export function hasVisitedThisSession() {
  try {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(VISITED_THIS_SESSION_KEY) != null
  } catch (_) {
    return false
  }
}

/**
 * Single responsibility: mark that we have counted this session (sessionStorage). No-op on failure.
 */
export function markVisitedThisSession() {
  try {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(VISITED_THIS_SESSION_KEY, '1')
  } catch (_) {
    // no-op
  }
}

/**
 * Read cached visitor count from sessionStorage. Returns the count if present and within TTL, else null.
 * @returns {number | null}
 */
export function getCachedVisitorCount() {
  try {
    if (typeof window === 'undefined') return null
    const raw = sessionStorage.getItem(VISITOR_COUNT_CACHE_KEY)
    const rawAt = sessionStorage.getItem(VISITOR_COUNT_CACHE_AT_KEY)
    const count = raw != null ? parseInt(raw, 10) : NaN
    const cachedAt = rawAt != null ? parseInt(rawAt, 10) : NaN
    if (Number.isNaN(count) || Number.isNaN(cachedAt) || count < 0) return null
    if (Date.now() - cachedAt > VISITOR_COUNT_CACHE_TTL_MS) return null
    return count
  } catch (_) {
    return null
  }
}

/**
 * Write visitor count and current timestamp to sessionStorage. No-op if sessionStorage fails.
 * @param {number} count
 */
export function setCachedVisitorCount(count) {
  try {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(VISITOR_COUNT_CACHE_KEY, String(count))
    sessionStorage.setItem(VISITOR_COUNT_CACHE_AT_KEY, String(Date.now()))
  } catch (_) {
    // no-op
  }
}

/**
 * Increment the main-page visitor count by 1. If the document does not exist, create it with total: 1.
 * Does not throw; logs errors so the main page is not blocked.
 * @returns {Promise<number | undefined>} The new total after increment, or undefined on error (so UI can show loading/fallback).
 */
export async function incrementVisitorCount() {
  try {
    const snapshot = await getDoc(VISITOR_COUNT_REF)
    if (!snapshot.exists()) {
      await setDoc(VISITOR_COUNT_REF, { total: 1 })
      return 1
    }
    await updateDoc(VISITOR_COUNT_REF, { total: increment(1) })
    const after = await getDoc(VISITOR_COUNT_REF)
    const total = parseTotalFromSnapshot(after)
    return total || undefined
  } catch (error) {
    console.error('Visitor count increment error:', error)
    return undefined
  }
}

/**
 * Get the current visitor count. Returns 0 if the document does not exist or on error.
 * @returns {Promise<number>}
 */
export async function getVisitorCount() {
  try {
    const snapshot = await getDoc(VISITOR_COUNT_REF)
    return parseTotalFromSnapshot(snapshot)
  } catch (error) {
    console.error('Visitor count get error:', error)
    return 0
  }
}

/**
 * Single responsibility: sync visitor count (increment if first visit this session, else fetch) and report via callback.
 * No-op when not in browser. Call with a callback that updates UI/cache (e.g. set state + set cache).
 * @param {(count: number) => void} onFreshCount - called with the fresh count when available
 */
export async function syncVisitorCount(onFreshCount) {
  if (typeof window === 'undefined') return
  try {
    if (!hasVisitedThisSession()) {
      const newTotal = await incrementVisitorCount()
      if (newTotal != null && onFreshCount) onFreshCount(newTotal)
      markVisitedThisSession()
      return
    }
  } catch (_) {
    const newTotal = await incrementVisitorCount()
    if (newTotal != null && onFreshCount) onFreshCount(newTotal)
    return
  }
  const n = await getVisitorCount()
  if (onFreshCount) onFreshCount(n)
}
