# Template Registry

This repo runs a simple API via a Worker that serves all the template content consumed by different services (e.g. our template gallery at developers.cloudflare.com/workers/templates).

## API

The API is a Cloudflare Worker that lives in [workers-site](./workers-site). That uses KV to store the toml/JS data and parses the data for the appropriate enddpoints


## Data

All the content that is served from the API lives in [templates](./templates)

To contribute see [CONTRIBUTING](./CONTRIBUTING.md)