async function handleRequest(request) {
  const init = {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  }
  return new Response(JSON.stringify(someJSON), init)
}
addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request))
})
const someJSON = {
  result: ['some', 'results'],
  errors: null,
  msg: 'this is some random json',
}
