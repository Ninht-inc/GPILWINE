import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = req.nextUrl.pathname.startsWith('/admin')
    const isAdminLogin = req.nextUrl.pathname === '/admin/login'
    
    if (isAdmin && !isAdminLogin && !token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith('/admin') && req.nextUrl.pathname !== '/admin/login') {
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
