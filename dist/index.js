'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestAsBrowser = exports.loadCookieFile = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * requestAsBrowser - Real browser UA wrapper for request() <https://github.com/msikma/requestAsBrowser>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fileCookieStore = require('file-cookie-store');

var _fileCookieStore2 = _interopRequireDefault(_fileCookieStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// These headers are sent with each request to make us look more like a real browser.
var browserHeaders = {
  'Accept-Language': 'en-US,en;q=0.9,ja;q=0.8,nl;q=0.7,de;q=0.6,es;q=0.5,it;q=0.4,pt;q=0.3',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive'

  /**
   * Loads cookies from the specified cookies.txt file (or the default file)
   * and loads them into a jar so that we can make requests with them.
   *
   * If domain and path are set, we will return the number of cookies found
   * in the file for that domain and path combination.
   * This allows you to easily check if a cookie file matches expectations.
   */
};var loadCookieFile = exports.loadCookieFile = function loadCookieFile(cookieFile) {
  return new Promise(function (resolve, reject) {
    try {
      // Cookies exported from the browser in Netscape cookie file format.
      // These are sent with our request to ensure we have access to logged in pages.
      var cookieStore = new _fileCookieStore2.default(cookieFile, { no_file_error: true });
      var jar = _request2.default.jar(cookieStore);

      resolve({ jar: jar });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Safely requests and returns the HTML for a URL.
 *
 * This mimics a browser request to ensure we don't hit an anti-bot wall.
 */
var requestAsBrowser = exports.requestAsBrowser = function requestAsBrowser(url, cookieJar) {
  var extraHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    (0, _request2.default)({
      url: url,
      headers: _extends({}, browserHeaders, extraHeaders),
      jar: cookieJar,
      gzip: true
    }, function (error, response, body) {
      if (error) {
        return reject(error);
      }
      return resolve({ response: response, body: body });
    });
  });
};