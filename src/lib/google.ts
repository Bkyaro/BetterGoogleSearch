/**
 * Everything that knows how a Google search URL is shaped.
 *
 * The launcher only ever builds links - it never fetches or embeds a SERP,
 * which is why this stays a completely static site.
 */

export const GOOGLE_ORIGIN = 'https://www.google.com'

export interface SearchTarget {
  q: string
  udm?: number
  gl?: string
  hl?: string
}

export function buildSearchUrl(target: SearchTarget): string {
  const params = new URLSearchParams()
  const q = target.q.trim()
  if (q) params.set('q', q)
  if (target.udm !== undefined) params.set('udm', String(target.udm))
  if (target.gl) params.set('gl', target.gl)
  if (target.hl) params.set('hl', target.hl)
  return GOOGLE_ORIGIN + '/search?' + params.toString()
}

/** Legacy tbm values and the udm value that replaced them. */
export const TBM_TO_UDM: Record<string, number> = {
  isch: 2,
  vid: 7,
  nws: 12,
  shop: 28,
  bks: 36,
}

/** Parameters the inspector explains; anything else is listed verbatim. */
export const KNOWN_PARAMS = [
  'q',
  'udm',
  'tbm',
  'gl',
  'hl',
  'num',
  'start',
  'tbs',
  'safe',
  'filter',
  'pws',
  'cr',
  'lr',
  'uule',
] as const

export type KnownParam = (typeof KNOWN_PARAMS)[number]

export interface ParsedParam {
  key: string
  value: string
  known: boolean
}

export interface ParsedSearchUrl {
  href: string
  host: string
  q: string
  params: ParsedParam[]
  udm: number | null
  /** set when tbm= was used, carrying the modern equivalent */
  tbm: string | null
  tbmEquivalent: number | null
}

const SCHEME = '://'

function toUrl(input: string): URL | null {
  const raw = input.trim()
  if (!raw) return null
  try {
    if (raw.indexOf(SCHEME) > 0) return new URL(raw)
    const query = raw.charAt(0) === '?' ? raw.slice(1) : raw
    if (query.indexOf('=') === -1) return null
    return new URL(GOOGLE_ORIGIN + '/search?' + query)
  } catch {
    return null
  }
}

/** Accepts a full URL or a bare query string such as ?q=cats&udm=2. */
export function parseSearchUrl(input: string): ParsedSearchUrl | null {
  const url = toUrl(input)
  if (!url) return null
  const known = new Set<string>(KNOWN_PARAMS)
  const params: ParsedParam[] = []
  let q = ''
  let udm: number | null = null
  let tbm: string | null = null
  url.searchParams.forEach((value, key) => {
    params.push({ key, value, known: known.has(key) })
    if (key === 'q') q = value
    if (key === 'udm') {
      const parsed = Number.parseInt(value, 10)
      udm = Number.isFinite(parsed) ? parsed : null
    }
    if (key === 'tbm') tbm = value
  })
  return {
    href: url.toString(),
    host: url.host,
    q,
    params,
    udm,
    tbm,
    tbmEquivalent: tbm && tbm in TBM_TO_UDM ? TBM_TO_UDM[tbm] : null,
  }
}

export function isGoogleHost(host: string): boolean {
  const parts = host.toLowerCase().split('.')
  if (parts.length < 2) return false
  return parts[parts.length - 2] === 'google'
}
