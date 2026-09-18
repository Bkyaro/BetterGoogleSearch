import { useMemo, useState } from 'react'
import { modeById } from '../data/udm'
import { useI18n } from '../i18n/I18nProvider'
import { TBM_TO_UDM, parseSearchUrl, type KnownParam } from '../lib/google'
import { IconAlert, IconSearch } from './Icons'

const EXAMPLE = 'https://www.google.com/search?q=coffee&udm=14&gl=jp&hl=ja'

export function UrlInspector() {
  const { t, pick } = useI18n()
  const [raw, setRaw] = useState('')
  const [showExample, setShowExample] = useState(false)

  const value = showExample ? EXAMPLE : raw
  const parsed = useMemo(() => (value.trim() ? parseSearchUrl(value) : null), [value])
  const invalid = value.trim().length > 0 && parsed === null

  return (
    <section className='panel' style={{ padding: 18 }} id='inspector'>
      <div className='section-head'>
        <div>
          <h2 className='section-title'>{t.inspectorTitle}</h2>
          <p className='section-sub'>{t.inspectorSubtitle}</p>
        </div>
        <button
          type='button'
          className='btn btn-ghost'
          onClick={() => {
            setShowExample((current) => !current)
            setRaw('')
          }}
        >
          <IconSearch width={14} height={14} />
          <span>{t.inspectorExample}</span>
        </button>
      </div>

      <input
        className='input mono'
        value={value}
        placeholder={t.inspectorPlaceholder}
        onChange={(event) => {
          setShowExample(false)
          setRaw(event.target.value)
        }}
      />

      {invalid ? (
        <p
          className='flex items-center gap-2' 
          style={{ marginTop: 14, color: 'var(--danger)', fontSize: 13 }}
        >
          <IconAlert width={15} height={15} />
          <span>{t.inspectorInvalid}</span>
        </p>
      ) : null}

      {parsed ? (
        <div style={{ marginTop: 14 }}>
          <p className='section-sub mono' style={{ wordBreak: 'break-all' }}>
            {parsed.params.length} params - {parsed.host}
          </p>
          {parsed.params.map((param) => {
            const mode = param.key === 'udm' ? modeById(Number.parseInt(param.value, 10)) : undefined
            const tbmed = param.key === 'tbm' ? TBM_TO_UDM[param.value] : undefined
            const doc = param.known ? t.paramDocs[param.key as KnownParam] : t.inspectorUnknown
            return (
              <div className='param-row' key={param.key}>
                <span className='param-key' data-known={param.known}>
                  {param.key}
                </span>
                <span className='param-value'>{param.value}</span>
                <span className='param-doc'>
                  {doc}
                  {mode ? ' - ' + pick(mode.name) : null}
                  {param.key === 'udm' && !mode ? ' - ' + t.inspectorUdmUnknown : null}
                  {tbmed ? ' - ' + t.inspectorTbmNote + ' udm=' + tbmed : null}
                </span>
              </div>
            )
          })}
        </div>
      ) : null}

      {!value.trim() ? (
        <p className='section-sub' style={{ marginTop: 14 }}>
          {t.inspectorEmpty}
        </p>
      ) : null}
    </section>
  )
}
