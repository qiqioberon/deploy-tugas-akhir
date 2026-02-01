'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getTranslations } from '@/lib/translations'

const LocaleContext = createContext({
  locale: 'en',
  setLocale: () => {},
  copy: getTranslations('en')
})

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState('en')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('ta_locale') : null
    if (stored === 'en' || stored === 'id') {
      setLocaleState(stored)
      document.documentElement.lang = stored
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    localStorage.setItem('ta_locale', locale)
  }, [locale])

  const value = useMemo(() => ({
    locale,
    setLocale: setLocaleState,
    copy: getTranslations(locale)
  }), [locale])

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
