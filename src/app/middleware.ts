import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith('/dashboard')) {

        const hasSession =
            req.cookies.has('sb-access-token') || req.cookies.has('sb-refresh-token')

        if (!hasSession) {
            const url = req.nextUrl.clone()
            url.pathname = '/login'
            url.searchParams.set('redirectTo', req.nextUrl.pathname)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*']
}
