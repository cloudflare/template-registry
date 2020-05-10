async function handleRequest(request: Request): Promise<Response> {
  return redirect(request)
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Returns a redirect determined by the country code
 * @param {Request} request
 */
function redirect(request: Request): Response {
  // The `cf-ipcountry` header is not supported in the preview
  const country = request.headers.get('cf-ipcountry')
  const url = countryMap[country]
  return Response.redirect(url)
}
/**
 * A map of the URLs to redirect to
 * @param {Object} countryMap
 */
const countryMap = {
  US: 'https://example.com/us',
  EU: 'https://eu.example.com/',
}

export {}
