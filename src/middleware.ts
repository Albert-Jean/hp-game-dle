import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale: 'fr',
})

export const config = {
  // Skip Next internals, API routes, and static files (fonts, images, etc.)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
