import { createI18nMiddleware } from 'next-international/middleware'
import { NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware({
    locales: ['en', 'fr'],
    defaultLocale: 'en',
})

export function middleware(request: NextRequest) {
    const locale = request.nextUrl.pathname.split('/')[1]
    console.log('Middleware detected locale:', locale)
    return I18nMiddleware(request)
}

export const config = {
    matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
}
