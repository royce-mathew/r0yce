import { NextFetchEvent, NextRequest } from "next/server"
import { getToken } from "@auth/core/jwt"

export default async function middleware(req: NextRequest) {
  // Retrieve the user data from the JWT token
  // @ts-expect-error
  const userData = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? "",
  })
  const isLoggedIn = !!userData

  if (!isLoggedIn) {
    // Redirect to login page if the user is not logged in
    const { nextUrl } = req
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) {
      callbackUrl += nextUrl.search
    }

    // Encode the callback URL to ensure proper redirection
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(
      new URL(`/auth/sign-in?callbackUrl=${encodedCallbackUrl}`, nextUrl.origin)
    )
  }
}

// Don't invoke Middleware on certain paths
export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|$|files|projects).*)",
    // Only invoke the middleware on the following paths
    "/kanjou/:path*",
  ],
}
