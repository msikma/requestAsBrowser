/**
 * requestAsBrowser - Real browser UA wrapper for request() <https://github.com/msikma/requestAsBrowser>
 * Copyright © 2018, Michiel Sikma
 */

import request from 'request'
import FileCookieStore from 'file-cookie-store'

// These headers are sent with each request to make us look more like a real browser.
const browserHeaders = {
  'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8,nl;q=0.7,de;q=0.6,es;q=0.5,it;q=0.4,pt;q=0.3',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive'
}

/**
 * Loads cookies from the specified cookies.txt file (or the default file)
 * and loads them into a jar so that we can make requests with them.
 *
 * If domain and path are set, we will return the number of cookies found
 * in the file for that domain and path combination.
 * This allows you to easily check if a cookie file matches expectations.
 */
export const loadCookieFile = (cookieFile) => (
  new Promise((resolve, reject) => {
    try {
      // Cookies exported from the browser in Netscape cookie file format.
      // These are sent with our request to ensure we have access to logged in pages.
      const cookieStore = new FileCookieStore(cookieFile, { no_file_error: true })
      const jar = request.jar(cookieStore)

      resolve({ jar })
    }
    catch (err) {
      reject(err)
    }
  })
)

/**
 * Safely requests and returns the HTML for a URL.
 *
 * This mimics a browser request to ensure we don't hit an anti-bot wall.
 */
export const requestAsBrowser = (url, cookieJar, extraHeaders = {}) => (
  new Promise((resolve, reject) => {
    request({
      url,
      headers: { ...browserHeaders, ...extraHeaders },
      jar: cookieJar,
      gzip: true
    }, (error, response, body) => {
      if (error) {
        return reject(error)
      }
      return resolve({ response, body })
    })
  })
)
