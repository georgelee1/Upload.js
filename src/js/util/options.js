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
 * o.get("key1", "key2") === ["val1", "val2]
 * o.get("key1", "key2", (v1, v2) => {
 *     v1 === "val1"
 *     v2 === "val2"
 * })
 * o.get("key1", "key3") === ["val1", undefined]
 * o.get("key1", "key3", (v1, v2) => {
 *     v1 === "val1"
 *     v2 === "val3"
 * })
 *
 * @class
 */
export class Options {

    constructor(opts, context) {
        this._opts = opts
        this._context = context || this
    }

    get(...args) {
        let names = []
        let callback = undefined
        args.forEach(a => {
            if (typeof a === "string") {
                names.push(a)
            } else if (typeof a === "function") {
                callback = a
            }
        })
        
        let result = []
        let next = () => {
            if (names.length === 0) {
                if (callback) {
                    callback.apply(this.context, result)
                }
                return
            }
            let name = names.shift()
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
                val.apply(this._context, [(v => { 
                    result.push(v)
                    next()
                })])
            } else {
                result.push(val.apply(this._context))
                next()
            }
        }
        next()

        if (!callback) {
            if (result.length > 1) {
                return result
            } else {
                return result[0]
            }
        }
    }
}