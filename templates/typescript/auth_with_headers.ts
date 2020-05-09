async function handleRequest(request: Request): Promise<Response> {
  let psk = request.headers.get(PRESHARED_AUTH_HEADER_KEY)
  if (psk === PRESHARED_AUTH_HEADER_VALUE) {
    // Correct preshared header key supplied. Fetching request
    // from origin
    return fetch(request)
  }
  // Incorrect key rejecting request
  return new Response('Sorry, you have supplied an invalid key.', {
    status: 403,
  })
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * @param {string} PRESHARED_AUTH_HEADER_KEY custom header to check for key
 * @param {string} PRESHARED_AUTH_HEADER_VALUE hard coded key value
 */
const PRESHARED_AUTH_HEADER_KEY = 'X-Custom-PSK'
const PRESHARED_AUTH_HEADER_VALUE = 'mypresharedkey'

export {}
