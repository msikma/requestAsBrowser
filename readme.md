requestAsBrowser
================

**Thin wrapper around request() for making browser-like requests**

This is an extremely simple enhancement of the excellent [request](https://github.com/request/request) library.
I got tired of copying this code around whenever I needed to make some screen scraper that does logged in requests,
so I decided to make it into its own package.

The main difference with a regular `request()` call is that this adds some standard headers that make us
look a little more [like a real browser](https://github.com/msikma/requestAsBrowser/blob/master/src/index.js#L10),
since occasionally sites will refuse access to obvious scripts.

## Usage

The `loadCookieFile()` function accepts a Netscape cookie file. To make a request, pass on a URI and optionally a cookie jar to `requestAsBrowser()`, the main export.

```js
import requestAsBrowser, { loadCookieFile } from 'requestAsBrowser'

const jar = await loadCookieFile('./cookies.txt')
const result = await requestAsBrowser('http://www.site.com/', jar)
```

Your result will have `response` (e.g. `response.statusCode`) and the response in `body`.

To post data (as `application/x-www-form-urlencoded`):

```js
import { postAsBrowser, loadCookieFile } from 'requestAsBrowser'

const jar = await loadCookieFile('./cookies.txt')
const result = await postAsBrowser('http://www.site.com/', jar, { hello: 'world' })
```

Or if you want to download a URL directly to a local file:

```js
import { downloadFileAsBrowser, loadCookieFile } from 'requestAsBrowser'

const jar = await loadCookieFile('./cookies.txt')
const result = await downloadFileAsBrowser('http://site.com/file.jpg', 'file.jpg', jar)
```

Note: you don't *need* to do anything with `result`. You can just omit it, since the URI gets downloaded to the specified path. The file's data is in the return value if you should need it, though.

The file will be downloaded using a pipe, meaning its contents get filled up gradually as the file is being downloaded. On premature exit, the file will have partial contents.

## Copyright

MIT license.
