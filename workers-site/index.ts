import * as toml from 'toml'
//relative paths of the stored data (e.g. folders in ../templates)
const META_DATA_PATH = 'meta_data'
const JS_PATH = 'javascript'

declare global {
  var __STATIC_CONTENT: any, __STATIC_CONTENT_MANIFEST: any
}
class CustomError extends Error {
  constructor(status: number, message?: string) {
    super(message) // 'Error' breaks prototype chain here
    this.status = status
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
  }
  code: number
  message: string
  status: number
}
/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */

const DEBUG = true

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event: FetchEvent): Promise<Response> {
  try {
    const url: string = event.request.url

    let jsonResponse
    let path = new URL(url).pathname
    let id = getIDFromPath(path)
    console.log('id', id)
    if (id) {
      const key = formTomlKey(id)
      const jsonData = await grabTemplate(key)
      jsonResponse = new Response(JSON.stringify(jsonData))
    } else {
      jsonResponse = await grabTemplates()
    }
    return jsonResponse
  } catch (e) {
    if (DEBUG) {
      return new Response(e.stack, {
        status: 500,
      })
    }
  }
}
/**
 * Looks for all the keys in __STATIC_CONTENT_MANIFEST
 * and then locates and serves the TOML files
 * from __STATIC_CONTENT   */
async function grabTemplates(): Promise<Response> {
  const manifest = JSON.parse(__STATIC_CONTENT_MANIFEST)
  const allKeys = Object.keys(manifest).filter(key => key.includes('.toml'))
  let results = []
  for (const key of allKeys) {
    // const allTomls = allKeys.reduce(async key => {
    const id = getIDFromKey(key)
    try {
      const jsonData = await grabTemplate(key)
      results.push(jsonData)
    } catch (e) {
      console.log('e', e)
      new Response(JSON.stringify(e)) //, e.status)
    }
  }
  return new Response(JSON.stringify(results))
}

/**
 * Same as grabTemplates but for individual template
 * @param key the file path to the toml
 */
async function grabTemplate(key: string): Promise<Object> {
  const manifest = JSON.parse(__STATIC_CONTENT_MANIFEST)
  const tomlData = await __STATIC_CONTENT.get(manifest[key])
  if (!tomlData) {
    throw new CustomError(404, 'Key ' + key + ' not Found')
  }
  const jsonData = toml.parse(tomlData)
  // grab the javascript file if it exists from templates/javascript/:id.js
  const jsKey = formJsKey(getIDFromKey(key))

  const jsData = await __STATIC_CONTENT.get(manifest[jsKey])
  if (jsData) {
    jsonData.code = jsData
  }
  return jsonData
}
const formTomlKey = (id: string) => META_DATA_PATH + '/' + id + '.toml'

const formJsKey = (id: string) => JS_PATH + '/' + id + '.js'

/**
 * Takes a URL path and gives the :id
 * @param path  a URL path (e.g. /templates/:id)
 */
const getIDFromPath = (path: string) => {
  console.log('path.match(/^/templates/w+$/)', path.match(/^\/templates\/\w+$/))
  console.log('path.search(/^/templates/[w|.]+$/)', path.search(/^\/templates\/[\w|.]+$/))
  let fileName =
    path.search(/^\/templates\/[\w|.]+$/) !== -1 ? path.match(/^\/templates\/\w+$/)[0] : ''
  return fileName.replace('/templates/', '')
}

/**
 * Takes in a file key and returns the IF
 * @param key the KV / filepath key (e.g. javascript/:id.js)
 */
const getIDFromKey = (key: string) => {
  let fileName = key.search(/\/\w+\.\w+$/) !== -1 ? key.match(/[\/|\w]+\.\w+$/)[0] : ''
  return fileName
    .replace('.toml', '')
    .replace('.js', '')
    .replace(JS_PATH + '/', '')
    .replace(META_DATA_PATH + '/', '')
}
