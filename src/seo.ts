export interface RouteMetadata {
  title: string
  description: string
  path: string
}

export const BASE_TITLE = 'Transmute'
export const SITE_URL = 'https://transmute.sh'
export const DEFAULT_OG_IMAGE = 'https://raw.githubusercontent.com/transmute-app/transmute/refs/heads/main/assets/screenshots/converter.png'

export const HOME_METADATA: RouteMetadata = {
  title: 'Self-Hosted File Converter for Images, Video, Audio & More',
  description:
    'Transmute is a free, open-source, self-hosted file converter. Convert images, video, audio, data, and documents on your own hardware with no file size limits, no watermarks, and full privacy.',
  path: '/',
}

export const DOCS_METADATA: RouteMetadata = {
  title: 'Documentation',
  description:
    'Transmute documentation — learn how to install, configure, and use the self-hosted file converter.',
  path: '/docs',
}

export const CONVERSIONS_METADATA: RouteMetadata = {
  title: 'Supported Conversions',
  description:
    'Browse every file format conversion supported by Transmute — images, video, audio, documents, data, and diagrams.',
  path: '/conversions',
}

export function formatPageTitle(title: string) {
  return title.toLowerCase().includes(BASE_TITLE.toLowerCase())
    ? title
    : `${title} — ${BASE_TITLE}`
}

export function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}