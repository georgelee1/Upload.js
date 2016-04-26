/** Upload.js (1.1.0) | https://github.com/georgelee1/Upload.js | MIT */!function e(t,n,i){function r(o,s){if(!n[o]){if(!t[o]){var u="function"==typeof require&&require;if(!s&&u)return u(o,!0);if(a)return a(o,!0);var l=new Error("Cannot find module '"+o+"'");throw l.code="MODULE_NOT_FOUND",l}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return r(n?n:e)},f,f.exports,e,t,n,i)}return n[o].exports}for(var a="function"==typeof require&&require,o=0;o<i.length;o++)r(i[o]);return r}({1:[function(e,t,n){"use strict";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.DeleteItem=void 0;var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),u=e("./item");n.DeleteItem=function(e){function t(e,n,i){r(this,t);var o=a(this,Object.getPrototypeOf(t).call(this,e,i));return o._widget=n,o._id=o._ele.data("uploadImageId"),o._trigger({type:"delete.added",id:o._id}),o}return o(t,e),s(t,[{key:"run",value:function(e){this._trigger({type:"delete.started",id:this._id});var t=this;this._widget._opts.get("delete.url","delete.param","delete.additionalParams",function(n,r,a){t._widget._opts.get("http")(n,Object.assign(a||{},i({},r,t._id))).done(t._done.bind(t,e)).fail(t._fail.bind(t,e))})}},{key:"_done",value:function(e,t){var n=this;return t.success?(this._ele.removeClass("removing").addClass("removed"),setTimeout(function(){n._ele.remove()},1e3),this._trigger({type:"delete.done",id:this._id}),void e()):void this._fail(e)}},{key:"_fail",value:function(e){this._ele.removeClass("removing");var t=this._widget._parser.parse(this._widget._opts.get("template.error")).appendTo(this._ele);setTimeout(function(){t.addClass("going"),setTimeout(function(){t.remove()},3e3)},2e3),this._trigger({type:"delete.failed",id:this._id}),e()}}]),t}(u.Item)},{"./item":2}],2:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();n.Item=function(){function e(t){var n=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];i(this,e),this._ele=t,this._listeners=n}return r(e,[{key:"_trigger",value:function(e){var t=this;this._listeners&&Array.isArray(this._listeners[e.type])&&this._listeners[e.type].forEach(function(n){"function"==typeof n&&n.call(t._ele.items?t._ele.items[0]:t._ele,e)})}}]),e}()},{}],3:[function(e,t,n){"use strict";function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0}),n.UploadItem=void 0;var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),u=e("./item"),l=e("../util/update");n.UploadItem=function(e){function t(e,n,i,o){r(this,t);var s=a(this,Object.getPrototypeOf(t).call(this,e,o));return s._file=n,s._widget=i,s._fin=!1,s._up=new l.Update(s._update.bind(s),200),s._trigger({type:"upload.added",file:s._file}),s}return o(t,e),s(t,[{key:"run",value:function(e){this._trigger({type:"upload.started",file:this._file}),this._dom_progress=this._ele.find(".progress");var t=this;this._widget._opts.get("upload.url","upload.param","upload.additionalParams",function(n,r,a){t._widget._opts.get("http")(n,Object.assign(a||{},i({},r,t._file))).progress(t._progress.bind(t)).done(t._done.bind(t,e)).fail(t._fail.bind(t,e))})}},{key:"_progress",value:function(e){this._fin||(this._up.value=e,this._trigger({type:"upload.progress",file:this._file,progress:e}))}},{key:"_update",value:function(e){if(!this._fin){var t=0-(100-e);this._dom_progress.css("transform","translateX("+t+"%)")}}},{key:"_done",value:function(e,t){if(!t.success)return void this._fail(e);this._update(200),this._fin=!0,this._ele.removeClass("uploading");var n=this._widget._parser.parse(this._widget._opts.get("template.done")).appendTo(this._ele),i=t["upload-image-id"]||t.uploadImageId;"undefined"!=typeof i&&(this._ele.data("uploadImageId",i),this._widget._opts.get("deletable")!==!1?this._widget._parser.parse(this._widget._opts.get("template.actions")).appendTo(this._ele):this._ele.addClass("static")),setTimeout(function(){n.addClass("going"),setTimeout(function(){n.remove()},3e3)},2e3),this._trigger({type:"upload.done",file:this._file,id:i}),e()}},{key:"_fail",value:function(e){var t=this;this._update(0),this._fin=!0,this._ele.addClass("stopped"),this._widget._parser.parse(this._widget._opts.get("template.error")).appendTo(this._ele),setTimeout(function(){t._ele.addClass("removed"),setTimeout(function(){t._ele.remove()},1e3)},1e4),this._trigger({type:"upload.failed",file:this._file}),e()}}]),t}(u.Item)},{"../util/update":11,"./item":2}],4:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e){return new l.Matcher(e)}function a(e){return new l.DOMList(e)}Object.defineProperty(n,"__esModule",{value:!0}),n.Widget=void 0;var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),s=e("../util/options"),u=e("../util/queue"),l=e("../util/dom"),f=e("./upload"),c=e("./delete");n.Widget=function(){function e(t){var n=this;i(this,e),this._ele=a(t);for(var r=arguments.length,o=Array(r>1?r-1:0),f=1;r>f;f++)o[f-1]=arguments[f];this._opts=new s.Options(o,t),this._size=0,this._queue=new u.Queue(this._next,{delay:200}),this._parser=new l.SimpleDOMParser,this._listeners={},this._opts.get("deletable","max","allowed_types","types",function(e,t,i,r){n._deletable=e!==!1,n._max=t,n._allowedTypes=[],"string"==typeof i&&(i=i.split(",")),Array.isArray(i)&&i.forEach(function(e){Array.isArray(r[e])?r[e].forEach(function(e){n._allowedTypes.push(e.toLowerCase())}):n._allowedTypes.push(e.toLowerCase())}),n._types,n._init()})}return o(e,[{key:"_init",value:function(){var e=this;this._ele.addClass("uploadjs"),this._picker=a("input").attr({type:"file",multiple:"multiple"}).appendTo(this._ele).on("change",this._picked.bind(this)),this._ele.find("img").each(function(t){var n=a(t);if(!e._max||e._size<e._max){var i=e._parser.parse(e._opts.get("template.item"));i.find("img").attr("src",n.attr("src")),e._deletable&&"undefined"!=typeof n.data("uploadImageId")?e._parser.parse(e._opts.get("template.actions")).appendTo(i):i.addClass("static"),i.appendTo(e._ele),e._size++}n.remove()}),this._add=this._parser.parse(this._opts.get("template.add")).appendTo(this._ele),this._picker=this._picker.items[0],this._ele.on("click",r(!0).css("item","new"),this._picker.click.bind(this._picker)),this._ele.on("click",r(!0).css("del"),this._delete.bind(this));var t=function(){e._size--,e._update()};this._addListener("upload.failed",t),this._addListener("delete.done",t),this._update()}},{key:"_addListener",value:function(e,t){if("function"==typeof t){var n=this._listeners[e];n||(n=this._listeners[e]=[]),n.push(t)}}},{key:"_picked",value:function(){for(var e=this,t=this._picker.files,n=0;n<t.length;n++)(!this._max||this._size<this._max)&&this._typeAllowed(t[n])&&!function(){var i=e._parser.parse(e._opts.get("template.item")).addClass("uploading");e._parser.parse(e._opts.get("template.uploading")).appendTo(i);var r=new FileReader;r.onload=function(e){i.find("img").attr("src",e.target.result)},r.readAsDataURL(t[n]),i.before(e._add),e._size++,e._update(),e._queue.offer(new f.UploadItem(i,t[n],e,e._listeners))}();this._picker.value=""}},{key:"_typeAllowed",value:function(e){return this._allowedTypes.indexOf(e.type)>=0}},{key:"_delete",value:function(e){var t=a(e.target).parent(r().css("item")).addClass("removing");this._parser.parse(this._opts.get("template.deleting")).appendTo(t),this._queue.offer(new c.DeleteItem(t,this,this._listeners))}},{key:"_next",value:function(e,t){e.run(t)}},{key:"_update",value:function(){this._max&&(this._size<this._max?this._add.removeClass("hide"):this._add.addClass("hide"))}}]),e}()},{"../util/dom":7,"../util/options":9,"../util/queue":10,"./delete":1,"./upload":3}],5:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=e("./ui/widget"),o=e("./util/http"),s={template:{item:"div.item (img)",add:"div.item.new (div.icon.plus)",actions:"div.actions (div.action.del (div.trash))",deleting:"div.spinner div.icon.trash",uploading:"div.spinner div.icon.upload div.progress",done:"div.icon.done (i)",error:"div.icon.error (i)"},max:function(){return parseInt(this.dataset.uploadMax)||0},deletable:function(){return"false"!==this.dataset.uploadDeletable},types:{images:["image/jpg","image/jpeg","image/png","image/gif"]},allowed_types:function(){return"undefined"==typeof this.dataset.uploadAllowedTypes?["images"]:this.dataset.uploadAllowedTypes.split(",")},upload:{url:function(){return this.dataset.uploadUrl},param:function(){return this.dataset.uploadParam||"file"},additionalParams:function(){var e=this,t={};return console.info("DATASET",this.dataset),Object.keys(this.dataset).forEach(function(n){var i="uploadAdditionalParam";n.startsWith(i)&&(t[n.substr(i.length)]=e.dataset[n])}),t}},"delete":{url:function(){return this.dataset.uploadDeleteUrl},param:function(){return this.dataset.uploadDeleteParam||"file"},additionalParams:function(){var e=this,t={};return Object.keys(this.dataset).forEach(function(n){var i="uploadDeleteAdditionalParam";n.startsWith(i)&&(t[n.substr(i.length)]=e.dataset[n])}),t}},http:function(){return function(e,t){return new o.Http(e,t)}}};window.UploadJs=function(){function e(t){var n=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];i(this,e),this._widget=new a.Widget(t,n,s)}return r(e,[{key:"on",value:function(e,t){var n=this;return e.split(" ").forEach(function(e){n._widget._addListener(e,t)}),this}}]),e}()},{"./ui/widget":4,"./util/http":8}],6:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();n.Cache=function(){function e(){var t=arguments.length<=0||void 0===arguments[0]?0:arguments[0];i(this,e),this._max=t,this._map={},this._head={},this._tail={prev:this._head},this._head.next=this._tail,this.length=0}return r(e,[{key:"get",value:function(e){var t=this._map[e];return this._insertAtTail(t),t?t.val:void 0}},{key:"put",value:function(e,t){this._max>0&&this.length>0&&this.length==this._max&&this.remove(this._head.next.key);var n=this._map[e],i=!0;return n?(n.val=t,i=!1):(n={key:e,val:t},this._map[e]=n,this.length++),this._insertAtTail(n),i}},{key:"remove",value:function(e){var t=this._map[e];return t?(delete this._map[e],this._evict(t),this.length--,t.val):void 0}},{key:"_evict",value:function(e){if(e){var t=e.prev,n=e.next;t.next=n,n.prev=t}}},{key:"_insertAtTail",value:function(e){e&&(e.next&&this._evict(e),e.prev=this._tail.prev,e.prev.next=e,e.next=this._tail,this._tail.prev=e)}}]),e}()},{}],7:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e){var t=[];return Array.isArray(e)?t=e:Array.isArray(e.items)?t=e.items:t.push(e),t}Object.defineProperty(n,"__esModule",{value:!0}),n.Matcher=n.DOMList=n.SimpleDOMParser=void 0;var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol?"symbol":typeof e},o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),s=e("./cache"),u=(n.SimpleDOMParser=function(){function e(){var t=arguments.length<=0||void 0===arguments[0]?10:arguments[0];i(this,e),this._cache=new s.Cache(t)}return o(e,[{key:"parse",value:function(e){var t=this._cache.get(e);return t||(t=new u(this._build(e)),this._cache.put(e,t)),t.clone()}},{key:"_build",value:function(e){var t=[],n=!1,i=[];if(e.split(/(\s*[ \s\(\)]\s*)/).forEach(function(e){var r=e.trim();if(0!==r.length)if(")"===r){var a=i.pop();if(!a)throw"ExpressiveDOMParser: Invalid location for closing parenthesis";n=a.node,t.forEach(function(e){return n.appendChild(e)}),t=a.nodes}else if("("===r){if(!n)throw"ExpressiveDOMParser: Invalid location for opening parenthesis";i.push({node:n,nodes:t}),t=[]}else{var o=r.split("."),s=o.shift();n=document.createElement(s),o.length&&(n.className=o.join(" ")),t.push(n)}}),i.length)throw"ExpressiveDOMParser: Unmatched opening and closing parenthesis";return t}}]),e}(),n.DOMList=function(){function e(){var t=arguments.length<=0||void 0===arguments[0]?[]:arguments[0];i(this,e),"string"==typeof t?this.items=[document.createElement(t)]:Array.isArray(t)?this.items=t:(this.items=[],t&&this.items.push(t))}return o(e,[{key:"clone",value:function(){var t=[];return this.items.forEach(function(e){t.push(e.cloneNode(!0))}),new e(t)}},{key:"appendTo",value:function(e){var t=this;return r(e).forEach(function(e){t.items.forEach(function(t){e.appendChild(t)})}),this}},{key:"before",value:function(e){var t=this;return r(e).forEach(function(e){t.items.forEach(function(t){e.parentNode.insertBefore(t,e)})}),this}},{key:"remove",value:function(){return this.items.forEach(function(e){e.parentNode.removeChild(e)}),this}},{key:"parent",value:function(t){var n=void 0;return t instanceof f?this.items.some(function(e){for(var i=e.parentNode;i;){if(t.test(i))return n=i,!0;i=i.parentNode}}):this.items.some(function(e){return e.parentNode?(n=e.parentNode,!0):void 0}),new e(n)}},{key:"addClass",value:function(){for(var e=arguments.length,t=Array(e),n=0;e>n;n++)t[n]=arguments[n];return this.items.forEach(function(e){var n=e.className?e.className.split(" "):[];t.forEach(function(e){n.indexOf(e)<0&&n.push(e)}),e.className=n.join(" ")}),this}},{key:"removeClass",value:function(){for(var e=arguments.length,t=Array(e),n=0;e>n;n++)t[n]=arguments[n];return this.items.forEach(function(e){var n=e.className?e.className.split(" "):[];t.forEach(function(e){var t=n.indexOf(e);t>=0&&n.splice(t,1)}),e.className=n.join(" ")}),this}},{key:"css",value:function(e,t){return this.items.forEach(function(n){"object"===("undefined"==typeof e?"undefined":a(e))?Object.keys(e).forEach(function(t){n.style[t]=e[t]}):n.style[e]=t}),this}},{key:"attr",value:function(e,t){if("object"===("undefined"==typeof e?"undefined":a(e)))this.items.forEach(function(t){Object.keys(e).forEach(function(n){"undefined"==typeof e[n]?t.removeAttribute(n):t.setAttribute(n,e[n])})});else{if("undefined"==typeof t){var n=void 0;return this.items.some(function(t){var i=t.getAttribute(e);return"undefined"!=typeof i?(n=i,!0):void 0}),n}this.items.forEach(function(n){return n.setAttribute(e,t)})}return this}},{key:"data",value:function(e,t){if("object"===("undefined"==typeof e?"undefined":a(e)))this.items.forEach(function(t){Object.keys(e).forEach(function(n){"undefined"==typeof e[n]?delete t.dataset[n]:t.dataset[n]=e[n]})});else{if("undefined"==typeof t){var n=void 0;return this.items.some(function(t){var i=t.dataset[e];return"undefined"!=typeof i?(n=i,!0):void 0}),n}this.items.forEach(function(n){return n.dataset[e]=t})}return this}},{key:"on",value:function(e,t,n){return this.items.forEach(function(i){i.addEventListener(e,function(e){t instanceof f?t.test(e.target)&&n(e):t(e)})}),this}},{key:"find",value:function(t){var n=[];return this.items.forEach(function(e){for(var i=e.querySelectorAll(t),r=0,a=i.length;a>r;r++)n.push(i[r])}),new e(n)}},{key:"each",value:function(){for(var e=this,t=arguments.length,n=Array(t),i=0;t>i;i++)n[i]=arguments[i];return n.forEach(function(t){e.items.forEach(function(e){t(e)})}),this}}]),e}()),l={type:function(e,t){return t.tagName.toUpperCase()===e.toUpperCase()},css:function(e,t){var n=(t.className||"").split(" ");return e.every(function(e){return n.indexOf(e)>=0})}},f=function(){function e(){var t=arguments.length<=0||void 0===arguments[0]?!1:arguments[0];i(this,e),this._bubble=t,this._matchers=[]}return o(e,[{key:"type",value:function(e){return this._matchers.push(l.type.bind(this,e)),this}},{key:"css",value:function(){for(var e=arguments.length,t=Array(e),n=0;e>n;n++)t[n]=arguments[n];return this._matchers.push(l.css.bind(this,t)),this}},{key:"test",value:function(e){var t=this;return r(e).every(function(e){for(var n=e,i=!1;n&&n.parentNode!==n;){if(i=t._matchers.every(function(e){return e(n)}))return!0;if(!t._bubble)return!1;n=n.parentNode}return!1},this)}}]),e}();n.Matcher=f},{"./cache":6}],8:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=function(){},o=function(){function e(t){var n=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];i(this,e),this._url=t,this._params=n,this._progress=a,this._done=a,this._fail=a,this._post()}return r(e,[{key:"progress",value:function(e){return"function"==typeof e&&(this._progress=e),this}},{key:"done",value:function(e){return"function"==typeof e&&(this._done=e),this}},{key:"fail",value:function(e){return"function"==typeof e&&(this._fail=e),this}},{key:"_post",value:function(){var e=this,t=new FormData,n=function(n){var i=e._params[n];Array.isArray(i)?i.forEach(function(e){e.type&&e.name?t.append(n,e,e.name):t.append(n,e)}):i.type&&i.name?t.append(n,i,i.name):t.append(n,i)};for(var i in this._params)n(i);var r=new XMLHttpRequest;r.onreadystatechange=function(){if(4==r.readyState)if(r.status>=200&&r.status<300)try{e._done(JSON.parse(r.response))}catch(t){e._fail()}else e._fail()},r.upload.addEventListener("progress",function(t){e._progress(Math.ceil(t.loaded/t.total*100))},!1),r.open("POST",this._url,!0),r.send(t)}}]),e}();n.Http=o},{}],9:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();n.Options=function(){function e(t,n){i(this,e),this._opts=Array.isArray(t)?t:[t],this._context=n||this}return r(e,[{key:"get",value:function(){for(var e=this,t=[],n=void 0,i=arguments.length,r=Array(i),a=0;i>a;a++)r[a]=arguments[a];r.forEach(function(e){"string"==typeof e?t.push(e):"function"==typeof e&&(n=e)});var o=[],s=function u(){if(0===t.length)return void(n&&n.apply(e.context,o));var i=t.shift().split("."),r=void 0;e._opts.some(function(e){var t=e;return i.forEach(function(e){"undefined"!=typeof t&&(t=t[e])}),"undefined"!=typeof t?(r=t,!0):!1}),"function"!=typeof r&&(r=function(e){return function(){return e}}(r)),r.length>0?r.apply(e._context,[function(e){o.push(e),u()}]):(o.push(r.apply(e._context)),u())};return s(),n?void 0:o.length>1?o:o[0]}}]),e}()},{}],10:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();n.Queue=function(){function e(t){var n=arguments.length<=1||void 0===arguments[1]?{}:arguments[1];i(this,e),this._handler=t,this._concurrency=Math.max(n.concurrency,1)||1,this._delay=Math.max(n.delay,0)||0,this._size=Math.max(n.size,0)||0,this._queue=[],this._working=[],this._id=0}return r(e,[{key:"offer",value:function(e){return!this._size||this._queue.length<this._size?(this._queue.push({item:e}),this._next(),!0):!1}},{key:"_next",value:function(){var e=this;this._working.length<this._concurrency&&!function(){var t=e._queue.shift();void 0!==t&&!function(){var n=++e._id,i=function(){var t=e._working.indexOf(n);t>=0&&(e._working.splice(t,1),e._next())},r=function(){e._handler.apply(e,[t.item,i])};e._working.push(n),e._delay?setTimeout(r,e._delay):r()}()}()}}]),e}()},{}],11:[function(e,t,n){"use strict";function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}();n.Update=function(){function e(t){var n=arguments.length<=1||void 0===arguments[1]?16:arguments[1];i(this,e),this._handler=t,this._delay=n}return r(e,[{key:"_fire",value:function(){"undefined"==typeof this._val?(clearInterval(this._interval),this._interval=!1):(this._handler.call(this,this._val),delete this._val)}},{key:"value",set:function(e){this._val=e,this._interval||"undefined"==typeof this._val||(this._interval=setInterval(this._fire.bind(this),this._delay))}}]),e}()},{}]},{},[5]);