/**
 * The Options module provides a wrap around an option object where options can be defined as
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
 * let o = options(opts)
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
 */
export function options(opts) {
  /**
   * @private
   */
  function _mapKeysToValues(keys) {
    return keys.map((key) => {
      let val;
      let obj = opts;
      key.split('.').forEach((part) => {
        val = obj[part];
        obj = val || {};
      });
      return val;
    });
  }

  /**
   * Get the option values
   */
  function get(...args) {
    const keys = [];
    let callback = undefined;
    args.forEach(a => {
      if (typeof a === 'string') {
        keys.push(a);
      } else if (typeof a === 'function') {
        callback = a;
      }
    });

    let values = _mapKeysToValues(keys);
    if (!callback) {
      values = values.map(v => (typeof v === 'function' ? undefined : v));
      if (values.length > 1) {
        return values;
      }
      return values[0];
    }

    let toResolve = values.filter(v => typeof v === 'function').length;
    const valueCallback = idx => (val) => {
      values[idx] = val;
      toResolve--;
      if (toResolve === 0) {
        callback(...values);
      }
    };

    values.forEach((v, idx) => {
      if (typeof v === 'function') {
        if (v.length > 0) {
          v(valueCallback(idx));
        } else {
          valueCallback(idx)(v());
        }
      }
    });

    return undefined;
  }

  return {
    get,
  };
}
