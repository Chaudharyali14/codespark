// jest.polyfills.js
if (typeof global.Request === 'undefined') {
  global.Request = require('node-fetch').Request;
}
if (typeof global.Response === 'undefined') {
  global.Response = require('node-fetch').Response;
}
if (typeof global.Headers === 'undefined') {
  global.Headers = require('node-fetch').Headers;
}
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch');
}
