import {Options} from "../util/options"
import {Queue} from "../util/queue"
import {on, matches, children, css, type, addClass, SimpleDOMParser} from "../util/dom"

export class Widget {

    constructor(ele, opts) {
        this._ele = ele
        this._opts = new Options(opts, this)
        this._size = size
        this._max = this._opts.get("max")
        this._queue = new Queue(this._next, {
            delay: this._opts.get("delay")
        })
        this._parser = new SimpleDOMParser()
        this._init()
    }

    _init() {
        this._ele

        this._picker = document.createElement("input")
        this._picker.setAttribute("type", "file")
        this._picker.setAttribute("multiple", "multiple")
        this._ele.appendChild(this._picker)
        on(this._picker, "change", () => true, this._picked)

        let current = []
        children(matches(type("img")))(this._ele).forEach(i => {
            if (this._max && this._size == this._max) {
                let item = this._parser.parse(this._opts.get("template.item"))
                item.appendChild(i)
                item.appendChild(this._parser.parse(this._opts.get("template.actions")))
                current.push(item)
            } else {
                i.remove()
            }
        })

        current.forEach(i => {
            this._ele.appendChild(i)
        })

        let actionNew = this._parser.parse(this._opts.get("template.new"))
        this._ele.appendChild(actionNew)

        if (this._max && this._size == this._max) {
            addClass("hide")(actionNew)
        }

        on(this._ele, matches(css("item"),css("new")), this._pick)
        on(this._ele, matches(css("del")), this._delete)
    }

    _pick(e) {
         e.stopImmediatePropagation();
         if (!matches(type("input"))(e.target)) {
            this._picker.click();
         }
    }

    _picked() {

    }

    _next(item, done) {

    }

    _delete(e) {

    }
}