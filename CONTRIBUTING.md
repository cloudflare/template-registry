# Contributing Cloudflare Workers Templates

- [Template Metadata](#template-metadata)
  - [Required Properties](#required-properties)
  - [Optional Properties](#optional-properties)
- [Template Content](#template-content)
  - [Snippet Content](#snippet-content)
  - [Boilerplate Template Content](#boilerplate-template-content)
- [Updating a Template](#updating-a-template)
- [Creating a Snippet](#creating-a-snippet)
- [Creating a Boilerplate](#creating-a-boilerplate)
  - [Testing Your Boilerplate](#testing-your-boilerplate)
  - [Submitting a Boilerplate to the Template Registry](#submitting-a-boilerplate-to-the-template-registry)

This repository supplies the list of templates that appear in the [Template Gallery on the Cloudflare Workers documentation website](https://developers.cloudflare.com/workers/templates/).

There are two types of templates:

- *Snippet*: A simple template whose content lives in a single TypeScript file in this repository in the `templates/typescript` directory. A snippet’s code will be displayed inline in the Template Gallery. Snippets are short and intended for users to copy-and-paste into their own projects, or use as a reference.
- *Boilerplate*: A more-complex template in any programming language, whose content lives in a separate repository, may consist of multiple files, and can be used to generate a new project by invoking `wrangler generate path-to-template-repository`. Their content is not displayed directly in the Workers documentation; rather, each boilerplate includes a link to the source repository and a `wrangler generate` command to create a project from the boilerplate. They often have more detailed documentation, either in the template repository’s `README`, or in an article in the Workers docs [like this one](https://github.com/cloudflare/workers-docs/blob/master/workers-docs/src/content/templates/pages/graphql_server.md).

## Template Metadata

Each template is defined by a `toml` file in the [`templates/meta_data`](./templates/meta_data) directory. For example, this is the contents of [`hello_world.toml`](https://github.com/cloudflare/template-registry/blob/f2a21ff87a4f9c60ce1d426e9e8d2e6807b786fd/templates/meta_data/hello_world.toml#L1-L11):

```toml
id = "hello_world"
weight = 99
type = "boilerplate"
title = "Hello World"
description = "Simple Hello World in JS"
repository_url = "https://github.com/cloudflare/worker-template"

[demos.main]
text = "Demo"
url = "https://cloudflareworkers.com/#6626eb50f7b53c2d42b79d1082b9bd37:https://tutorial.cloudflareworkers.com"
tags = [ "Originless" ]
```

### Required Properties

```yaml
id = "some_unique_alphanumeric_slug"
title =  "Title of your template"
description = "Concise 1-2 sentences that explains what your template does"
```

Boilerplate templates must also have a `repository_url` property that links to the repository where the template code lives:

```yaml
repository_url = "https://github.com/<you>/<id>"
```

### Optional Properties

```yaml
share_url="/templates/pages/id " #path to another resource, like a tutorial, that will be displayed alongside the template
tags = ["TypeScript", "Enterprise"] # arbitrary tags that can be used to filter templates in the Template Gallery

[demos.main]
title = "Demo"
url = "https://cloudflareworkers.com/#6cbbd3ae7d4e928da3502cb9ce11227a:https://tutorial.cloudflareworkers.com/foo" # a live demo of your code
```

## Template Content

Templates should follow our [JavaScript/TypeScript style guide](./style/javascript.md).

### Snippet Content

Snippet template content lives in [`templates/typescript`](./templates/typescript). TypeScript snippet definitions are also transpiled to JavaScript, and the JavaScript versions are committed to source control in [`templates/javascript`](./templates/javascript).

A snippet with an `id` of `example` is expected to have a TypeScript content definition named `example.ts` and a JavaScript content definition named `example.js`.

Snippets should consist of the following components, in this specific order:

1. A `handleRequest` function definition
2. A call to `addEventListener`
3. Helper functions
4. Hardcoded constants which a user will likely change

Most of the logic should be in a function called `handleRequest`, which should have one of the following type signatures:

```typescript
function handleRequest(request: Request): Promise<Response>
function handleRequest(request: Request): Response
```

The event listener should be one of the following:

```typescript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
addEventListener('fetch', event => {
  event.respondWith(handleRequest())
})
```

Snippets *should not* contain any blank lines. This makes them easier to present in a small amount of space in the Template Gallery.

### Boilerplate Template Content

Boilerplate template content lives in another repository; only metadata about these templates lives in this repository. The metadata allows the Workers Docs to render information about these templates.

Boilerplate templates can be used to start a new project by running:

```bash
wrangler generate https://github.com/path/to/template
```

`wrangler` clones the repo containing the boilerplate template and performs some simple templating logic using [`cargo-generate`](https://github.com/ashleygwilliams/cargo-generate).

Refer to the [documentation of `cargo-generate`](https://github.com/ashleygwilliams/cargo-generate/blob/master/README.md) for information about template placeholders like `{{ project-name }}` and `{{ authors }}`, as well as the use of a `.genignore` file to determine which files from the template repository should end up in the user’s generated project directory. If there are binary or other files that you need to exclude from placeholder substitution, see the [documentation for cargo-generate.toml](https://github.com/ashleygwilliams/cargo-generate#include--exclude).

Boilerplate templates should not contain any generated artifacts, like the `worker` directory of a default `wrangler` project.

Example boilerplate templates include:

* [cloudflare/worker-template](https://github.com/cloudflare/worker-template)
* [EverlastingBugstopper/worker-typescript-template](https://github.com/EverlastingBugstopper/worker-typescript-template)
* [cloudflare/rustwasm-worker-template](https://github.com/cloudflare/rustwasm-worker-template)
* [cloudflare/worker-emscripten-template](https://github.com/cloudflare/worker-emscripten-template)
* [cloudflare/cobol-worker-template](https://github.com/cloudflare/cobol-worker-template)
* [signalnerve/workers-graphql-server](https://github.com/signalnerve/workers-graphql-server)
* [cloudflare/worker-sites-template](https://github.com/cloudflare/worker-sites-template)
* [cloudflare/worker-template-router](https://github.com/cloudflare/worker-template-router)

You can write additional documentation about your template that will be displayed in the Workers documentation, like this:

[Template Gallery | Hello World Rust](https://developers.cloudflare.com/workers/templates/pages/hello_world_rust)

Such additional documentation lives in the [cloudflare/workers-docs](https://github.com/cloudflare/workers-docs/) repository.

## Updating a Template

If you spot an error in a template, feel free to make a PR against this repository!

If you want to update the contents of a snippet, edit the TypeScript file (not the transpiled JavaScript version), and then run:

```bash
npm run transpile && npm run lint
```

This will transpile your TypeScript changes to the JavaScript version as well.

## Creating a Snippet

1. Clone this repository.
2. Run `npm install` from the repo’s root directory to install development dependencies.
3. Choose an `id` for your template. This should be a unique and descriptive “slug” like the other filenames in [`templates/meta_data`](./templates/meta_data).
4. Create a new metadata file in [`templates/meta_data`](./templates/meta_data) with the name `your_template_id.toml`.
5. Add your TypeScript template content in [`templates/typescript`](./templates/typescript) with the name `your_template_id.ts`.
6. Run `npm run transpile && npm run lint` to generate the JavaScript version of your TypeScript file.
7. Test your snippet in the [Cloudflare Workers Playground](https://cloudflareworkers.com/) or in a `wrangler` project.
8. Make a PR to this repository containing three files:
   - `templates/meta_data/your_template_id.toml`
   - `templates/typescript/your_template_id.ts`
   - `templates/javascript/your_template_id.js`

## Creating a Boilerplate

You can get started by cloning the [template creator](https://github.com/victoriabernard92/workers-template-creator) and following the instructions in the README. You can also start from scratch and add template placeholders to any `wrangler` project.

### Testing Your Boilerplate

A boilerplate must be capable of being installed with `wrangler generate`.

Test using [`wrangler`](https://github.com/cloudflare/wrangler) to generate a new project from your boilerplate template:

```bash
wrangler generate your-template-id ./
cd your-template-slug
wrangler preview --watch
```

Finally, publish your template in a public GitHub repo, and then test your boilerplate template by running:

```bash
wrangler generate https://github.com/<you>/<your-template-id>
cd your-template-id
wrangler preview --watch
```

### Submitting a Boilerplate to the Template Registry

Create a metadata file for your template in `templates/meta_data`. Make sure to include a `repo` link to your boilerplate template’s GitHub repository.

Then make a PR to this repo with your new metadata `toml` file.
