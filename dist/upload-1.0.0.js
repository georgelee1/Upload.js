/** Upload.js (1.0.0) | https://github.com/georgelee1/Upload.js | MIT (https://github.com/georgelee1/Upload.js/blob/master/LICENSE) */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Widget = undefined;

var _options = require("../util/options");

var _queue = require("../util/queue");

var _dom = require("../util/dom");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Why bother instantiating a Matcher when you can call the short convenience function
 * So instead of new Matcher().css(..) it's m().css(..)
 */
function m(bubble) {
    return new _dom.Matcher(bubble);
}

/**
 * Instead of instantiating a DOMList every time we can use this this tiny convenience function
 * So instead of new DOMList(..) it's just up(..)
 */
function up(arg) {
    return new _dom.DOMList(arg);
}

/**
 * The Widget class is the controller between the DOM elements (and user actions) and the backend.
 */

var Widget = exports.Widget = (function () {
    function Widget(ele, opts) {
        _classCallCheck(this, Widget);

        this._ele = up(ele);
        this._opts = new _options.Options(opts, this);
        this._size = 0;
        this._max = this._opts.get("max");
        this._queue = new _queue.Queue(this._next, {
            delay: this._opts.get("delay")
        });
        this._parser = new _dom.SimpleDOMParser();
        this._init();
    }

    /**
     * Sets up the DOM.
     * Creates and appends an INPUT of type file for the user to be able to pick files.
     * Adjusts any current IMG elements in the containing element.
     * Registers appropriate listeners.
     */

    _createClass(Widget, [{
        key: "_init",
        value: function _init() {
            var _this = this;

            this._ele.addClass("uploadjs");

            this._picker = up("input").attr({ "type": "file", "multiple": "multiple" }).appendTo(this._ele).on("change", this._picked.bind(this));

            this._ele.find("img").each(function (img) {
                if (!_this._max || _this._size < _this._max) {
                    var item = _this._parser.parse(_this._opts.get("template.item"));
                    item.find("img").attr("src", img.getAttribute("src"));
                    _this._parser.parse(_this._opts.get("template.actions")).appendTo(item);
                    item.appendTo(_this._ele);
                    _this._size++;
                }
                img.remove();
            });

            this._add = this._parser.parse(this._opts.get("template.add")).appendTo(this._ele);

            if (!this._max && this._size < this._max) {
                this._add.addClass("hide");
            }

            this._picker = this._picker.items[0];
            this._ele.on("click", m(true).css("item", "new"), this._picker.click.bind(this._picker));
            this._ele.on("click", m(true).css("del"), this._delete.bind(this));
        }

        /**
         * Fired when the user has selected files from the file selection.
         * Adds DOM elements to the containing elements in an uploading state
         * Adds upload to the queue
         */

    }, {
        key: "_picked",
        value: function _picked() {
            var _this2 = this;

            var files = this._picker.files;

            var _loop = function _loop(x) {
                var item = _this2._parser.parse(_this2._opts.get("template.item")).addClass("uploading");
                _this2._parser.parse(_this2._opts.get("template.uploading")).appendTo(item);

                var reader = new FileReader();
                reader.onload = function (e) {
                    item.find("img").attr("src", e.target.result);
                };
                reader.readAsDataURL(files[x]);
                item.before(_this2._add);
            };

            for (var x = 0; x < files.length; x++) {
                _loop(x);
            }
        }

        /**
         * Fired when the user has clicked the delete action from the actions bar
         * Sets the DOM element into a removing state
         * Adds deletion to the queue
         */

    }, {
        key: "_delete",
        value: function _delete(e) {}
    }]);

    return Widget;
})();

},{"../util/dom":4,"../util/options":5,"../util/queue":6}],2:[function(require,module,exports){
"use strict";

var _widget = require("./ui/widget");

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Default options for the UploadJs widget
 */
var DEFAULTS = {
    // template Strings
    "template": {
        "item": "div.item (img)",
        "add": "div.item.new (div.icon.plus)",
        "actions": "div.actions (div.action.bin (div.trash))",
        "deleting": "div.spinner div.icon.trash",
        "uploading": "div.spinner div.icon.upload div.progress",
        "done": "div.icon.done (i)",
        "error": "div.icon.error (i)"
    },
    "max": 0,
    "deletable": true,
    "url": {
        "upload": "...",
        "delete": "..."
    },
    "types": {
        "images": ["image/jpg", "image/jpeg", "image/png", "image/gif"]
    },
    "allowed_types": ["images"]
};

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
window.UploadJs =

/**
 * @param ele The
 * @param {object} opts - Optional. The widget settings.
 */
function UploadJs(ele) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, UploadJs);

    new _widget.Widget(ele, merge(DEFAULTS, opts));
};

/**
 * Simple object merging utility. Runs deep. Returns a new object, no modifications
 * are made to the original target and source.
 *
 * @param target The target object
 * @param source The source object
 * @returns {{}} The new instance of the merged objects
 */
function merge(target, source) {
    var clone = {};
    Object.keys(target).forEach(function (k) {
        if (_typeof(target[k]) === "object") {
            clone[k] = merge({}, target[k]);
        } else {
            clone[k] = target[k];
        }
    });
    Object.keys(source).forEach(function (k) {
        if (k in clone && _typeof(clone[k]) === "object" && _typeof(source[k]) === "object") {
            clone[k] = merge(clone[k], source[k]);
        } else {
            clone[k] = source[k];
        }
    });
    return clone;
}

},{"./ui/widget":1}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A simple cache. When attempting to add to a full cache entries are evicted to make space (LRU). The auto eviction only occurs when a
 * max size has been defined for the map.
 *
 * Usage:
 * let cache = new Cache(max=5)
 * cache.put("test", "val") === true
 * cache.put("test", "val2") === false
 * cache.get("test") === "val2"
 * cache.remove("test") === "val2"
 * cache.get("test") === undefined
 *
 * // auto eviction
 * cache.put("test", "val") === true
 * cache.put("test1", "val1") === true
 * cache.put("test2", "val2") === true
 * cache.put("test3", "val3") === true
 * cache.put("test4", "val4") === true
 * cache.put("test5", "val5") === true // evicts oldest
 * cache.get("test") === undefined
 *
 * @class
 */

var Cache = exports.Cache = (function () {
    function Cache() {
        var max = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

        _classCallCheck(this, Cache);

        this._max = max;
        this._map = {};
        this._head = {};
        this._tail = { prev: this._head };
        this._head.next = this._tail;
        this.length = 0;
    }

    /**
     * Get value mapped to the passed key in the cache.
     */

    _createClass(Cache, [{
        key: "get",
        value: function get(key) {
            var entry = this._map[key];
            this._insertAtTail(entry);
            return entry ? entry.val : undefined;
        }

        /**
         * Put the passed value mapped against the passed key in the cache. If a mapping with the same key already exists it will be overridden.
         * True is returned if this is a new mapping being added, otherwise false if being overridden.
         */

    }, {
        key: "put",
        value: function put(key, val) {
            if (this._max > 0 && this.length > 0 && this.length == this._max) {
                this.remove(this._head.next.key);
            }
            var entry = this._map[key],
                newEntry = true;
            if (entry) {
                entry.val = val;
                newEntry = false;
            } else {
                entry = { key: key, val: val };
                this._map[key] = entry;
                this.length++;
            }
            this._insertAtTail(entry);
            return newEntry;
        }

        /**
         * Remove the entry from the cache against the mapped key. Returns the current value mapped.
         */

    }, {
        key: "remove",
        value: function remove(key) {
            var entry = this._map[key];
            if (entry) {
                delete this._map[key];
                this._evict(entry);
                this.length--;
                return entry.val;
            }
        }
    }, {
        key: "_evict",
        value: function _evict(entry) {
            if (entry) {
                var prev = entry.prev;
                var next = entry.next;
                prev.next = next;
                next.prev = prev;
            }
        }
    }, {
        key: "_insertAtTail",
        value: function _insertAtTail(entry) {
            if (entry) {
                if (entry.next) {
                    this._evict(entry);
                }
                entry.prev = this._tail.prev;
                entry.prev.next = entry;
                entry.next = this._tail;
                this._tail.prev = entry;
            }
        }
    }]);

    return Cache;
})();

},{}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Matcher = exports.DOMList = exports.SimpleDOMParser = undefined;

var _cache = require("./cache");

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The purpose of the SimpleDOMParser is to parse an expressive HTML string into DOM elements. The style of the expressive HTML string
 * is simple on purpose with only the element tag name and class names definable. Hierarchy is expressed using parenthesis.
 *
 * The SimpleDOMParser uses a cache to provide a level of performance for repeated calls. By default the size of the cache
 * is limited to 10. DOM elements are memory expensive, increasing the size of the cache should be done with caution. The cache will
 * evict entries based on when they were last accessed, evicting the oldest first.
 *
 * Examples:
 * let parser = new SimpleDOMParser()
 *
 * let result = parser.parse("div")
 * result.outerHTML == '<div></div>'
 *
 * result = parser.parse("div.myclass")
 * result.outerHTML == '<div class="myclass"></div>'
 *
 * result = parser.parse("div.myclass.another")
 * result.outerHTML == '<div class="myclass another"></div>'
 *
 * result = parser.parse("div div.sibling")
 * result.outerHTML == '<div></div><div class="sibling"></div>'
 *
 * result = parser.parse("div (div.child)")
 * result.outerHTML == '<div><div class="child"></div></div>'
 *
 * result = parser.parse("div (div.child div.child.sibling) div.sibling")
 * result.outerHTML == '<div><div class="child"></div><div class="child sibling"></div></div><div class="sibling"></div>'
 *
 * result = parser.parse("div (div.child (div.nested))")
 * result.outerHTML == '<div><div class="child"><div class="nested"></div></div></div>'
 *
 * @class
 */

var SimpleDOMParser = exports.SimpleDOMParser = (function () {
    function SimpleDOMParser() {
        var size = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

        _classCallCheck(this, SimpleDOMParser);

        this._cache = new _cache.Cache(size);
    }

    /**
     * Perform the actual parse of the value, see class level doc for more info.
     */

    _createClass(SimpleDOMParser, [{
        key: "parse",
        value: function parse(val) {
            var nodes = this._cache.get(val);
            if (!nodes) {
                nodes = new DOMList(this._build(val));
                this._cache.put(val, nodes);
            }
            return nodes.clone();
        }
    }, {
        key: "_build",
        value: function _build(val) {
            var nodes = [],
                node = false,
                hierarchy = [];

            val.split(/(\s*[ \s\(\)]\s*)/).forEach(function (t) {
                var token = t.trim();
                if (token.length === 0) {
                    return;
                }
                if (token === ")") {
                    var back = hierarchy.pop();
                    if (!back) {
                        throw "ExpressiveDOMParser: Invalid location for closing parenthesis";
                    }
                    node = back.node;
                    nodes.forEach(function (e) {
                        return node.appendChild(e);
                    });
                    nodes = back.nodes;
                } else if (token === "(") {
                    if (!node) {
                        throw "ExpressiveDOMParser: Invalid location for opening parenthesis";
                    }
                    hierarchy.push({
                        "node": node,
                        "nodes": nodes
                    });
                    nodes = [];
                } else {
                    var parts = token.split("\."),
                        name = parts.shift();
                    node = document.createElement(name);
                    if (parts.length) {
                        node.className = parts.join(" ");
                    }
                    nodes.push(node);
                }
            });

            if (hierarchy.length) {
                throw "ExpressiveDOMParser: Unmatched opening and closing parenthesis";
            }

            return nodes;
        }
    }]);

    return SimpleDOMParser;
})();

/**
 * Flattens the passed object into an Array of elements. Detect if the type is a single element, an Array or a DOMList.
 */

function flat(ele) {
    var elements = [];
    if (Array.isArray(ele)) {
        elements = ele;
    } else if (Array.isArray(ele.items)) {
        elements = ele.items;
    } else {
        elements.push(ele);
    }
    return elements;
}

/**
 * The DOM List is a wrapper around a list of DOM elements that allow easy modification of the wrapped DOM elements.
 *
 * Usage:
 * let list = new DOMList([dom1, dom2])
 * list.items // access to array of elements
 *
 * @class
 */

var DOMList = exports.DOMList = (function () {
    function DOMList() {
        var doms = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        _classCallCheck(this, DOMList);

        if (typeof doms === "string") {
            this.items = [document.createElement(doms)];
        } else if (Array.isArray(doms)) {
            this.items = doms;
        } else {
            this.items = [doms];
        }
    }

    /**
     * Returns a new DOMList with all wrapped elements cloned deeply
     */

    _createClass(DOMList, [{
        key: "clone",
        value: function clone() {
            var cloned = [];
            this.items.forEach(function (ele) {
                cloned.push(ele.cloneNode(true));
            });
            return new DOMList(cloned);
        }

        /**
         * Append the DOM elements within this DOMList to the passed parent DOM element
         *
         * @param parent The parent DOM element to append to
         */

    }, {
        key: "appendTo",
        value: function appendTo(parent) {
            var _this = this;

            flat(parent).forEach(function (p) {
                _this.items.forEach(function (ele) {
                    p.appendChild(ele);
                });
            });
            return this;
        }

        /**
         * Inserts the DOM elements within the DOMList before the passed parent DOM element
         * 
         * @param parent The parent DOM element to insert before
         */

    }, {
        key: "before",
        value: function before(insertBefore) {
            var _this2 = this;

            flat(insertBefore).forEach(function (b) {
                _this2.items.forEach(function (ele) {
                    b.parentNode.insertBefore(ele, b);
                });
            });
            return this;
        }

        /**
         * Add the passed style class to all the DOM elements within this DOMList
         * 
         * @param cls The class(s) name to add
         */

    }, {
        key: "addClass",
        value: function addClass() {
            for (var _len = arguments.length, cls = Array(_len), _key = 0; _key < _len; _key++) {
                cls[_key] = arguments[_key];
            }

            this.items.forEach(function (ele) {
                var classes = !!ele.className ? ele.className.split(" ") : [];
                cls.forEach(function (c) {
                    if (classes.indexOf(c) < 0) {
                        classes.push(c);
                    }
                });
                ele.className = classes.join(" ");
            });
            return this;
        }

        /**
         * Add the passed style class to all the DOM elements within this DOMList
         * 
         * @param cls The class(s) name to add
         */

    }, {
        key: "removeClass",
        value: function removeClass() {
            for (var _len2 = arguments.length, cls = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                cls[_key2] = arguments[_key2];
            }

            this.items.forEach(function (ele) {
                var classes = !!ele.className ? ele.className.split(" ") : [];
                cls.forEach(function (c) {
                    var index = classes.indexOf(c);
                    if (index >= 0) {
                        classes.splice(index, 1);
                    }
                });
                ele.className = classes.join(" ");
            });
            return this;
        }

        /**
        * Set the passed attribute on all the DOM elements within this DOMList.
        *
        * Usage:
        * let list = new DOMList([dom1, dom2])
        * list.attr("test", "val") // add
        * list.attr({
        *  test: "val", // add
        *  test2: undefined // remove
        * ) 
        * list.attr("test") // remove
        */

    }, {
        key: "attr",
        value: function attr(key, val) {
            this.items.forEach(function (ele) {
                if ((typeof key === "undefined" ? "undefined" : _typeof(key)) === "object") {
                    Object.keys(key).forEach(function (k) {
                        if (typeof key[k] === "undefined") {
                            ele.removeAttribute(k);
                        } else {
                            ele.setAttribute(k, key[k]);
                        }
                    });
                } else {
                    if (typeof val === "undefined") {
                        ele.removeAttribute(key);
                    } else {
                        ele.setAttribute(key, val);
                    }
                }
            });
            return this;
        }

        /**
         * Registers the event lister on all the DOM elements within the DOMList
         *
         * @param event The event name, eg. click
         * @param matcher The matcher to filter events
         * @param handler The handler that is called for the event
         */

    }, {
        key: "on",
        value: function on(event, matcher, handler) {
            this.items.forEach(function (ele) {
                ele.addEventListener(event, function (event) {
                    if (matcher instanceof Matcher) {
                        if (matcher.test(event.target)) {
                            handler(event);
                        }
                    } else {
                        matcher(event);
                    }
                });
            });
            return this;
        }

        /**
         * Uses the <ele>.querySelectorAll(..) to find the appropriate nodes from all the DOM elements within this DOMList and returns
         * them in a wrapped DOMList
         */

    }, {
        key: "find",
        value: function find(selector) {
            var found = [];
            this.items.forEach(function (ele) {
                var result = ele.querySelectorAll(selector);
                for (var x = 0, len = result.length; x < len; x++) {
                    found.push(result[x]);
                }
            });
            return new DOMList(found);
        }

        /**
         * Calls each of the passed handlers for each of the DOM elements within this DOMList with the DOM element as the only parameter
         */

    }, {
        key: "each",
        value: function each() {
            var _this3 = this;

            for (var _len3 = arguments.length, handlers = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                handlers[_key3] = arguments[_key3];
            }

            handlers.forEach(function (handler) {
                _this3.items.forEach(function (ele) {
                    handler(ele);
                });
            });
            return this;
        }
    }]);

    return DOMList;
})();

var MATCHERS = {
    type: function type(_type, ele) {
        return ele.tagName.toUpperCase() === _type.toUpperCase();
    },
    css: function css(_css, ele) {
        var classes = (ele.className || "").split(" ");
        return _css.every(function (c) {
            return classes.indexOf(c) >= 0;
        });
    }
};

/**
 * The Matcher tests whether a set of elements all match
 */

var Matcher = (function () {
    function Matcher() {
        var bubble = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        _classCallCheck(this, Matcher);

        this._bubble = bubble;
        this._matchers = [];
    }

    /**
     * The testing element must match the type of the element
     */

    _createClass(Matcher, [{
        key: "type",
        value: function type(_type2) {
            this._matchers.push(MATCHERS.type.bind(this, _type2));
            return this;
        }

        /**
         * Test testing element must contain all the css classes
         */

    }, {
        key: "css",
        value: function css() {
            for (var _len4 = arguments.length, _css2 = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                _css2[_key4] = arguments[_key4];
            }

            this._matchers.push(MATCHERS.css.bind(this, _css2));
            return this;
        }

        /**
         * Returns true if the passed element(s) match all the matchers configured
         */

    }, {
        key: "test",
        value: function test(ele) {
            var _this4 = this;

            return flat(ele).every(function (e) {
                var next = e,
                    result = false;
                while (next && next.parentNode !== next) {
                    result = _this4._matchers.every(function (m) {
                        return m(next);
                    });
                    if (!result) {
                        if (_this4._bubble) {
                            next = next.parentNode;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                }
                return false;
            }, this);
        }
    }]);

    return Matcher;
})();

exports.Matcher = Matcher;

},{"./cache":3}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Options class provides a wrap around an options object map where options can be defined as
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
 * let o = new Options(opts)
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
 *
 * @class
 */

var Options = exports.Options = (function () {
    function Options(opts, context) {
        _classCallCheck(this, Options);

        this._opts = opts;
        this._context = context || this;
    }

    _createClass(Options, [{
        key: "get",
        value: function get(name, callback) {
            var val = this._opts;
            name.split("\.").forEach(function (p) {
                val = val[p];
            });
            if (!("function" === typeof val)) {
                val = (function (v) {
                    return function () {
                        return v;
                    };
                })(val);
            }
            if (val.length > 0) {
                var result = undefined;
                val.apply(this._context, [callback || function (v) {
                    result = v;
                }]);
                return result;
            } else {
                if (callback) {
                    callback.apply(this._context, [val.apply(this._context)]);
                } else {
                    return val.apply(this._context);
                }
            }
        }
    }]);

    return Options;
})();

},{}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
 * let q = new Queue((item, done) => {
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
 *
 * @class
 */

var Queue = exports.Queue = (function () {

    /**
     * @param handler Handler function that takes each item offered to the queue
     * @param options Object of mapped options, see class doc to details
     */

    function Queue(handler) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, Queue);

        this._handler = handler;
        this._concurrency = Math.max(options.concurrency, 1) || 1;
        this._delay = Math.max(options.delay, 0) || 0;
        this._size = Math.max(options.size, 0) || 0;
        this._queue = [];
        this._working = [];
        this._id = 0;
    }

    /**
     * Offer a item to the queue
     *
     * @param item The item that eventually get passed to the handler
     * @returns {boolean} True if the queue accepted the item, False if the queue has reached it max size
     */

    _createClass(Queue, [{
        key: "offer",
        value: function offer(item) {
            if (!this._size || this._queue.length < this._size) {
                this._queue.push({
                    item: item
                });
                this._next();
                return true;
            }
            return false;
        }

        /**
         * @private
         */

    }, {
        key: "_next",
        value: function _next() {
            var _this = this;

            if (this._working.length < this._concurrency) {
                (function () {
                    var next = _this._queue.shift();
                    if (next !== undefined) {
                        (function () {
                            var id = ++_this._id,
                                done = function done() {
                                var index = _this._working.indexOf(id);
                                if (index >= 0) {
                                    _this._working.splice(index, 1);
                                    _this._next();
                                }
                            },
                                fire = function fire() {
                                _this._handler.apply(_this, [next.item, done]);
                            };
                            _this._working.push(id);
                            if (_this._delay) {
                                setTimeout(fire, _this._delay);
                            } else {
                                fire();
                            }
                        })();
                    }
                })();
            }
        }
    }]);

    return Queue;
})();

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvdWkvd2lkZ2V0LmpzIiwic3JjL2pzL3VwbG9hZC5qcyIsInNyYy9qcy91dGlsL2NhY2hlLmpzIiwic3JjL2pzL3V0aWwvZG9tLmpzIiwic3JjL2pzL3V0aWwvb3B0aW9ucy5qcyIsInNyYy9qcy91dGlsL3F1ZXVlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDUUEsU0FBUyxDQUFDLENBQUMsTUFBTSxFQUFFO0FBQ2YsV0FBTyxTQVBNLE9BQU8sQ0FPRCxNQUFNLENBQUMsQ0FBQTtDQUM3Qjs7Ozs7O0FBQUEsQUFNRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLEVBQUU7QUFDYixXQUFPLFNBZkgsT0FBTyxDQWVRLEdBQUcsQ0FBQyxDQUFBO0NBQzFCOzs7OztBQUFBO0lBS1ksTUFBTSxXQUFOLE1BQU07QUFFZixhQUZTLE1BQU0sQ0FFSCxHQUFHLEVBQUUsSUFBSSxFQUFFOzhCQUZkLE1BQU07O0FBR1gsWUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDbkIsWUFBSSxDQUFDLEtBQUssR0FBRyxhQTNCYixPQUFPLENBMkJrQixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDcEMsWUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUE7QUFDZCxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ2pDLFlBQUksQ0FBQyxNQUFNLEdBQUcsV0E3QmQsS0FBSyxDQTZCbUIsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNoQyxpQkFBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQztTQUNqQyxDQUFDLENBQUE7QUFDRixZQUFJLENBQUMsT0FBTyxHQUFHLFNBL0JHLGVBQWUsRUErQkcsQ0FBQTtB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LEVBQUUsTUFBSyxNQUFNLENBQUMsQ0FBQTs2QkFDaEMsTUFBTTtBQUNILG9DQUFJLEVBQUUsQ0FBQTs2QkFDVDs7cUJBQ0o7O2FBQ0o7U0FDSjs7O1dBekRRLEtBQUsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtPcHRpb25zfSBmcm9tIFwiLi4vdXRpbC9vcHRpb25zXCJcbmltcG9ydCB7UXVldWV9IGZyb20gXCIuLi91dGlsL3F1ZXVlXCJcbmltcG9ydCB7RE9NTGlzdCwgTWF0Y2hlciwgU2ltcGxlRE9NUGFyc2VyfSBmcm9tIFwiLi4vdXRpbC9kb21cIlxuXG4vKipcbiAqIFdoeSBib3RoZXIgaW5zdGFudGlhdGluZyBhIE1hdGNoZXIgd2hlbiB5b3UgY2FuIGNhbGwgdGhlIHNob3J0IGNvbnZlbmllbmNlIGZ1bmN0aW9uXG4gKiBTbyBpbnN0ZWFkIG9mIG5ldyBNYXRjaGVyKCkuY3NzKC4uKSBpdCdzIG0oKS5jc3MoLi4pXG4gKi9cbmZ1bmN0aW9uIG0oYnViYmxlKSB7XG4gICAgcmV0dXJuIG5ldyBNYXRjaGVyKGJ1YmJsZSlcbn1cblxuLyoqXG4gKiBJbnN0ZWFkIG9mIGluc3RhbnRpYXRpbmcgYSBET01MaXN0IGV2ZXJ5IHRpbWUgd2UgY2FuIHVzZSB0aGlzIHRoaXMgdGlueSBjb252ZW5pZW5jZSBmdW5jdGlvblxuICogU28gaW5zdGVhZCBvZiBuZXcgRE9NTGlzdCguLikgaXQncyBqdXN0IHVwKC4uKVxuICovXG5mdW5jdGlvbiB1cChhcmcpIHtcbiAgICByZXR1cm4gbmV3IERPTUxpc3QoYXJnKVxufVxuXG4vKipcbiAqIFRoZSBXaWRnZXQgY2xhc3MgaXMgdGhlIGNvbnRyb2xsZXIgYmV0d2VlbiB0aGUgRE9NIGVsZW1lbnRzIChhbmQgdXNlciBhY3Rpb25zKSBhbmQgdGhlIGJhY2tlbmQuXG4gKi9cbmV4cG9ydCBjbGFzcyBXaWRnZXQge1xuXG4gICAgY29uc3RydWN0b3IoZWxlLCBvcHRzKSB7XG4gICAgICAgIHRoaXMuX2VsZSA9IHVwKGVsZSlcbiAgICAgICAgdGhpcy5fb3B0cyA9IG5ldyBPcHRpb25zKG9wdHMsIHRoaXMpXG4gICAgICAgIHRoaXMuX3NpemUgPSAwXG4gICAgICAgIHRoaXMuX21heCA9IHRoaXMuX29wdHMuZ2V0KFwibWF4XCIpXG4gICAgICAgIHRoaXMuX3F1ZXVlID0gbmV3IFF1ZXVlKHRoaXMuX25leHQsIHtcbiAgICAgICAgICAgIGRlbGF5OiB0aGlzLl9vcHRzLmdldChcImRlbGF5XCIpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMuX3BhcnNlciA9IG5ldyBTaW1wbGVET01QYXJzZXIoKVxuICAgICAgICB0aGlzLl9pbml0KClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHVwIHRoZSBET00uXG4gICAgICogQ3JlYXRlcyBhbmQgYXBwZW5kcyBhbiBJTlBVVCBvZiB0eXBlIGZpbGUgZm9yIHRoZSB1c2VyIHRvIGJlIGFibGUgdG8gcGljayBmaWxlcy5cbiAgICAgKiBBZGp1c3RzIGFueSBjdXJyZW50IElNRyBlbGVtZW50cyBpbiB0aGUgY29udGFpbmluZyBlbGVtZW50LlxuICAgICAqIFJlZ2lzdGVycyBhcHByb3ByaWF0ZSBsaXN0ZW5lcnMuXG4gICAgICovXG4gICAgX2luaXQoKSB7XG4gICAgICAgIHRoaXMuX2VsZS5hZGRDbGFzcyhcInVwbG9hZGpzXCIpXG5cbiAgICAgICAgdGhpcy5fcGlja2VyID0gdXAoXCJpbnB1dFwiKS5hdHRyKHtcInR5cGVcIjogXCJmaWxlXCIsIFwibXVsdGlwbGVcIjogXCJtdWx0aXBsZVwifSkuYXBwZW5kVG8odGhpcy5fZWxlKS5vbihcImNoYW5nZVwiLCB0aGlzLl9waWNrZWQuYmluZCh0aGlzKSlcblxuICAgICAgICB0aGlzLl9lbGUuZmluZChcImltZ1wiKS5lYWNoKGltZyA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX21heCB8fCB0aGlzLl9zaXplIDwgdGhpcy5fbWF4KSB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9wYXJzZXIucGFyc2UodGhpcy5fb3B0cy5nZXQoXCJ0ZW1wbGF0ZS5pdGVtXCIpKVxuICAgICAgICAgICAgICAgIGl0ZW0uZmluZChcImltZ1wiKS5hdHRyKFwic3JjXCIsIGltZy5nZXRBdHRyaWJ1dGUoXCJzcmNcIikpXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFyc2VyLnBhcnNlKHRoaXMuX29wdHMuZ2V0KFwidGVtcGxhdGUuYWN0aW9uc1wiKSkuYXBwZW5kVG8oaXRlbSlcbiAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZFRvKHRoaXMuX2VsZSlcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGltZy5yZW1vdmUoKVxuICAgICAgICB9KVxuXG4gICAgICAgIHRoaXMuX2FkZCA9IHRoaXMuX3BhcnNlci5wYXJzZSh0aGlzLl9vcHRzLmdldChcInRlbXBsYXRlLmFkZFwiKSkuYXBwZW5kVG8odGhpcy5fZWxlKVxuXG4gICAgICAgIGlmICghdGhpcy5fbWF4ICYmIHRoaXMuX3NpemUgPCB0aGlzLl9tYXgpIHtcbiAgICAgICAgICAgIHRoaXMuX2FkZC5hZGRDbGFzcyhcImhpZGVcIilcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3BpY2tlciA9IHRoaXMuX3BpY2tlci5pdGVtc1swXVxuICAgICAgICB0aGlzLl9lbGUub24oXCJjbGlja1wiLCBtKHRydWUpLmNzcyhcIml0ZW1cIiwgXCJuZXdcIiksIHRoaXMuX3BpY2tlci5jbGljay5iaW5kKHRoaXMuX3BpY2tlcikpXG4gICAgICAgIHRoaXMuX2VsZS5vbihcImNsaWNrXCIsIG0odHJ1ZSkuY3NzKFwiZGVsXCIpLCB0aGlzLl9kZWxldGUuYmluZCh0aGlzKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaXJlZCB3aGVuIHRoZSB1c2VyIGhhcyBzZWxlY3RlZCBmaWxlcyBmcm9tIHRoZSBmaWxlIHNlbGVjdGlvbi5cbiAgICAgKiBBZGRzIERPTSBlbGVtZW50cyB0byB0aGUgY29udGFpbmluZyBlbGVtZW50cyBpbiBhbiB1cGxvYWRpbmcgc3RhdGVcbiAgICAgKiBBZGRzIHVwbG9hZCB0byB0aGUgcXVldWVcbiAgICAgKi9cbiAgICBfcGlja2VkKCkge1xuICAgICAgICBsZXQgZmlsZXMgPSB0aGlzLl9waWNrZXIuZmlsZXNcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBmaWxlcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9wYXJzZXIucGFyc2UodGhpcy5fb3B0cy5nZXQoXCJ0ZW1wbGF0ZS5pdGVtXCIpKS5hZGRDbGFzcyhcInVwbG9hZGluZ1wiKVxuICAgICAgICAgICAgdGhpcy5fcGFyc2VyLnBhcnNlKHRoaXMuX29wdHMuZ2V0KFwidGVtcGxhdGUudXBsb2FkaW5nXCIpKS5hcHBlbmRUbyhpdGVtKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGUgPT4ge1xuICAgICAgICAgICAgICAgIGl0ZW0uZmluZChcImltZ1wiKS5hdHRyKFwic3JjXCIsIGUudGFyZ2V0LnJlc3VsdClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGZpbGVzW3hdKVxuICAgICAgICAgICAgaXRlbS5iZWZvcmUodGhpcy5fYWRkKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmlyZWQgd2hlbiB0aGUgdXNlciBoYXMgY2xpY2tlZCB0aGUgZGVsZXRlIGFjdGlvbiBmcm9tIHRoZSBhY3Rpb25zIGJhclxuICAgICAqIFNldHMgdGhlIERPTSBlbGVtZW50IGludG8gYSByZW1vdmluZyBzdGF0ZVxuICAgICAqIEFkZHMgZGVsZXRpb24gdG8gdGhlIHF1ZXVlXG4gICAgICovXG4gICAgX2RlbGV0ZShlKSB7XG5cbiAgICB9XG59IiwiaW1wb3J0IHtXaWRnZXR9IGZyb20gXCIuL3VpL3dpZGdldFwiXG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgVXBsb2FkSnMgd2lkZ2V0XG4gKi9cbmNvbnN0IERFRkFVTFRTID0ge1xuICAgIC8vIHRlbXBsYXRlIFN0cmluZ3NcbiAgICBcInRlbXBsYXRlXCI6IHtcbiAgICAgICAgXCJpdGVtXCI6IFwiZGl2Lml0ZW0gKGltZylcIixcbiAgICAgICAgXCJhZGRcIjogXCJkaXYuaXRlbS5uZXcgKGRpdi5pY29uLnBsdXMpXCIsXG4gICAgICAgIFwiYWN0aW9uc1wiOiBcImRpdi5hY3Rpb25zIChkaXYuYWN0aW9uLmJpbiAoZGl2LnRyYXNoKSlcIixcbiAgICAgICAgXCJkZWxldGluZ1wiOiBcImRpdi5zcGlubmVyIGRpdi5pY29uLnRyYXNoXCIsXG4gICAgICAgIFwidXBsb2FkaW5nXCI6IFwiZGl2LnNwaW5uZXIgZGl2Lmljb24udXBsb2FkIGRpdi5wcm9ncmVzc1wiLFxuICAgICAgICBcImRvbmVcIjogXCJkaXYuaWNvbi5kb25lIChpKVwiLFxuICAgICAgICBcImVycm9yXCI6IFwiZGl2Lmljb24uZXJyb3IgKGkpXCJcbiAgICB9LFxuICAgIFwibWF4XCI6IDAsXG4gICAgXCJkZWxldGFibGVcIjogdHJ1ZSxcbiAgICBcInVybFwiOiB7XG4gICAgICAgIFwidXBsb2FkXCI6IFwiLi4uXCIsXG4gICAgICAgIFwiZGVsZXRlXCI6IFwiLi4uXCJcbiAgICB9LFxuICAgIFwidHlwZXNcIjoge1xuICAgICAgICBcImltYWdlc1wiOiBbXCJpbWFnZS9qcGdcIiwgXCJpbWFnZS9qcGVnXCIsIFwiaW1hZ2UvcG5nXCIsIFwiaW1hZ2UvZ2lmXCJdXG4gICAgfSxcbiAgICBcImFsbG93ZWRfdHlwZXNcIjogW1wiaW1hZ2VzXCJdXG59XG5cbi8qKlxuICogQWxsb3dzIHBsYWluIHZhbmlsbGEgSmF2YVNjcmlwdCBhY2Nlc3MgdG8gdGhlIFVwbG9hZEpzIFdpZGdldC5cbiAqXG4gKiBVc2FnZTpcbiAqIHZhciBlbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15aWRcIik7XG4gKiB2YXIgb3B0aW9ucyA9IHsgLi4uIH1cbiAqIG5ldyBVcGxvYWRKcyhlbGUsIG9wdGlvbnMpXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbndpbmRvdy5VcGxvYWRKcyA9IGNsYXNzIFVwbG9hZEpzIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBlbGUgVGhlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdHMgLSBPcHRpb25hbC4gVGhlIHdpZGdldCBzZXR0aW5ncy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihlbGUsIG9wdHM9e30pIHtcbiAgICAgICAgbmV3IFdpZGdldChlbGUsIG1lcmdlKERFRkFVTFRTLCBvcHRzKSlcbiAgICB9XG59XG5cbi8qKlxuICogU2ltcGxlIG9iamVjdCBtZXJnaW5nIHV0aWxpdHkuIFJ1bnMgZGVlcC4gUmV0dXJucyBhIG5ldyBvYmplY3QsIG5vIG1vZGlmaWNhdGlvbnNcbiAqIGFyZSBtYWRlIHRvIHRoZSBvcmlnaW5hbCB0YXJnZXQgYW5kIHNvdXJjZS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0XG4gKiBAcGFyYW0gc291cmNlIFRoZSBzb3VyY2Ugb2JqZWN0XG4gKiBAcmV0dXJucyB7e319IFRoZSBuZXcgaW5zdGFuY2Ugb2YgdGhlIG1lcmdlZCBvYmplY3RzXG4gKi9cbmZ1bmN0aW9uIG1lcmdlKHRhcmdldCwgc291cmNlKSB7XG4gICAgdmFyIGNsb25lID0ge31cbiAgICBPYmplY3Qua2V5cyh0YXJnZXQpLmZvckVhY2goayA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W2tdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBjbG9uZVtrXSA9IG1lcmdlKHt9LCB0YXJnZXRba10pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbG9uZVtrXSA9IHRhcmdldFtrXVxuICAgICAgICB9XG4gICAgfSlcbiAgICBPYmplY3Qua2V5cyhzb3VyY2UpLmZvckVhY2goayA9PiB7XG4gICAgICAgIGlmIChrIGluIGNsb25lICYmIHR5cGVvZiBjbG9uZVtrXSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2Ygc291cmNlW2tdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBjbG9uZVtrXSA9IG1lcmdlKGNsb25lW2tdLCBzb3VyY2Vba10pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjbG9uZVtrXSA9IHNvdXJjZVtrXVxuICAgICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gY2xvbmVcbn0iLCIvKipcbiAqIEEgc2ltcGxlIGNhY2hlLiBXaGVuIGF0dGVtcHRpbmcgdG8gYWRkIHRvIGEgZnVsbCBjYWNoZSBlbnRyaWVzIGFyZSBldmljdGVkIHRvIG1ha2Ugc3BhY2UgKExSVSkuIFRoZSBhdXRvIGV2aWN0aW9uIG9ubHkgb2NjdXJzIHdoZW4gYVxuICogbWF4IHNpemUgaGFzIGJlZW4gZGVmaW5lZCBmb3IgdGhlIG1hcC5cbiAqXG4gKiBVc2FnZTpcbiAqIGxldCBjYWNoZSA9IG5ldyBDYWNoZShtYXg9NSlcbiAqIGNhY2hlLnB1dChcInRlc3RcIiwgXCJ2YWxcIikgPT09IHRydWVcbiAqIGNhY2hlLnB1dChcInRlc3RcIiwgXCJ2YWwyXCIpID09PSBmYWxzZVxuICogY2FjaGUuZ2V0KFwidGVzdFwiKSA9PT0gXCJ2YWwyXCJcbiAqIGNhY2hlLnJlbW92ZShcInRlc3RcIikgPT09IFwidmFsMlwiXG4gKiBjYWNoZS5nZXQoXCJ0ZXN0XCIpID09PSB1bmRlZmluZWRcbiAqXG4gKiAvLyBhdXRvIGV2aWN0aW9uXG4gKiBjYWNoZS5wdXQoXCJ0ZXN0XCIsIFwidmFsXCIpID09PSB0cnVlXG4gKiBjYWNoZS5wdXQoXCJ0ZXN0MVwiLCBcInZhbDFcIikgPT09IHRydWVcbiAqIGNhY2hlLnB1dChcInRlc3QyXCIsIFwidmFsMlwiKSA9PT0gdHJ1ZVxuICogY2FjaGUucHV0KFwidGVzdDNcIiwgXCJ2YWwzXCIpID09PSB0cnVlXG4gKiBjYWNoZS5wdXQoXCJ0ZXN0NFwiLCBcInZhbDRcIikgPT09IHRydWVcbiAqIGNhY2hlLnB1dChcInRlc3Q1XCIsIFwidmFsNVwiKSA9PT0gdHJ1ZSAvLyBldmljdHMgb2xkZXN0XG4gKiBjYWNoZS5nZXQoXCJ0ZXN0XCIpID09PSB1bmRlZmluZWRcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZXhwb3J0IGNsYXNzIENhY2hlIHtcbiAgICBjb25zdHJ1Y3RvcihtYXggPSAwKSB7XG4gICAgICAgIHRoaXMuX21heCA9IG1heFxuICAgICAgICB0aGlzLl9tYXAgPSB7fVxuICAgICAgICB0aGlzLl9oZWFkID0ge31cbiAgICAgICAgdGhpcy5fdGFpbCA9IHtwcmV2OiB0aGlzLl9oZWFkfVxuICAgICAgICB0aGlzLl9oZWFkLm5leHQgPSB0aGlzLl90YWlsXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB2YWx1ZSBtYXBwZWQgdG8gdGhlIHBhc3NlZCBrZXkgaW4gdGhlIGNhY2hlLlxuICAgICAqL1xuICAgIGdldChrZXkpIHtcbiAgICAgICAgbGV0IGVudHJ5ID0gdGhpcy5fbWFwW2tleV1cbiAgICAgICAgdGhpcy5faW5zZXJ0QXRUYWlsKGVudHJ5KVxuICAgICAgICByZXR1cm4gZW50cnkgPyBlbnRyeS52YWwgOiB1bmRlZmluZWRcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQdXQgdGhlIHBhc3NlZCB2YWx1ZSBtYXBwZWQgYWdhaW5zdCB0aGUgcGFzc2VkIGtleSBpbiB0aGUgY2FjaGUuIElmIGEgbWFwcGluZyB3aXRoIHRoZSBzYW1lIGtleSBhbHJlYWR5IGV4aXN0cyBpdCB3aWxsIGJlIG92ZXJyaWRkZW4uXG4gICAgICogVHJ1ZSBpcyByZXR1cm5lZCBpZiB0aGlzIGlzIGEgbmV3IG1hcHBpbmcgYmVpbmcgYWRkZWQsIG90aGVyd2lzZSBmYWxzZSBpZiBiZWluZyBvdmVycmlkZGVuLlxuICAgICAqL1xuICAgIHB1dChrZXksIHZhbCkge1xuICAgICAgICBpZiAodGhpcy5fbWF4ID4gMCAmJiB0aGlzLmxlbmd0aCA+IDAgJiYgdGhpcy5sZW5ndGggPT0gdGhpcy5fbWF4KSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZSh0aGlzLl9oZWFkLm5leHQua2V5KVxuICAgICAgICB9XG4gICAgICAgIGxldCBlbnRyeSA9IHRoaXMuX21hcFtrZXldLCBuZXdFbnRyeSA9IHRydWVcbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICBlbnRyeS52YWwgPSB2YWxcbiAgICAgICAgICAgIG5ld0VudHJ5ID0gZmFsc2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVudHJ5ID0ge2tleSwgdmFsfVxuICAgICAgICAgICAgdGhpcy5fbWFwW2tleV0gPSBlbnRyeVxuICAgICAgICAgICAgdGhpcy5sZW5ndGgrK1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2luc2VydEF0VGFpbChlbnRyeSlcbiAgICAgICAgcmV0dXJuIG5ld0VudHJ5XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIHRoZSBlbnRyeSBmcm9tIHRoZSBjYWNoZSBhZ2FpbnN0IHRoZSBtYXBwZWQga2V5LiBSZXR1cm5zIHRoZSBjdXJyZW50IHZhbHVlIG1hcHBlZC5cbiAgICAgKi9cbiAgICByZW1vdmUoa2V5KSB7XG4gICAgICAgIGxldCBlbnRyeSA9IHRoaXMuX21hcFtrZXldXG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX21hcFtrZXldXG4gICAgICAgICAgICB0aGlzLl9ldmljdChlbnRyeSlcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoLS1cbiAgICAgICAgICAgIHJldHVybiBlbnRyeS52YWxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9ldmljdChlbnRyeSkge1xuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgIGxldCBwcmV2ID0gZW50cnkucHJldlxuICAgICAgICAgICAgbGV0IG5leHQgPSBlbnRyeS5uZXh0XG4gICAgICAgICAgICBwcmV2Lm5leHQgPSBuZXh0XG4gICAgICAgICAgICBuZXh0LnByZXYgPSBwcmV2XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfaW5zZXJ0QXRUYWlsKGVudHJ5KSB7XG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgICAgaWYgKGVudHJ5Lm5leHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmljdChlbnRyeSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVudHJ5LnByZXYgPSB0aGlzLl90YWlsLnByZXZcbiAgICAgICAgICAgIGVudHJ5LnByZXYubmV4dCA9IGVudHJ5XG4gICAgICAgICAgICBlbnRyeS5uZXh0ID0gdGhpcy5fdGFpbFxuICAgICAgICAgICAgdGhpcy5fdGFpbC5wcmV2ID0gZW50cnlcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQge0NhY2hlfSBmcm9tIFwiLi9jYWNoZVwiXG5cbi8qKlxuICogVGhlIHB1cnBvc2Ugb2YgdGhlIFNpbXBsZURPTVBhcnNlciBpcyB0byBwYXJzZSBhbiBleHByZXNzaXZlIEhUTUwgc3RyaW5nIGludG8gRE9NIGVsZW1lbnRzLiBUaGUgc3R5bGUgb2YgdGhlIGV4cHJlc3NpdmUgSFRNTCBzdHJpbmdcbiAqIGlzIHNpbXBsZSBvbiBwdXJwb3NlIHdpdGggb25seSB0aGUgZWxlbWVudCB0YWcgbmFtZSBhbmQgY2xhc3MgbmFtZXMgZGVmaW5hYmxlLiBIaWVyYXJjaHkgaXMgZXhwcmVzc2VkIHVzaW5nIHBhcmVudGhlc2lzLlxuICpcbiAqIFRoZSBTaW1wbGVET01QYXJzZXIgdXNlcyBhIGNhY2hlIHRvIHByb3ZpZGUgYSBsZXZlbCBvZiBwZXJmb3JtYW5jZSBmb3IgcmVwZWF0ZWQgY2FsbHMuIEJ5IGRlZmF1bHQgdGhlIHNpemUgb2YgdGhlIGNhY2hlXG4gKiBpcyBsaW1pdGVkIHRvIDEwLiBET00gZWxlbWVudHMgYXJlIG1lbW9yeSBleHBlbnNpdmUsIGluY3JlYXNpbmcgdGhlIHNpemUgb2YgdGhlIGNhY2hlIHNob3VsZCBiZSBkb25lIHdpdGggY2F1dGlvbi4gVGhlIGNhY2hlIHdpbGxcbiAqIGV2aWN0IGVudHJpZXMgYmFzZWQgb24gd2hlbiB0aGV5IHdlcmUgbGFzdCBhY2Nlc3NlZCwgZXZpY3RpbmcgdGhlIG9sZGVzdCBmaXJzdC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqIGxldCBwYXJzZXIgPSBuZXcgU2ltcGxlRE9NUGFyc2VyKClcbiAqXG4gKiBsZXQgcmVzdWx0ID0gcGFyc2VyLnBhcnNlKFwiZGl2XCIpXG4gKiByZXN1bHQub3V0ZXJIVE1MID09ICc8ZGl2PjwvZGl2PidcbiAqXG4gKiByZXN1bHQgPSBwYXJzZXIucGFyc2UoXCJkaXYubXljbGFzc1wiKVxuICogcmVzdWx0Lm91dGVySFRNTCA9PSAnPGRpdiBjbGFzcz1cIm15Y2xhc3NcIj48L2Rpdj4nXG4gKlxuICogcmVzdWx0ID0gcGFyc2VyLnBhcnNlKFwiZGl2Lm15Y2xhc3MuYW5vdGhlclwiKVxuICogcmVzdWx0Lm91dGVySFRNTCA9PSAnPGRpdiBjbGFzcz1cIm15Y2xhc3MgYW5vdGhlclwiPjwvZGl2PidcbiAqXG4gKiByZXN1bHQgPSBwYXJzZXIucGFyc2UoXCJkaXYgZGl2LnNpYmxpbmdcIilcbiAqIHJlc3VsdC5vdXRlckhUTUwgPT0gJzxkaXY+PC9kaXY+PGRpdiBjbGFzcz1cInNpYmxpbmdcIj48L2Rpdj4nXG4gKlxuICogcmVzdWx0ID0gcGFyc2VyLnBhcnNlKFwiZGl2IChkaXYuY2hpbGQpXCIpXG4gKiByZXN1bHQub3V0ZXJIVE1MID09ICc8ZGl2PjxkaXYgY2xhc3M9XCJjaGlsZFwiPjwvZGl2PjwvZGl2PidcbiAqXG4gKiByZXN1bHQgPSBwYXJzZXIucGFyc2UoXCJkaXYgKGRpdi5jaGlsZCBkaXYuY2hpbGQuc2libGluZykgZGl2LnNpYmxpbmdcIilcbiAqIHJlc3VsdC5vdXRlckhUTUwgPT0gJzxkaXY+PGRpdiBjbGFzcz1cImNoaWxkXCI+PC9kaXY+PGRpdiBjbGFzcz1cImNoaWxkIHNpYmxpbmdcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwic2libGluZ1wiPjwvZGl2PidcbiAqXG4gKiByZXN1bHQgPSBwYXJzZXIucGFyc2UoXCJkaXYgKGRpdi5jaGlsZCAoZGl2Lm5lc3RlZCkpXCIpXG4gKiByZXN1bHQub3V0ZXJIVE1MID09ICc8ZGl2PjxkaXYgY2xhc3M9XCJjaGlsZFwiPjxkaXYgY2xhc3M9XCJuZXN0ZWRcIj48L2Rpdj48L2Rpdj48L2Rpdj4nXG4gKlxuICogQGNsYXNzXG4gKi9cbmV4cG9ydCBjbGFzcyBTaW1wbGVET01QYXJzZXIge1xuICAgIGNvbnN0cnVjdG9yKHNpemUgPSAxMCkge1xuICAgICAgICB0aGlzLl9jYWNoZSA9IG5ldyBDYWNoZShzaXplKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm0gdGhlIGFjdHVhbCBwYXJzZSBvZiB0aGUgdmFsdWUsIHNlZSBjbGFzcyBsZXZlbCBkb2MgZm9yIG1vcmUgaW5mby5cbiAgICAgKi9cbiAgICBwYXJzZSh2YWwpIHtcbiAgICAgICAgbGV0IG5vZGVzID0gdGhpcy5fY2FjaGUuZ2V0KHZhbClcbiAgICAgICAgaWYgKCFub2Rlcykge1xuICAgICAgICAgICAgbm9kZXMgPSBuZXcgRE9NTGlzdCh0aGlzLl9idWlsZCh2YWwpKVxuICAgICAgICAgICAgdGhpcy5fY2FjaGUucHV0KHZhbCwgbm9kZXMpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVzLmNsb25lKClcbiAgICB9XG5cbiAgICBfYnVpbGQodmFsKSB7XG4gICAgICAgIGxldCBub2RlcyA9IFtdLCBub2RlID0gZmFsc2UsIGhpZXJhcmNoeSA9IFtdXG5cbiAgICAgICAgdmFsLnNwbGl0KC8oXFxzKlsgXFxzXFwoXFwpXVxccyopLykuZm9yRWFjaCh0ID0+IHtcbiAgICAgICAgICAgIGxldCB0b2tlbiA9IHQudHJpbSgpXG4gICAgICAgICAgICBpZiAodG9rZW4ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodG9rZW4gPT09IFwiKVwiKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJhY2sgPSBoaWVyYXJjaHkucG9wKClcbiAgICAgICAgICAgICAgICBpZiAoIWJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJFeHByZXNzaXZlRE9NUGFyc2VyOiBJbnZhbGlkIGxvY2F0aW9uIGZvciBjbG9zaW5nIHBhcmVudGhlc2lzXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbm9kZSA9IGJhY2subm9kZVxuICAgICAgICAgICAgICAgIG5vZGVzLmZvckVhY2goZSA9PiBub2RlLmFwcGVuZENoaWxkKGUpKVxuICAgICAgICAgICAgICAgIG5vZGVzID0gYmFjay5ub2Rlc1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlbiA9PT0gXCIoXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJFeHByZXNzaXZlRE9NUGFyc2VyOiBJbnZhbGlkIGxvY2F0aW9uIGZvciBvcGVuaW5nIHBhcmVudGhlc2lzXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaGllcmFyY2h5LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBcIm5vZGVcIjogbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgXCJub2Rlc1wiOiBub2Rlc1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgbm9kZXMgPSBbXVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFydHMgPSB0b2tlbi5zcGxpdChcIlxcLlwiKSwgbmFtZSA9IHBhcnRzLnNoaWZ0KClcbiAgICAgICAgICAgICAgICBub2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuYW1lKVxuICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzc05hbWUgPSBwYXJ0cy5qb2luKFwiIFwiKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBub2Rlcy5wdXNoKG5vZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGhpZXJhcmNoeS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IFwiRXhwcmVzc2l2ZURPTVBhcnNlcjogVW5tYXRjaGVkIG9wZW5pbmcgYW5kIGNsb3NpbmcgcGFyZW50aGVzaXNcIlxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5vZGVzXG4gICAgfVxufVxuXG4vKipcbiAqIEZsYXR0ZW5zIHRoZSBwYXNzZWQgb2JqZWN0IGludG8gYW4gQXJyYXkgb2YgZWxlbWVudHMuIERldGVjdCBpZiB0aGUgdHlwZSBpcyBhIHNpbmdsZSBlbGVtZW50LCBhbiBBcnJheSBvciBhIERPTUxpc3QuXG4gKi9cbmZ1bmN0aW9uIGZsYXQoZWxlKSB7XG4gICAgbGV0IGVsZW1lbnRzID0gW11cbiAgICBpZiAoQXJyYXkuaXNBcnJheShlbGUpKSB7XG4gICAgICAgIGVsZW1lbnRzID0gZWxlXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGVsZS5pdGVtcykpIHtcbiAgICAgICAgZWxlbWVudHMgPSBlbGUuaXRlbXNcbiAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50cy5wdXNoKGVsZSlcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnRzXG59XG5cbi8qKlxuICogVGhlIERPTSBMaXN0IGlzIGEgd3JhcHBlciBhcm91bmQgYSBsaXN0IG9mIERPTSBlbGVtZW50cyB0aGF0IGFsbG93IGVhc3kgbW9kaWZpY2F0aW9uIG9mIHRoZSB3cmFwcGVkIERPTSBlbGVtZW50cy5cbiAqXG4gKiBVc2FnZTpcbiAqIGxldCBsaXN0ID0gbmV3IERPTUxpc3QoW2RvbTEsIGRvbTJdKVxuICogbGlzdC5pdGVtcyAvLyBhY2Nlc3MgdG8gYXJyYXkgb2YgZWxlbWVudHNcbiAqXG4gKiBAY2xhc3NcbiAqL1xuZXhwb3J0IGNsYXNzIERPTUxpc3Qge1xuICAgIGNvbnN0cnVjdG9yKGRvbXMgPSBbXSkge1xuICAgICAgICBpZiAodHlwZW9mIGRvbXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSBbZG9jdW1lbnQuY3JlYXRlRWxlbWVudChkb21zKV1cbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRvbXMpKSB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zID0gZG9tc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFtkb21zXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBET01MaXN0IHdpdGggYWxsIHdyYXBwZWQgZWxlbWVudHMgY2xvbmVkIGRlZXBseVxuICAgICAqL1xuICAgIGNsb25lKCkge1xuICAgICAgICBsZXQgY2xvbmVkID0gW11cbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGVsZSA9PiB7XG4gICAgICAgICAgICBjbG9uZWQucHVzaChlbGUuY2xvbmVOb2RlKHRydWUpKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gbmV3IERPTUxpc3QoY2xvbmVkKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFwcGVuZCB0aGUgRE9NIGVsZW1lbnRzIHdpdGhpbiB0aGlzIERPTUxpc3QgdG8gdGhlIHBhc3NlZCBwYXJlbnQgRE9NIGVsZW1lbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJlbnQgVGhlIHBhcmVudCBET00gZWxlbWVudCB0byBhcHBlbmQgdG9cbiAgICAgKi9cbiAgICBhcHBlbmRUbyhwYXJlbnQpIHtcbiAgICAgICAgZmxhdChwYXJlbnQpLmZvckVhY2gocCA9PiB7XG4gICAgICAgICAgICB0aGlzLml0ZW1zLmZvckVhY2goZWxlID0+IHtcbiAgICAgICAgICAgICAgICBwLmFwcGVuZENoaWxkKGVsZSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIEluc2VydHMgdGhlIERPTSBlbGVtZW50cyB3aXRoaW4gdGhlIERPTUxpc3QgYmVmb3JlIHRoZSBwYXNzZWQgcGFyZW50IERPTSBlbGVtZW50XG4gICAgICogXG4gICAgICogQHBhcmFtIHBhcmVudCBUaGUgcGFyZW50IERPTSBlbGVtZW50IHRvIGluc2VydCBiZWZvcmVcbiAgICAgKi9cbiAgICBiZWZvcmUoaW5zZXJ0QmVmb3JlKSB7XG4gICAgICAgIGZsYXQoaW5zZXJ0QmVmb3JlKS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGVsZSA9PiB7XG4gICAgICAgICAgICAgICAgYi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlbGUsIGIpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBBZGQgdGhlIHBhc3NlZCBzdHlsZSBjbGFzcyB0byBhbGwgdGhlIERPTSBlbGVtZW50cyB3aXRoaW4gdGhpcyBET01MaXN0XG4gICAgICogXG4gICAgICogQHBhcmFtIGNscyBUaGUgY2xhc3MocykgbmFtZSB0byBhZGRcbiAgICAgKi9cbiAgICBhZGRDbGFzcyguLi5jbHMpIHtcbiAgICAgICAgdGhpcy5pdGVtcy5mb3JFYWNoKGVsZSA9PiB7XG4gICAgICAgICAgICBsZXQgY2xhc3NlcyA9ICEhZWxlLmNsYXNzTmFtZSA/IGVsZS5jbGFzc05hbWUuc3BsaXQoXCIgXCIpIDogW107XG4gICAgICAgICAgICBjbHMuZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2xhc3Nlcy5pbmRleE9mKGMpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goYylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgZWxlLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbihcIiBcIilcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogQWRkIHRoZSBwYXNzZWQgc3R5bGUgY2xhc3MgdG8gYWxsIHRoZSBET00gZWxlbWVudHMgd2l0aGluIHRoaXMgRE9NTGlzdFxuICAgICAqIFxuICAgICAqIEBwYXJhbSBjbHMgVGhlIGNsYXNzKHMpIG5hbWUgdG8gYWRkXG4gICAgICovXG4gICAgcmVtb3ZlQ2xhc3MoLi4uY2xzKSB7XG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChlbGUgPT4ge1xuICAgICAgICAgICAgbGV0IGNsYXNzZXMgPSAhIWVsZS5jbGFzc05hbWUgPyBlbGUuY2xhc3NOYW1lLnNwbGl0KFwiIFwiKSA6IFtdO1xuICAgICAgICAgICAgY2xzLmZvckVhY2goYyA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gY2xhc3Nlcy5pbmRleE9mKGMpXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsZS5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oXCIgXCIpXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiB0aGlzXG4gICAgfVxuICAgIFxuXG4gICAgLyoqXG4gICAgKiBTZXQgdGhlIHBhc3NlZCBhdHRyaWJ1dGUgb24gYWxsIHRoZSBET00gZWxlbWVudHMgd2l0aGluIHRoaXMgRE9NTGlzdC5cbiAgICAqXG4gICAgKiBVc2FnZTpcbiAgICAqIGxldCBsaXN0ID0gbmV3IERPTUxpc3QoW2RvbTEsIGRvbTJdKVxuICAgICogbGlzdC5hdHRyKFwidGVzdFwiLCBcInZhbFwiKSAvLyBhZGRcbiAgICAqIGxpc3QuYXR0cih7XG4gICAgKiAgdGVzdDogXCJ2YWxcIiwgLy8gYWRkXG4gICAgKiAgdGVzdDI6IHVuZGVmaW5lZCAvLyByZW1vdmVcbiAgICAqICkgXG4gICAgKiBsaXN0LmF0dHIoXCJ0ZXN0XCIpIC8vIHJlbW92ZVxuICAgICovXG4gICAgYXR0cihrZXksIHZhbCkge1xuICAgICAgICB0aGlzLml0ZW1zLmZvckVhY2goZWxlID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmtleXMoa2V5KS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGtleVtrXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnJlbW92ZUF0dHJpYnV0ZShrKVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNldEF0dHJpYnV0ZShrLCBrZXlba10pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBlbGUucmVtb3ZlQXR0cmlidXRlKGtleSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBlbGUuc2V0QXR0cmlidXRlKGtleSwgdmFsKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG4gICAgIFxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyB0aGUgZXZlbnQgbGlzdGVyIG9uIGFsbCB0aGUgRE9NIGVsZW1lbnRzIHdpdGhpbiB0aGUgRE9NTGlzdFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFRoZSBldmVudCBuYW1lLCBlZy4gY2xpY2tcbiAgICAgKiBAcGFyYW0gbWF0Y2hlciBUaGUgbWF0Y2hlciB0byBmaWx0ZXIgZXZlbnRzXG4gICAgICogQHBhcmFtIGhhbmRsZXIgVGhlIGhhbmRsZXIgdGhhdCBpcyBjYWxsZWQgZm9yIHRoZSBldmVudFxuICAgICAqL1xuICAgIG9uKGV2ZW50LCBtYXRjaGVyLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChlbGUgPT4ge1xuICAgICAgICAgICAgZWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hlciBpbnN0YW5jZW9mIE1hdGNoZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoZXIudGVzdChldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyKGV2ZW50KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcihldmVudClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBVc2VzIHRoZSA8ZWxlPi5xdWVyeVNlbGVjdG9yQWxsKC4uKSB0byBmaW5kIHRoZSBhcHByb3ByaWF0ZSBub2RlcyBmcm9tIGFsbCB0aGUgRE9NIGVsZW1lbnRzIHdpdGhpbiB0aGlzIERPTUxpc3QgYW5kIHJldHVybnNcbiAgICAgKiB0aGVtIGluIGEgd3JhcHBlZCBET01MaXN0XG4gICAgICovXG4gICAgZmluZChzZWxlY3Rvcikge1xuICAgICAgICBsZXQgZm91bmQgPSBbXVxuICAgICAgICB0aGlzLml0ZW1zLmZvckVhY2goZWxlID0+IHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBlbGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwLCBsZW4gPSByZXN1bHQubGVuZ3RoOyB4IDwgbGVuOyB4KyspIHtcbiAgICAgICAgICAgICAgICBmb3VuZC5wdXNoKHJlc3VsdFt4XSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIG5ldyBET01MaXN0KGZvdW5kKVxuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBDYWxscyBlYWNoIG9mIHRoZSBwYXNzZWQgaGFuZGxlcnMgZm9yIGVhY2ggb2YgdGhlIERPTSBlbGVtZW50cyB3aXRoaW4gdGhpcyBET01MaXN0IHdpdGggdGhlIERPTSBlbGVtZW50IGFzIHRoZSBvbmx5IHBhcmFtZXRlclxuICAgICAqL1xuICAgIGVhY2goLi4uaGFuZGxlcnMpIHtcbiAgICAgICAgaGFuZGxlcnMuZm9yRWFjaChoYW5kbGVyID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChlbGUgPT4ge1xuICAgICAgICAgICAgICAgIGhhbmRsZXIoZWxlKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG59XG5cbmNvbnN0IE1BVENIRVJTID0ge1xuICAgICAgICB0eXBlKHR5cGUsIGVsZSkge1xuICAgICAgICAgICAgcmV0dXJuIGVsZS50YWdOYW1lLnRvVXBwZXJDYXNlKCkgPT09IHR5cGUudG9VcHBlckNhc2UoKVxuICAgICAgICB9LFxuICAgICAgICBjc3MoY3NzLCBlbGUpIHtcbiAgICAgICAgICAgIGxldCBjbGFzc2VzID0gKGVsZS5jbGFzc05hbWUgfHwgXCJcIikuc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICByZXR1cm4gY3NzLmV2ZXJ5KGMgPT4geyByZXR1cm4gY2xhc3Nlcy5pbmRleE9mKGMpID49IDAgfSlcbiAgICAgICAgfVxufVxuXG4vKipcbiAqIFRoZSBNYXRjaGVyIHRlc3RzIHdoZXRoZXIgYSBzZXQgb2YgZWxlbWVudHMgYWxsIG1hdGNoXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRjaGVyIHtcbiAgICBjb25zdHJ1Y3RvcihidWJibGU9ZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fYnViYmxlID0gYnViYmxlXG4gICAgICAgIHRoaXMuX21hdGNoZXJzID0gW11cbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogVGhlIHRlc3RpbmcgZWxlbWVudCBtdXN0IG1hdGNoIHRoZSB0eXBlIG9mIHRoZSBlbGVtZW50XG4gICAgICovXG4gICAgdHlwZSh0eXBlKSB7XG4gICAgICAgIHRoaXMuX21hdGNoZXJzLnB1c2goTUFUQ0hFUlMudHlwZS5iaW5kKHRoaXMsIHR5cGUpKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBUZXN0IHRlc3RpbmcgZWxlbWVudCBtdXN0IGNvbnRhaW4gYWxsIHRoZSBjc3MgY2xhc3Nlc1xuICAgICAqL1xuICAgIGNzcyguLi5jc3MpIHtcbiAgICAgICAgdGhpcy5fbWF0Y2hlcnMucHVzaChNQVRDSEVSUy5jc3MuYmluZCh0aGlzLCBjc3MpKVxuICAgICAgICByZXR1cm4gdGhpc1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHBhc3NlZCBlbGVtZW50KHMpIG1hdGNoIGFsbCB0aGUgbWF0Y2hlcnMgY29uZmlndXJlZFxuICAgICAqL1xuICAgIHRlc3QoZWxlKSB7XG4gICAgICAgIHJldHVybiBmbGF0KGVsZSkuZXZlcnkoZSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV4dCA9IGUsIHJlc3VsdCA9IGZhbHNlXG4gICAgICAgICAgICB3aGlsZSAobmV4dCAmJiBuZXh0LnBhcmVudE5vZGUgIT09IG5leHQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSB0aGlzLl9tYXRjaGVycy5ldmVyeShtID0+IG0obmV4dCkpXG4gICAgICAgICAgICAgICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2J1YmJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dCA9IG5leHQucGFyZW50Tm9kZVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9LCB0aGlzKVxuICAgIH1cbn0iLCIvKipcbiAqIE9wdGlvbnMgY2xhc3MgcHJvdmlkZXMgYSB3cmFwIGFyb3VuZCBhbiBvcHRpb25zIG9iamVjdCBtYXAgd2hlcmUgb3B0aW9ucyBjYW4gYmUgZGVmaW5lZCBhc1xuICogZnVuY3Rpb25zIHdoaWNoIHRha2UgYW4gb3B0aW9uYWwgZG9uZSBjYWxsYmFjayB0byBhbGxvdyBsYXp5IGFzeW5jaHJvbm91cyBsb2FkaW5nIG9mIG9wdGlvblxuICogdmFsdWVzLlxuICpcbiAqIFVzYWdlOlxuICogbGV0IG9wdHMgPSB7XG4gKiAgICBrZXkxOiBcInZhbDFcIixcbiAqICAgIGtleTI6IGZ1bmN0aW9uKCkge1xuICogICAgICAgcmV0dXJuIFwidmFsMlwiXG4gKiAgICB9LFxuICogICAga2V5MzogZnVuY3Rpb24oZG9uZSkge1xuICogICAgICAgLy8gc29tZSBhc3luYyBhY3Rpb24gdGhhdCB0YWtlcyAxcywgc2ltdWxhdGVkIGhlcmUgd2l0aCBzZXRUaW1lb3V0XG4gKiAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAqICAgICAgICAgICBkb25lKFwidmFsM1wiKVxuICogICAgICAgfSwgMTAwMClcbiAqICAgIH1cbiAqIH1cbiAqXG4gKiBsZXQgbyA9IG5ldyBPcHRpb25zKG9wdHMpXG4gKiBvLmdldChcImtleTFcIikgPT09IFwidmFsMVwiXG4gKiBvLmdldChcImtleTFcIiwgdiA9PiB7XG4gKiAgICAgdiA9PT0gXCJ2YWwxXCJcbiAqIH0pXG4gKiBvLmdldChcImtleTJcIikgPT09IFwidmFsMlwiXG4gKiBvLmdldChcImtleTJcIiwgdiA9PiB7XG4gKiAgICAgdiA9PT0gXCJ2YWwyXCJcbiAqIH0pXG4gKiBvLmdldChcImtleTNcIikgPT09IHVuZGVmaW5lZFxuICogby5nZXQoXCJrZXkzXCIsIHYgPT4ge1xuICogICAgIHYgPT09IFwidmFsM1wiXG4gKiB9KVxuICpcbiAqIEBjbGFzc1xuICovXG5leHBvcnQgY2xhc3MgT3B0aW9ucyB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRzLCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuX29wdHMgPSBvcHRzXG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBjb250ZXh0IHx8IHRoaXNcbiAgICB9XG5cbiAgICBnZXQobmFtZSwgY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHZhbCA9IHRoaXMuX29wdHNcbiAgICAgICAgbmFtZS5zcGxpdChcIlxcLlwiKS5mb3JFYWNoKHAgPT4ge1xuICAgICAgICAgICAgdmFsID0gdmFsW3BdXG4gICAgICAgIH0pXG4gICAgICAgIGlmICghKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIHZhbCkpIHtcbiAgICAgICAgICAgIHZhbCA9ICh2ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKHZhbClcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCByZXN1bHQgPSB1bmRlZmluZWRcbiAgICAgICAgICAgIHZhbC5hcHBseSh0aGlzLl9jb250ZXh0LCBbY2FsbGJhY2sgfHwgKHYgPT4geyByZXN1bHQgPSB2IH0pXSlcbiAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMuX2NvbnRleHQsIFt2YWwuYXBwbHkodGhpcy5fY29udGV4dCldKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsLmFwcGx5KHRoaXMuX2NvbnRleHQpXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBTaW1wbGUgUXVldWUgdGhhdCBhbGxvd3MgZm9yIGEgY29uZmlndXJlZCBudW1iZXIgb2YgY29uY3VycmVudCBpdGVtcyB0byBiZSBleGVjdXRlZCBieSBhIGhhbmRsZXIuXG4gKlxuICogVXNhZ2U6XG4gKiBsZXQgb3B0aW9ucyA9IHtcbiAqICAgICAvLyBudW1iZXIgb2YgaXRlbXMgdGhhdCBjYW4gYmUgcHJvY2Vzc2VkIGF0IG9uY2VcbiAqICAgICBjb25jdXJyZW5jeTogMSxcbiAqICAgICAvLyBkZWxheSBpbiB0aGUgc3RhcnQgb2YgdGhlIHByb2Nlc3NpbmcgaW4gbXNcbiAqICAgICBkZWxheTogMjAwLFxuICogICAgIC8vIG1heCBzaXplIG9mIHRoZSBxdWV1ZVxuICogICAgIHNpemU6IDEwMFxuICogfVxuICpcbiAqIGxldCBxID0gbmV3IFF1ZXVlKChpdGVtLCBkb25lKSA9PiB7XG4gKiAgICAgLy8gZG8gc29tZSB3b3JrIHdpdGggaXRlbSB0aGF0IHRha2VzIDFzLCBzaW11bGF0ZWQgaGVyZSB3aXRoIHNldFRpbWVvdXRcbiAqICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAqICAgICAgICAgZG9uZSgpXG4gKiAgICAgfSwgMTAwMClcbiAqIH0sIG9wdGlvbnMpXG4gKlxuICogbGV0IG15X2l0ZW0gPSAuLi5cbiAqIGlmICghcS5vZmZlcihteV9pdGVtKSkge1xuICogICAgIHRocm93IFwiVW5hYmxlIHRvIGFkZCBpdGVtIHRvIHF1ZXVlXCJcbiAqIH1cbiAqXG4gKiBAY2xhc3NcbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXVlIHtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBoYW5kbGVyIEhhbmRsZXIgZnVuY3Rpb24gdGhhdCB0YWtlcyBlYWNoIGl0ZW0gb2ZmZXJlZCB0byB0aGUgcXVldWVcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBPYmplY3Qgb2YgbWFwcGVkIG9wdGlvbnMsIHNlZSBjbGFzcyBkb2MgdG8gZGV0YWlsc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGhhbmRsZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9oYW5kbGVyID0gaGFuZGxlclxuICAgICAgICB0aGlzLl9jb25jdXJyZW5jeSA9IE1hdGgubWF4KG9wdGlvbnMuY29uY3VycmVuY3ksIDEpIHx8IDFcbiAgICAgICAgdGhpcy5fZGVsYXkgPSBNYXRoLm1heChvcHRpb25zLmRlbGF5LCAwKSB8fCAwXG4gICAgICAgIHRoaXMuX3NpemUgPSBNYXRoLm1heChvcHRpb25zLnNpemUsIDApIHx8IDBcbiAgICAgICAgdGhpcy5fcXVldWUgPSBbXVxuICAgICAgICB0aGlzLl93b3JraW5nID0gW11cbiAgICAgICAgdGhpcy5faWQgPSAwXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogT2ZmZXIgYSBpdGVtIHRvIHRoZSBxdWV1ZVxuICAgICAqXG4gICAgICogQHBhcmFtIGl0ZW0gVGhlIGl0ZW0gdGhhdCBldmVudHVhbGx5IGdldCBwYXNzZWQgdG8gdGhlIGhhbmRsZXJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgcXVldWUgYWNjZXB0ZWQgdGhlIGl0ZW0sIEZhbHNlIGlmIHRoZSBxdWV1ZSBoYXMgcmVhY2hlZCBpdCBtYXggc2l6ZVxuICAgICAqL1xuICAgIG9mZmVyKGl0ZW0pIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zaXplIHx8IHRoaXMuX3F1ZXVlLmxlbmd0aCA8IHRoaXMuX3NpemUpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlLnB1c2goe1xuICAgICAgICAgICAgICAgIGl0ZW1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB0aGlzLl9uZXh0KClcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3dvcmtpbmcubGVuZ3RoIDwgdGhpcy5fY29uY3VycmVuY3kpIHtcbiAgICAgICAgICAgIGxldCBuZXh0ID0gdGhpcy5fcXVldWUuc2hpZnQoKVxuICAgICAgICAgICAgaWYgKG5leHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGxldCBpZCA9ICsrdGhpcy5faWQsIGRvbmUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMuX3dvcmtpbmcuaW5kZXhPZihpZClcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3dvcmtpbmcuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmV4dCgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCBmaXJlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVyLmFwcGx5KHRoaXMsIFtuZXh0Lml0ZW0sIGRvbmVdKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLl93b3JraW5nLnB1c2goaWQpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZmlyZSwgdGhpcy5fZGVsYXkpXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmlyZSgpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSJdfQ==
