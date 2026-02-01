'use client'

import { Button } from '@/components/ui/button'
import { useLocale } from '@/components/locale-provider'

export function LanguageToggle() {
  const { locale, setLocale, copy } = useLocale()
  const nextLocale = locale === 'en' ? 'id' : 'en'

  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="Toggle language"
      onClick={() => setLocale(nextLocale)}
      className="min-w-20"
    >
      {locale === 'en' ? 'EN / ID' : 'ID / EN'}
    </Button>
  )
}
