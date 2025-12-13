'use client'

import { Suspense } from 'react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  )
}