import {Options} from "../util/options"
import {Queue} from "../util/queue"
import {on, matchesOrChild, matches, children, hasClass, type, addClass, removeClass, attr, SimpleDOMParser} from "../util/dom"

/**
 * The Widget class is the controller between the DOM elements (and user actions) and the backend.
 */
export class Widget {

    constructor(ele, opts) {
        this._ele = ele
        this._opts = new Options(opts, this)
        this._size = 0
        this._max = this._opts.get("max")
        this._queue = new Queue(this._next, {
            delay: this._opts.get("delay")
        })
        this._parser = new SimpleDOMParser()
        this._init()
    }

    /**
     * Sets up the DOM.
     * Creates and appends an INPUT of type file for the user to be able to pick files.
     * Adjusts any current IMG elements in the containing element.
     * Registers appropriate listeners.
     */
    _init() {
        if (!hasClass("uploadjs")(this._ele)) {
            addClass("uploadjs")(this._ele)
        }

        this._picker = document.createElement("input")
        this._picker.setAttribute("type", "file")
        this._picker.setAttribute("multiple", "multiple")
        this._ele.appendChild(this._picker)
        on(this._picker, "change", () => true, this._picked.bind(this))

        children(matches(type("img")))(this._ele).forEach(i => {
            if (!this._max || this._size < this._max) {
                let item = this._parser.parse(this._opts.get("template.item"))
                attr("src", i.getAttribute("src"))(children(type("img"))(item))
                this._parser.parse(this._opts.get("template.actions")).appendTo(item.items)
                item.appendTo(this._ele)
                this._size++
            }
            i.remove()
        })

        this._add = this._parser.parse(this._opts.get("template.add")).appendTo(this._ele)

        if (!this._max && this._size < this._max) {
            addClass("hide")(this._add)
        }

        on(this._ele, "click", matchesOrChild(hasClass("item", "new")), this._picker.click.bind(this._picker))
        on(this._ele, "click", matchesOrChild(hasClass("del")), this._delete.bind(this))
    }

    /**
     * Fired when the user has selected files from the file selection.
     * Adds DOM elements to the containing elements in an uploading state
     * Adds upload to the queue
     */
    _picked() {
        let files = this._picker.files
        for (let x = 0; x < files.length; x++) {
            let item = this._parser.parse(this._opts.get("template.item"))
            addClass("uploading")(item)
            this._parser.parse(this._opts.get("template.uploading")).appendTo(item)
            
            let reader = new FileReader()
            reader.onload = e => {
                attr("src", e.target.result)(children(type("img"))(item))
            }
            reader.readAsDataURL(files[x])
            item.before(this._add)
        }
    }

    /**
     * Fired when the user has clicked the delete action from the actions bar
     * Sets the DOM element into a removing state
     * Adds deletion to the queue
     */
    _delete(e) {

    }
}