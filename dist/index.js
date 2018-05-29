'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestCookie = exports.downloadFileAsBrowser = exports.postAsBrowser = exports.loadCookieFile = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * requestAsBrowser - Real browser UA wrapper for request() <https://github.com/msikma/requestAsBrowser>
                                                                                                                                                                                                                                                                   * Copyright © 2018, Michiel Sikma
                                                                                                                                                                                                                                                                   */

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _fileCookieStore = require('file-cookie-store');

var _fileCookieStore2 = _interopRequireDefault(_fileCookieStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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
 * Standard callback responder for requests.
 */
var reqCallback = function reqCallback(resolve, reject) {
  return function (error, response, body) {
    if (error) {
      return reject(error);
    }
    return resolve({ response: response, body: body });
  };
};

/**
 * Same as requestAsBrowser, but does a POST request and includes form data.
 * This sends a form upload using application/x-www-form-urlencoded.
 */
var postAsBrowser = exports.postAsBrowser = function postAsBrowser(url, cookieJar, form) {
  var extraHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var gzip = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var reqOverrides = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  return new Promise(function (resolve, reject) {
    _request2.default.post(_extends({
      url: url,
      form: form,
      headers: _extends({}, browserHeaders, extraHeaders),
      jar: cookieJar,
      gzip: gzip
    }, reqOverrides), reqCallback(resolve, reject));
  });
};

/**
 * Safely requests and returns the HTML for a URL.
 *
 * This mimics a browser request to ensure we don't hit an anti-bot wall.
 */
var requestAsBrowser = function requestAsBrowser(url, cookieJar) {
  var extraHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var gzip = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var reqOverrides = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  return new Promise(function (resolve, reject) {
    (0, _request2.default)(_extends({
      url: url,
      headers: _extends({}, browserHeaders, extraHeaders),
      jar: cookieJar,
      gzip: gzip
    }, reqOverrides), reqCallback(resolve, reject));
  });
};

/**
 * Starts downloading a file to a path, and returns a promise that resolves
 * after the file has been fully saved. A pipe is used to write the file,
 * meaning that the file will be gradually filled with data, and on premature exit
 * the file will have partial data.
 *
 * mightBe: Special hack for Pixiv: a file might be a jpg, or it might be a png.
 * This is the least expensive way to check when downloading a lot of files.
 */
var downloadFileAsBrowser = exports.downloadFileAsBrowser = function downloadFileAsBrowser(url, name, cookieJar) {
  var extraHeaders = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var gzip = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var reqOverrides = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var mightBeURL = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  var mightBeName = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;
  return new Promise(function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
      var args, main, secondary;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              args = _extends({ headers: _extends({}, browserHeaders, extraHeaders), jar: cookieJar, gzip: gzip }, reqOverrides);
              _context.next = 3;
              return requestAsBrowser.apply(undefined, [url].concat(_toConsumableArray(args)));

            case 3:
              main = _context.sent;

              if (!(main.response && main.response.statusCode === 200)) {
                _context.next = 8;
                break;
              }

              _context.next = 7;
              return saveBinaryFile(main.body, name);

            case 7:
              return _context.abrupt('return', resolve({ response: main.response, body: main.body }));

            case 8:
              if (!(main.response && main.response.statusCode === 404 && mightBeURL)) {
                _context.next = 17;
                break;
              }

              _context.next = 11;
              return requestAsBrowser.apply(undefined, [mightBeURL].concat(_toConsumableArray(args)));

            case 11:
              secondary = _context.sent;

              if (!(secondary.response && secondary.response.statusCode === 200)) {
                _context.next = 16;
                break;
              }

              _context.next = 15;
              return saveBinaryFile(main.body, mightBeName);

            case 15:
              return _context.abrupt('return', resolve({ response: secondary.response, body: secondary.body }));

            case 16:
              return _context.abrupt('return', reject(secondary));

            case 17:
              return _context.abrupt('return', reject(main));

            case 18:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function (_x12, _x13) {
      return _ref.apply(this, arguments);
    };
  }());
};

/**
 * Saves binary data to a destination file.
 */
var saveBinaryFile = function saveBinaryFile(data, dest) {
  return new Promise(function (resolve, reject) {
    _fs2.default.writeFile(dest, data, { encoding: null });
  });
};

// Export request.cookie so we can make new cookies aside from loading a file
var requestCookie = exports.requestCookie = _request2.default.cookie;

exports.default = requestAsBrowser;