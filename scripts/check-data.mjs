// Data integrity checks for the udm table and the URL helpers.
// Run with: npm run check   (Node 22.18+ / 24+ can strip the types.)

import { UDM_MODES, isAvailable, modeById, modeBySlug } from '../src/data/udm.ts'
import { tierOf, KNOWN_REGIONS, QUICK_PICK_REGIONS } from '../src/data/regions.ts'
import { buildSearchUrl, parseSearchUrl, TBM_TO_UDM } from '../src/lib/google.ts'

const failures = []

function eq(label, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (ok === false) failures.push(label + ' (got ' + JSON.stringify(got) + ')')
  console.log((ok ? 'ok   ' : 'FAIL ') + label)
}

const base = 'https://www.google.com/search?q=coffee&udm=14&gl=jp&hl=ja'

eq('the table holds 24 modes', UDM_MODES.length, 24)
eq('mode ids are unique', new Set(UDM_MODES.map((m) => m.id)).size, 24)
eq('mode slugs are unique', new Set(UDM_MODES.map((m) => m.slug)).size, 24)
eq('12 worldwide modes', UDM_MODES.filter((m) => m.tier === 1).length, 12)
eq('1 territory mode', UDM_MODES.filter((m) => m.tier === 2).length, 1)
eq('11 european modes', UDM_MODES.filter((m) => m.tier === 3).length, 11)
eq('227 known regions', KNOWN_REGIONS.length, 227)
eq('every quick pick is a known region', QUICK_PICK_REGIONS.every((c) => KNOWN_REGIONS.includes(c)), true)
eq('quick picks span all three tiers', [...new Set(QUICK_PICK_REGIONS.map(tierOf))].sort(), [1, 2, 3])
eq('us is tier 1', tierOf('us'), 1)
eq('ky resolves to tier 2', tierOf('ky'), 2)
eq('de resolves to tier 3', tierOf('de'), 3)
eq('gb resolves to tier 1', tierOf('gb'), 1)
eq('an unlisted code degrades to tier 1', tierOf('zz'), 1)
eq('12 modes available at tier 1', UDM_MODES.filter((m) => isAvailable(m, 1)).length, 12)
eq('13 modes available at tier 2', UDM_MODES.filter((m) => isAvailable(m, 2)).length, 13)
eq('24 modes available at tier 3', UDM_MODES.filter((m) => isAvailable(m, 3)).length, 24)
eq('lookup by id', modeById(14).slug, 'web')
eq('lookup by slug', modeBySlug('web').id, 14)
eq('an unknown id returns undefined', modeById(999), undefined)
eq('link building', buildSearchUrl({ q: 'coffee', udm: 14, gl: 'jp' }), 'https://www.google.com/search?q=coffee&udm=14&gl=jp')
eq('the query is trimmed', buildSearchUrl({ q: '  coffee  ', udm: 2, gl: 'us' }), 'https://www.google.com/search?q=coffee&udm=2&gl=us')
eq('udm is omitted when undefined', buildSearchUrl({ q: 'x', gl: 'us' }), 'https://www.google.com/search?q=x&gl=us')

const parsed = parseSearchUrl(base)
eq('parses udm', parsed.udm, 14)
eq('parses the query', parsed.q, 'coffee')
eq('reports every parameter', parsed.params.length, 4)
eq('flags unknown parameters', parseSearchUrl('?q=x&foo=bar').params.filter((p) => p.known === false).map((p) => p.key), ['foo'])

const legacy = parseSearchUrl('?q=cats&tbm=isch')
eq('tbm=isch maps to udm=2', legacy.tbmEquivalent, 2)
eq('the mapping table agrees', TBM_TO_UDM[legacy.tbm], legacy.tbmEquivalent)

eq('rejects prose', parseSearchUrl('not a url'), null)
eq('rejects whitespace', parseSearchUrl('   '), null)
eq('accepts a bare query string', parseSearchUrl('?q=x').q, 'x')
eq('accepts a regional google host', parseSearchUrl('https://www.google.co.uk/search?q=x').q, 'x')

if (failures.length > 0) {
  console.error('')
  console.error(failures.length + ' check(s) failed:')
  for (const failure of failures) console.error(' - ' + failure)
  process.exit(1)
}

console.log('')
console.log('all data checks passed')
