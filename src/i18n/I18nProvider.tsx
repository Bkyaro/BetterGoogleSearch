/**
 * Locale state for the whole app: stored in localStorage, mirrored onto the
 * html lang attribute, and never destructive to the URL.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Localized } from '../data/udm'
import { dictionaries, type Dictionary, type Locale } from './dictionary'

const STORAGE_KEY = 'better-google-search:locale'

interface I18nValue {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
  pick: (value: Localized) => string
}

const I18nContext = createContext<I18nValue | null>(null)

function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  } catch {
    /* storage can be blocked, which is not a reason to crash */
  }
  return null
}

export function detectLocale(): Locale {
  const stored = readStoredLocale()
  if (stored) return stored
  try {
    const languages: readonly string[] = navigator.languages ?? [navigator.language]
    for (const tag of languages) {
      if (tag.toLowerCase().indexOf('zh') === 0) return 'zh'
    }
  } catch {
    /* no navigator: fall through to English */
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    document.title = dictionaries[locale].appName + ' - ' + dictionaries[locale].tagline
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore: the choice simply will not survive a reload */
    }
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const value = useMemo<I18nValue>(() => {
    const t = dictionaries[locale]
    return {
      locale,
      t,
      setLocale,
      pick: (localized) => localized[locale],
    }
  }, [locale, setLocale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
