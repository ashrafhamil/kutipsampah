import './globals.css'
import LayoutWithFeedback from '@/components/LayoutWithFeedback'

export const metadata = {
  title: 'Kome Buang Kita Kutip - Community Waste Utility',
  description: 'Connect waste requesters with collectors',
  icons: {
    icon: '/icon',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ms">
      <body>
        <LayoutWithFeedback>{children}</LayoutWithFeedback>
      </body>
    </html>
  )
}
