async function handleRequest() {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  }
  return new Response(someHTML, init)
}
addEventListener('fetch', event => {
  return event.respondWith(handleRequest())
})
const someHTML = `<!DOCTYPE html>
<html>
  <body>
  <h1>Hello World</h1>
  <p>This is all generated using a Worker</p>
  <iframe
      width="560"
      height="315"
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
  ></iframe>
  </body>
</html>
`

export {}
