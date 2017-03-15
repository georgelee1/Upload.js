/** Upload.js (1.2.1) | https://github.com/georgelee1/Upload.js | MIT */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fileDelete;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * The delete module handles the deletion of a file by id
 */
function fileDelete(http, events, opts, queue) {
  /**
   * @private
   */
  function _peformDelete(id, done) {
    events.trigger('delete.started', { id: id });
    opts.get('delete.url', 'delete.param', 'delete.additionalParams', 'delete.headers', function (url, param, additionalParams, headers) {
      var params = Object.assign({}, additionalParams, _defineProperty({}, param, id));

      http(url, params, headers).done(function () {
        events.trigger('delete.done', { id: id });
        done();
      }).fail(function () {
        events.trigger('delete.failed', { id: id });
        done();
      });
    });
  }

  /**
   * Delete one or more files.
   */
  function del() {
    for (var _len = arguments.length, ids = Array(_len), _key = 0; _key < _len; _key++) {
      ids[_key] = arguments[_key];
    }

    ids.forEach(function (id) {
      events.trigger('delete.added', { id: id });
      queue.offer(function (done) {
        return _peformDelete(id, done);
      });
    });
  }

  return {
    del: del
  };
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = types;
/**
 * Types module. Gets and parses pre-defined types and allowed types, exposes
 * an isAllowed function to test whether a type is allowed or not.
 */
function types(opts) {
  var allowed = void 0;
  var waiting = [];

  /**
   * Returns true of false if the passed type is an allowed type.
   * @private
   */
  function _checkIsAllowed(type) {
    return allowed.indexOf(type.toLowerCase()) >= 0;
  }

  /**
   * Calls the callback with true or false whether or not the type is allowed.
   */
  function isAllowed(type, callback) {
    if (waiting) {
      waiting.push([type, callback]);
      if (waiting.length === 1) {
        opts.get('allowed_types', 'types', function () {
          var optAllowedTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
          var optTypes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

          allowed = [].concat.apply([], optAllowedTypes.map(function (t) {
            return optTypes[t] || t;
          })).map(function (t) {
            return t.toLowerCase();
          });
          waiting.forEach(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                waitingType = _ref2[0],
                waitingCallback = _ref2[1];

            return waitingCallback(_checkIsAllowed(waitingType));
          });
          waiting = undefined;
        });
      }
    } else {
      callback(_checkIsAllowed(type));
    }
  }

  return {
    isAllowed: isAllowed
  };
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fileUpload;

var _types2 = require('./types');

var _types3 = _interopRequireDefault(_types2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * The upload module handles the actual file upload mechanism
 */
function fileUpload(http, events, opts, queue) {
  var _types = (0, _types3.default)(opts);

  /**
   * @private
   */
  function _peformUpload(file, id, done) {
    events.trigger('upload.started', { file: file, id: id });
    opts.get('upload.url', 'upload.param', 'upload.additionalParams', 'upload.headers', function (url, param, additionalParams, headers) {
      var params = Object.assign({}, additionalParams, _defineProperty({}, param, file));

      http(url, params, headers).progress(function (progress) {
        return events.trigger('upload.progress', { file: file, id: id, progress: progress });
      }).done(function (_ref) {
        var uploadImageId = _ref.uploadImageId;

        events.trigger('upload.done', { file: file, id: id, uploadImageId: uploadImageId });
        done();
      }).fail(function () {
        events.trigger('upload.failed', { file: file, id: id });
        done();
      });
    });
  }

  /**
   * Upload one or more files.
   */
  function upload() {
    for (var _len = arguments.length, files = Array(_len), _key = 0; _key < _len; _key++) {
      files[_key] = arguments[_key];
    }

    files.forEach(function (_ref2) {
      var file = _ref2.file,
          id = _ref2.id;

      _types.isAllowed(file.type, function (allowed) {
        if (allowed) {
          events.trigger('upload.added', { file: file, id: id });
          queue.offer(function (done) {
            return _peformUpload(file, id, done);
          });
        } else {
          events.trigger('upload.rejected', { file: file, id: id, rejected: 'type' });
        }
      });
    });
  }

  return {
    upload: upload
  };
}

},{"./types":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = core;

var _queue2 = require('./util/queue');

var _queue3 = _interopRequireDefault(_queue2);

var _upload = require('./actions/upload');

var _upload2 = _interopRequireDefault(_upload);

var _delete = require('./actions/delete');

var _delete2 = _interopRequireDefault(_delete);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The core is the engine that handles the uploading and deleting of files.
 */
function core(http, events, opts) {
  var _queue = (0, _queue3.default)(function (item, done) {
    item(done);
  }, { delay: 100 });

  var upload = (0, _upload2.default)(http, events, opts, _queue);
  var del = (0, _delete2.default)(http, events, opts, _queue);

  return {
    upload: upload.upload,
    del: del.del
  };
}

},{"./actions/delete":1,"./actions/upload":3,"./util/queue":9}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = events;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ALL = '$all';

/**
 * The events module handles registering of event listeners and triggering of events.
 */
function events() {
  var known = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var _byKey = {};
  var _emit = [];
  var _parents = [];

  function isDefined(val) {
    return typeof val !== 'undefined' && !((typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && !val);
  }

  /**
   * Register event listener
   */
  function on(key, id, listener) {
    var available = known.concat(_parents.reduce(function (val, next) {
      return val.concat(next);
    }, []));
    if (available.length && available.indexOf(key) < 0) {
      console.warn('Attemping to listen to an unknown event. ' + ('\'' + key + '\' is not one of \'' + available.join(', ') + '\''));
    }
    if (typeof id === 'function') {
      listener = id;
      id = ALL;
    }
    var actualId = isDefined(id) ? id.toString() : ALL;
    if (typeof listener === 'function') {
      if (!_byKey[key]) {
        _byKey[key] = _defineProperty({}, ALL, []);
      }
      if (!_byKey[key][actualId]) {
        _byKey[key][actualId] = [];
      }
      _byKey[key][actualId].push(listener);
    }
  }

  /**
   * Unregister event listener
   */
  function off(key, id) {
    if (_byKey[key]) {
      var actualId = isDefined(id) ? id.toString() : false;
      if (actualId) {
        delete _byKey[key][actualId];
      } else {
        _byKey[key] = _defineProperty({}, ALL, []);
      }
    }
  }

  /**
   * Triggers event with key and parameters
   */
  function trigger(key, event) {
    if (_byKey[key]) {
      var id = isDefined(event.id) ? event.id.toString() : false;
      if (id && _byKey[key][id]) {
        _byKey[key][id].forEach(function (listener) {
          return listener(Object.assign({ type: key }, event));
        });
      }
      _byKey[key][ALL].forEach(function (listener) {
        return listener(Object.assign({ type: key }, event));
      });
    }
    _emit.forEach(function (ev) {
      return ev.trigger(key, event);
    });
  }

  /**
   * Emits events trigger in this events instance to the passed events instance.
   */
  function emit(ev) {
    if (ev && ev.trigger) {
      _emit.push(ev);
      ev._parent(known);
    }
  }

  return {
    on: on,
    off: off,
    trigger: trigger,
    emit: emit,
    _parent: function _parent(ev) {
      _parents.push(ev);
    }
  };
}

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = http;
var NOOP = function NOOP() {};

/**
 * Simple AJAX Http caller that expects JSON response. Handles standard parameter posting and
 * file uploading.
 *
 * Usage (POST parameters):
 * let params = {
 *     key: "value"
 * }
 * let h = http("/post", params).done(data => {
 *     // do something with data
 * }).fail(() => {
 *     // do something when failed
 * })
 *
 * Usage (file uplaod):
 * let file = ...
 * let params = {
 *     file1: file
 * }
 * let h = http("/upload", params).progress((p => {
 *     // upload progress bar, p = percentage done
 * }).done(data => {
 *     // do something with data
 * }).fail(() => {
 *     // do something when failed
 * })
 */
function http(url) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var headers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _progress = NOOP;
  var _done = NOOP;
  var _fail = NOOP;
  var _instance = {};

  /**
   * Sets a progress handler for http request. Is called multiple times, periodically with a
   * progress value between 0 and 100
   */
  function progress(handler) {
    if (typeof handler === 'function') {
      _progress = handler;
    }
    return _instance;
  }

  /**
   * Sets a done handler for when the http request is complete. Called when response returns
   * with successful status code (2xx). Passed the parsed JSON object from the response.
   */
  function done(handler) {
    if (typeof handler === 'function') {
      _done = handler;
    }
    return _instance;
  }

  /**
   * Sets a failure handler for when the request fails with a non success http status code (2xx).
   */
  function fail(handler) {
    if (typeof handler === 'function') {
      _fail = handler;
    }
    return _instance;
  }

  /**
   * @private
   */
  function _post() {
    var data = new FormData();
    Object.keys(params).forEach(function (key) {
      var val = params[key];
      if (Array.isArray(val)) {
        val.forEach(function (v) {
          if (v.type && v.name) {
            data.append(key, v, v.name);
          } else {
            data.append(key, v);
          }
        });
      } else {
        if (val.type && val.name) {
          data.append(key, val, val.name);
        } else {
          data.append(key, val);
        }
      }
    });

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          try {
            _done(JSON.parse(request.response));
          } catch (e) {
            _done({});
          }
        } else {
          _fail();
        }
      }
    };

    request.upload.addEventListener('progress', function (e) {
      _progress(Math.ceil(e.loaded / e.total * 100));
    }, false);

    request.open('POST', url, true);
    if (headers) {
      Object.keys(headers).forEach(function (key) {
        request.setRequestHeader(key, headers[key]);
      });
    }
    request.send(data);
  }

  _instance.progress = progress;
  _instance.done = done;
  _instance.fail = fail;
  _post();
  return _instance;
}

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = merge;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function isObject(item) {
  return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
}

function merge(target) {
  for (var _len = arguments.length, objs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objs[_key - 1] = arguments[_key];
  }

  if (!objs.length) return target;
  var next = objs.shift();

  if (isObject(target) && isObject(next)) {
    Object.keys(next).forEach(function (key) {
      if (isObject(next[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        merge(target[key], next[key]);
      } else {
        Object.assign(target, _defineProperty({}, key, next[key]));
      }
    });
  }

  return merge.apply(undefined, [target].concat(objs));
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = options;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * The Options module provides a wrap around an option object where options can be defined as
 * functions which take an optional done callback to allow lazy asynchronous loading of option
 * values.
 *
 * Usage:
 * let opts = {
 *    key1: "val1",
 *    key2: function() {
 *       return "val2"
 *    },
 *    key3: function(done) {
 *       // some async action that takes 1s, simulated here with setTimeout
 *       setTimeout(() => {
 *           done("val3")
 *       }, 1000)
 *    }
 * }
 *
 * let o = options(opts)
 * o.get("key1") === "val1"
 * o.get("key1", v => {
 *     v === "val1"
 * })
 * o.get("key2") === "val2"
 * o.get("key2", v => {
 *     v === "val2"
 * })
 * o.get("key3") === undefined
 * o.get("key3", v => {
 *     v === "val3"
 * })
 * o.get("key1", "key2") === ["val1", "val2]
 * o.get("key1", "key2", (v1, v2) => {
 *     v1 === "val1"
 *     v2 === "val2"
 * })
 * o.get("key1", "key3") === ["val1", undefined]
 * o.get("key1", "key3", (v1, v2) => {
 *     v1 === "val1"
 *     v2 === "val3"
 * })
 */
function options(opts) {
  /**
   * @private
   */
  function _mapKeysToValues(keys) {
    return keys.map(function (key) {
      var val = void 0;
      var obj = opts;
      key.split('.').forEach(function (part) {
        val = obj[part];
        obj = val || {};
      });
      return val;
    });
  }

  /**
   * Get the option values
   */
  function get() {
    var keys = [];
    var callback = undefined;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    args.forEach(function (a) {
      if (typeof a === 'string') {
        keys.push(a);
      } else if (typeof a === 'function') {
        callback = a;
      }
    });

    var values = _mapKeysToValues(keys);
    if (!callback) {
      values = values.map(function (v) {
        if (typeof v === 'function') {
          if (v.length === 0) {
            return v();
          }
          return undefined;
        }
        return v;
      });
      if (values.length > 1) {
        return values;
      }
      return values[0];
    }

    var toResolve = values.filter(function (v) {
      return typeof v === 'function';
    }).length;

    if (toResolve === 0) {
      callback.apply(undefined, _toConsumableArray(values));
    } else {
      var valueCallback = function valueCallback(idx) {
        return function (val) {
          values[idx] = val;
          toResolve--;
          if (toResolve === 0) {
            callback.apply(undefined, _toConsumableArray(values));
          }
        };
      };

      values.forEach(function (v, idx) {
        if (typeof v === 'function') {
          if (v.length > 0) {
            v(valueCallback(idx));
          } else {
            valueCallback(idx)(v());
          }
        }
      });
    }

    return undefined;
  }

  return {
    get: get
  };
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = queue;
/**
 * Simple Queue that allows for a configured number of concurrent items to be executed by a handler.
 *
 * Usage:
 * let options = {
 *     // number of items that can be processed at once
 *     concurrency: 1,
 *     // delay in the start of the processing in ms
 *     delay: 200,
 *     // max size of the queue
 *     size: 100
 * }
 *
 * let q = queue((item, done) => {
 *     // do some work with item that takes 1s, simulated here with setTimeout
 *     setTimeout(() => {
 *         done()
 *     }, 1000)
 * }, options)
 *
 * let my_item = ...
 * if (!q.offer(my_item)) {
 *     throw "Unable to add item to queue"
 * }
 */
function queue(handler) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _handler = handler;
  var _concurrency = Math.max(options.concurrency, 1) || 1;
  var _delay = Math.max(options.delay, 0) || 0;
  var _size = Math.max(options.size, 0) || 0;
  var _queue = [];
  var _working = [];
  var _id = 0;

  /**
   * @private
   */
  function _next() {
    if (_working.length < _concurrency) {
      var next = _queue.shift();
      if (next !== undefined) {
        var id = ++_id;
        var done = function done() {
          var index = _working.indexOf(id);
          if (index >= 0) {
            _working.splice(index, 1);
            _next();
          }
        };
        var fire = function fire() {
          return _handler.apply(undefined, [next.item, done]);
        };
        _working.push(id);
        if (_delay) {
          setTimeout(fire, _delay);
        } else {
          fire();
        }
      }
    }
  }

  /**
   * Offer a item to the queue to be processed by the handler. Returns True if the queue
   * accepted the item, False if the queue has reached it's max size.
   */
  function offer(item) {
    if (!_size || _queue.length < _size) {
      _queue.push({
        item: item
      });
      _next();
      return true;
    }
    return false;
  }

  return {
    offer: offer
  };
}

},{}],10:[function(require,module,exports){
'use strict';

module.exports = {
  /**
   * number | Maxiumum number of files that UploadJs will allow to contain.
   */
  max: 10,

  /**
   * object: {
   *   key: array
   * }
   * defined grouping of file types for allowed_types by MIME type
   */
  types: {
    images: ['image/jpg', 'image/jpeg', 'image/png', 'image/gif']
  },
  /**
   * array | The allowed file types that can be uploaded. Either MIME type of grouping key (see
   *         types)
   */
  allowed_types: ['images'],

  /**
   * Http upload options
   */
  upload: {
    /**
     * string | The URL that is called when uploading a file
     */
    url: '',
    /**
     * string | The name of the parameter that each file is set as in the upload request.
     */
    param: 'file',
    /**
     * object | Keyed object of additional parameters to send with the upload request.
     */
    additionalParams: {},
    /**
     * object | Keyed object of additional headers to send with the upload request.
     */
    headers: {}
  },

  /**
   * Http delete options
   */
  delete: {
    /**
     * string | The URL that is called when deleting a file
     */
    url: '',
    /**
     * string | The name of the parameter set with the file id that is set on the deletion request.
     */
    param: 'file',
    /**
     * object | Keyed object of additional parameters to send with the delete request.
     */
    additionalParams: {},
    /**
     * object | Keyed object of additional headers to send with the delete request.
     */
    headers: {}
  }
};

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = container;

var _dom = require('./dom');

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function makeAdd() {
  var ele = (0, _dom.make)('div', { class: 'item new' });
  var icon = (0, _dom.make)('div', { class: 'icon plus' });
  (0, _dom.append)(ele, icon);
  return ele;
}

function makePicker(trigger, events) {
  var ele = (0, _dom.make)('input', {
    type: 'file',
    multiple: 'multiple'
  });
  (0, _dom.on)(ele, 'change', function () {
    var id = Date.now();
    for (var x = 0; x < ele.files.length; x++) {
      events.trigger('file.picked', { file: ele.files.item(x), id: x + '_' + id });
    }
  });
  (0, _dom.on)(trigger, 'click', ele.click.bind(ele));
  return ele;
}

/**
 * The container module is a wrapper around the upload container.
 */
function container(ele, items, events) {
  (0, _dom.addClass)(ele, 'uploadjs');

  var _items = (0, _dom.make)('div', { class: 'uploadjs-container' });
  _dom.append.apply(undefined, [_items].concat(_toConsumableArray(items)));

  var _actions = (0, _dom.make)('div', { class: 'uploadjs-container' });
  (0, _dom.append)(ele, _items, _actions);

  var _add = makeAdd();
  (0, _dom.append)(_actions, _add);
  (0, _dom.append)(ele, makePicker(_add, events));

  events.on('upload.added', function (_ref) {
    var file = _ref.file,
        id = _ref.id;

    var i = (0, _item2.default)({ type: _item.TYPE_IMAGE, fileId: id, file: file, events: events });
    (0, _dom.append)(_items, i);
  });

  items.splice(0, items.length);

  return (0, _dom.data)(ele, 'upload', {
    url: 'upload.url',
    param: 'upload.param',
    deleteUrl: 'delete.url',
    deleteParam: 'delete.param',
    allowedTypes: 'allowed_types',
    additionalParam: 'upload.additionalParams',
    header: 'upload.headers',
    deleteAdditionalParam: 'delete.additionalParams',
    deleteHeader: 'delete.headers'
  });
}

},{"./dom":12,"./item":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.children = children;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.make = make;
exports.append = append;
exports.marker = marker;
exports.replaceMarker = replaceMarker;
exports.empty = empty;
exports.attrs = attrs;
exports.on = on;
exports.set = set;
exports.data = data;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Returns a array of child elements of the passed element that match the passed type. Type is
 * optional, if not defined will match all children.
 */
function children(ele, type) {
  var result = [];
  var c = ele.children;
  var name = (type || '').toLowerCase();
  for (var x = 0; x < c.length; x++) {
    var child = c.item(x);
    if (!type || child.nodeName.toLowerCase() === name) {
      result.push(child);
    }
  }
  return result;
}

/**
 * Adds the passed classes to the passed DOM element.
 */
function addClass(ele) {
  var classes = !!ele.className ? ele.className.split(' ') : [];

  for (var _len = arguments.length, cls = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    cls[_key - 1] = arguments[_key];
  }

  cls.forEach(function (c) {
    if (classes.indexOf(c) < 0) {
      classes.push(c);
    }
  });
  ele.className = classes.join(' ');
}

/**
 * Removes the passed classes from the passed DOM element.
 */
function removeClass(ele) {
  var classes = !!ele.className ? ele.className.split(' ') : [];

  for (var _len2 = arguments.length, cls = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    cls[_key2 - 1] = arguments[_key2];
  }

  cls.forEach(function (c) {
    var index = classes.indexOf(c);
    if (index >= 0) {
      classes.splice(index, 1);
    }
  });
  ele.className = classes.join(' ');
}

/**
 * Creates and retusn a new DOM element with the defined name. Attributes is optional, must be an
 * object, if defined sets the attribute key and value from the enumerable properties on the object.
 */
function make(name, attributes) {
  var ele = document.createElement(name);
  if (attributes) {
    Object.keys(attributes).forEach(function (key) {
      if (key === 'class') {
        addClass.apply(undefined, [ele].concat(_toConsumableArray((attributes[key] || '').split(' '))));
      } else {
        ele.setAttribute(key, attributes[key]);
      }
    });
  }
  return ele;
}

/**
 * Appends the passed children to the passed element.
 */
function append(ele) {
  for (var _len3 = arguments.length, appendChildren = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    appendChildren[_key3 - 1] = arguments[_key3];
  }

  appendChildren.forEach(function (child) {
    ele.appendChild(child);
  });
}

function makeMarkerKey(key, postfix) {
  return 'up-marker-' + key + '-' + postfix;
}

/**
 * Creates a marker that is appended to the element with the defined key.
 */
function marker(ele, key) {
  append(ele, document.createComment(makeMarkerKey(key, 'start')), document.createComment(makeMarkerKey(key, 'end')));
}

/**
 * Replaces the content inside the marker and replaces it with the supplied contents
 */
function replaceMarker(ele, key) {
  var markerStart = makeMarkerKey(key, 'start');
  var markerEnd = makeMarkerKey(key, 'end');
  var processing = false;

  var node = ele.firstChild;
  var insert = function insert(to, n) {
    return node.parentNode.insertBefore(n, to);
  };

  for (var _len4 = arguments.length, contents = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
    contents[_key4 - 2] = arguments[_key4];
  }

  while (node) {
    if (node.nodeType === 8) {
      if (node.nodeValue === markerStart) {
        processing = true;
        node = node.nextSibling;
        continue;
      } else if (node.nodeValue === markerEnd) {
        contents.forEach(insert.bind(undefined, node));
        return;
      }
    }

    if (processing) {
      var next = node.nextSibling;
      node.parentNode.removeChild(node);
      node = next;
      continue;
    }

    node = node.nextSibling;
  }
}

/**
 * Removes all child nodes from the passed element.
 */
function empty(ele) {
  while (ele.firstChild) {
    ele.removeChild(ele.firstChild);
  }
}

/**
 * Gets the attributes from the passed element and returns a keyed object.
 */
function attrs(ele) {
  var result = {};

  for (var _len5 = arguments.length, attributes = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    attributes[_key5 - 1] = arguments[_key5];
  }

  attributes.forEach(function (attr) {
    result[attr] = ele.getAttribute(attr);
  });
  return result;
}

/**
 * Adds event listener to the passed element.
 */
function on(ele, event, handler) {
  ele.addEventListener(event, handler);
}

/**
 * Sets the value on the object using the path. Grows the object deep until the end of the path is
 * reached.
 */
function set(obj, path, val) {
  var setOn = obj;
  var parts = path.split('.');
  var last = parts.pop();
  parts.forEach(function (part) {
    var next = setOn[part];
    if (!next) {
      next = {};
      setOn[part] = next;
    }
    setOn = next;
  });
  if ((typeof setOn === 'undefined' ? 'undefined' : _typeof(setOn)) === 'object') {
    setOn[last] = val;
  }
}

/**
 * Extracts data attributes from the passed element where they start with the prefix and returns a
 * key object. An optional shape parameter can be defined that defines the shape of the result.
 * For example:
 * shape = { test: 'some.bit', other: 'thing' }
 * <... data-test-key1="val" data-other="val2" />
 * result = { some: { bit: { key1: 'val' } }, thing: 'val2' }
 */
function data(ele) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var shape = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var result = {};
  Object.keys(ele.dataset).filter(function (key) {
    return key.startsWith(prefix);
  }).forEach(function (key) {
    var adjusted = key.substr(prefix.length);
    adjusted = adjusted.charAt(0).toLowerCase() + adjusted.slice(1);
    var path = '';
    var best = 0;
    Object.keys(shape).forEach(function (sk) {
      var idx = adjusted.indexOf(sk);
      if (idx >= 0 && best < sk.length) {
        best = sk.length;
        var rest = adjusted.slice(sk.length);
        path = shape[sk] + (rest ? '.' + (rest.charAt(0).toLowerCase() + rest.slice(1)) : '');
      }
    });
    set(result, path || adjusted, ele.dataset[key]);
  });
  return result;
}

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPE_IMAGE = undefined;
exports.imageRenderer = imageRenderer;
exports.default = item;

var _dom = require('./dom');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TYPE_IMAGE = exports.TYPE_IMAGE = 'image';

/**
 * Renders a item type of image.
 */
function imageRenderer(data) {
  if (data.file) {
    var ele = (0, _dom.make)('img');
    var reader = new FileReader();
    reader.onload = function (e) {
      ele.setAttribute('src', e.target.result);
    };
    reader.readAsDataURL(data.file);
    return Object.assign({}, data, { ele: ele });
  }
  return Object.assign({}, data, { ele: (0, _dom.make)('img', { src: data.src }) });
}

/**
 * Map of renderers by type.
 */
var renderers = _defineProperty({
  NOOP: function NOOP() {
    return (0, _dom.make)('div');
  }
}, TYPE_IMAGE, imageRenderer);

/**
 * Wrapping DOM around the item DOM
 */
function wrap(data) {
  var isUploading = !!data.file;
  var root = (0, _dom.make)('div', {
    class: ['item'].concat(isUploading ? ['uploading'] : []).join(' ')
  });
  (0, _dom.append)(root, data.ele);
  (0, _dom.marker)(root, 'status');
  (0, _dom.marker)(root, 'actions');

  var _progress = void 0;
  if (isUploading) {
    _progress = (0, _dom.make)('div', { class: 'progress' });
    (0, _dom.replaceMarker)(root, 'status', (0, _dom.make)('div', { class: 'spinner' }), (0, _dom.make)('div', { class: 'icon upload' }), _progress);
  }

  return Object.assign({}, data, { ele: root, _progress: _progress });
}

/**
 * Makes the appropriate status icon and appends to the status marker. Then removes after a short
 * period.
 */
function status(ele, st, done) {
  var s = (0, _dom.make)('div', { class: 'icon ' + st });
  (0, _dom.append)(s, (0, _dom.make)('i'));
  (0, _dom.replaceMarker)(ele, 'status', s);

  setTimeout(function () {
    (0, _dom.addClass)(s, 'going');
    setTimeout(function () {
      (0, _dom.replaceMarker)(ele, 'status');
      (0, _dom.removeClass)(s, 'going');

      if (done) {
        done();
      }
    }, 2000);
  }, 2000);
}

/**
 * Remove all upload events
 */
function removeUploadEvents(data) {
  data.events.off('upload.added', data.fileId);
  data.events.off('upload.started', data.fileId);
  data.events.off('upload.progress', data.fileId);
  data.events.off('upload.done', data.fileId);
  data.events.off('upload.failed', data.fileId);
}

/**
 * Remove all delete events
 */
function removeDeleteEvents(data) {
  data.events.off('delete.added', data.fileId);
  data.events.off('delete.started', data.fileId);
  data.events.off('delete.done', data.fileId);
  data.events.off('delete.failed', data.fileId);
}

/**
 * Remove the item
 */
function remove(ele, data) {
  (0, _dom.addClass)(ele, 'removed');
  setTimeout(function () {
    ele.parentNode.removeChild(ele);
  }, 1000);

  removeUploadEvents(data);
  removeDeleteEvents(data);
}

/**
 * Add deletion listeners to the events
 */
function onDelete(ele, data) {
  data.events.on('delete.added', data.id, function () {
    (0, _dom.addClass)(ele, 'removing');

    (0, _dom.replaceMarker)(ele, 'status', (0, _dom.make)('div', { class: 'spinner' }), (0, _dom.make)('div', { class: 'icon trash' }));
  });

  data.events.on('delete.done', data.id, function () {
    setTimeout(function () {
      (0, _dom.removeClass)(ele, 'removing');
      remove(ele, data);
    }, 500);
  });

  data.events.on('delete.failed', data.id, function () {
    setTimeout(function () {
      (0, _dom.removeClass)(ele, 'removing');
      status(ele, 'error');
    }, 500);
  });
}

/**
 * Makes the actions bar DOM
 */
function makeActions(ele, data) {
  if (data.id) {
    var actions = (0, _dom.make)('div', { class: 'actions' });
    var del = (0, _dom.make)('div', { class: 'action del' });
    (0, _dom.append)(actions, del);
    (0, _dom.append)(del, (0, _dom.make)('div', { class: 'trash' }));
    (0, _dom.replaceMarker)(ele, 'actions', actions);

    (0, _dom.on)(del, 'click', function () {
      return data.events.trigger('file.delete', { id: data.id });
    });
    onDelete(ele, data);
  } else {
    (0, _dom.addClass)(ele, 'static');
  }
}

/**
 * Add upload listeners to the events
 */
function onUpload(ele, progressEle, data) {
  data.events.on('upload.progress', data.fileId, function (_ref) {
    var progress = _ref.progress;

    var val = 0 - (100 - progress);
    progressEle.style.transform = 'translateX(' + val + '%)';
  });

  data.events.on('upload.done', data.fileId, function (_ref2) {
    var id = _ref2.id;

    data.id = id;
    status(ele, 'done');
    (0, _dom.removeClass)(ele, 'uploading');
    makeActions(ele, data);

    removeUploadEvents(data);
  });

  data.events.on('upload.failed', data.fileId, function () {
    (0, _dom.addClass)(ele, 'stopped');
    status(ele, 'error', function () {
      remove(ele, data);
    });
  });
}

/**
 * The item module is a wrapper around an item in the container that the user can interact with.
 */
function item(data) {
  var _wrapper = wrap((renderers[data.type] || renderers.NOOP)(data));

  if (data.fileId) {
    onUpload(_wrapper.ele, _wrapper._progress, data);
  } else {
    makeActions(_wrapper.ele, data);
  }

  return _wrapper.ele;
}

},{"./dom":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _dom = require('./dom');

var _item = require('./item');

var _item2 = _interopRequireDefault(_item);

var _container = require('./container');

var _container2 = _interopRequireDefault(_container);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseImage(ele, events) {
  return (0, _item2.default)(Object.assign({ type: _item.TYPE_IMAGE }, (0, _dom.attrs)(ele, 'src'), { id: ele.dataset.uploadImageId, events: events }));
}

/**
 * The parse module parses the DOM element and returns a container wrapper element.
 */
function parse(ele, events) {
  var items = (0, _dom.children)(ele, 'img').map(function (img) {
    return parseImage(img, events);
  });
  (0, _dom.empty)(ele);
  return (0, _container2.default)(ele, items, events);
}

},{"./container":11,"./dom":12,"./item":13}],15:[function(require,module,exports){
'use strict';

var _parse = require('./render/parse');

var _parse2 = _interopRequireDefault(_parse);

var _core2 = require('./core');

var _core3 = _interopRequireDefault(_core2);

var _http = require('./core/util/http');

var _http2 = _interopRequireDefault(_http);

var _events2 = require('./core/util/events');

var _events3 = _interopRequireDefault(_events2);

var _options = require('./core/util/options');

var _options2 = _interopRequireDefault(_options);

var _merge = require('./core/util/merge');

var _merge2 = _interopRequireDefault(_merge);

var _defaults = require('./defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Allows plain vanilla JavaScript access to the UploadJs Widget.
 *
 * Usage:
 * var ele = document.getElementById("myid");
 * var options = { ... }
 * new UploadJs(ele, options)
 *
 * @constructor
 */
window.UploadJs = function UploadJs(ele) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _classCallCheck(this, UploadJs);

  var _events = (0, _events3.default)(['upload.added', 'upload.started', 'upload.progress', 'upload.done', 'upload.failed', 'delete.added', 'delete.started', 'delete.done', 'delete.failed']);
  var _uiEvents = (0, _events3.default)(['file.picked', 'file.delete']);
  _events.emit(_uiEvents);

  var _dataOpts = (0, _parse2.default)(ele, _uiEvents);
  var _opts = (0, _options2.default)((0, _merge2.default)({}, _defaults2.default, _dataOpts, opts));
  var _core = (0, _core3.default)(_http2.default, _events, _opts);

  _uiEvents.on('file.picked', function (ev) {
    return _core.upload(ev);
  });
  _uiEvents.on('file.delete', function (ev) {
    return _core.del(ev.id);
  });
};

},{"./core":4,"./core/util/events":5,"./core/util/http":6,"./core/util/merge":7,"./core/util/options":8,"./defaults":10,"./render/parse":14}]},{},[15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvY29yZS9hY3Rpb25zL2RlbGV0ZS5qcyIsInNyYy9qcy9jb3JlL2FjdGlvbnMvdHlwZXMuanMiLCJzcmMvanMvY29yZS9hY3Rpb25zL3VwbG9hZC5qcyIsInNyYy9qcy9jb3JlL2luZGV4LmpzIiwic3JjL2pzL2NvcmUvdXRpbC9ldmVudHMuanMiLCJzcmMvanMvY29yZS91dGlsL2h0dHAuanMiLCJzcmMvanMvY29yZS91dGlsL21lcmdlLmpzIiwic3JjL2pzL2NvcmUvdXRpbC9vcHRpb25zLmpzIiwic3JjL2pzL2NvcmUvdXRpbC9xdWV1ZS5qcyIsInNyYy9qcy9kZWZhdWx0cy5qcyIsInNyYy9qcy9yZW5kZXIvY29udGFpbmVyLmpzIiwic3JjL2pzL3JlbmRlci9kb20uanMiLCJzcmMvanMvcmVuZGVyL2l0ZW0uanMiLCJzcmMvanMvcmVuZGVyL3BhcnNlLmpzIiwic3JjL2pzL3VwbG9hZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O2tCQ0d3QixVOzs7O0FBSHhCOzs7QUFHZSxTQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsTUFBMUIsRUFBa0MsSUFBbEMsRUFBd0MsS0FBeEMsRUFBK0M7QUFDNUQ7OztBQUdBLFdBQVMsYUFBVCxDQUF1QixFQUF2QixFQUEyQixJQUEzQixFQUFpQztBQUMvQixXQUFPLE9BQVAsQ0FBZSxnQkFBZixFQUFpQyxFQUFFLE1BQUYsRUFBakM7QUFDQSxTQUFLLEdBQUwsQ0FBUyxZQUFULEVBQXVCLGNBQXZCLEVBQXVDLHlCQUF2QyxFQUFrRSxnQkFBbEUsRUFDRSxVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWEsZ0JBQWIsRUFBK0IsT0FBL0IsRUFBMkM7QUFDekMsVUFBTSxTQUFTLE9BQU8sTUFBUCxDQUFjLEVBQWQsRUFBa0IsZ0JBQWxCLHNCQUNaLEtBRFksRUFDSixFQURJLEVBQWY7O0FBSUEsV0FBSyxHQUFMLEVB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QSxXQUFNLE1BQU0sR0FBTixDQUFVLEdBQUcsRUFBYixDQUFOO0FBQUEsR0FBNUI7QUFDRCxDQXpCSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcbiAqIFRoZSBkZWxldGUgbW9kdWxlIGhhbmRsZXMgdGhlIGRlbGV0aW9uIG9mIGEgZmlsZSBieSBpZFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBmaWxlRGVsZXRlKGh0dHAsIGV2ZW50cywgb3B0cywgcXVldWUpIHtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfcGVmb3JtRGVsZXRlKGlkLCBkb25lKSB7XG4gICAgZXZlbnRzLnRyaWdnZXIoJ2RlbGV0ZS5zdGFydGVkJywgeyBpZCB9KTtcbiAgICBvcHRzLmdldCgnZGVsZXRlLnVybCcsICdkZWxldGUucGFyYW0nLCAnZGVsZXRlLmFkZGl0aW9uYWxQYXJhbXMnLCAnZGVsZXRlLmhlYWRlcnMnLFxuICAgICAgKHVybCwgcGFyYW0sIGFkZGl0aW9uYWxQYXJhbXMsIGhlYWRlcnMpID0+IHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7fSwgYWRkaXRpb25hbFBhcmFtcywge1xuICAgICAgICAgIFtwYXJhbV06IGlkLFxuICAgICAgICB9KTtcblxuICAgICAgICBodHRwKHVybCwgcGFyYW1zLCBoZWFkZXJzKVxuICAgICAgICAgIC5kb25lKCgpID0+IHtcbiAgICAgICAgICAgIGV2ZW50cy50cmlnZ2VyKCdkZWxldGUuZG9uZScsIHsgaWQgfSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuZmFpbCgoKSA9PiB7XG4gICAgICAgICAgICBldmVudHMudHJpZ2dlcignZGVsZXRlLmZhaWxlZCcsIHsgaWQgfSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgb25lIG9yIG1vcmUgZmlsZXMuXG4gICAqL1xuICBmdW5jdGlvbiBkZWwoLi4uaWRzKSB7XG4gICAgaWRzLmZvckVhY2goKGlkKSA9PiB7XG4gICAgICBldmVudHMudHJpZ2dlcignZGVsZXRlLmFkZGVkJywgeyBpZCB9KTtcbiAgICAgIHF1ZXVlLm9mZmVyKChkb25lKSA9PiBfcGVmb3JtRGVsZXRlKGlkLCBkb25lKSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGRlbCxcbiAgfTtcbn1cbiIsIi8qKlxuICogVHlwZXMgbW9kdWxlLiBHZXRzIGFuZCBwYXJzZXMgcHJlLWRlZmluZWQgdHlwZXMgYW5kIGFsbG93ZWQgdHlwZXMsIGV4cG9zZXNcbiAqIGFuIGlzQWxsb3dlZCBmdW5jdGlvbiB0byB0ZXN0IHdoZXRoZXIgYSB0eXBlIGlzIGFsbG93ZWQgb3Igbm90LlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0eXBlcyhvcHRzKSB7XG4gIGxldCBhbGxvd2VkO1xuICBsZXQgd2FpdGluZyA9IFtdO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgb2YgZmFsc2UgaWYgdGhlIHBhc3NlZCB0eXBlIGlzIGFuIGFsbG93ZWQgdHlwZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9jaGVja0lzQWxsb3dlZCh0eXBlKSB7XG4gICAgcmV0dXJuIGFsbG93ZWQuaW5kZXhPZih0eXBlLnRvTG93ZXJDYXNlKCkpID49IDA7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbHMgdGhlIGNhbGxiYWNrIHdpdGggdHJ1ZSBvciBmYWxzZSB3aGV0aGVyIG9yIG5vdCB0aGUgdHlwZSBpcyBhbGxvd2VkLlxuICAgKi9cbiAgZnVuY3Rpb24gaXNBbGxvd2VkKHR5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHdhaXRpbmcpIHtcbiAgICAgIHdhaXRpbmcucHVzaChbdHlwZSwgY2FsbGJhY2tdKTtcbiAgICAgIGlmICh3YWl0aW5nLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBvcHRzLmdldCgnYWxsb3dlZF90eXBlcycsICd0eXBlcycsIChvcHRBbGxvd2VkVHlwZXMgPSBbXSwgb3B0VHlwZXMgPSB7fSkgPT4ge1xuICAgICAgICAgIGFsbG93ZWQgPSBbXS5jb25jYXQuYXBwbHkoW10sIG9wdEFsbG93ZWRUeXBlcy5tYXAodCA9PiBvcHRUeXBlc1t0XSB8fCB0KSlcbiAgICAgICAgICAgIC5tYXAodCA9PiB0LnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgIHdhaXRpbmcuZm9yRWFjaCgoW3dhaXRpbmdUeXBlLCB3YWl0aW5nQ2FsbGJhY2tdKSA9PlxuICAgICAgICAgICAgd2FpdGluZ0NhbGxiYWNrKF9jaGVja0lzQWxsb3dlZCh3YWl0aW5nVHlwZSkpKTtcbiAgICAgICAgICB3YWl0aW5nID0gdW5kZWZpbmVkO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2soX2NoZWNrSXNBbGxvd2VkKHR5cGUpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGlzQWxsb3dlZCxcbiAgfTtcbn1cbiIsImltcG9ydCB0eXBlcyBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBUaGUgdXBsb2FkIG1vZHVsZSBoYW5kbGVzIHRoZSBhY3R1YWwgZmlsZSB1cGxvYWQgbWVjaGFuaXNtXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZpbGVVcGxvYWQoaHR0cCwgZXZlbnRzLCBvcHRzLCBxdWV1ZSkge1xuICBjb25zdCBfdHlwZXMgPSB0eXBlcyhvcHRzKTtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9wZWZvcm1VcGxvYWQoZmlsZSwgaWQsIGRvbmUpIHtcbiAgICBldmVudHMudHJpZ2dlcigndXBsb2FkLnN0YXJ0ZWQnLCB7IGZpbGUsIGlkIH0pO1xuICAgIG9wdHMuZ2V0KCd1cGxvYWQudXJsJywgJ3VwbG9hZC5wYXJhbScsICd1cGxvYWQuYWRkaXRpb25hbFBhcmFtcycsICd1cGxvYWQuaGVhZGVycycsXG4gICAgICAodXJsLCBwYXJhbSwgYWRkaXRpb25hbFBhcmFtcywgaGVhZGVycykgPT4ge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHt9LCBhZGRpdGlvbmFsUGFyYW1zLCB7XG4gICAgICAgICAgW3BhcmFtXTogZmlsZSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaHR0cCh1cmwsIHBhcmFtcywgaGVhZGVycylcbiAgICAgICAgICAucHJvZ3Jlc3MocHJvZ3Jlc3MgPT4gZXZlbnRzLnRyaWdnZXIoJ3VwbG9hZC5wcm9ncmVzcycsIHsgZmlsZSwgaWQsIHByb2dyZXNzIH0pKVxuICAgICAgICAgIC5kb25lKCh7IHVwbG9hZEltYWdlSWQgfSkgPT4ge1xuICAgICAgICAgICAgZXZlbnRzLnRyaWdnZXIoJ3VwbG9hZC5kb25lJywgeyBmaWxlLCBpZCwgdXBsb2FkSW1hZ2VJZCB9KTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5mYWlsKCgpID0+IHtcbiAgICAgICAgICAgIGV2ZW50cy50cmlnZ2VyKCd1cGxvYWQuZmFpbGVkJywgeyBmaWxlLCBpZCB9KTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwbG9hZCBvbmUgb3IgbW9yZSBmaWxlcy5cbiAgICovXG4gIGZ1bmN0aW9uIHVwbG9hZCguLi5maWxlcykge1xuICAgIGZpbGVzLmZvckVhY2goKHsgZmlsZSwgaWQgfSkgPT4ge1xuICAgICAgX3R5cGVzLmlzQWxsb3dlZChmaWxlLnR5cGUsIChhbGxvd2VkKSA9PiB7XG4gICAgICAgIGlmIChhbGxvd2VkKSB7XG4gICAgICAgICAgZXZlbnRzLnRyaWdnZXIoJ3VwbG9hZC5hZGRlZCcsIHsgZmlsZSwgaWQgfSk7XG4gICAgICAgICAgcXVldWUub2ZmZXIoKGRvbmUpID0+IF9wZWZvcm1VcGxvYWQoZmlsZSwgaWQsIGRvbmUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBldmVudHMudHJpZ2dlcigndXBsb2FkLnJlamVjdGVkJywgeyBmaWxlLCBpZCwgcmVqZWN0ZWQ6ICd0eXBlJyB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHVwbG9hZCxcbiAgfTtcbn1cbiIsImltcG9ydCBxdWV1ZSBmcm9tICcuL3V0aWwvcXVldWUnO1xuaW1wb3J0IGZpbGVVcGxvYWQgZnJvbSAnLi9hY3Rpb25zL3VwbG9hZCc7XG5pbXBvcnQgZmlsZURlbGV0ZSBmcm9tICcuL2FjdGlvbnMvZGVsZXRlJztcblxuLyoqXG4gKiBUaGUgY29yZSBpcyB0aGUgZW5naW5lIHRoYXQgaGFuZGxlcyB0aGUgdXBsb2FkaW5nIGFuZCBkZWxldGluZyBvZiBmaWxlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29yZShodHRwLCBldmVudHMsIG9wdHMpIHtcbiAgY29uc3QgX3F1ZXVlID0gcXVldWUoKGl0ZW0sIGRvbmUpID0+IHtcbiAgICBpdGVtKGRvbmUpO1xuICB9LCB7IGRlbGF5OiAxMDAgfSk7XG5cbiAgY29uc3QgdXBsb2FkID0gZmlsZVVwbG9hZChodHRwLCBldmVudHMsIG9wdHMsIF9xdWV1ZSk7XG4gIGNvbnN0IGRlbCA9IGZpbGVEZWxldGUoaHR0cCwgZXZlbnRzLCBvcHRzLCBfcXVldWUpO1xuXG4gIHJldHVybiB7XG4gICAgdXBsb2FkOiB1cGxvYWQudXBsb2FkLFxuICAgIGRlbDogZGVsLmRlbCxcbiAgfTtcbn1cbiIsImNvbnN0IEFMTCA9ICckYWxsJztcblxuLyoqXG4gKiBUaGUgZXZlbnRzIG1vZHVsZSBoYW5kbGVzIHJlZ2lzdGVyaW5nIG9mIGV2ZW50IGxpc3RlbmVycyBhbmQgdHJpZ2dlcmluZyBvZiBldmVudHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGV2ZW50cyhrbm93biA9IFtdKSB7XG4gIGNvbnN0IF9ieUtleSA9IHt9O1xuICBjb25zdCBfZW1pdCA9IFtdO1xuICBjb25zdCBfcGFyZW50cyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGlzRGVmaW5lZCh2YWwpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgISh0eXBlb2YgdmFsID09PSAnb2JqZWN0JyAmJiAhdmFsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBldmVudCBsaXN0ZW5lclxuICAgKi9cbiAgZnVuY3Rpb24gb24oa2V5LCBpZCwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBhdmFpbGFibGUgPSBrbm93bi5jb25jYXQoX3BhcmVudHMucmVkdWNlKCh2YWwsIG5leHQpID0+IHZhbC5jb25jYXQobmV4dCksIFtdKSk7XG4gICAgaWYgKGF2YWlsYWJsZS5sZW5ndGggJiYgYXZhaWxhYmxlLmluZGV4T2Yoa2V5KSA8IDApIHtcbiAgICAgIGNvbnNvbGUud2FybignQXR0ZW1waW5nIHRvIGxpc3RlbiB0byBhbiB1bmtub3duIGV2ZW50LiAnICtcbiAgICAgICAgYCcke2tleX0nIGlzIG5vdCBvbmUgb2YgJyR7YXZhaWxhYmxlLmpvaW4oJywgJyl9J2ApO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGlkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsaXN0ZW5lciA9IGlkO1xuICAgICAgaWQgPSBBTEw7XG4gICAgfVxuICAgIGNvbnN0IGFjdHVhbElkID0gaXNEZWZpbmVkKGlkKSA/IChpZCkudG9TdHJpbmcoKSA6IEFMTDtcbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoIV9ieUtleVtrZXldKSB7XG4gICAgICAgIF9ieUtleVtrZXldID0ge1xuICAgICAgICAgIFtBTExdOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghX2J5S2V5W2tleV1bYWN0dWFsSWRdKSB7XG4gICAgICAgIF9ieUtleVtrZXldW2FjdHVhbElkXSA9IFtdO1xuICAgICAgfVxuICAgICAgX2J5S2V5W2tleV1bYWN0dWFsSWRdLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVbnJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyXG4gICAqL1xuICBmdW5jdGlvbiBvZmYoa2V5LCBpZCkge1xuICAgIGlmIChfYnlLZXlba2V5XSkge1xuICAgICAgY29uc3QgYWN0dWFsSWQgPSBpc0RlZmluZWQoaWQpID8gKGlkKS50b1N0cmluZygpIDogZmFsc2U7XG4gICAgICBpZiAoYWN0dWFsSWQpIHtcbiAgICAgICAgZGVsZXRlIF9ieUtleVtrZXldW2FjdHVhbElkXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9ieUtleVtrZXldID0ge1xuICAgICAgICAgIFtBTExdOiBbXSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlcnMgZXZlbnQgd2l0aCBrZXkgYW5kIHBhcmFtZXRlcnNcbiAgICovXG4gIGZ1bmN0aW9uIHRyaWdnZXIoa2V5LCBldmVudCkge1xuICAgIGlmIChfYnlLZXlba2V5XSkge1xuICAgICAgY29uc3QgaWQgPSBpc0RlZmluZWQoZXZlbnQuaWQpID8gKGV2ZW50LmlkKS50b1N0cmluZygpIDogZmFsc2U7XG4gICAgICBpZiAoaWQgJiYgX2J5S2V5W2tleV1baWRdKSB7XG4gICAgICAgIF9ieUtleVtrZXldW2lkXS5mb3JFYWNoKGxpc3RlbmVyID0+IGxpc3RlbmVyKE9iamVjdC5hc3NpZ24oeyB0eXBlOiBrZXkgfSwgZXZlbnQpKSk7XG4gICAgICB9XG4gICAgICBfYnlLZXlba2V5XVtBTExdLmZvckVhY2gobGlzdGVuZXIgPT4gbGlzdGVuZXIoT2JqZWN0LmFzc2lnbih7IHR5cGU6IGtleSB9LCBldmVudCkpKTtcbiAgICB9XG4gICAgX2VtaXQuZm9yRWFjaChldiA9PiBldi50cmlnZ2VyKGtleSwgZXZlbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbWl0cyBldmVudHMgdHJpZ2dlciBpbiB0aGlzIGV2ZW50cyBpbnN0YW5jZSB0byB0aGUgcGFzc2VkIGV2ZW50cyBpbnN0YW5jZS5cbiAgICovXG4gIGZ1bmN0aW9uIGVtaXQoZXYpIHtcbiAgICBpZiAoZXYgJiYgZXYudHJpZ2dlcikge1xuICAgICAgX2VtaXQucHVzaChldik7XG4gICAgICBldi5fcGFyZW50KGtub3duKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9uLFxuICAgIG9mZixcbiAgICB0cmlnZ2VyLFxuICAgIGVtaXQsXG4gICAgX3BhcmVudChldikge1xuICAgICAgX3BhcmVudHMucHVzaChldik7XG4gICAgfSxcbiAgfTtcbn1cbiIsImNvbnN0IE5PT1AgPSAoKSA9PiB7fTtcblxuLyoqXG4gKiBTaW1wbGUgQUpBWCBIdHRwIGNhbGxlciB0aGF0IGV4cGVjdHMgSlNPTiByZXNwb25zZS4gSGFuZGxlcyBzdGFuZGFyZCBwYXJhbWV0ZXIgcG9zdGluZyBhbmRcbiAqIGZpbGUgdXBsb2FkaW5nLlxuICpcbiAqIFVzYWdlIChQT1NUIHBhcmFtZXRlcnMpOlxuICogbGV0IHBhcmFtcyA9IHtcbiAqICAgICBrZXk6IFwidmFsdWVcIlxuICogfVxuICogbGV0IGggPSBodHRwKFwiL3Bvc3RcIiwgcGFyYW1zKS5kb25lKGRhdGEgPT4ge1xuICogICAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIGRhdGFcbiAqIH0pLmZhaWwoKCkgPT4ge1xuICogICAgIC8vIGRvIHNvbWV0aGluZyB3aGVuIGZhaWxlZFxuICogfSlcbiAqXG4gKiBVc2FnZSAoZmlsZSB1cGxhb2QpOlxuICogbGV0IGZpbGUgPSAuLi5cbiAqIGxldCBwYXJhbXMgPSB7XG4gKiAgICAgZmlsZTE6IGZpbGVcbiAqIH1cbiAqIGxldCBoID0gaHR0cChcIi91cGxvYWRcIiwgcGFyYW1zKS5wcm9ncmVzcygocCA9PiB7XG4gKiAgICAgLy8gdXBsb2FkIHByb2dyZXNzIGJhciwgcCA9IHBlcmNlbnRhZ2UgZG9uZVxuICogfSkuZG9uZShkYXRhID0+IHtcbiAqICAgICAvLyBkbyBzb21ldGhpbmcgd2l0aCBkYXRhXG4gKiB9KS5mYWlsKCgpID0+IHtcbiAqICAgICAvLyBkbyBzb21ldGhpbmcgd2hlbiBmYWlsZWRcbiAqIH0pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGh0dHAodXJsLCBwYXJhbXMgPSB7fSwgaGVhZGVycyA9IHt9KSB7XG4gIGxldCBfcHJvZ3Jlc3MgPSBOT09QO1xuICBsZXQgX2RvbmUgPSBOT09QO1xuICBsZXQgX2ZhaWwgPSBOT09QO1xuICBjb25zdCBfaW5zdGFuY2UgPSB7fTtcblxuICAvKipcbiAgICogU2V0cyBhIHByb2dyZXNzIGhhbmRsZXIgZm9yIGh0dHAgcmVxdWVzdC4gSXMgY2FsbGVkIG11bHRpcGxlIHRpbWVzLCBwZXJpb2RpY2FsbHkgd2l0aCBhXG4gICAqIHByb2dyZXNzIHZhbHVlIGJldHdlZW4gMCBhbmQgMTAwXG4gICAqL1xuICBmdW5jdGlvbiBwcm9ncmVzcyhoYW5kbGVyKSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBfcHJvZ3Jlc3MgPSBoYW5kbGVyO1xuICAgIH1cbiAgICByZXR1cm4gX2luc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBkb25lIGhhbmRsZXIgZm9yIHdoZW4gdGhlIGh0dHAgcmVxdWVzdCBpcyBjb21wbGV0ZS4gQ2FsbGVkIHdoZW4gcmVzcG9uc2UgcmV0dXJuc1xuICAgKiB3aXRoIHN1Y2Nlc3NmdWwgc3RhdHVzIGNvZGUgKDJ4eCkuIFBhc3NlZCB0aGUgcGFyc2VkIEpTT04gb2JqZWN0IGZyb20gdGhlIHJlc3BvbnNlLlxuICAgKi9cbiAgZnVuY3Rpb24gZG9uZShoYW5kbGVyKSB7XG4gICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBfZG9uZSA9IGhhbmRsZXI7XG4gICAgfVxuICAgIHJldHVybiBfaW5zdGFuY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIGZhaWx1cmUgaGFuZGxlciBmb3Igd2hlbiB0aGUgcmVxdWVzdCBmYWlscyB3aXRoIGEgbm9uIHN1Y2Nlc3MgaHR0cCBzdGF0dXMgY29kZSAoMnh4KS5cbiAgICovXG4gIGZ1bmN0aW9uIGZhaWwoaGFuZGxlcikge1xuICAgIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgX2ZhaWwgPSBoYW5kbGVyO1xuICAgIH1cbiAgICByZXR1cm4gX2luc3RhbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfcG9zdCgpIHtcbiAgICBjb25zdCBkYXRhID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgT2JqZWN0LmtleXMocGFyYW1zKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIGNvbnN0IHZhbCA9IHBhcmFtc1trZXldO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgICAgICB2YWwuZm9yRWFjaCh2ID0+IHtcbiAgICAgICAgICBpZiAodi50eXBlICYmIHYubmFtZSkge1xuICAgICAgICAgICAgZGF0YS5hcHBlbmQoa2V5LCB2LCB2Lm5hbWUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLmFwcGVuZChrZXksIHYpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodmFsLnR5cGUgJiYgdmFsLm5hbWUpIHtcbiAgICAgICAgICBkYXRhLmFwcGVuZChrZXksIHZhbCwgdmFsLm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRhdGEuYXBwZW5kKGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYgKHJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICBpZiAocmVxdWVzdC5zdGF0dXMgPj0gMjAwICYmIHJlcXVlc3Quc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIF9kb25lKEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZSkpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIF9kb25lKHt9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX2ZhaWwoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGUgPT4ge1xuICAgICAgX3Byb2dyZXNzKE1hdGguY2VpbCgoZS5sb2FkZWQgLyBlLnRvdGFsKSAqIDEwMCkpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHJlcXVlc3Qub3BlbignUE9TVCcsIHVybCwgdHJ1ZSk7XG4gICAgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCBoZWFkZXJzW2tleV0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJlcXVlc3Quc2VuZChkYXRhKTtcbiAgfVxuXG4gIF9pbnN0YW5jZS5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICBfaW5zdGFuY2UuZG9uZSA9IGRvbmU7XG4gIF9pbnN0YW5jZS5mYWlsID0gZmFpbDtcbiAgX3Bvc3QoKTtcbiAgcmV0dXJuIF9pbnN0YW5jZTtcbn1cbiIsImZ1bmN0aW9uIGlzT2JqZWN0KGl0ZW0pIHtcbiAgcmV0dXJuIChpdGVtICYmIHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpdGVtKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlKHRhcmdldCwgLi4ub2Jqcykge1xuICBpZiAoIW9ianMubGVuZ3RoKSByZXR1cm4gdGFyZ2V0O1xuICBjb25zdCBuZXh0ID0gb2Jqcy5zaGlmdCgpO1xuXG4gIGlmIChpc09iamVjdCh0YXJnZXQpICYmIGlzT2JqZWN0KG5leHQpKSB7XG4gICAgT2JqZWN0LmtleXMobmV4dClcbiAgICAgIC5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKGlzT2JqZWN0KG5leHRba2V5XSkpIHtcbiAgICAgICAgICBpZiAoIXRhcmdldFtrZXldKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZXJnZSh0YXJnZXRba2V5XSwgbmV4dFtrZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHRhcmdldCwge1xuICAgICAgICAgICAgW2tleV06IG5leHRba2V5XSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICByZXR1cm4gbWVyZ2UodGFyZ2V0LCAuLi5vYmpzKTtcbn1cbiIsIi8qKlxuICogVGhlIE9wdGlvbnMgbW9kdWxlIHByb3ZpZGVzIGEgd3JhcCBhcm91bmQgYW4gb3B0aW9uIG9iamVjdCB3aGVyZSBvcHRpb25zIGNhbiBiZSBkZWZpbmVkIGFzXG4gKiBmdW5jdGlvbnMgd2hpY2ggdGFrZSBhbiBvcHRpb25hbCBkb25lIGNhbGxiYWNrIHRvIGFsbG93IGxhenkgYXN5bmNocm9ub3VzIGxvYWRpbmcgb2Ygb3B0aW9uXG4gKiB2YWx1ZXMuXG4gKlxuICogVXNhZ2U6XG4gKiBsZXQgb3B0cyA9IHtcbiAqICAgIGtleTE6IFwidmFsMVwiLFxuICogICAga2V5MjogZnVuY3Rpb24oKSB7XG4gKiAgICAgICByZXR1cm4gXCJ2YWwyXCJcbiAqICAgIH0sXG4gKiAgICBrZXkzOiBmdW5jdGlvbihkb25lKSB7XG4gKiAgICAgICAvLyBzb21lIGFzeW5jIGFjdGlvbiB0aGF0IHRha2VzIDFzLCBzaW11bGF0ZWQgaGVyZSB3aXRoIHNldFRpbWVvdXRcbiAqICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICogICAgICAgICAgIGRvbmUoXCJ2YWwzXCIpXG4gKiAgICAgICB9LCAxMDAwKVxuICogICAgfVxuICogfVxuICpcbiAqIGxldCBvID0gb3B0aW9ucyhvcHRzKVxuICogby5nZXQoXCJrZXkxXCIpID09PSBcInZhbDFcIlxuICogby5nZXQoXCJrZXkxXCIsIHYgPT4ge1xuICogICAgIHYgPT09IFwidmFsMVwiXG4gKiB9KVxuICogby5nZXQoXCJrZXkyXCIpID09PSBcInZhbDJcIlxuICogby5nZXQoXCJrZXkyXCIsIHYgPT4ge1xuICogICAgIHYgPT09IFwidmFsMlwiXG4gKiB9KVxuICogby5nZXQoXCJrZXkzXCIpID09PSB1bmRlZmluZWRcbiAqIG8uZ2V0KFwia2V5M1wiLCB2ID0+IHtcbiAqICAgICB2ID09PSBcInZhbDNcIlxuICogfSlcbiAqIG8uZ2V0KFwia2V5MVwiLCBcImtleTJcIikgPT09IFtcInZhbDFcIiwgXCJ2YWwyXVxuICogby5nZXQoXCJrZXkxXCIsIFwia2V5MlwiLCAodjEsIHYyKSA9PiB7XG4gKiAgICAgdjEgPT09IFwidmFsMVwiXG4gKiAgICAgdjIgPT09IFwidmFsMlwiXG4gKiB9KVxuICogby5nZXQoXCJrZXkxXCIsIFwia2V5M1wiKSA9PT0gW1widmFsMVwiLCB1bmRlZmluZWRdXG4gKiBvLmdldChcImtleTFcIiwgXCJrZXkzXCIsICh2MSwgdjIpID0+IHtcbiAqICAgICB2MSA9PT0gXCJ2YWwxXCJcbiAqICAgICB2MiA9PT0gXCJ2YWwzXCJcbiAqIH0pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG9wdGlvbnMob3B0cykge1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGZ1bmN0aW9uIF9tYXBLZXlzVG9WYWx1ZXMoa2V5cykge1xuICAgIHJldHVybiBrZXlzLm1hcCgoa2V5KSA9PiB7XG4gICAgICBsZXQgdmFsO1xuICAgICAgbGV0IG9iaiA9IG9wdHM7XG4gICAgICBrZXkuc3BsaXQoJy4nKS5mb3JFYWNoKChwYXJ0KSA9PiB7XG4gICAgICAgIHZhbCA9IG9ialtwYXJ0XTtcbiAgICAgICAgb2JqID0gdmFsIHx8IHt9O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgb3B0aW9uIHZhbHVlc1xuICAgKi9cbiAgZnVuY3Rpb24gZ2V0KC4uLmFyZ3MpIHtcbiAgICBjb25zdCBrZXlzID0gW107XG4gICAgbGV0IGNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgIGFyZ3MuZm9yRWFjaChhID0+IHtcbiAgICAgIGlmICh0eXBlb2YgYSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAga2V5cy5wdXNoKGEpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjYWxsYmFjayA9IGE7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgdmFsdWVzID0gX21hcEtleXNUb1ZhbHVlcyhrZXlzKTtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICB2YWx1ZXMgPSB2YWx1ZXMubWFwKCh2KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmICh2Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHYoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdjtcbiAgICAgIH0pO1xuICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gdmFsdWVzWzBdO1xuICAgIH1cblxuICAgIGxldCB0b1Jlc29sdmUgPSB2YWx1ZXMuZmlsdGVyKHYgPT4gdHlwZW9mIHYgPT09ICdmdW5jdGlvbicpLmxlbmd0aDtcblxuICAgIGlmICh0b1Jlc29sdmUgPT09IDApIHtcbiAgICAgIGNhbGxiYWNrKC4uLnZhbHVlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHZhbHVlQ2FsbGJhY2sgPSBpZHggPT4gKHZhbCkgPT4ge1xuICAgICAgICB2YWx1ZXNbaWR4XSA9IHZhbDtcbiAgICAgICAgdG9SZXNvbHZlLS07XG4gICAgICAgIGlmICh0b1Jlc29sdmUgPT09IDApIHtcbiAgICAgICAgICBjYWxsYmFjayguLi52YWx1ZXMpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YWx1ZXMuZm9yRWFjaCgodiwgaWR4KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmICh2Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHYodmFsdWVDYWxsYmFjayhpZHgpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFsdWVDYWxsYmFjayhpZHgpKHYoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXQsXG4gIH07XG59XG4iLCIvKipcbiAqIFNpbXBsZSBRdWV1ZSB0aGF0IGFsbG93cyBmb3IgYSBjb25maWd1cmVkIG51bWJlciBvZiBjb25jdXJyZW50IGl0ZW1zIHRvIGJlIGV4ZWN1dGVkIGJ5IGEgaGFuZGxlci5cbiAqXG4gKiBVc2FnZTpcbiAqIGxldCBvcHRpb25zID0ge1xuICogICAgIC8vIG51bWJlciBvZiBpdGVtcyB0aGF0IGNhbiBiZSBwcm9jZXNzZWQgYXQgb25jZVxuICogICAgIGNvbmN1cnJlbmN5OiAxLFxuICogICAgIC8vIGRlbGF5IGluIHRoZSBzdGFydCBvZiB0aGUgcHJvY2Vzc2luZyBpbiBtc1xuICogICAgIGRlbGF5OiAyMDAsXG4gKiAgICAgLy8gbWF4IHNpemUgb2YgdGhlIHF1ZXVlXG4gKiAgICAgc2l6ZTogMTAwXG4gKiB9XG4gKlxuICogbGV0IHEgPSBxdWV1ZSgoaXRlbSwgZG9uZSkgPT4ge1xuICogICAgIC8vIGRvIHNvbWUgd29yayB3aXRoIGl0ZW0gdGhhdCB0YWtlcyAxcywgc2ltdWxhdGVkIGhlcmUgd2l0aCBzZXRUaW1lb3V0XG4gKiAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gKiAgICAgICAgIGRvbmUoKVxuICogICAgIH0sIDEwMDApXG4gKiB9LCBvcHRpb25zKVxuICpcbiAqIGxldCBteV9pdGVtID0gLi4uXG4gKiBpZiAoIXEub2ZmZXIobXlfaXRlbSkpIHtcbiAqICAgICB0aHJvdyBcIlVuYWJsZSB0byBhZGQgaXRlbSB0byBxdWV1ZVwiXG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHF1ZXVlKGhhbmRsZXIsIG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBfaGFuZGxlciA9IGhhbmRsZXI7XG4gIGNvbnN0IF9jb25jdXJyZW5jeSA9IE1hdGgubWF4KG9wdGlvbnMuY29uY3VycmVuY3ksIDEpIHx8IDE7XG4gIGNvbnN0IF9kZWxheSA9IE1hdGgubWF4KG9wdGlvbnMuZGVsYXksIDApIHx8IDA7XG4gIGNvbnN0IF9zaXplID0gTWF0aC5tYXgob3B0aW9ucy5zaXplLCAwKSB8fCAwO1xuICBjb25zdCBfcXVldWUgPSBbXTtcbiAgY29uc3QgX3dvcmtpbmcgPSBbXTtcbiAgbGV0IF9pZCA9IDA7XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBmdW5jdGlvbiBfbmV4dCgpIHtcbiAgICBpZiAoX3dvcmtpbmcubGVuZ3RoIDwgX2NvbmN1cnJlbmN5KSB7XG4gICAgICBjb25zdCBuZXh0ID0gX3F1ZXVlLnNoaWZ0KCk7XG4gICAgICBpZiAobmV4dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGlkID0gKytfaWQ7XG4gICAgICAgIGNvbnN0IGRvbmUgPSAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBfd29ya2luZy5pbmRleE9mKGlkKTtcbiAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgX3dvcmtpbmcuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIF9uZXh0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBmaXJlID0gKCkgPT4gX2hhbmRsZXIuYXBwbHkodW5kZWZpbmVkLCBbbmV4dC5pdGVtLCBkb25lXSk7XG4gICAgICAgIF93b3JraW5nLnB1c2goaWQpO1xuICAgICAgICBpZiAoX2RlbGF5KSB7XG4gICAgICAgICAgc2V0VGltZW91dChmaXJlLCBfZGVsYXkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZpcmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBPZmZlciBhIGl0ZW0gdG8gdGhlIHF1ZXVlIHRvIGJlIHByb2Nlc3NlZCBieSB0aGUgaGFuZGxlci4gUmV0dXJucyBUcnVlIGlmIHRoZSBxdWV1ZVxuICAgKiBhY2NlcHRlZCB0aGUgaXRlbSwgRmFsc2UgaWYgdGhlIHF1ZXVlIGhhcyByZWFjaGVkIGl0J3MgbWF4IHNpemUuXG4gICAqL1xuICBmdW5jdGlvbiBvZmZlcihpdGVtKSB7XG4gICAgaWYgKCFfc2l6ZSB8fCBfcXVldWUubGVuZ3RoIDwgX3NpemUpIHtcbiAgICAgIF9xdWV1ZS5wdXNoKHtcbiAgICAgICAgaXRlbSxcbiAgICAgIH0pO1xuICAgICAgX25leHQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9mZmVyLFxuICB9O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBudW1iZXIgfCBNYXhpdW11bSBudW1iZXIgb2YgZmlsZXMgdGhhdCBVcGxvYWRKcyB3aWxsIGFsbG93IHRvIGNvbnRhaW4uXG4gICAqL1xuICBtYXg6IDEwLFxuXG4gIC8qKlxuICAgKiBvYmplY3Q6IHtcbiAgICogICBrZXk6IGFycmF5XG4gICAqIH1cbiAgICogZGVmaW5lZCBncm91cGluZyBvZiBmaWxlIHR5cGVzIGZvciBhbGxvd2VkX3R5cGVzIGJ5IE1JTUUgdHlwZVxuICAgKi9cbiAgdHlwZXM6IHtcbiAgICBpbWFnZXM6IFsnaW1hZ2UvanBnJywgJ2ltYWdlL2pwZWcnLCAnaW1hZ2UvcG5nJywgJ2ltYWdlL2dpZiddLFxuICB9LFxuICAvKipcbiAgICogYXJyYXkgfCBUaGUgYWxsb3dlZCBmaWxlIHR5cGVzIHRoYXQgY2FuIGJlIHVwbG9hZGVkLiBFaXRoZXIgTUlNRSB0eXBlIG9mIGdyb3VwaW5nIGtleSAoc2VlXG4gICAqICAgICAgICAgdHlwZXMpXG4gICAqL1xuICBhbGxvd2VkX3R5cGVzOiBbJ2ltYWdlcyddLFxuXG4gIC8qKlxuICAgKiBIdHRwIHVwbG9hZCBvcHRpb25zXG4gICAqL1xuICB1cGxvYWQ6IHtcbiAgICAvKipcbiAgICAgKiBzdHJpbmcgfCBUaGUgVVJMIHRoYXQgaXMgY2FsbGVkIHdoZW4gdXBsb2FkaW5nIGEgZmlsZVxuICAgICAqL1xuICAgIHVybDogJycsXG4gICAgLyoqXG4gICAgICogc3RyaW5nIHwgVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciB0aGF0IGVhY2ggZmlsZSBpcyBzZXQgYXMgaW4gdGhlIHVwbG9hZCByZXF1ZXN0LlxuICAgICAqL1xuICAgIHBhcmFtOiAnZmlsZScsXG4gICAgLyoqXG4gICAgICogb2JqZWN0IHwgS2V5ZWQgb2JqZWN0IG9mIGFkZGl0aW9uYWwgcGFyYW1ldGVycyB0byBzZW5kIHdpdGggdGhlIHVwbG9hZCByZXF1ZXN0LlxuICAgICAqL1xuICAgIGFkZGl0aW9uYWxQYXJhbXM6IHt9LFxuICAgIC8qKlxuICAgICAqIG9iamVjdCB8IEtleWVkIG9iamVjdCBvZiBhZGRpdGlvbmFsIGhlYWRlcnMgdG8gc2VuZCB3aXRoIHRoZSB1cGxvYWQgcmVxdWVzdC5cbiAgICAgKi9cbiAgICBoZWFkZXJzOiB7fSxcbiAgfSxcblxuICAvKipcbiAgICogSHR0cCBkZWxldGUgb3B0aW9uc1xuICAgKi9cbiAgZGVsZXRlOiB7XG4gICAgLyoqXG4gICAgICogc3RyaW5nIHwgVGhlIFVSTCB0aGF0IGlzIGNhbGxlZCB3aGVuIGRlbGV0aW5nIGEgZmlsZVxuICAgICAqL1xuICAgIHVybDogJycsXG4gICAgLyoqXG4gICAgICogc3RyaW5nIHwgVGhlIG5hbWUgb2YgdGhlIHBhcmFtZXRlciBzZXQgd2l0aCB0aGUgZmlsZSBpZCB0aGF0IGlzIHNldCBvbiB0aGUgZGVsZXRpb24gcmVxdWVzdC5cbiAgICAgKi9cbiAgICBwYXJhbTogJ2ZpbGUnLFxuICAgIC8qKlxuICAgICAqIG9iamVjdCB8IEtleWVkIG9iamVjdCBvZiBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgdG8gc2VuZCB3aXRoIHRoZSBkZWxldGUgcmVxdWVzdC5cbiAgICAgKi9cbiAgICBhZGRpdGlvbmFsUGFyYW1zOiB7fSxcbiAgICAvKipcbiAgICAgKiBvYmplY3QgfCBLZXllZCBvYmplY3Qgb2YgYWRkaXRpb25hbCBoZWFkZXJzIHRvIHNlbmQgd2l0aCB0aGUgZGVsZXRlIHJlcXVlc3QuXG4gICAgICovXG4gICAgaGVhZGVyczoge30sXG4gIH0sXG59O1xuIiwiaW1wb3J0IHsgYWRkQ2xhc3MsIGFwcGVuZCwgbWFrZSwgb24sIGRhdGEgfSBmcm9tICcuL2RvbSc7XG5pbXBvcnQgaXRlbSwgeyBUWVBFX0lNQUdFIH0gZnJvbSAnLi9pdGVtJztcblxuZnVuY3Rpb24gbWFrZUFkZCgpIHtcbiAgY29uc3QgZWxlID0gbWFrZSgnZGl2JywgeyBjbGFzczogJ2l0ZW0gbmV3JyB9KTtcbiAgY29uc3QgaWNvbiA9IG1ha2UoJ2RpdicsIHsgY2xhc3M6ICdpY29uIHBsdXMnIH0pO1xuICBhcHBlbmQoZWxlLCBpY29uKTtcbiAgcmV0dXJuIGVsZTtcbn1cblxuZnVuY3Rpb24gbWFrZVBpY2tlcih0cmlnZ2VyLCBldmVudHMpIHtcbiAgY29uc3QgZWxlID0gbWFrZSgnaW5wdXQnLCB7XG4gICAgdHlwZTogJ2ZpbGUnLFxuICAgIG11bHRpcGxlOiAnbXVsdGlwbGUnLFxuICB9KTtcbiAgb24oZWxlLCAnY2hhbmdlJywgKCkgPT4ge1xuICAgIGNvbnN0IGlkID0gRGF0ZS5ub3coKTtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGVsZS5maWxlcy5sZW5ndGg7IHgrKykge1xuICAgICAgZXZlbnRzLnRyaWdnZXIoJ2ZpbGUucGlja2VkJywgeyBmaWxlOiBlbGUuZmlsZXMuaXRlbSh4KSwgaWQ6IGAke3h9XyR7aWR9YCB9KTtcbiAgICB9XG4gIH0pO1xuICBvbih0cmlnZ2VyLCAnY2xpY2snLCBlbGUuY2xpY2suYmluZChlbGUpKTtcbiAgcmV0dXJuIGVsZTtcbn1cblxuLyoqXG4gKiBUaGUgY29udGFpbmVyIG1vZHVsZSBpcyBhIHdyYXBwZXIgYXJvdW5kIHRoZSB1cGxvYWQgY29udGFpbmVyLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjb250YWluZXIoZWxlLCBpdGVtcywgZXZlbnRzKSB7XG4gIGFkZENsYXNzKGVsZSwgJ3VwbG9hZGpzJyk7XG5cbiAgY29uc3QgX2l0ZW1zID0gbWFrZSgnZGl2JywgeyBjbGFzczogJ3VwbG9hZGpzLWNvbnRhaW5lcicgfSk7XG4gIGFwcGVuZChfaXRlbXMsIC4uLml0ZW1zKTtcblxuICBjb25zdCBfYWN0aW9ucyA9IG1ha2UoJ2RpdicsIHsgY2xhc3M6ICd1cGxvYWRqcy1jb250YWluZXInIH0pO1xuICBhcHBlbmQoZWxlLCBfaXRlbXMsIF9hY3Rpb25zKTtcblxuICBjb25zdCBfYWRkID0gbWFrZUFkZCgpO1xuICBhcHBlbmQoX2FjdGlvbnMsIF9hZGQpO1xuICBhcHBlbmQoZWxlLCBtYWtlUGlja2VyKF9hZGQsIGV2ZW50cykpO1xuXG4gIGV2ZW50cy5vbigndXBsb2FkLmFkZGVkJywgKHsgZmlsZSwgaWQgfSkgPT4ge1xuICAgIGNvbnN0IGkgPSBpdGVtKHsgdHlwZTogVFlQRV9JTUFHRSwgZmlsZUlkOiBpZCwgZmlsZSwgZXZlbnRzIH0pO1xuICAgIGFwcGVuZChfaXRlbXMsIGkpO1xuICB9KTtcblxuICBpdGVtcy5zcGxpY2UoMCwgaXRlbXMubGVuZ3RoKTtcblxuICByZXR1cm4gZGF0YShlbGUsICd1cGxvYWQnLCB7XG4gICAgdXJsOiAndXBsb2FkLnVybCcsXG4gICAgcGFyYW06ICd1cGxvYWQucGFyYW0nLFxuICAgIGRlbGV0ZVVybDogJ2RlbGV0ZS51cmwnLFxuICAgIGRlbGV0ZVBhcmFtOiAnZGVsZXRlLnBhcmFtJyxcbiAgICBhbGxvd2VkVHlwZXM6ICdhbGxvd2VkX3R5cGVzJyxcbiAgICBhZGRpdGlvbmFsUGFyYW06ICd1cGxvYWQuYWRkaXRpb25hbFBhcmFtcycsXG4gICAgaGVhZGVyOiAndXBsb2FkLmhlYWRlcnMnLFxuICAgIGRlbGV0ZUFkZGl0aW9uYWxQYXJhbTogJ2RlbGV0ZS5hZGRpdGlvbmFsUGFyYW1zJyxcbiAgICBkZWxldGVIZWFkZXI6ICdkZWxldGUuaGVhZGVycycsXG4gIH0pO1xufVxuIiwiLyoqXG4gKiBSZXR1cm5zIGEgYXJyYXkgb2YgY2hpbGQgZWxlbWVudHMgb2YgdGhlIHBhc3NlZCBlbGVtZW50IHRoYXQgbWF0Y2ggdGhlIHBhc3NlZCB0eXBlLiBUeXBlIGlzXG4gKiBvcHRpb25hbCwgaWYgbm90IGRlZmluZWQgd2lsbCBtYXRjaCBhbGwgY2hpbGRyZW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGlsZHJlbihlbGUsIHR5cGUpIHtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGNvbnN0IGMgPSBlbGUuY2hpbGRyZW47XG4gIGNvbnN0IG5hbWUgPSAodHlwZSB8fCAnJykudG9Mb3dlckNhc2UoKTtcbiAgZm9yIChsZXQgeCA9IDA7IHggPCBjLmxlbmd0aDsgeCsrKSB7XG4gICAgY29uc3QgY2hpbGQgPSBjLml0ZW0oeCk7XG4gICAgaWYgKCF0eXBlIHx8IGNoaWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG5hbWUpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGNoaWxkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBZGRzIHRoZSBwYXNzZWQgY2xhc3NlcyB0byB0aGUgcGFzc2VkIERPTSBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkQ2xhc3MoZWxlLCAuLi5jbHMpIHtcbiAgY29uc3QgY2xhc3NlcyA9ICEhZWxlLmNsYXNzTmFtZSA/IGVsZS5jbGFzc05hbWUuc3BsaXQoJyAnKSA6IFtdO1xuICBjbHMuZm9yRWFjaCgoYykgPT4ge1xuICAgIGlmIChjbGFzc2VzLmluZGV4T2YoYykgPCAwKSB7XG4gICAgICBjbGFzc2VzLnB1c2goYyk7XG4gICAgfVxuICB9KTtcbiAgZWxlLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpO1xufVxuXG4vKipcbiAqIFJlbW92ZXMgdGhlIHBhc3NlZCBjbGFzc2VzIGZyb20gdGhlIHBhc3NlZCBET00gZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZSwgLi4uY2xzKSB7XG4gIGNvbnN0IGNsYXNzZXMgPSAhIWVsZS5jbGFzc05hbWUgPyBlbGUuY2xhc3NOYW1lLnNwbGl0KCcgJykgOiBbXTtcbiAgY2xzLmZvckVhY2goKGMpID0+IHtcbiAgICBjb25zdCBpbmRleCA9IGNsYXNzZXMuaW5kZXhPZihjKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgY2xhc3Nlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfSk7XG4gIGVsZS5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oJyAnKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuZCByZXR1c24gYSBuZXcgRE9NIGVsZW1lbnQgd2l0aCB0aGUgZGVmaW5lZCBuYW1lLiBBdHRyaWJ1dGVzIGlzIG9wdGlvbmFsLCBtdXN0IGJlIGFuXG4gKiBvYmplY3QsIGlmIGRlZmluZWQgc2V0cyB0aGUgYXR0cmlidXRlIGtleSBhbmQgdmFsdWUgZnJvbSB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0aWVzIG9uIHRoZSBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYWtlKG5hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgY29uc3QgZWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKTtcbiAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKVxuICAgICAgLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSAnY2xhc3MnKSB7XG4gICAgICAgICAgYWRkQ2xhc3MoZWxlLCAuLi4oYXR0cmlidXRlc1trZXldIHx8ICcnKS5zcGxpdCgnICcpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGUuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cbiAgcmV0dXJuIGVsZTtcbn1cblxuLyoqXG4gKiBBcHBlbmRzIHRoZSBwYXNzZWQgY2hpbGRyZW4gdG8gdGhlIHBhc3NlZCBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kKGVsZSwgLi4uYXBwZW5kQ2hpbGRyZW4pIHtcbiAgYXBwZW5kQ2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICBlbGUuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbWFrZU1hcmtlcktleShrZXksIHBvc3RmaXgpIHtcbiAgcmV0dXJuIGB1cC1tYXJrZXItJHtrZXl9LSR7cG9zdGZpeH1gO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXJrZXIgdGhhdCBpcyBhcHBlbmRlZCB0byB0aGUgZWxlbWVudCB3aXRoIHRoZSBkZWZpbmVkIGtleS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcmtlcihlbGUsIGtleSkge1xuICBhcHBlbmQoXG4gICAgZWxlLFxuICAgIGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQobWFrZU1hcmtlcktleShrZXksICdzdGFydCcpKSxcbiAgICBkb2N1bWVudC5jcmVhdGVDb21tZW50KG1ha2VNYXJrZXJLZXkoa2V5LCAnZW5kJykpXG4gICk7XG59XG5cbi8qKlxuICogUmVwbGFjZXMgdGhlIGNvbnRlbnQgaW5zaWRlIHRoZSBtYXJrZXIgYW5kIHJlcGxhY2VzIGl0IHdpdGggdGhlIHN1cHBsaWVkIGNvbnRlbnRzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXBsYWNlTWFya2VyKGVsZSwga2V5LCAuLi5jb250ZW50cykge1xuICBjb25zdCBtYXJrZXJTdGFydCA9IG1ha2VNYXJrZXJLZXkoa2V5LCAnc3RhcnQnKTtcbiAgY29uc3QgbWFya2VyRW5kID0gbWFrZU1hcmtlcktleShrZXksICdlbmQnKTtcbiAgbGV0IHByb2Nlc3NpbmcgPSBmYWxzZTtcblxuICBsZXQgbm9kZSA9IGVsZS5maXJzdENoaWxkO1xuICBjb25zdCBpbnNlcnQgPSAodG8sIG4pID0+IG5vZGUucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobiwgdG8pO1xuXG4gIHdoaWxlIChub2RlKSB7XG4gICAgaWYgKG5vZGUubm9kZVR5cGUgPT09IDgpIHtcbiAgICAgIGlmIChub2RlLm5vZGVWYWx1ZSA9PT0gbWFya2VyU3RhcnQpIHtcbiAgICAgICAgcHJvY2Vzc2luZyA9IHRydWU7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5ub2RlVmFsdWUgPT09IG1hcmtlckVuZCkge1xuICAgICAgICBjb250ZW50cy5mb3JFYWNoKGluc2VydC5iaW5kKHVuZGVmaW5lZCwgbm9kZSkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb2Nlc3NpbmcpIHtcbiAgICAgIGNvbnN0IG5leHQgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgbm9kZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xuICAgICAgbm9kZSA9IG5leHQ7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBub2RlID0gbm9kZS5uZXh0U2libGluZztcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGNoaWxkIG5vZGVzIGZyb20gdGhlIHBhc3NlZCBlbGVtZW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHkoZWxlKSB7XG4gIHdoaWxlIChlbGUuZmlyc3RDaGlsZCkge1xuICAgIGVsZS5yZW1vdmVDaGlsZChlbGUuZmlyc3RDaGlsZCk7XG4gIH1cbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBhdHRyaWJ1dGVzIGZyb20gdGhlIHBhc3NlZCBlbGVtZW50IGFuZCByZXR1cm5zIGEga2V5ZWQgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXR0cnMoZWxlLCAuLi5hdHRyaWJ1dGVzKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBhdHRyaWJ1dGVzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICByZXN1bHRbYXR0cl0gPSBlbGUuZ2V0QXR0cmlidXRlKGF0dHIpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBZGRzIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBwYXNzZWQgZWxlbWVudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uKGVsZSwgZXZlbnQsIGhhbmRsZXIpIHtcbiAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHZhbHVlIG9uIHRoZSBvYmplY3QgdXNpbmcgdGhlIHBhdGguIEdyb3dzIHRoZSBvYmplY3QgZGVlcCB1bnRpbCB0aGUgZW5kIG9mIHRoZSBwYXRoIGlzXG4gKiByZWFjaGVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0KG9iaiwgcGF0aCwgdmFsKSB7XG4gIGxldCBzZXRPbiA9IG9iajtcbiAgY29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gIGNvbnN0IGxhc3QgPSBwYXJ0cy5wb3AoKTtcbiAgcGFydHMuZm9yRWFjaCgocGFydCkgPT4ge1xuICAgIGxldCBuZXh0ID0gc2V0T25bcGFydF07XG4gICAgaWYgKCFuZXh0KSB7XG4gICAgICBuZXh0ID0ge307XG4gICAgICBzZXRPbltwYXJ0XSA9IG5leHQ7XG4gICAgfVxuICAgIHNldE9uID0gbmV4dDtcbiAgfSk7XG4gIGlmICh0eXBlb2Ygc2V0T24gPT09ICdvYmplY3QnKSB7XG4gICAgc2V0T25bbGFzdF0gPSB2YWw7XG4gIH1cbn1cblxuLyoqXG4gKiBFeHRyYWN0cyBkYXRhIGF0dHJpYnV0ZXMgZnJvbSB0aGUgcGFzc2VkIGVsZW1lbnQgd2hlcmUgdGhleSBzdGFydCB3aXRoIHRoZSBwcmVmaXggYW5kIHJldHVybnMgYVxuICoga2V5IG9iamVjdC4gQW4gb3B0aW9uYWwgc2hhcGUgcGFyYW1ldGVyIGNhbiBiZSBkZWZpbmVkIHRoYXQgZGVmaW5lcyB0aGUgc2hhcGUgb2YgdGhlIHJlc3VsdC5cbiAqIEZvciBleGFtcGxlOlxuICogc2hhcGUgPSB7IHRlc3Q6ICdzb21lLmJpdCcsIG90aGVyOiAndGhpbmcnIH1cbiAqIDwuLi4gZGF0YS10ZXN0LWtleTE9XCJ2YWxcIiBkYXRhLW90aGVyPVwidmFsMlwiIC8+XG4gKiByZXN1bHQgPSB7IHNvbWU6IHsgYml0OiB7IGtleTE6ICd2YWwnIH0gfSwgdGhpbmc6ICd2YWwyJyB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkYXRhKGVsZSwgcHJlZml4ID0gJycsIHNoYXBlID0ge30pIHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIE9iamVjdC5rZXlzKGVsZS5kYXRhc2V0KVxuICAgIC5maWx0ZXIoa2V5ID0+IGtleS5zdGFydHNXaXRoKHByZWZpeCkpXG4gICAgLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgbGV0IGFkanVzdGVkID0ga2V5LnN1YnN0cihwcmVmaXgubGVuZ3RoKTtcbiAgICAgIGFkanVzdGVkID0gYWRqdXN0ZWQuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBhZGp1c3RlZC5zbGljZSgxKTtcbiAgICAgIGxldCBwYXRoID0gJyc7XG4gICAgICBsZXQgYmVzdCA9IDA7XG4gICAgICBPYmplY3Qua2V5cyhzaGFwZSkuZm9yRWFjaCgoc2spID0+IHtcbiAgICAgICAgY29uc3QgaWR4ID0gYWRqdXN0ZWQuaW5kZXhPZihzayk7XG4gICAgICAgIGlmIChpZHggPj0gMCAmJiBiZXN0IDwgc2subGVuZ3RoKSB7XG4gICAgICAgICAgYmVzdCA9IHNrLmxlbmd0aDtcbiAgICAgICAgICBjb25zdCByZXN0ID0gYWRqdXN0ZWQuc2xpY2Uoc2subGVuZ3RoKTtcbiAgICAgICAgICBwYXRoID0gc2hhcGVbc2tdICsgKHJlc3QgPyBgLiR7cmVzdC5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIHJlc3Quc2xpY2UoMSl9YCA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzZXQocmVzdWx0LCBwYXRoIHx8IGFkanVzdGVkLCBlbGUuZGF0YXNldFtrZXldKTtcbiAgICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7IG1ha2UsIGFwcGVuZCwgbWFya2VyLCByZXBsYWNlTWFya2VyLCBhZGRDbGFzcywgcmVtb3ZlQ2xhc3MsIG9uIH0gZnJvbSAnLi9kb20nO1xuXG5leHBvcnQgY29uc3QgVFlQRV9JTUFHRSA9ICdpbWFnZSc7XG5cbi8qKlxuICogUmVuZGVycyBhIGl0ZW0gdHlwZSBvZiBpbWFnZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGltYWdlUmVuZGVyZXIoZGF0YSkge1xuICBpZiAoZGF0YS5maWxlKSB7XG4gICAgY29uc3QgZWxlID0gbWFrZSgnaW1nJyk7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICByZWFkZXIub25sb2FkID0gKGUpID0+IHtcbiAgICAgIGVsZS5zZXRBdHRyaWJ1dGUoJ3NyYycsIGUudGFyZ2V0LnJlc3VsdCk7XG4gICAgfTtcbiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChkYXRhLmZpbGUpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkYXRhLCB7IGVsZSB9KTtcbiAgfVxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBlbGU6IG1ha2UoJ2ltZycsIHsgc3JjOiBkYXRhLnNyYyB9KSB9KTtcbn1cblxuLyoqXG4gKiBNYXAgb2YgcmVuZGVyZXJzIGJ5IHR5cGUuXG4gKi9cbmNvbnN0IHJlbmRlcmVycyA9IHtcbiAgTk9PUDogKCkgPT4gbWFrZSgnZGl2JyksXG4gIFtUWVBFX0lNQUdFXTogaW1hZ2VSZW5kZXJlcixcbn07XG5cbi8qKlxuICogV3JhcHBpbmcgRE9NIGFyb3VuZCB0aGUgaXRlbSBET01cbiAqL1xuZnVuY3Rpb24gd3JhcChkYXRhKSB7XG4gIGNvbnN0IGlzVXBsb2FkaW5nID0gISFkYXRhLmZpbGU7XG4gIGNvbnN0IHJvb3QgPSBtYWtlKCdkaXYnLCB7XG4gICAgY2xhc3M6IFsnaXRlbSddLmNvbmNhdChpc1VwbG9hZGluZyA/IFsndXBsb2FkaW5nJ10gOiBbXSkuam9pbignICcpLFxuICB9KTtcbiAgYXBwZW5kKHJvb3QsIGRhdGEuZWxlKTtcbiAgbWFya2VyKHJvb3QsICdzdGF0dXMnKTtcbiAgbWFya2VyKHJvb3QsICdhY3Rpb25zJyk7XG5cbiAgbGV0IF9wcm9ncmVzcztcbiAgaWYgKGlzVXBsb2FkaW5nKSB7XG4gICAgX3Byb2dyZXNzID0gbWFrZSgnZGl2JywgeyBjbGFzczogJ3Byb2dyZXNzJyB9KTtcbiAgICByZXBsYWNlTWFya2VyKFxuICAgICAgcm9vdCxcbiAgICAgICdzdGF0dXMnLFxuICAgICAgbWFrZSgnZGl2JywgeyBjbGFzczogJ3NwaW5uZXInIH0pLFxuICAgICAgbWFrZSgnZGl2JywgeyBjbGFzczogJ2ljb24gdXBsb2FkJyB9KSxcbiAgICAgIF9wcm9ncmVzc1xuICAgICk7XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZGF0YSwgeyBlbGU6IHJvb3QsIF9wcm9ncmVzcyB9KTtcbn1cblxuLyoqXG4gKiBNYWtlcyB0aGUgYXBwcm9wcmlhdGUgc3RhdHVzIGljb24gYW5kIGFwcGVuZHMgdG8gdGhlIHN0YXR1cyBtYXJrZXIuIFRoZW4gcmVtb3ZlcyBhZnRlciBhIHNob3J0XG4gKiBwZXJpb2QuXG4gKi9cbmZ1bmN0aW9uIHN0YXR1cyhlbGUsIHN0LCBkb25lKSB7XG4gIGNvbnN0IHMgPSBtYWtlKCdkaXYnLCB7IGNsYXNzOiBgaWNvbiAke3N0fWAgfSk7XG4gIGFwcGVuZChzLCBtYWtlKCdpJykpO1xuICByZXBsYWNlTWFya2VyKGVsZSwgJ3N0YXR1cycsIHMpO1xuXG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGFkZENsYXNzKHMsICdnb2luZycpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVwbGFjZU1hcmtlcihlbGUsICdzdGF0dXMnKTtcbiAgICAgIHJlbW92ZUNsYXNzKHMsICdnb2luZycpO1xuXG4gICAgICBpZiAoZG9uZSkge1xuICAgICAgICBkb25lKCk7XG4gICAgICB9XG4gICAgfSwgMjAwMCk7XG4gIH0sIDIwMDApO1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbGwgdXBsb2FkIGV2ZW50c1xuICovXG5mdW5jdGlvbiByZW1vdmVVcGxvYWRFdmVudHMoZGF0YSkge1xuICBkYXRhLmV2ZW50cy5vZmYoJ3VwbG9hZC5hZGRlZCcsIGRhdGEuZmlsZUlkKTtcbiAgZGF0YS5ldmVudHMub2ZmKCd1cGxvYWQuc3RhcnRlZCcsIGRhdGEuZmlsZUlkKTtcbiAgZGF0YS5ldmVudHMub2ZmKCd1cGxvYWQucHJvZ3Jlc3MnLCBkYXRhLmZpbGVJZCk7XG4gIGRhdGEuZXZlbnRzLm9mZigndXBsb2FkLmRvbmUnLCBkYXRhLmZpbGVJZCk7XG4gIGRhdGEuZXZlbnRzLm9mZigndXBsb2FkLmZhaWxlZCcsIGRhdGEuZmlsZUlkKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYWxsIGRlbGV0ZSBldmVudHNcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlRGVsZXRlRXZlbnRzKGRhdGEpIHtcbiAgZGF0YS5ldmVudHMub2ZmKCdkZWxldGUuYWRkZWQnLCBkYXRhLmZpbGVJZCk7XG4gIGRhdGEuZXZlbnRzLm9mZignZGVsZXRlLnN0YXJ0ZWQnLCBkYXRhLmZpbGVJZCk7XG4gIGRhdGEuZXZlbnRzLm9mZignZGVsZXRlLmRvbmUnLCBkYXRhLmZpbGVJZCk7XG4gIGRhdGEuZXZlbnRzLm9mZignZGVsZXRlLmZhaWxlZCcsIGRhdGEuZmlsZUlkKTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGl0ZW1cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlKGVsZSwgZGF0YSkge1xuICBhZGRDbGFzcyhlbGUsICdyZW1vdmVkJyk7XG4gIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGVsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZSk7XG4gIH0sIDEwMDApO1xuXG4gIHJlbW92ZVVwbG9hZEV2ZW50cyhkYXRhKTtcbiAgcmVtb3ZlRGVsZXRlRXZlbnRzKGRhdGEpO1xufVxuXG4vKipcbiAqIEFkZCBkZWxldGlvbiBsaXN0ZW5lcnMgdG8gdGhlIGV2ZW50c1xuICovXG5mdW5jdGlvbiBvbkRlbGV0ZShlbGUsIGRhdGEpIHtcbiAgZGF0YS5ldmVudHMub24oJ2RlbGV0ZS5hZGRlZCcsIGRhdGEuaWQsICgpID0+IHtcbiAgICBhZGRDbGFzcyhlbGUsICdyZW1vdmluZycpO1xuXG4gICAgcmVwbGFjZU1hcmtlcihcbiAgICAgIGVsZSxcbiAgICAgICdzdGF0dXMnLFxuICAgICAgbWFrZSgnZGl2JywgeyBjbGFzczogJ3NwaW5uZXInIH0pLFxuICAgICAgbWFrZSgnZGl2JywgeyBjbGFzczogJ2ljb24gdHJhc2gnIH0pXG4gICAgKTtcbiAgfSk7XG5cbiAgZGF0YS5ldmVudHMub24oJ2RlbGV0ZS5kb25lJywgZGF0YS5pZCwgKCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVtb3ZlQ2xhc3MoZWxlLCAncmVtb3ZpbmcnKTtcbiAgICAgIHJlbW92ZShlbGUsIGRhdGEpO1xuICAgIH0sIDUwMCk7XG4gIH0pO1xuXG4gIGRhdGEuZXZlbnRzLm9uKCdkZWxldGUuZmFpbGVkJywgZGF0YS5pZCwgKCkgPT4ge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVtb3ZlQ2xhc3MoZWxlLCAncmVtb3ZpbmcnKTtcbiAgICAgIHN0YXR1cyhlbGUsICdlcnJvcicpO1xuICAgIH0sIDUwMCk7XG4gIH0pO1xufVxuXG4vKipcbiAqIE1ha2VzIHRoZSBhY3Rpb25zIGJhciBET01cbiAqL1xuZnVuY3Rpb24gbWFrZUFjdGlvbnMoZWxlLCBkYXRhKSB7XG4gIGlmIChkYXRhLmlkKSB7XG4gICAgY29uc3QgYWN0aW9ucyA9IG1ha2UoJ2RpdicsIHsgY2xhc3M6ICdhY3Rpb25zJyB9KTtcbiAgICBjb25zdCBkZWwgPSBtYWtlKCdkaXYnLCB7IGNsYXNzOiAnYWN0aW9uIGRlbCcgfSk7XG4gICAgYXBwZW5kKGFjdGlvbnMsIGRlbCk7XG4gICAgYXBwZW5kKGRlbCwgbWFrZSgnZGl2JywgeyBjbGFzczogJ3RyYXNoJyB9KSk7XG4gICAgcmVwbGFjZU1hcmtlcihlbGUsICdhY3Rpb25zJywgYWN0aW9ucyk7XG5cbiAgICBvbihkZWwsICdjbGljaycsICgpID0+IGRhdGEuZXZlbnRzLnRyaWdnZXIoJ2ZpbGUuZGVsZXRlJywgeyBpZDogZGF0YS5pZCB9KSk7XG4gICAgb25EZWxldGUoZWxlLCBkYXRhKTtcbiAgfSBlbHNlIHtcbiAgICBhZGRDbGFzcyhlbGUsICdzdGF0aWMnKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZCB1cGxvYWQgbGlzdGVuZXJzIHRvIHRoZSBldmVudHNcbiAqL1xuZnVuY3Rpb24gb25VcGxvYWQoZWxlLCBwcm9ncmVzc0VsZSwgZGF0YSkge1xuICBkYXRhLmV2ZW50cy5vbigndXBsb2FkLnByb2dyZXNzJywgZGF0YS5maWxlSWQsICh7IHByb2dyZXNzIH0pID0+IHtcbiAgICBjb25zdCB2YWwgPSAwIC0gKDEwMCAtIHByb2dyZXNzKTtcbiAgICBwcm9ncmVzc0VsZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke3ZhbH0lKWA7XG4gIH0pO1xuXG4gIGRhdGEuZXZlbnRzLm9uKCd1cGxvYWQuZG9uZScsIGRhdGEuZmlsZUlkLCAoeyBpZCB9KSA9PiB7XG4gICAgZGF0YS5pZCA9IGlkO1xuICAgIHN0YXR1cyhlbGUsICdkb25lJyk7XG4gICAgcmVtb3ZlQ2xhc3MoZWxlLCAndXBsb2FkaW5nJyk7XG4gICAgbWFrZUFjdGlvbnMoZWxlLCBkYXRhKTtcblxuICAgIHJlbW92ZVVwbG9hZEV2ZW50cyhkYXRhKTtcbiAgfSk7XG5cbiAgZGF0YS5ldmVudHMub24oJ3VwbG9hZC5mYWlsZWQnLCBkYXRhLmZpbGVJZCwgKCkgPT4ge1xuICAgIGFkZENsYXNzKGVsZSwgJ3N0b3BwZWQnKTtcbiAgICBzdGF0dXMoZWxlLCAnZXJyb3InLCAoKSA9PiB7XG4gICAgICByZW1vdmUoZWxlLCBkYXRhKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhlIGl0ZW0gbW9kdWxlIGlzIGEgd3JhcHBlciBhcm91bmQgYW4gaXRlbSBpbiB0aGUgY29udGFpbmVyIHRoYXQgdGhlIHVzZXIgY2FuIGludGVyYWN0IHdpdGguXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGl0ZW0oZGF0YSkge1xuICBjb25zdCBfd3JhcHBlciA9IHdyYXAoKHJlbmRlcmVyc1tkYXRhLnR5cGVdIHx8IHJlbmRlcmVycy5OT09QKShkYXRhKSk7XG5cbiAgaWYgKGRhdGEuZmlsZUlkKSB7XG4gICAgb25VcGxvYWQoX3dyYXBwZXIuZWxlLCBfd3JhcHBlci5fcHJvZ3Jlc3MsIGRhdGEpO1xuICB9IGVsc2Uge1xuICAgIG1ha2VBY3Rpb25zKF93cmFwcGVyLmVsZSwgZGF0YSk7XG4gIH1cblxuICByZXR1cm4gX3dyYXBwZXIuZWxlO1xufVxuIiwiaW1wb3J0IHsgY2hpbGRyZW4sIGVtcHR5LCBhdHRycyB9IGZyb20gJy4vZG9tJztcbmltcG9ydCBpdGVtLCB7IFRZUEVfSU1BR0UgfSBmcm9tICcuL2l0ZW0nO1xuaW1wb3J0IGNvbnRhaW5lciBmcm9tICcuL2NvbnRhaW5lcic7XG5cbmZ1bmN0aW9uIHBhcnNlSW1hZ2UoZWxlLCBldmVudHMpIHtcbiAgcmV0dXJuIGl0ZW0oXG4gICAgT2JqZWN0LmFzc2lnbih7IHR5cGU6IFRZUEVfSU1BR0UgfSxcbiAgICAgIGF0dHJzKGVsZSwgJ3NyYycpLCB7IGlkOiBlbGUuZGF0YXNldC51cGxvYWRJbWFnZUlkLCBldmVudHMgfVxuICAgIClcbiAgKTtcbn1cblxuLyoqXG4gKiBUaGUgcGFyc2UgbW9kdWxlIHBhcnNlcyB0aGUgRE9NIGVsZW1lbnQgYW5kIHJldHVybnMgYSBjb250YWluZXIgd3JhcHBlciBlbGVtZW50LlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZShlbGUsIGV2ZW50cykge1xuICBjb25zdCBpdGVtcyA9IGNoaWxkcmVuKGVsZSwgJ2ltZycpLm1hcChpbWcgPT4gcGFyc2VJbWFnZShpbWcsIGV2ZW50cykpO1xuICBlbXB0eShlbGUpO1xuICByZXR1cm4gY29udGFpbmVyKGVsZSwgaXRlbXMsIGV2ZW50cyk7XG59XG4iLCJpbXBvcnQgcGFyc2UgZnJvbSAnLi9yZW5kZXIvcGFyc2UnO1xuaW1wb3J0IGNvcmUgZnJvbSAnLi9jb3JlJztcbmltcG9ydCBodHRwIGZyb20gJy4vY29yZS91dGlsL2h0dHAnO1xuaW1wb3J0IGV2ZW50cyBmcm9tICcuL2NvcmUvdXRpbC9ldmVudHMnO1xuaW1wb3J0IG9wdGlvbnMgZnJvbSAnLi9jb3JlL3V0aWwvb3B0aW9ucyc7XG5pbXBvcnQgbWVyZ2UgZnJvbSAnLi9jb3JlL3V0aWwvbWVyZ2UnO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnO1xuXG4vKipcbiAqIEFsbG93cyBwbGFpbiB2YW5pbGxhIEphdmFTY3JpcHQgYWNjZXNzIHRvIHRoZSBVcGxvYWRKcyBXaWRnZXQuXG4gKlxuICogVXNhZ2U6XG4gKiB2YXIgZWxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteWlkXCIpO1xuICogdmFyIG9wdGlvbnMgPSB7IC4uLiB9XG4gKiBuZXcgVXBsb2FkSnMoZWxlLCBvcHRpb25zKVxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG53aW5kb3cuVXBsb2FkSnMgPSBjbGFzcyBVcGxvYWRKcyB7XG4gIGNvbnN0cnVjdG9yKGVsZSwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgX2V2ZW50cyA9IGV2ZW50cyhbXG4gICAgICAndXBsb2FkLmFkZGVkJyxcbiAgICAgICd1cGxvYWQuc3RhcnRlZCcsXG4gICAgICAndXBsb2FkLnByb2dyZXNzJyxcbiAgICAgICd1cGxvYWQuZG9uZScsXG4gICAgICAndXBsb2FkLmZhaWxlZCcsXG4gICAgICAnZGVsZXRlLmFkZGVkJyxcbiAgICAgICdkZWxldGUuc3RhcnRlZCcsXG4gICAgICAnZGVsZXRlLmRvbmUnLFxuICAgICAgJ2RlbGV0ZS5mYWlsZWQnLFxuICAgIF0pO1xuICAgIGNvbnN0IF91aUV2ZW50cyA9IGV2ZW50cyhbXG4gICAgICAnZmlsZS5waWNrZWQnLFxuICAgICAgJ2ZpbGUuZGVsZXRlJyxcbiAgICBdKTtcbiAgICBfZXZlbnRzLmVtaXQoX3VpRXZlbnRzKTtcblxuICAgIGNvbnN0IF9kYXRhT3B0cyA9IHBhcnNlKGVsZSwgX3VpRXZlbnRzKTtcbiAgICBjb25zdCBfb3B0cyA9IG9wdGlvbnMobWVyZ2Uoe30sIGRlZmF1bHRzLCBfZGF0YU9wdHMsIG9wdHMpKTtcbiAgICBjb25zdCBfY29yZSA9IGNvcmUoaHR0cCwgX2V2ZW50cywgX29wdHMpO1xuXG4gICAgX3VpRXZlbnRzLm9uKCdmaWxlLnBpY2tlZCcsIGV2ID0+IF9jb3JlLnVwbG9hZChldikpO1xuICAgIF91aUV2ZW50cy5vbignZmlsZS5kZWxldGUnLCBldiA9PiBfY29yZS5kZWwoZXYuaWQpKTtcbiAgfVxufTtcbiJdfQ==
