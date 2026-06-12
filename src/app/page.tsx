import { redirect } from 'next/navigation'

// Root "/" redirects to the default locale.
// next-intl middleware normally handles this, but this file
// is required by Next.js as the top-level app/layout.
export default function RootPage() {
  redirect('/fr')
}
