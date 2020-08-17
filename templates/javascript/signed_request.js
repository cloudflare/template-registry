/**
 * GET -> GET -> reply with an HTTP response header set to the signature for the text provided as a query string
 * POST -> check the validity of base64 signature provided as an HTTP header for message in the HTTP body
 */
const SECRET = 'SECRET_KEY'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'GET') {
    const url = new URL(request.url)
    const msg = url.searchParams.get('msg') || ''
    const signature = await signResponse(msg, SECRET)
    let response = new Response(msg)
    response.headers.set('signature', signature)

    return response
  } else if (request.method === 'POST') {
    const message = await request.text()
    const signature = request.headers.get('signature') || ''
    const isSigValid = await verifySignature(message, signature, SECRET)

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

async function signResponse(message, secret) {
  const key = await importKey(secret)
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(message),
  )

  // Convert ArrayBuffer to Base64
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

async function verifySignature(message, signature, secret) {
  const key = await importKey(secret)

  // Convert Base64 to Uint8Array
  const sigBuf = Uint8Array.from(atob(signature), c => c.charCodeAt(0))

  return await crypto.subtle.verify(
    'HMAC',
    key,
    sigBuf,
    new TextEncoder().encode(message),
  )
}
