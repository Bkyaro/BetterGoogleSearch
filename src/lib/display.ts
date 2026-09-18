/**
 * Locale-aware formatting that needs no shipped data: region names come
 * from Intl.DisplayNames, so the region list stays a pure list of codes.
 */

const displayNameCache = new Map<string, Intl.DisplayNames>()

function tagFor(locale: string): string {
  return locale === 'zh' ? 'zh-CN' : 'en'
}

export function regionName(code: string, locale: string): string {
  const upper = code.toUpperCase()
  const tag = tagFor(locale)
  try {
    let names = displayNameCache.get(tag)
    if (!names) {
      names = new Intl.DisplayNames([tag], { type: 'region' })
      displayNameCache.set(tag, names)
    }
    const resolved = names.of(upper)
    if (resolved && resolved !== upper) return resolved
  } catch {
    /* Intl.DisplayNames missing: fall through to the raw code. */
  }
  return upper
}

const REGIONAL_OFFSET = 0x1f1e6 - 65

/** Two-letter code to regional-indicator pair, e.g. de -> the German flag. */
export function flagEmoji(code: string): string {
  const upper = code.trim().toUpperCase()
  if (upper.length !== 2) return ''
  const first = upper.charCodeAt(0)
  const second = upper.charCodeAt(1)
  if (first < 65 || first > 90 || second < 65 || second > 90) return ''
  return String.fromCodePoint(REGIONAL_OFFSET + first, REGIONAL_OFFSET + second)
}

export function formatDate(iso: string, locale: string): string {
  const parsed = new Date(iso + 'T00:00:00Z')
  if (Number.isNaN(parsed.getTime())) return iso
  try {
    return new Intl.DateTimeFormat(tagFor(locale), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(parsed)
  } catch {
    return iso
  }
}

export function formatNumber(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(tagFor(locale)).format(value)
  } catch {
    return String(value)
  }
}
