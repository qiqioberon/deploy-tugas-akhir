'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'

  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={handleToggle}
      disabled={!mounted}
      className="rounded-full"
    >
      <Sun className={`w-4 h-4 ${isDark ? 'hidden' : 'block'}`} />
      <Moon className={`w-4 h-4 ${isDark ? 'block' : 'hidden'}`} />
    </Button>
  )
}
