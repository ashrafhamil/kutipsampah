import { JOB_STATUS } from '@/constants/jobConstants'

/**
 * Gets the priority number for a job status (for sorting)
 * Lower number = higher priority in display
 * @param {string} status - Job status
 * @returns {number} Priority number (0 = PENDING, 1 = COLLECTING, 2 = DONE, 3 = unknown)
 */
export const getStatusPriority = (status) => {
  switch (status) {
    case JOB_STATUS.PENDING:
      return 0
    case JOB_STATUS.COLLECTING:
      return 1
    case JOB_STATUS.DONE:
      return 2
    default:
      return 3
  }
}

/**
 * Converts a timestamp to milliseconds
 * Handles both Firestore Timestamp objects and regular Date objects
 * @param {any} timestamp - Timestamp to convert
 * @returns {number|null} Milliseconds since epoch, or null if invalid
 */
export const getTimestampMillis = (timestamp) => {
  if (!timestamp) return null
  
  if (timestamp.toMillis) {
    return timestamp.toMillis()
  }
  
  if (timestamp instanceof Date) {
    return timestamp.getTime()
  }
  
  if (typeof timestamp === 'number') {
    return timestamp
  }
  
  return null
}

/**
 * Compares two timestamps for sorting (newest first)
 * @param {any} timestampA - First timestamp
 * @param {any} timestampB - Second timestamp
 * @returns {number} Comparison result (-1, 0, or 1)
 */
export const compareTimestampsDesc = (timestampA, timestampB) => {
  const timeA = getTimestampMillis(timestampA)
  const timeB = getTimestampMillis(timestampB)
  
  if (timeA === null || timeB === null) return 0
  
  return timeB - timeA
}

/**
 * Filters jobs by status
 * @param {Array} jobs - Array of job objects
 * @param {string|null} status - Status to filter by (null = all jobs)
 * @returns {Array} Filtered array of jobs
 */
export const filterJobsByStatus = (jobs, status) => {
  if (!status) return jobs
  return jobs.filter(job => job.status === status)
}

/**
 * Gets human-readable label for job status
 * @param {string} status - Job status
 * @returns {string} Human-readable label
 */
export const getStatusLabel = (status) => {
  switch (status) {
    case JOB_STATUS.PENDING:
      return 'Pending'
    case JOB_STATUS.COLLECTING:
      return 'Collecting'
    case JOB_STATUS.DONE:
      return 'Done'
    default:
      return status || '—'
  }
}

/**
 * Gets CSS classes for status badge
 * @param {string} status - Job status
 * @returns {string} CSS class string
 */
export const getStatusClass = (status) => {
  switch (status) {
    case JOB_STATUS.PENDING:
      return 'bg-amber-100 text-amber-700'
    case JOB_STATUS.COLLECTING:
      return 'bg-blue-100 text-blue-700'
    case JOB_STATUS.DONE:
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

/**
 * Gets button background color class for active filter state
 * @param {string|null} status - Job status (null for "All" button)
 * @returns {string} CSS class string for active button
 */
export const getFilterButtonActiveClass = (status) => {
  switch (status) {
    case JOB_STATUS.PENDING:
      return 'bg-amber-100 text-amber-700 shadow-md'
    case JOB_STATUS.COLLECTING:
      return 'bg-blue-100 text-blue-700 shadow-md'
    case JOB_STATUS.DONE:
      return 'bg-green-100 text-green-700 shadow-md'
    default:
      return 'bg-primary text-white shadow-md'
  }
}

/**
 * Sorts jobs by status priority first, then by creation date (newest first)
 * @param {Array} jobs - Array of job objects
 * @returns {Array} Sorted array of jobs
 */
export const sortJobsByStatusAndDate = (jobs) => {
  return [...jobs].sort((a, b) => {
    // First, sort by status priority
    const aStatusPriority = getStatusPriority(a.status)
    const bStatusPriority = getStatusPriority(b.status)
    
    if (aStatusPriority !== bStatusPriority) {
      return aStatusPriority - bStatusPriority
    }
    
    // If same status, sort by creation date (newest first)
    return compareTimestampsDesc(a.createdAt, b.createdAt)
  })
}
