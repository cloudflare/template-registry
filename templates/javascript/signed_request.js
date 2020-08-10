/**
 * GET  ->  provides base64 signature of responseBody as HTTP Header
 * POST ->  checks base64 signature provided as HTTP Header for the request text
 */
const SECRET = 'SECRET_KEY'
const responseBody = 'Hello worker!'
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
async function handleRequest(request) {
  if (request.method === 'GET') {
    return await signResponse(responseBody, new Response(responseBody))
  } else if (request.method === 'POST') {
    const isSigValid = await verifySignature(request)
    return isSigValid
      ? new Response('Valid signature!')
      : new Response('Invalid signature!', { status: 400 })
  } else {
    return new Response('Method not supported')
  }
}
async function importKey(secret) {
  return await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}
async function signResponse(responseBody, response) {
  const key = await importKey(SECRET)
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(responseBody),
  )
  // Convert Uint8Array to Base64
  const sigHash = btoa(String.fromCharCode(...new Uint8Array(signature)))
  response.headers.set('signature', sigHash)
  return response
}
async function verifySignature(request) {
  const signature = request.headers.get('signature') || ''
  const key = await importKey(SECRET)
  // Convert Base64 to Uint8Array
  const sigBuf = Uint8Array.from(atob(signature), c => c.charCodeAt(0))
  return await crypto.subtle.verify(
    'HMAC',
    key,
    sigBuf,
    new TextEncoder().encode(await request.text()),
  )
}
