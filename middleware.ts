import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'
import { COOKIE_NAME } from './constants'
import { usePathname } from 'next/navigation'
 
export function middleware(request: NextRequest) {

    const cookie = cookies().get(COOKIE_NAME)
    if(!cookie)return NextResponse.redirect(new URL('/sign-in', request.url))
}

export const config = {
  matcher: '/user/:path*',
}