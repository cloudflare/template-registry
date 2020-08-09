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
  const sigHash = btoa(String.fromCharCode(...new Uint8Array(signature)))
  response.headers.set('signature', sigHash)
  return response
}
async function verifySignature(request) {
  const signature = request.headers.get('signature') || ''
  const key = await importKey(SECRET)

  return await crypto.subtle.verify(
    'HMAC',
    key,
    base64ToUint8Array(signature),
    new TextEncoder().encode(await request.text()),
  )
}
function base64ToUint8Array(base64) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0))
}
