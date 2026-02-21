import { VALIDATION } from '@/constants/jobConstants'

/**
 * Validates name input
 * @param {string} name - Name to validate
 * @returns {{valid: boolean, message?: string}}
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, message: 'Name is required' }
  }
  
  if (name.length > VALIDATION.NAME_MAX_LENGTH) {
    return { valid: false, message: `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters` }
  }
  
  return { valid: true }
}

/**
 * Validates phone number (counts digits only, no format restriction)
 * @param {string} phone - Phone number to validate
 * @returns {{valid: boolean, message?: string, cleaned?: string}}
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) {
    return { valid: false, message: 'Phone number is required' }
  }
  
  // Remove all non-digit characters to count only digits
  const digitsOnly = phone.replace(/\D/g, '')
  
  if (!digitsOnly) {
    return { valid: false, message: 'Phone number must contain at least one digit' }
  }
  
  if (digitsOnly.length < VALIDATION.PHONE_MIN_DIGITS) {
    return { valid: false, message: `Phone number must have at least ${VALIDATION.PHONE_MIN_DIGITS} digits` }
  }
  
  if (digitsOnly.length > VALIDATION.PHONE_MAX_DIGITS) {
    return { valid: false, message: `Phone number must not exceed ${VALIDATION.PHONE_MAX_DIGITS} digits` }
  }
  
  return { valid: true, cleaned: digitsOnly }
}

/**
 * Validates bag count
 * @param {number|string} bagCount - Bag count to validate
 * @returns {{valid: boolean, message?: string}}
 */
export const validateBagCount = (bagCount) => {
  const num = Number(bagCount)
  
  if (isNaN(num) || !Number.isInteger(num)) {
    return { valid: false, message: 'Bag count must be a whole number' }
  }
  
  if (num < VALIDATION.BAG_COUNT_MIN) {
    return { valid: false, message: `Bag count must be at least ${VALIDATION.BAG_COUNT_MIN}` }
  }
  
  if (num > VALIDATION.BAG_COUNT_MAX) {
    return { valid: false, message: `Bag count cannot exceed ${VALIDATION.BAG_COUNT_MAX}` }
  }
  
  return { valid: true }
}

/**
 * Clamps a number between min and max values
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value))
}

/**
 * Clamps bag count to valid range
 * @param {number} bagCount - Bag count to clamp
 * @returns {number}
 */
export const clampBagCount = (bagCount) => {
  return clamp(bagCount, VALIDATION.BAG_COUNT_MIN, VALIDATION.BAG_COUNT_MAX)
}

/**
 * Truncates string to max length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
export const truncateString = (str, maxLength) => {
  if (!str) return ''
  return str.slice(0, maxLength)
}

/**
 * Truncates name to max length
 * @param {string} name - Name to truncate
 * @returns {string}
 */
export const truncateName = (name) => {
  return truncateString(name, VALIDATION.NAME_MAX_LENGTH)
}
