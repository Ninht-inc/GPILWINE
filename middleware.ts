import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Admin routes that must stay reachable while signed out.
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/admin/accept-invite', '/admin/reset-password', '/admin/forgot-password']

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = req.nextUrl.pathname.startsWith('/admin')

    if (isAdmin && !isPublicAdminPath(req.nextUrl.pathname) && !token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin') && !isPublicAdminPath(req.nextUrl.pathname)) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
