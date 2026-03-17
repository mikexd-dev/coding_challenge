import './globals.css'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'Live Session Challenge',
  description: 'Candidate Decision System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('font-sans', inter.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
