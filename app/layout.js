import './globals.css'

export const metadata = {
  title: 'Kutip Sampah - Community Food Waste Utility',
  description: 'Connect waste requesters with collectors',
  icons: {
    icon: '/icon',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body>{children}</body>
    </html>
  )
}
