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
export class Queue {

    /**
     * @param handler Handler function that takes each item offered to the queue
     * @param options Object of mapped options, see class doc to details
     */
    constructor(handler, options = {}) {
        this._handler = handler
        this._concurrency = Math.max(options.concurrency, 1) || 1
        this._delay = Math.max(options.delay, 0) || 0
        this._size = Math.max(options.size, 0) || 0
        this._queue = []
        this._working = []
        this._id = 0
    }

    /**
     * Offer a item to the queue
     *
     * @param item The item that eventually get passed to the handler
     * @returns {boolean} True if the queue accepted the item, False if the queue has reached it max size
     */
    offer(item) {
        if (!this._size || this._queue.length < this._size) {
            this._queue.push({
                item
            })
            this._next()
            return true
        }
        return false
    }

    /**
     * @private
     */
    _next() {
        if (this._working.length < this._concurrency) {
            let next = this._queue.shift()
            if (next !== undefined) {
                let id = ++this._id, done = () => {
                    let index = this._working.indexOf(id)
                    if (index >= 0) {
                        this._working.splice(index, 1)
                        this._next()
                    }
                }, fire = () => {
                    this._handler.apply(this, [next.item, done])
                }
                this._working.push(id)
                if (this._delay) {
                    setTimeout(fire, this._delay)
                } else {
                    fire()
                }
            }
        }
    }
}