if (typeof Promise === 'undefined') {
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions');
}

Object.assign = require('object-assign');
require('whatwg-fetch');

require('raf/polyfill');
