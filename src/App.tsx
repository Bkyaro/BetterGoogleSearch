import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RegionPicker } from './components/RegionPicker'
import {
  IconAlert,
  IconCheck,
  IconCopy,
  IconMoon,
  IconSearch,
  IconShuffle,
  IconSun,
} from './components/Icons'
import { ModeCard } from './components/ModeCard'
import { UrlInspector } from './components/UrlInspector'
import { DEFAULT_REGION, tierOf } from './data/regions'
import {
  MODES_VERIFIED_AT,
  TIER_LABELS,
  UDM_MODES,
  isAvailable,
  type UdmMode,
} from './data/udm'
import { useI18n } from './i18n/I18nProvider'
import { formatDate } from './lib/display'
import { buildSearchUrl } from './lib/google'

type Theme = 'dark' | 'light'
type Filter = 'all' | 'available'

const THEME_KEY = 'better-google-search:theme'

function readHash(): { q: string; gl: string } {
  try {
    const params = new URLSearchParams(window.location.hash.slice(1))
    return {
      q: params.get('q') ?? '',
      gl: params.get('gl') ?? '',
    }
  } catch {
    return { q: '', gl: '' }
  }
}

function readTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fall back to the selection trick below */
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.top = '-1000px'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(area)
    return ok
  } catch {
    return false
  }
}

export default function App() {
  const { t, locale, pick, setLocale } = useI18n()
  const initial = useRef(readHash())
  const [query, setQuery] = useState(initial.current.q)
  const [region, setRegion] = useState(initial.current.gl || DEFAULT_REGION)
  const [filter, setFilter] = useState<Filter>('all')
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [flash, setFlash] = useState<{ key: string; ok: boolean } | null>(null)
  const queryRef = useRef<HTMLInputElement | null>(null)
  const flashTimer = useRef<number | null>(null)

  const tier = tierOf(region)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {
      /* not fatal: the theme just will not persist */
    }
  }, [theme])

  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (region) params.set('gl', region)
    const next = params.toString()
    const base = window.location.pathname + window.location.search
    window.history.replaceState(null, '', next ? base + '#' + next : base)
  }, [query, region])

  useEffect(() => {
    return () => {
      if (flashTimer.current !== null) window.clearTimeout(flashTimer.current)
    }
  }, [])

  const availableCount = useMemo(
    () => UDM_MODES.filter((mode) => isAvailable(mode, tier)).length,
    [tier],
  )

  const visibleModes = useMemo(
    () => UDM_MODES.filter((mode) => (filter === 'all' ? true : isAvailable(mode, tier))),
    [filter, tier],
  )

  const links = useMemo(() => {
    const map = new Map<number, string>()
    for (const mode of UDM_MODES) {
      map.set(mode.id, buildSearchUrl({ q: query, udm: mode.id, gl: region }))
    }
    return map
  }, [query, region])

  const announce = useCallback((key: string, ok: boolean) => {
    setFlash({ key, ok })
    if (flashTimer.current !== null) window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setFlash(null), 1600)
  }, [])

  const copyMode = useCallback(
    async (mode: UdmMode) => {
      const ok = await writeClipboard(links.get(mode.id) ?? '')
      announce('mode:' + mode.id, ok)
    },
    [announce, links],
  )

  const copyAll = useCallback(async () => {
    const text = UDM_MODES.filter((mode) => isAvailable(mode, tier))
      .map((mode) => 'udm=' + mode.id + '  ' + pick(mode.name) + '  ' + (links.get(mode.id) ?? ''))
      .join('\n')
    announce('all', await writeClipboard(text))
  }, [announce, links, pick, tier])

  const surprise = useCallback(() => {
    const pool = UDM_MODES.filter((mode) => isAvailable(mode, tier))
    const picked = pool[Math.floor(Math.random() * pool.length)]
    if (picked) setQuery(picked.demo)
  }, [tier])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      const typing =
        !!target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if (event.key === '/' && !typing) {
        event.preventDefault()
        queryRef.current?.focus()
        return
      }
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'r') {
        surprise()
        return
      }
      const digit = Number.parseInt(event.key, 10)
      if (Number.isNaN(digit) === false && digit >= 1 && digit <= 9) {
        const launchable = visibleModes.filter((mode) => isAvailable(mode, tier))
        const mode = launchable[digit - 1]
        if (mode) {
          const href = links.get(mode.id)
          if (href) window.open(href, '_blank', 'noopener,noreferrer')
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [links, surprise, tier, visibleModes])

  const tierNote = tier === 1 ? t.tierNote1 : tier === 2 ? t.tierNote2 : t.tierNote3

  return (
    <div className='shell' style={{ paddingTop: 26, paddingBottom: 40 }}>
      <header className='flex flex-wrap items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <svg width='34' height='34' viewBox='0 0 34 34' aria-hidden='true'>
            <circle cx='17' cy='17' r='15' fill='none' stroke='var(--line-2)' />
            <circle cx='17' cy='17' r='9' fill='none' stroke='var(--brand)' strokeDasharray='3 4' />
            <circle cx='17' cy='17' r='3.4' fill='var(--brand)' />
          </svg>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {t.appName}
            </p>
            <p className='section-sub' style={{ fontSize: 12.5 }}>
              {t.tagline}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <span className='chip mono'>{UDM_MODES.length} udm</span>
          <div className='seg seg-sm' role='group' aria-label={t.langGroup}>
            <button
              type='button'
              aria-pressed={locale === 'zh'}
              onClick={() => setLocale('zh')}
            >
              中文
            </button>
            <button
              type='button'
              aria-pressed={locale === 'en'}
              onClick={() => setLocale('en')}
            >
              English
            </button>
          </div>
          <button
            type='button'
            className='btn'
            aria-label={t.themeToggle}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </header>

      <section className='panel panel-raised' style={{ padding: 16, marginTop: 22 }}>
        <div className='flex flex-wrap items-end gap-2'>
          <div style={{ flex: '1 1 300px' }}>
            <label
              htmlFor='udm-query'
              className='section-sub'
              style={{ display: 'block', marginBottom: 6, fontSize: 12.5 }}
            >
              {t.queryLabel}
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-faint)' }}
              >
                <IconSearch width={16} height={16} />
              </span>
              <input
                id='udm-query'
                ref={queryRef}
                className='input'
                style={{ paddingLeft: 40 }}
                value={query}
                placeholder={t.queryPlaceholder}
                autoComplete='off'
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          <button type='button' className='btn' onClick={surprise}>
            <IconShuffle />
            <span>{t.random}</span>
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          <p className='section-sub' style={{ marginBottom: 8, fontSize: 12.5 }}>
            {t.regionLabel} - {pick(TIER_LABELS[tier])} - {tierNote}
          </p>
          <RegionPicker value={region} onChange={setRegion} />
        </div>
      </section>

      <section style={{ marginTop: 30 }}>
        <div className='section-head'>
          <div>
            <h2 className='section-title'>{t.modesHeading}</h2>
            <p className='section-sub'>
              {t.modesSubheading} {availableCount}/{UDM_MODES.length} {t.availableHere}
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <div className='seg'>
              <button
                type='button'
                aria-pressed={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                {t.filterAll}
              </button>
              <button
                type='button'
                aria-pressed={filter === 'available'}
                onClick={() => setFilter('available')}
              >
                {t.filterAvailable}
              </button>
            </div>
            <button type='button' className='btn' onClick={copyAll}>
              {flash && flash.key === 'all' ? (
                flash.ok ? <IconCheck /> : <IconAlert />
              ) : (
                <IconCopy />
              )}
              <span>{flash && flash.key === 'all' && flash.ok ? t.copied : t.copyAll}</span>
            </button>
          </div>
        </div>

        {availableCount < UDM_MODES.length ? (
          <p className='region-notice'>
            <IconAlert width={15} height={15} />
            <span>{t.regionNotice}</span>
          </p>
        ) : null}

        <div className='mode-grid'>
          {visibleModes.map((mode, index) => (
            <ModeCard
              key={mode.slug}
              mode={mode}
              index={index}
              available={isAvailable(mode, tier)}
              href={links.get(mode.id) ?? '#'}
              copied={!!flash && flash.key === 'mode:' + mode.id && flash.ok}
              onCopy={copyMode}
              onUseDemo={setQuery}
            />
          ))}
        </div>

        <p className='section-sub' style={{ marginTop: 14 }}>{t.keyboardHint}</p>
      </section>

      <div style={{ marginTop: 30 }}>
        <UrlInspector />
      </div>

      <footer className='site-footer'>
        <p style={{ margin: '0 0 6px' }}>{t.footerData}</p>
        <p style={{ margin: '0 0 6px' }}>{t.footerBuilt}</p>
        <p style={{ margin: 0 }}>
          {t.footerVerified} {formatDate(MODES_VERIFIED_AT, locale)} - {t.footerSource}: 
          <a
            href='https://serpapi.com/blog/every-google-udm-in-the-world/'
            target='_blank'
            rel='noopener noreferrer'
          >
            SerpApi - Every Google udm in the world
          </a>
        </p>
      </footer>
    </div>
  )
}
