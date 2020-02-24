const handleRequest = evt => {
  // Using waitUntil confirms that the log request finished before
  // the Workers script stops executing
  evt.waitUntil(log('Received request: ', evt.request.url))
  evt.respondWith(fetch(evt.request))
}

// Identifies the logging client in Datadog's UI. 
// Can be hard-coded to something like "edge", or can be
// customized per environment using `wrangler secret put SERVICE_NAME`
const SERVICE_NAME = "edge"

const log = body => 
  // DATADOG_API_KEY is an API key generated in Datadog's UI
  fetch(`https://http-intake.logs.datadoghq.com/v1/input/${DATADOG_API_KEY}`, {
    method: 'POST',
    body: JSON.stringify(Object.assign({}, body, { service: SERVICE_NAME })),
    headers: { 'Content-type': 'application/json' },
  })


addEventListener('fetch', handleRequest)
