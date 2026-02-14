import './globals.css'

export const metadata = {
  title: 'Kampung Sapu - Community Food Waste Utility',
  description: 'Connect waste requesters with collectors',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  )
}
