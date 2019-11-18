async function handleRequest(request) {
  let url = new URL(request.url)
  // Check if incoming hostname is
  // a key in the ORIGINS object
  let target = ORIGINS[url.hostname]
  // If it is, proxy request to that third party origin
  if (target) {
    url.hostname = target
    return fetch(url, request)
  }
  // Otherwise, process request as normal
  return fetch(request)
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * An object with different url's to fetch
 * @param {Object} ORIGINS
 */
const ORIGINS = {
  'starwarsapi.yourdomain.com': 'swapi.co',
  'google.yourdomain.com': 'google.com',
}
