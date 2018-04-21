requestAsBrowser
================

**Thin wrapper around request() for making browser-like requests**

This is an extremely simple enhancement of the excellent [request](https://github.com/request/request) library.
I got tired of copying this code around whenever I needed to make some screen scraper that does logged in requests,
so I decided to make it into its own package.

The main difference with a regular `request()` call is that this adds some standard headers that make us
look a little more like a real browser, since occasionally sites will refuse access to obvious scripts.

## Usage

The `loadCookieFile()` function accepts a Netscape cookie file.

```js
import requestAsBrowser, { loadCookieFile } from 'requestAsBrowser'

const jar = await loadCookieFile('./cookies.txt')
const result = await requestAsBrowser('http://www.site.com/', jar)

// or...
import { postAsBrowser } from 'requestAsBrowser'
// Form data is sent as application/x-www-form-urlencoded.
const result = await postAsBrowser('http://www.site.com/', jar, { hello: 'world' })
```

Your result will have `response` (e.g. `response.statusCode`) and the response in `body`.

## Copyright

MIT license.
