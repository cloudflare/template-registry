/**
 * sets up routes and redirects them to a location based on a map
 * @param {Request} request
 */
async function handleRequest(request) {
  let requestURL = new URL(request.url)
  let path = requestURL.pathname.split('/redirect')[1]
  let location = redirectMap.get(path)
  if (location) {
    return Response.redirect(location, 301)
  }
  // If in map, return the original request
  return fetch(request)
}
addEventListener('fetch', async event => {
  event.respondWith(handleRequest(event.request))
})
/**
 *  Example Input
 * @param {Map<string, string>} redirectMap
 *  */
const externalHostname = 'workers-tooling.cf'
const redirectMap = new Map([
  ['/bulk1', 'https://' + externalHostname + '/redirect2'],
  ['/bulk2', 'https://' + externalHostname + '/redirect3'],
  ['/bulk3', 'https://' + externalHostname + '/redirect4'],
  ['/bulk4', 'https://google.com'],
])
