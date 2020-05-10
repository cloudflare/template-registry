async function handleRequest(request: Request): Promise<Response> {
  /**
   * Response properties are immutable. To change them, construct a new
   * Response, passing modified status or statusText in the ResponseInit
   * object.
   * Response Headers can be modified through the headers `set` method.
   */
  let originalResponse = await fetch(request)
  // Change status and statusText, but preserve body and headers
  let response = new Response(originalResponse.body, {
    status: 500,
    statusText: 'some message',
    headers: originalResponse.headers,
  })
  // Change response body by adding the foo prop
  let originalBody = await originalResponse.json()
  let body = JSON.stringify({ foo: 'bar', ...originalBody })
  response = new Response(body, response)
  // Add a header using set method
  response.headers.set('foo', 'bar')
  // Set destination header to the value of the source header
  if (response.headers.has(headerNameSrc)) {
    response.headers.set(headerNameDst, response.headers.get(headerNameSrc))
    console.log(
      `Response header "${headerNameDst}" was set to "${response.headers.get(
        headerNameDst,
      )}"`,
    )
  }
  return response
}
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * @param {string} headerNameSrc the header to get the new value from
 * @param {string} headerNameDst the header to set based off of value in src
 */
const headerNameSrc = 'foo' //'Orig-Header'
const headerNameDst = 'Last-Modified'

export {}
