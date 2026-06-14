import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'hp-api.onrender.com' },
      { protocol: 'https', hostname: 'api.potterdb.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'erbylsyrvjtiekstfgzg.supabase.co' }
    ],
  },
}

export default withNextIntl(nextConfig)
