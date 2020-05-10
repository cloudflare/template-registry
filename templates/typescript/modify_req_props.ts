async function handleRequest(request: Request): Promise<Response> {
  /**
   * Best practice is to only assign new properties on the request
   * object (i.e. RequestInit props) through either a method or the constructor
   */
  let newRequestInit = {
    // Change method
    method: 'POST',
    // Change body
    body: JSON.stringify({ bar: 'foo' }),
    // Change the redirect mode.
    redirect: 'follow' as RequestRedirect,
    //Change headers, note this method will erase existing headers
    headers: {
      'Content-Type': 'application/json',
    },
    // Change a Cloudflare feature on the outbound response
    cf: { apps: false },
  }
  // Change just the host
  let url = new URL(someUrl)
  url.hostname = someHost
  // Best practice is to always use the original request to construct the new request
  // thereby cloning all the attributes, applying the URL also requires a constructor
  // since once a Request has been constructed, its URL is immutable.
  const newRequest = new Request(
    url.toString(),
    new Request(request, newRequestInit),
  )
  // Set headers using method
  newRequest.headers.set('X-Example', 'bar')
  newRequest.headers.set('Content-Type', 'application/json')
  try {
    return await fetch(newRequest)
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 })
  }
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Example someHost is set up to return raw JSON
 * @param {string} someUrl the URL to send the request to, since we are setting hostname too only path is applied
 * @param {string} someHost the host the request will resolve too
 */
const someHost = 'example.com'
const someUrl = 'https://foo.example.com/api.js'

export {}
