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
export class Options {

    constructor(opts, context) {
        this._opts = opts
        this._context = context || this
    }

    get(name, callback) {
        let val = this._opts
        name.split("\.").forEach(p => {
            val = val[p]
        })
        if (!("function" === typeof val)) {
            val = (v => {
                return () => {
                    return v
                }
            })(val)
        }
        if (val.length > 0) {
            let result = undefined
            val.apply(this._context, [callback || (v => { result = v })])
            return result
        } else {
            if (callback) {
                callback.apply(this._context, [val.apply(this._context)])
            } else {
                return val.apply(this._context)
            }
        }
    }
}