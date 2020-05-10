async function handleRequest(request: Request): Promise<Response> {
  let reqBody = await readRequestBody(request)
  let retBody = `The request body sent in was ${reqBody}`
  return new Response(retBody)
}
addEventListener('fetch', event => {
  const { request } = event
  const { url } = request
  if (url.includes('form')) {
    return event.respondWith(rawHtmlResponse(someForm))
  }
  if (request.method === 'POST') {
    return event.respondWith(handleRequest(request))
  } else if (request.method === 'GET') {
    return event.respondWith(new Response(`The request was a GET`))
  }
})
/**
 * rawHtmlResponse delievers a response with HTML inputted directly
 * into the worker script
 * @param {string} html
 */
function rawHtmlResponse(html: string): Response {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  }
  return new Response(html, init)
}
/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request: Request): Promise<string> {
  const { headers } = request
  const contentType = headers.get('content-type')
  if (contentType.includes('application/json')) {
    return JSON.stringify(await request.json())
  } else if (contentType.includes('application/text')) {
    return await request.text()
  } else if (contentType.includes('text/html')) {
    return await request.text()
  } else if (contentType.includes('form')) {
    const formData = await request.formData()
    let body = {}
    for (let entry of formData.entries()) {
      body[entry[0]] = entry[1]
    }
    return JSON.stringify(body)
  } else {
    let myBlob = await request.blob()
    var objectURL = URL.createObjectURL(myBlob)
    return objectURL
  }
}
const someForm = `
  <!DOCTYPE html>
  <html>
  <body>
  <h1>Hello World</h1>
  <p>This is all generated using a Worker</p>
  <form action="/demos/requests" method="post">
    <div>
      <label for="say">What  do you want to say?</label>
      <input name="say" id="say" value="Hi">
    </div>
    <div>
      <label for="to">To who?</label>
      <input name="to" id="to" value="Mom">
    </div>
    <div>
      <button>Send my greetings</button>
    </div>
  </form>
  </body>
  </html>
  `

export {}
