/**
 * Rejects browser requests that did not originate from this deployment.
 * Identity still comes from the session; this only narrows the cross-site
 * surface for state changes.
 */
export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin")
  return (
    (origin === null || origin === new URL(request.url).origin) &&
    request.headers.get("sec-fetch-site") !== "cross-site"
  )
}
