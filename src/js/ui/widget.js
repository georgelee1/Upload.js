import {Options} from "../util/options"
import {Queue} from "../util/queue"
import {DOMList, Matcher, SimpleDOMParser} from "../util/dom"

/**
 * Why bother instantiating a Matcher when you can call the short convenience function
 * So instead of new Matcher().css(..) it's m().css(..)
 */
function m(bubble) {
    return new Matcher(bubble)
}

/**
 * Instead of instantiating a DOMList every time we can use this this tiny convenience function
 * So instead of new DOMList(..) it's just up(..)
 */
function up(arg) {
    return new DOMList(arg)
}

/**
 * The Widget class is the controller between the DOM elements (and user actions) and the backend.
 */
export class Widget {

    constructor(ele, opts) {
        this._ele = up(ele)
        this._opts = new Options(opts, ele)
        this._size = 0
        this._max = this._opts.get("max")
        this._queue = new Queue(this._next, {
            delay: this._opts.get("delay")
        })
        this._parser = new SimpleDOMParser()
        this._listeners = {}
        this._init()
    }

    /**
     * Sets up the DOM.
     * Creates and appends an INPUT of type file for the user to be able to pick files.
     * Adjusts any current IMG elements in the containing element.
     * Registers appropriate listeners.
     */
    _init() {
        this._ele.addClass("uploadjs")

        this._picker = up("input").attr({"type": "file", "multiple": "multiple"}).appendTo(this._ele).on("change", this._picked.bind(this))

        this._ele.find("img").each(image => {
            let img = up(image)
            let id = img.data("uploadImageId")
            if (typeof id !== "undefined" && (!this._max || this._size < this._max)) {
                let item = this._parser.parse(this._opts.get("template.item"))
                item.find("img").attr("src", img.attr("src"))
                if (this._opts.get("deletable") !== false) {
                    this._parser.parse(this._opts.get("template.actions")).appendTo(item)
                } else {
                    item.addClass("static")
                }
                item.appendTo(this._ele)
                this._size++
            }
            img.remove()
        })

        this._add = this._parser.parse(this._opts.get("template.add")).appendTo(this._ele)

        this._picker = this._picker.items[0]
        this._ele.on("click", m(true).css("item", "new"), this._picker.click.bind(this._picker))
        this._ele.on("click", m(true).css("del"), this._delete.bind(this))
        
        let reduceAndUpdate = () => {
            this._size--
            this._update()
        }
        this._addListener("upload.failed", reduceAndUpdate)
        this._addListener("delete.done", reduceAndUpdate)
        
        this._allowedTypes = []
        let allowedTypes = this._opts.get("allowed_types")
        let types = this._opts.get("types")
        if (Array.isArray(allowedTypes)) {
            allowedTypes.forEach(type => {
                if (Array.isArray(types[type])) {
                    types[type].forEach(t => {
                        this._allowedTypes.push(t.toLowerCase())
                    })
                } else {
                    this._allowedTypes.push(type.toLowerCase())
                }
            })
        }
        
        this._update()
    }
    
    /**
     * Registers a listener with this Widget
     * 
     * @param on The event to listen for
     * @param handler The handler function that gets called
     */
    _addListener(on, handler) {
        if (typeof handler === "function") {
            let listeners = this._listeners[on]
            if (!listeners) {
                listeners = this._listeners[on] = []
            }
            listeners.push(handler)
        }
    }

    /**
     * Fired when the user has selected files from the file selection.
     * Adds DOM elements to the containing elements in an uploading state
     * Adds upload to the queue
     */
    _picked() {
        let files = this._picker.files
        for (let x = 0; x < files.length; x++) {
            if ((!this._max || this._size < this._max) && this._typeAllowed(files[x])) {
                let item = this._parser.parse(this._opts.get("template.item")).addClass("uploading")
                this._parser.parse(this._opts.get("template.uploading")).appendTo(item)
                
                let reader = new FileReader()
                reader.onload = e => {
                    item.find("img").attr("src", e.target.result)
                }
                reader.readAsDataURL(files[x])
                item.before(this._add)
                
                this._size++
                this._update()
                this._queue.offer(new UploadItem(item, files[x], this, this._listeners))
            }
        }
        
        this._picker.value = ""
    }
    
    /**
     * Returns true if the passed file is an allowed type
     */
    _typeAllowed(file) {
        return this._allowedTypes.indexOf(file.type) >= 0
    }

    /**
     * Fired when the user has clicked the delete action from the actions bar
     * Sets the DOM element into a removing state
     * Adds deletion to the queue
     */
    _delete(e) {
        let item = up(e.target).parent(m().css("item")).addClass("removing")
        this._parser.parse(this._opts.get("template.deleting")).appendTo(item)
        
        this._queue.offer(new DeleteItem(item, this, this._listeners))
    }
    
    /**
     * Triggered from the queue to handle the next item
     */
    _next(item, done) {
        item.run(done)
    }
    
    /**
     * Adjusts the visibility of the "add" action based on the max option and the current size
     */
    _update() {
        if (this._max) {
            if (this._size < this._max) {
                this._add.removeClass("hide")
            } else {
                this._add.addClass("hide")
            }
        }
    }
}

/**
* Very simple class to run a handler function with the latest value passed as the only argument. The handler will be called at a set delay, starting from
* the first time the value is set. After each handler function invocation the value is reset. The handler will stop being called if value has not then
* been set to another value.
*
* Usage:
* let update = new Update(v => console.info(v), 1000)
* update.value = "test1"
* update.value = "test2"
* // 1 second later, console print "test2"
*
* @class
*/
class Update {
    /**
     * @param {function} handler - The handler function to be called with the value as the only argument
     * @param {number} delay - The interval delay between each call of the handler in milliseconds
     */
    constructor(handler, delay=16) {
        this._handler = handler
        this._delay = delay
    }
    
    set value(val) {
        this._val = val
        if (!this._interval && typeof this._val !== "undefined") {
            this._interval = setInterval(this._fire.bind(this), this._delay)
        }
    }
    
    _fire() {
        if (typeof this._val === "undefined") {
            clearInterval(this._interval)
            this._interval = false
        } else {
            this._handler.call(this, this._val)
            delete this._val
        }
    }
}

class Item {
    constructor(listeners=[]) {
        this._listeners = listeners
    }
    
    /**
     * Triggers the registered events with the passed arguments
     */
    _trigger(event) {
        if (this._listeners && Array.isArray(this._listeners[event.type])) {
            this._listeners[event.type].forEach(listener => {
                if (typeof listener === "function") {
                    listener.call(null, event)
                }
            })
        }
    }
}

/**
 * UploadItem handles the uploading of a file and the updating of the DOM elements
 */
class UploadItem extends Item {
    constructor(ele, file, widget, listeners) {
        super(listeners)
        this._ele = ele
        this._file = file
        this._widget = widget
        this._fin = false
        this._up = new Update(this._update.bind(this), 200)
        
        this._trigger({type: "upload.added", file: this._file})
    }
    
    /**
     * Starts the uploading
     */
    run(done) {
        this._trigger({type: "upload.started", file: this._file})
        this._dom_progress = this._ele.find(".progress")
        
        let item = this
        this._widget._opts.get("upload.url", url => {
            item._widget._opts.get("http")(url, {[item._widget._opts.get("upload.param")]: item._file})
                .progress(item._progress.bind(item))
                .done(item._done.bind(item, done))
                .fail(item._fail.bind(item, done))
        })
    }
    
    /**
     * Triggered by the HTTP with updates on the progress of the upload
     */
    _progress(percent) {
        if (!this._fin) {
            this._up.value = percent
            this._trigger({type: "upload.progress", file: this._file, progress: percent})
        }
    }
    
    /**
     * Called by the Update to apply the progress percent
     */
    _update(percent) {
        if (!this._fin) {
            this._dom_progress.css("transform", `translateX(-${100 - percent}%)`)
        }
    }
    
    /**
     * Triggered by the HTTP when the upload has successfully completed
     */
    _done(done, data) {
        if (!data.success) {
            this._fail(done)
            return
        }
        
        this._update(0)
        this._fin = true
        this._ele.removeClass("uploading")
        let complete = this._widget._parser.parse(this._widget._opts.get("template.done")).appendTo(this._ele)
        
        let id = data["upload-image-id"] || data["uploadImageId"]
        if (typeof id !== "undefined") {
            this._ele.data("uploadImageId", id)
            if (this._widget._opts.get("deletable") !== false) {
                this._widget._parser.parse(this._widget._opts.get("template.actions")).appendTo(this._ele)
            } else {
                this._ele.addClass("static")
            }
        }
        
        setTimeout(() => {
            complete.addClass("going")
            setTimeout(() => {
                complete.remove()
            }, 3000)
        }, 2000)
        
        this._trigger({type: "upload.done", file: this._file, id})
        done()
    }
    
    /**
     * Triggered by the HTTP when the upload has failed
     */
    _fail(done) {
        this._update(0)
        this._fin = true
        this._ele.addClass("stopped")
        this._widget._parser.parse(this._widget._opts.get("template.error")).appendTo(this._ele)
        
        setTimeout(() => {
            this._ele.addClass("removed")
            setTimeout(() => {
                this._ele.remove()
            }, 1000)
        }, 10000)
        
        this._trigger({type: "upload.failed", file: this._file})
        done()
    }
}

/**
 * DeleteItem handles the deleting of a file and the updating of the DOM elements
 */
class DeleteItem extends Item {
    constructor(ele, widget, listeners) {
        super(listeners)
        this._ele = ele
        this._widget = widget
        this._id = this._ele.data("uploadImageId")
        
        this._trigger({type: "delete.added", id: this._id})
    }
    
    /**
     * Starts the deletion
     */
    run(done) {
        this._trigger({type: "delete.started", id: this._id})
        let item = this
        this._widget._opts.get("delete.url", url => {
            item._widget._opts.get("http")(url, {[item._widget._opts.get("delete.param")]: item._id})
                .done(item._done.bind(item, done))
                .fail(item._fail.bind(item, done))
        })
    }
    
    /**
     * Triggered by the HTTP when the deletion has successfully completed
     */
    _done(done, data) {
        if (!data.success) {
            this._fail(done)
            return
        }
        
        this._ele.removeClass("removing").addClass("removed")
        setTimeout(() => {
            this._ele.remove()
        }, 1000)
        
        this._trigger({type: "delete.done", id: this._id})
        done()
    }
    
    /**
     * Triggered by the HTTP when the deletion has failed
     */
    _fail(done) {
        this._ele.removeClass("removing")
        let error = this._widget._parser.parse(this._widget._opts.get("template.error")).appendTo(this._ele)
        
        setTimeout(() => {
            error.addClass("going")
            setTimeout(() => {
                error.remove()
            }, 3000)
        }, 2000)
        
        this._trigger({type: "delete.failed", id: this._id})
        done()
    }
}