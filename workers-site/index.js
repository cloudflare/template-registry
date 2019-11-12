import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler'

import mime from 'mime'
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
  const url = new URL(event.request.url)
  let options = {}

  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  options.mapRequestToAsset = customMapRequestToAsset

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }

    // let resp = await getAssetFromKV(event, options)
    // let tomlData = await resp.text()
    // let jsonData = toml.parse(tomlData)
    const jsonData = await grabTemplates()
    return new Response(JSON.stringify(jsonData))
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req =>
            new Request(`${new URL(req.url).origin}/404.html`, req),
        })

        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        })
      } catch (e) {}
    }

    return new Response(e.stack || e.toString(), { status: 500 })
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
function handlePrefix(prefix) {
  return request => {
    // compute the default (e.g. / -> index.html)
    let defaultAssetKey = mapRequestToAsset(request)
    let url = new URL(defaultAssetKey.url)

    // strip the prefix from the path for lookup
    url.pathname = url.pathname.replace(prefix, '/')

    // inherit all other props from the default request
    return new Request(url.toString(), defaultAssetKey)
  }
}
const customMapRequestToAsset = async request => {
  const parsedUrl = new URL(request.url)
  let pathname = parsedUrl.pathname

  if (pathname.endsWith('/')) {
    // If path looks like a directory append index.html
    // e.g. If path is /about/ -> /about/index.html

    pathname = pathname.concat('index.html')
  }
  if (pathname.endsWith('/')) {
  }
  parsedUrl.pathname = pathname
  return new Request(parsedUrl, request)
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
