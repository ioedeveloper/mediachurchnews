if (typeof window !== 'undefined' && !window.Promise) {
  window.Promise = require('./promise.min')
}
