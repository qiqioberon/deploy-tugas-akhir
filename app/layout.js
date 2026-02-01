import './globals.css'
import { ThemeProvider } from 'next-themes'

export const metadata = {
  title: 'TA Personality Demo - Big Five Voice Analysis',
  description: 'Analyze your personality traits from voice using AI. Upload or record 15 seconds of audio to discover your Big Five (OCEAN) personality profile.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
