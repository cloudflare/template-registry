import toml from 'toml'
/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */

const DEBUG = true

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event))
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      )
    }
    event.respondWith(new Response('Internal Error', { status: 500 }))
  }
})

async function handleEvent(event) {
  const url = event.request.url

  let jsonData
  let id = url.match(/templates\/\w+$/)
  if (id) {
    id = id[0].replace('templates/', '')
    jsonData = await grabTemplate(id)
  } else {
    jsonData = await grabTemplates()
  }
  return new Response(JSON.stringify(jsonData))
}
/**
 * Looks for all the keys in __STATIC_CONTENT_MANIFEST
 * and then locates and serves the TOML files
 * from __STATIC_CONTENT   */
async function grabTemplates() {
  const manifest = JSON.parse(__STATIC_CONTENT_MANIFEST)
  const allKeys = Object.keys(manifest)
  let results = []
  for (const key of allKeys) {
    // const allTomls = allKeys.reduce(async key => {
    const tomlData = await __STATIC_CONTENT.get(manifest[key])
    const jsonData = toml.parse(tomlData)
    results.push(jsonData)
  }
  return results
}
/**
 * Same as grabTemplates but for individual template */
async function grabTemplate(id) {
  const manifest = JSON.parse(__STATIC_CONTENT_MANIFEST)
  const key = Object.keys(manifest).filter(key => key.includes(id))[0]
  const tomlData = await __STATIC_CONTENT.get(manifest[key])
  const jsonData = toml.parse(tomlData)
  return jsonData
}
