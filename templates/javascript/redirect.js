async function handleRequest(request) {
  return Response.redirect(someURLToRedirectTo, code)
}
addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Example Input
 * @param {Request} url where to redirect the response
 * @param {number?=301|302} type permanent or temporary redirect
 */
const someURLToRedirectTo = 'https://www.google.com'
const code = 301
