const OLD_URL = 'developer.mozilla.org'
const NEW_URL = 'mynewdomain.com'

async function handleRequest(req: Request): Promise<Response> {
  const res = await fetch(req)
  return rewriter.transform(res)
}

class AttributeRewriter {
  attributeName: string

  constructor(attributeName: string) {
    this.attributeName = attributeName
  }

  element(element: Element) {
    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace(OLD_URL, NEW_URL),
      )
    }
  }
}

const rewriter = new HTMLRewriter()
  .on('a', new AttributeRewriter('href'))
  .on('img', new AttributeRewriter('src'))

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

export {}
