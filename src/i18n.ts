import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'
import fr from '../messages/fr.json'
import en from '../messages/en.json'

export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]

const messagesMap = { fr, en }

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale

  const locale = (requested && locales.includes(requested as Locale))
    ? (requested as Locale)
    : null

  if (!locale) notFound()

  return {
    locale,
    messages: messagesMap[locale],
  }
})