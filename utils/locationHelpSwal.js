import Swal from 'sweetalert2'

/** Links to official browser help for enabling location permission (desktop and mobile). */
const LOCATION_HELP_LINKS = [
  { name: 'Chrome', url: 'https://support.google.com/chrome/answer/114662' },
  { name: 'Safari on iPhone/iPad', url: 'https://support.apple.com/en-my/guide/safari/ibrw7f78f7fe/mac' },
  { name: 'Safari on Mac', url: 'https://support.apple.com/guide/safari/ibrwe2159f50/mac' },
  { name: 'Firefox', url: 'https://support.mozilla.org/en-US/kb/does-firefox-share-my-location-websites' },
  { name: 'Microsoft Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/location-and-privacy-in-microsoft-edge-31b5d154-0b1b-90ef-e389-7c7d4ffe7b04' },
]

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Shows SweetAlert with message and links for enabling location in browsers. */
export function showLocationUnavailableSwal() {
  const linksHtml = LOCATION_HELP_LINKS
    .map(({ name, url }) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary underline">${escapeHtml(name)}</a></li>`)
    .join('')
  Swal.fire({
    icon: 'error',
    title: 'Location unavailable',
    html: `
      <p class="text-left mb-3">Unable to get location. Please allow location access in your browser, then try again.</p>
      <p class="text-left text-sm font-semibold mb-1">How to enable location:</p>
      <ul class="text-left text-sm list-disc list-inside space-y-1 mb-0">${linksHtml}</ul>
    `,
    confirmButtonText: 'OK',
    width: 'min(90vw, 420px)',
  })
}
