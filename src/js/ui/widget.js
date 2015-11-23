import {Options} from "../util/options"
import {Queue} from "../util/queue"
import {on, matchesOrChild, matches, children, css, type, cls, attr, SimpleDOMParser} from "../util/dom"

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

    _init() {
        this._ele

        if (!css("uploadjs")(this._ele)) {
            cls("uploadjs")(this._ele)
        }

        this._picker = document.createElement("input")
        this._picker.setAttribute("type", "file")
        this._picker.setAttribute("multiple", "multiple")
        this._ele.appendChild(this._picker)
        on(this._picker, "change", () => true, this._picked)

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

        let actionAdd = this._parser.parse(this._opts.get("template.add")).appendTo(this._ele)

        if (!this._max || this._size < this._max) {
            cls("hide", actionAdd)
        }

        on(this._ele, "click", matchesOrChild(css("item"), css("new")), this._pick.bind(this))
        on(this._ele, "click", matchesOrChild(css("del")), this._delete)
    }

    _pick() {
        this._picker.click()
    }

    _picked() {

    }

    _next(item, done) {

    }

    _delete(e) {

    }
}