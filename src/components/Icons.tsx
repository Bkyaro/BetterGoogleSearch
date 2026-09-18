/** Hand-rolled 24px stroke icons so the bundle ships no icon dependency. */

import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Frame({ children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={1.8}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      {...rest}
    >
      {children}
    </svg>
  )
}

export function IconSearch(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx='11' cy='11' r='7' />
      <path d='m20 20-3.6-3.6' />
    </Frame>
  )
}

export function IconGlobe(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx='12' cy='12' r='9' />
      <path d='M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18' />
    </Frame>
  )
}

export function IconCopy(props: IconProps) {
  return (
    <Frame {...props}>
      <rect x='9' y='9' width='11' height='11' rx='2' />
      <path d='M5 15V6a1 1 0 0 1 1-1h9' />
    </Frame>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <Frame {...props}>
      <path d='m4 12.5 5 5L20 6.5' />
    </Frame>
  )
}

export function IconLaunch(props: IconProps) {
  return (
    <Frame {...props}>
      <path d='M14 4h6v6' />
      <path d='M20 4 11 13' />
      <path d='M18 15v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4' />
    </Frame>
  )
}

export function IconShuffle(props: IconProps) {
  return (
    <Frame {...props}>
      <path d='M4 6h3.5l9 12H20' />
      <path d='M4 18h3.5l2.2-2.9' />
      <path d='m14.4 8.9 2.1-2.9H20' />
      <path d='m17 3 3 3-3 3M17 15l3 3-3 3' />
    </Frame>
  )
}

export function IconSun(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx='12' cy='12' r='4' />
      <path d='M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4' />
    </Frame>
  )
}

export function IconMoon(props: IconProps) {
  return (
    <Frame {...props}>
      <path d='M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z' />
    </Frame>
  )
}

export function IconChevron(props: IconProps) {
  return (
    <Frame {...props}>
      <path d='m6 9 6 6 6-6' />
    </Frame>
  )
}

export function IconAlert(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v6M12 16.5v.5' />
    </Frame>
  )
}

export function IconLayers(props: IconProps) {
  return (
    <Frame {...props}>
      <path d='m12 3 9 5-9 5-9-5 9-5Z' />
      <path d='m3 13 9 5 9-5' />
    </Frame>
  )
}
