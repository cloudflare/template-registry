async function handleRequest(request) {
  // Make the headers mutable by re-constructing the Request.
  request = new Request(request)
  request.headers.set('x-my-header', 'custom value')
  const URL = 'https://workers-tooling.cf/demos/static/html'
  // URL is set up to respond with dummy HTML, remove to send requests to your own origin
  let response = await fetch(URL, request)
  // Make the headers mutable by re-constructing the Response.
  response = new Response(response.body, response)
  response.headers.set('x-my-header', 'custom value')
  return response
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

export {}
