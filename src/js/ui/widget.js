import {Queue} from "../util/queue"
import {on, matches, children, css, type} from "../util/dom"

export class Widget {

    constructor(ele, opts) {
        this._ele = ele
        this._opts = opts
        this._size = size
        this._queue = new Queue(this._next, {
            delay: 200
        })
        this._init()
    }

    _init() {
        this._ele

        children(matches(type("img")))(this._ele).forEach(i => {

        })

        on(this._ele, matches(css("del")), this._delete)
    }

    _next(item, done) {

    }

    _delete(e) {

    }
}