'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var exec = _interopDefault(require('cordova/exec'));

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * @ignore
 */
function exec$1(method, args) {
  return new Promise(function (resolve, reject) {
    exec(resolve, reject, 'AdMob', method, args);
  });
}

/**
 * @ignore
 */
function isFunction(x) {
  return typeof x === 'function';
}

function isString(x) {
  return typeof x === 'string';
}

/**
 * @ignore
 */
function wrapCallbacks(p, successCallback, failureCallback) {
  if (isFunction(successCallback)) {
    p = p.then(successCallback);
  }
  if (isFunction(failureCallback)) {
    p = p['catch'](failureCallback);
  }
  return p;
}

function boolean2string(x) {
  if (x === null) {
    return '';
  }
  if (x === true) {
    return 'yes';
  }
  if (x === false) {
    return 'no';
  }
  return x;
}

/**
 * @ignore
 */
function translateOptions(options) {
  /* eslint-disable no-console */
  var opts = {};
  if (!isUndefined(options.forChild)) {
    opts.forChild = boolean2string(options.forChild);
    if (isString(options.forChild)) {
      console.warn('`forChild` will not accept string in future, pass boolean instead');
    }
  }
  if (!isUndefined(options.forFamily)) {
    opts.forFamily = boolean2string(options.forFamily);
    if (isString(options.forFamily)) {
      console.warn('`forFamily` will not accept string in future, pass boolean instead');
    }
  }
  return _extends({}, options, opts);
}

/**
 * @ignore
 */
function buildEvents(adType, eventKeys) {
  return eventKeys.reduce(function (r, eventKey) {
    r[eventKey] = 'admob.' + adType + '.events.' + eventKey;
    return r;
  }, {});
}

/**
 * Banner config object.
 * @typedef {Object} BannerConfig
 * @property {string} [id=TESTING_AD_ID] - Ad Unit ID
 * @property {boolean} [isTesting=false] - receiving test ad
 * @property {boolean} [autoShow=false] - auto show ad when loaded
 * @property {boolean} [bannerAtTop=false] - set to true, to put banner at top
 * @property {boolean} [overlap=true] - set to true, to allow banner overlap webview
 * @property {boolean} [offsetTopBar=false] - set to true to avoid ios7 status bar overlap
 * @property {string} [size=SMART_BANNER] - {@link BANNER_SIZE}
 */

var events = buildEvents('banner', ['LOAD', 'LOAD_FAIL', 'OPEN', 'CLOSE', 'EXIT_APP']);

/**
 * @typedef {Object} BANNER_SIZE
 * @property {string} BANNER - BANNER
 * @property {string} IAB_BANNER - IAB_BANNER
 * @property {string} IAB_LEADERBOARD - IAB_LEADERBOARD
 * @property {string} IAB_MRECT - IAB_MRECT
 * @property {string} LARGE_BANNER - LARGE_BANNER
 * @property {string} SMART_BANNER - SMART_BANNER
 * @property {string} FLUID - FLUID
 */
/**
 * @constant
 * @type {Object}
 */
var sizes = {
  BANNER: 'BANNER',
  IAB_BANNER: 'IAB_BANNER',
  IAB_LEADERBOARD: 'IAB_LEADERBOARD',
  IAB_MRECT: 'IAB_MRECT',
  LARGE_BANNER: 'LARGE_BANNER',
  SMART_BANNER: 'SMART_BANNER',
  FLUID: 'FLUID',
  // android-only
  FULL_BANNER: 'FULL_BANNER',
  LEADERBOARD: 'LEADERBOARD',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  SEARCH: 'SEARCH',
  WIDE_SKYSCRAPER: 'WIDE_SKYSCRAPER'
};

/**
 * @protected
 * @desc
 * See usage in {@link banner}.
 */

var Banner = function () {

  /**
   * @protected
   * @param {BannerConfig} opts - initial config.
   */
  function Banner(opts) {
    classCallCheck(this, Banner);

    this.config(_extends({
      size: sizes.SMART_BANNER
    }, opts));
  }

  /**
   * Update config.
   * @param {BannerConfig} opts - new config.
   * @return {BannerConfig} updated config.
   */


  /**
   * Banner sizes
   * @type {BANNER_SIZE}
   */


  createClass(Banner, [{
    key: 'config',
    value: function config(opts) {
      this._config = _extends({}, this._config, opts);
      return this._config;
    }

    /**
     * Create banner.
     * @return {Promise}
     */

  }, {
    key: 'prepare',
    value: function prepare() {
      var options = _extends({
        publisherId: this._config.id
      }, this._config);
      delete options.id;
      return exec$1('createBannerView', [translateOptions(options)]);
    }

    /**
     * Show the banner.
     * @return {Promise}
     */

  }, {
    key: 'show',
    value: function show() {
      return exec$1('showAd', [true]);
    }

    /**
     * Hide the banner.
     * @return {Promise}
     */

  }, {
    key: 'hide',
    value: function hide() {
      return exec$1('showAd', [false]);
    }

    /**
     * Remove the banner.
     * @return {Promise}
     */

  }, {
    key: 'remove',
    value: function remove() {
      return exec$1('destroyBannerView', []);
    }
  }]);
  return Banner;
}();

Banner.events = events;
Banner.sizes = sizes;

/**
 * Interstitial config object.
 * @typedef {Object} InterstitialConfig
 * @property {string} [id=TESTING_AD_ID] - Ad Unit ID
 * @property {boolean} [isTesting=false] - receiving test ad
 * @property {boolean} [autoShow=false] - auto show ad when loaded
 */

var events$1 = buildEvents('interstitial', ['LOAD', 'LOAD_FAIL', 'OPEN', 'CLOSE', 'EXIT_APP']);

/**
 * @protected
 * @desc
 * See usage in {@link interstitial}.
 */

var Interstitial = function () {

  /**
   * @protected
   * @param {InterstitialConfig} opts - initial config.
   */
  function Interstitial(opts) {
    classCallCheck(this, Interstitial);

    this.config(_extends({}, opts));
  }

  /**
   * Update config.
   * @param {InterstitialConfig} opts - new config.
   * @return {InterstitialConfig} updated config.
   */


  createClass(Interstitial, [{
    key: 'config',
    value: function config(opts) {
      this._config = _extends({}, this._config, opts);
      return this._config;
    }

    /**
     * @return {Promise}
     */

  }, {
    key: 'prepare',
    value: function prepare() {
      var options = _extends({
        interstitialAdId: this._config.id
      }, this._config);
      delete options.id;
      return exec$1('prepareInterstitial', [translateOptions(options)]);
    }

    /**
     * @return {Promise}
     */

  }, {
    key: 'show',
    value: function show() {
      return exec$1('showInterstitialAd', [true]);
    }

    /**
     * @return {Promise}
     */

  }, {
    key: 'isReady',
    value: function isReady() {
      return exec$1('isInterstitialReady', []);
    }
  }]);
  return Interstitial;
}();

Interstitial.events = events$1;

/**
 * Reward Video config object.
 * @typedef {Object} RewardVideoConfig
 * @property {string} [id=TESTING_AD_ID] - Ad Unit ID
 * @property {boolean} [isTesting=false] - receiving test ad
 * @property {boolean} [autoShow=false] - auto show ad when loaded
 */

var events$2 = buildEvents('rewardvideo', ['LOAD', 'LOAD_FAIL', 'OPEN', 'CLOSE', 'EXIT_APP', 'START', 'REWARD']);

/**
 * See usage in {@link rewardvideo}.
 * @protected
 */

var RewardVideo = function () {

  /**
   * @protected
   * @param {RewardVideoConfig} opts - initial config.
   */
  function RewardVideo(opts) {
    classCallCheck(this, RewardVideo);

    this.config(_extends({}, opts));
  }

  /**
   * Update config.
   * @param {RewardVideoConfig} opts - new config.
   * @return {RewardVideoConfig} updated config.
   */


  createClass(RewardVideo, [{
    key: 'config',
    value: function config(opts) {
      this._config = _extends({}, this._config, opts);
      return this._config;
    }

    /**
     * @return {Promise}
     */

  }, {
    key: 'prepare',
    value: function prepare() {
      var options = _extends({
        rewardVideoId: this._config.id
      }, this._config);
      delete options.id;
      return exec$1('createRewardVideo', [translateOptions(options)]);
    }

    /**
     * @return {Promise}
     */

  }, {
    key: 'show',
    value: function show() {
      return exec$1('showRewardVideo', [true]);
    }

    /**
     * @return {Promise}
     */

  }, {
    key: 'isReady',
    value: function isReady() {
      return exec$1('isRewardVideoReady', []);
    }
  }]);
  return RewardVideo;
}();

RewardVideo.events = events$2;

/* eslint-disable no-console */
/**
 * @type {Banner}
 * @since 0.6
 * @emits {admob.banner.events.LOAD}
 * @emits {admob.banner.events.LOAD_FAIL}
 * @emits {admob.banner.events.OPEN}
 * @emits {admob.banner.events.CLOSE}
 * @emits {admob.banner.events.EXIT_APP}
 * @example
 * admob.banner.config({
 *  id: 'ca-app-pub-xxx/xxx',
 * })
 *
 * // Create banner
 * admob.banner.prepare()
 *
 * // Show the banner
 * admob.banner.show()
 *
 * // Hide the banner
 * admob.banner.hide()
 *
 * // Remove the banner
 * admob.banner.remove()
 */
var banner = new Banner();

/**
 * @type {Interstitial}
 * @since 0.6
 * @emits {admob.interstitial.events.LOAD}
 * @emits {admob.interstitial.events.LOAD_FAIL}
 * @emits {admob.interstitial.events.OPEN}
 * @emits {admob.interstitial.events.CLOSE}
 * @emits {admob.interstitial.events.EXIT_APP}
 * @example
 * admob.interstitial.config({
 *  id: 'ca-app-pub-xxx/xxx',
 * })
 *
 * admob.interstitial.prepare()
 *
 * admob.interstitial.show()
 */
var interstitial = new Interstitial();

/**
 * @external {cordova-admob-mediation} https://github.com/rehy/cordova-admob-mediation
 */
/**
 * Reward video requires mediation SDK to be installed,
 * see {@link cordova-admob-mediation} for list of supported networks.
 * @type {RewardVideo}
 * @since 0.6
 * @emits {admob.rewardvideo.events.LOAD}
 * @emits {admob.rewardvideo.events.LOAD_FAIL}
 * @emits {admob.rewardvideo.events.OPEN}
 * @emits {admob.rewardvideo.events.CLOSE}
 * @emits {admob.rewardvideo.events.EXIT_APP}
 * @emits {admob.rewardvideo.events.START}
 * @emits {admob.rewardvideo.events.REWARD}
 * @example
 * admob.rewardvideo.config({
 *  id: 'ca-app-pub-xxx/xxx',
 * })
 *
 * admob.rewardvideo.prepare()
 *
 * admob.rewardvideo.show()
 */
var rewardvideo = new RewardVideo();

// Old APIs

/**
 *
 * @deprecated since version 0.6
 * @param {Object} options
 * @param {string} options.publisherId
 * @param {string} options.interstitialAdId
 *
 * @param {boolean} [options.bannerAtTop=false]    Set to true, to put banner at top
 * @param {boolean} [options.overlap=true]   Set to true, to allow banner overlap webview
 * @param {boolean} [options.offsetTopBar=false]    Set to true to avoid ios7 status bar overlap
 * @param {boolean} [options.isTesting=false]    Receiving test ad
 * @param {boolean} [options.autoShow=false]    Auto show interstitial ad when loaded
 *
 * @param {boolean|null} [options.forChild=null]
 * Default is not calling `tagForChildDirectedTreatment`.
 * Set to "true" for `tagForChildDirectedTreatment(true)`.
 * Set to "false" for `tagForChildDirectedTreatment(false)`.
 *
 * @param {boolean|null} [options.forFamily=null]
 * Android-only.
 * Default is not calling `setIsDesignedForFamilies`.
 * Set to "true" for `setIsDesignedForFamilies(true)`.
 * Set to "false" for `setIsDesignedForFamilies(false)`.
 *
 * @param {function()} [successCallback]
 * @param {function()} [failureCallback]
 */
function setOptions(options, successCallback, failureCallback) {
  if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
    Object.keys(options).forEach(function (k) {
      switch (k) {
        case 'publisherId':
          banner._config.id = options[k];
          break;
        case 'bannerAtTop':
        case 'overlap':
        case 'offsetTopBar':
          banner._config[k] = options[k];
          break;
        case 'interstitialAdId':
          interstitial._config.id = options[k];
          break;
        case 'rewardVideoId':
          rewardvideo._config.id = options[k];
          break;
        case 'isTesting':
        case 'autoShow':
          banner._config[k] = options[k];
          interstitial._config[k] = options[k];
          rewardvideo._config[k] = options[k];
          break;
        default:
      }
    });
    exec(successCallback, failureCallback, 'AdMob', 'setOptions', [translateOptions(options)]);
  } else if (typeof failureCallback === 'function') {
    failureCallback('options should be specified.');
  }
}

/**
 * Ad sizes.
 * @constant
 * @type {BANNER_SIZE}
 * @deprecated since version 0.6
 */
var AD_SIZE = Banner.sizes;

/**
 * @deprecated since version 0.6
 */
function createBannerView() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var successCallback = arguments[1];
  var failureCallback = arguments[2];

  console.warn('Use admob.banner.prepare() instead.');
  exec(successCallback, failureCallback, 'AdMob', 'createBannerView', [translateOptions(options)]);
}

/**
 * @deprecated since version 0.6
 */
function destroyBannerView() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var successCallback = arguments[1];
  var failureCallback = arguments[2];

  console.warn('Use admob.banner.remove() instead.');
  exec(successCallback, failureCallback, 'AdMob', 'destroyBannerView', []);
}

/**
 * @deprecated since version 0.6
 */
function showAd() {
  var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var successCallback = arguments[1];
  var failureCallback = arguments[2];

  console.warn('Use admob.banner.show() and admob.banner.hide() instead.');
  exec(successCallback, failureCallback, 'AdMob', 'showAd', [show]);
}

/**
 * @deprecated since version 0.6
 */
function createInterstitialView(options, successCallback, failureCallback) {
  console.warn('Use admob.interstitial.prepare() instead, it will do both createInterstitialView() and requestInterstitialAd().');
  exec(successCallback, failureCallback, 'AdMob', 'createInterstitialView', [translateOptions(options)]);
}

/**
 * @deprecated since version 0.6
 */
function requestInterstitialAd() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var successCallback = arguments[1];
  var failureCallback = arguments[2];

  console.warn('Use admob.interstitial.prepare() instead, it will do both createInterstitialView() and requestInterstitialAd().');
  exec(successCallback, failureCallback, 'AdMob', 'requestInterstitialAd', [translateOptions(options)]);
}

/**
 * @deprecated since version 0.6
 */
function prepareInterstitial() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var successCallback = arguments[1];
  var failureCallback = arguments[2];

  console.warn('Use admob.interstitial.prepare() instead.');
  exec(successCallback, failureCallback, 'AdMob', 'prepareInterstitial', [translateOptions(options)]);
}

/**
 * @deprecated since version 0.6
 */
function showInterstitial(successCallback, failureCallback) {
  console.warn('Use admob.interstitial.show() instead.');
  wrapCallbacks(interstitial.show(), successCallback, failureCallback);
}

/**
 * @deprecated since version 0.6
 */
function showInterstitialAd() {
  var show = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var successCallback = arguments[1];
  var failureCallback = arguments[2];

  console.warn('Use admob.interstitial.show() instead.');
  exec(successCallback, failureCallback, 'AdMob', 'showInterstitialAd', [show]);
}

exports.banner = banner;
exports.interstitial = interstitial;
exports.rewardvideo = rewardvideo;
exports.setOptions = setOptions;
exports.AD_SIZE = AD_SIZE;
exports.createBannerView = createBannerView;
exports.destroyBannerView = destroyBannerView;
exports.showAd = showAd;
exports.createInterstitialView = createInterstitialView;
exports.requestInterstitialAd = requestInterstitialAd;
exports.prepareInterstitial = prepareInterstitial;
exports.showInterstitial = showInterstitial;
exports.showInterstitialAd = showInterstitialAd;
//# sourceMappingURL=admob.js.map
