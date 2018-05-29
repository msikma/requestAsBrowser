/**
 * requestAsBrowser - Real browser UA wrapper for request() <https://github.com/msikma/requestAsBrowser>
 * Copyright © 2018, Michiel Sikma
 */

import fs from 'fs'
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
 * Standard callback responder for requests.
 */
const reqCallback = (resolve, reject) => (error, response, body) => {
  if (error) {
    return reject(error)
  }
  return resolve({ response, body })
}

/**
 * Same as requestAsBrowser, but does a POST request and includes form data.
 * This sends a form upload using application/x-www-form-urlencoded.
 */
export const postAsBrowser = (url, cookieJar, form, extraHeaders = {}, gzip = true, reqOverrides = {}) => (
  new Promise((resolve, reject) => {
    request.post({
      url,
      form,
      headers: { ...browserHeaders, ...extraHeaders },
      jar: cookieJar,
      gzip,
      ...reqOverrides
    }, reqCallback(resolve, reject))
  })

)

/**
 * Safely requests and returns the HTML for a URL.
 *
 * This mimics a browser request to ensure we don't hit an anti-bot wall.
 */
const requestAsBrowser = (url, cookieJar, extraHeaders = {}, gzip = true, reqOverrides = {}) => (
  new Promise((resolve, reject) => {
    request({
      url,
      headers: { ...browserHeaders, ...extraHeaders },
      jar: cookieJar,
      gzip,
      ...reqOverrides
    }, reqCallback(resolve, reject))
  })
)

/**
 * Starts downloading a file to a path, and returns a promise that resolves
 * after the file has been fully saved. A pipe is used to write the file,
 * meaning that the file will be gradually filled with data, and on premature exit
 * the file will have partial data.
 *
 * mightBe: Special hack for Pixiv: a file might be a jpg, or it might be a png.
 * This is the least expensive way to check when downloading a lot of files.
 */
export const downloadFileAsBrowser = (url, name, cookieJar, extraHeaders = {}, gzip = true, reqOverrides = {}, mightBeURL = null, mightBeName = null) => (
  new Promise(async (resolve, reject) => {
    const args = { headers: { ...browserHeaders, ...extraHeaders }, jar: cookieJar, gzip, ...reqOverrides }
    const main = await requestAsBrowser(url, ...args)
    if (main.response && main.response.statusCode === 200) {
      await saveBinaryFile(main.body, name)
      return resolve({ response: main.response, body: main.body })
    }

    // If the main URL is a 404, and we have 'mightBe' values, try a secondary URL.
    if (main.response && main.response.statusCode === 404 && mightBeURL) {
      const secondary = await requestAsBrowser(mightBeURL, ...args)
      if (secondary.response && secondary.response.statusCode === 200) {
        await saveBinaryFile(main.body, mightBeName)
        return resolve({ response: secondary.response, body: secondary.body })
      }
      return reject(secondary)
    }

    return reject(main)
  })
)

/**
 * Saves binary data to a destination file.
 */
const saveBinaryFile = (data, dest) => (
  new Promise((resolve, reject) => {
    fs.writeFile(dest, data, { encoding: null })
  })
)

// Export request.cookie so we can make new cookies aside from loading a file
export const requestCookie = request.cookie

export default requestAsBrowser
