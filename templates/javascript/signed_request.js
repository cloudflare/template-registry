// NOTE Requires ESM through webpack project type
const crypto = require('crypto')
const SECRET = 'SECRET_KEY'
async function handleRequest(request) {
  let signed = await checkSignature(request)
  if (signed) {
    let responseBody = 'Hello worker!'
    return await signResponse(responseBody, new Response(responseBody))
  } else {
    return new Response('Request not signed', { status: 400 })
  }
}
addEventListener('fetch', event => {
  console.log(createHexSignature('asd'))
  event.respondWith(handleRequest(event.request))
})
async function createHexSignature(requestBody) {
  let hmac = crypto.createHmac('sha256', SECRET)
  hmac.update(requestBody)
  return hmac.digest('hex')
}
async function checkSignature(request) {
  // hash request with secret key
  let expectedSignature = await createHexSignature(await request.text())
  let actualSignature = await request.headers.get('signature')
  // check that hash matches signature
  return expectedSignature === actualSignature
}
async function signResponse(responseBody, response) {
  // create signature
  const signature = await createHexSignature(responseBody)
  response.headers.set('signature', signature)
  //add header with signature
  return response
}
