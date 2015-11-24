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
        this._ele.addClass("uploadjs")

        this._picker = up("input").attr({"type": "file", "multiple": "multiple"}).appendTo(this._ele).on("change", this._picked.bind(this))

        this._ele.find("img").each(img => {
            if (!this._max || this._size < this._max) {
                let item = this._parser.parse(this._opts.get("template.item"))
                item.find("img").attr("src", img.getAttribute("src"))
                this._parser.parse(this._opts.get("template.actions")).appendTo(item)
                item.appendTo(this._ele)
                this._size++
            }
            img.remove()
        })

        this._add = this._parser.parse(this._opts.get("template.add")).appendTo(this._ele)

        if (!this._max && this._size < this._max) {
            this._add.addClass("hide")
        }

        this._picker = this._picker.items[0]
        this._ele.on("click", m(true).css("item", "new"), this._picker.click.bind(this._picker))
        this._ele.on("click", m(true).css("del"), this._delete.bind(this))
    }

    /**
     * Fired when the user has selected files from the file selection.
     * Adds DOM elements to the containing elements in an uploading state
     * Adds upload to the queue
     */
    _picked() {
        let files = this._picker.files
        for (let x = 0; x < files.length; x++) {
            let item = this._parser.parse(this._opts.get("template.item")).addClass("uploading")
            this._parser.parse(this._opts.get("template.uploading")).appendTo(item)
            
            let reader = new FileReader()
            reader.onload = e => {
                item.find("img").attr("src", e.target.result)
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