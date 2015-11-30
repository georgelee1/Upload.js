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
export class Update {
    /**
     * @param {function} handler - The handler function to be called with the value as the only argument
     * @param {number} delay - The interval delay between each call of the handler in milliseconds
     */
    constructor(handler, delay=16) {
        this._handler = handler
        this._delay = delay
    }

    /**
     * Sets the current value for the updater that is going to passed to the handler when the time is right
     */
    set value(val) {
        this._val = val
        if (!this._interval && typeof this._val !== "undefined") {
            this._interval = setInterval(this._fire.bind(this), this._delay)
        }
    }

    /**
     * @private
     */
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