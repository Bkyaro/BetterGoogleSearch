import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { KNOWN_REGIONS, QUICK_PICK_REGIONS } from '../data/regions'
import { regionName, flagEmoji } from '../lib/display'
import { useI18n } from '../i18n/I18nProvider'
import { IconChevron, IconGlobe } from './Icons'

interface RegionPickerProps {
  value: string
  onChange: (code: string) => void
}

export function RegionPicker({ value, onChange }: RegionPickerProps) {
  const { t, locale } = useI18n()
  const [open, setOpen] = useState(false)
  const [term, setTerm] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const options = useMemo(() => {
    const needle = term.trim().toLowerCase()
    if (!needle) return KNOWN_REGIONS as readonly string[]
    return KNOWN_REGIONS.filter((code) => {
      if (code.indexOf(needle) === 0) return true
      return regionName(code, locale).toLowerCase().indexOf(needle) !== -1
    })
  }, [term, locale])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      const root = rootRef.current
      if (root && !root.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  function commit(code: string) {
    onChange(code)
    setOpen(false)
    setTerm('')
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((current) => Math.min(current + 1, options.length - 1))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((current) => Math.max(current - 1, 0))
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const picked = options[active]
      if (picked) commit(picked)
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <div className='relative' ref={rootRef}>
        <button
          type='button'
          className='region-pill'
          aria-haspopup='listbox'
          aria-expanded={open}
          onClick={() => {
            setOpen((current) => !current)
            setTerm('')
            setActive(0)
          }}
        >
          <IconGlobe />
          <span aria-hidden='true'>{flagEmoji(value)}</span>
          <span>{regionName(value, locale)}</span>
          <IconChevron width={14} height={14} />
        </button>

        {open ? (
          <div
            className='drop'
            role='listbox'
            style={{ minWidth: 320, right: 'auto' }}
          >
            <div style={{ padding: '4px 6px 8px' }}>
              <input
                className='input'
                autoFocus
                value={term}
                placeholder={t.regionSearch}
                onChange={(event) => {
                  setTerm(event.target.value)
                  setActive(0)
                }}
                onKeyDown={onKeyDown}
              />
            </div>
            {options.length === 0 ? (
              <p className='drop-empty'>-</p>
            ) : (
              options.map((code, index) => (
                <button
                  key={code}
                  type='button'
                  role='option'
                  aria-selected={code === value}
                  data-active={index === active}
                  className='drop-item'
                  onMouseEnter={() => setActive(index)}
                  onClick={() => commit(code)}
                >
                  <span aria-hidden='true'>{flagEmoji(code)}</span>
                  <span>{regionName(code, locale)}</span>
                  <span className='mono' style={{ marginLeft: 'auto', color: 'var(--text-faint)' }}>
                    {code.toUpperCase()}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      {QUICK_PICK_REGIONS.filter((code) => code !== value).map((code) => (
        <button
          key={code}
          type='button'
          className='region-pill'
          onClick={() => onChange(code)}
        >
          <span aria-hidden='true'>{flagEmoji(code)}</span>
          <span>{regionName(code, locale)}</span>
        </button>
      ))}
    </div>
  )
}
