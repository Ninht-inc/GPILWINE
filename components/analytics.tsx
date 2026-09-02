'use client'

import Script from 'next/script'
import { useSiteSettings } from '@/components/site-settings-provider'

/** Google Analytics 4. Loads only when a G-XXXX measurement ID is set in /admin/settings. */
export function Analytics() {
  const { ga_measurement_id } = useSiteSettings()
  const id = (ga_measurement_id || '').trim()
  if (!/^G-[A-Z0-9]+$/i.test(id)) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  )
}
