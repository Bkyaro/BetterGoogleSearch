import type { UdmMode } from '../data/udm'
import { CATEGORY_LABELS, TIER_LABELS } from '../data/udm'
import { useI18n } from '../i18n/I18nProvider'
import { IconCheck, IconCopy, IconLaunch } from './Icons'

interface ModeCardProps {
  mode: UdmMode
  index: number
  available: boolean
  href: string
  copied: boolean
  onCopy: (mode: UdmMode) => void
  onUseDemo: (query: string) => void
}

export function ModeCard({
  mode,
  index,
  available,
  href,
  copied,
  onCopy,
  onUseDemo,
}: ModeCardProps) {
  const { t, pick } = useI18n()

  return (
    <article
      className='mode-card'
      data-category={mode.category}
      data-available={available}
      style={{ animationDelay: Math.min(index, 16) * 26 + 'ms' }}
    >
      <header className='mode-card__top'>
        <span className='mode-card__id'>udm={mode.id}</span>
        <span className='chip chip-cat'>{pick(CATEGORY_LABELS[mode.category])}</span>
      </header>

      <h3 className='mode-card__name'>{pick(mode.name)}</h3>
      <p className='mode-card__blurb'>{pick(mode.blurb)}</p>

      <div className='mode-card__meta'>
        {mode.tbm ? <span className='chip'>{t.tbmLabel}={mode.tbm}</span> : null}
        {mode.tier > 1 ? <span className='chip'>{pick(TIER_LABELS[mode.tier])}</span> : null}
        {available ? null : (
          <span className='chip' title={t.unavailableHint}>
            {t.unavailable}
          </span>
        )}
      </div>

      <div className='mode-card__actions'>
        <a
          className={available ? 'btn btn-primary' : 'btn'}
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          title={available ? t.launch : t.unavailableHint}
        >
          <IconLaunch />
          <span>{available ? t.launch : t.tryAnyway}</span>
        </a>

        <button type='button' className='btn' onClick={() => onCopy(mode)}>
          {copied ? <IconCheck /> : <IconCopy />}
          <span>{copied ? t.copied : t.copyLink}</span>
        </button>
      </div>

      {available ? null : <p className='mode-card__hint'>{t.mayNotApply}</p>}

      <button
        type='button'
        className='mode-card__demo'
        onClick={() => onUseDemo(mode.demo)}
        title={mode.demo}
      >
        {t.demoLabel}: {mode.demo}
      </button>
    </article>
  )
}
