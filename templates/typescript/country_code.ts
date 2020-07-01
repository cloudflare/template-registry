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
async function redirect(request: Request): Promise<Response> {
  // The `cf-ipcountry` header is not supported in the preview
  const country = request.headers.get('cf-ipcountry')
  if (country != null && country in countryMap) {
    const url = countryMap[country]
    return Response.redirect(url)
  } else {
    return await fetch(request)
  }
}
/**
 * A map of the URLs to redirect to
 * @param {Object} countryMap
 */
const countryMap: { [key: string]: string } = {
  US: 'https://example.com/us',
  EU: 'https://eu.example.com/',
}

export {}
