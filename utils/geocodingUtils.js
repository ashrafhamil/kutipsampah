/** Single responsibility: wrap browser geolocation in a Promise. Returns { lat, lng } or rejects. */
export function getCurrentPositionAsync() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }),
      reject
    )
  })
}

/** Single responsibility: fetch city and state from coordinates via Nominatim. Returns { city, state }. */
export async function fetchReverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    )
    const data = await response.json()
    if (data?.address) {
      const city = data.address.city ?? data.address.town ?? data.address.village ?? data.address.municipality ?? data.address.county ?? data.address.state_district ?? null
      const state = data.address.state ?? data.address.region ?? null
      return { city, state }
    }
    return { city: null, state: null }
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return { city: null, state: null }
  }
}
