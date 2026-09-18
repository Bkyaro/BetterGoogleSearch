/**
 * Region support tiers, derived from the SerpApi survey:
 * https://serpapi.com/blog/every-google-udm-in-the-world/
 *
 * tier 1 - the 12 base modes (176 entries)
 * tier 2 - tier 1 + udm=9 Product sites (9 territories)
 * tier 3 - tier 1 + 2 + the 11 European travel and local modes (42 entries)
 *
 * The list is curated rather than a verbatim copy of the survey: a few
 * entries the source publishes are deliberately not offered in the picker,
 * so the counts here describe what ships.
 *
 * Codes are ISO 3166-1 alpha-2. Display names are resolved at runtime with
 * Intl.DisplayNames so the data stays locale-neutral.
 */

export type RegionTier = 1 | 2 | 3

const TIER_1: readonly string[] = [
  'ca', 'us', 'mx', 'bz', 'cr', 'cu', 'do', 'sv', 'gt', 'ht', 'hn', 'jm',
  'ni', 'pa', 'pr', 'tt', 'ar', 'bo', 'br', 'cl', 'co', 'ec', 'gy', 'py',
  'pe', 'sr', 'uy', 've', 'ad', 'mc', 'sm', 'ch', 'uk', 'gb', 'va', 'al',
  'by', 'ba', 'md', 'mk', 'ru', 'rs', 'ua', 'bh', 'eg', 'ir', 'iq', 'il',
  'jo', 'kw', 'lb', 'om', 'ps', 'qa', 'sa', 'sy', 'ae', 'ye', 'dz', 'ao',
  'bj', 'bw', 'bf', 'bi', 'cm', 'cv', 'cf', 'td', 'km', 'cg', 'cd', 'dj',
  'gq', 'er', 'et', 'ga', 'gm', 'gh', 'gn', 'gw', 'ci', 'ke', 'ls', 'lr',
  'ly', 'mg', 'mw', 'ml', 'mr', 'mu', 'ma', 'mz', 'na', 'ne', 'ng', 'rw',
  'sn', 'sc', 'sl', 'so', 'za', 'sd', 'sz', 'tz', 'tg', 'tn', 'ug', 'eh',
  'zm', 'zw', 'kz', 'kg', 'tj', 'tm', 'uz', 'af', 'bd', 'bt', 'in', 'mv',
  'np', 'pk', 'lk', 'cn', 'jp', 'mn', 'kp', 'kr', 'bn', 'kh', 'id',
  'la', 'my', 'mm', 'ph', 'sg', 'th', 'tl', 'vn', 'au', 'fj', 'ki', 'mh',
  'fm', 'nr', 'nz', 'pw', 'pg', 'ws', 'sb', 'to', 'tv', 'vu', 'as', 'cx',
  'cc', 'ck', 'fo', 'gi', 'gl', 'gu', 'hk', 'mo', 'an', 'nu', 'nf', 'mp',
  'pn', 'sh', 'sj', 'tk', 'um', 'vi', 'aq', 'bv', 'hm',
]

const TIER_2: readonly string[] = [
  'ai', 'bm', 'io', 'ky', 'fk', 'ms', 'gs', 'tc', 'vg',
]

const TIER_3: readonly string[] = [
  'aw', 'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'fr', 'gf',
  'pf', 'tf', 'de', 'gr', 'gp', 'hu', 'is', 'ie', 'it', 'lv', 'li', 'lt',
  'lu', 'mt', 'mq', 'yt', 'nl', 'nc', 'no', 'pl', 'pt', 're', 'ro', 'pm',
  'sk', 'si', 'es', 'se', 'tr', 'wf',
]

const regionTier: Record<string, RegionTier> = {}
for (const code of TIER_1) regionTier[code] = 1
for (const code of TIER_2) regionTier[code] = 2
for (const code of TIER_3) regionTier[code] = 3

/** Regions the survey explicitly lists, sorted alphabetically. */
export const KNOWN_REGIONS: readonly string[] = Object.keys(regionTier).sort()

/**
 * Tier of a region. The base set is documented as working everywhere, so an
 * unlisted-but-valid code degrades to tier 1 rather than to nothing.
 */
export function tierOf(code: string): RegionTier {
  return regionTier[code.toLowerCase()] ?? 1
}

/**
 * Quick-pick row: deliberately spans all three tiers so the difference
 * between them is visible without opening the dropdown.
 */
export const QUICK_PICK_REGIONS: readonly string[] = [
  'us', 'de', 'jp', 'fr', 'br', 'nl', 'ky', 'pl',
]

/** Region used when nothing else is selected. */
export const DEFAULT_REGION = 'us'
