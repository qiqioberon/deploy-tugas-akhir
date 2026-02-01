'use client'

import { ThemeProvider } from 'next-themes'
import { LocaleProvider } from '@/components/locale-provider'

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
    >
      <LocaleProvider>
        {children}
      </LocaleProvider>
    </ThemeProvider>
  )
}
