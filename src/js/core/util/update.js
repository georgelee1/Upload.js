/**
 * Very simple class to run a handler function with the latest value passed as the only argument.
 * The handler will be called at a set delay, starting from the first time the value is set. After
 * each handler function invocation the value is reset. The handler will stop being called if value
 * has not then been set to another value.
 *
 * Usage:
 * let update = update(v => console.info(v), 1000)
 * update.value = "test1"
 * update.value = "test2"
 * // 1 second later, console print "test2"
 */
export default function update(handler, delay = 16) {
  const _handler = handler;
  const _delay = delay;
  let _val;
  let _interval;

  /**
   * @private
   */
  function _fire() {
    if (typeof _val === 'undefined') {
      clearInterval(_interval);
      _interval = false;
    } else {
      _handler(_val);
      _val = undefined;
    }
  }

  return {
    /**
     * Sets the current value for the updater that is going to passed to the handler when the time
     * is right.
     */
    set value(val) {
      _val = val;
      if (!_interval) {
        _interval = setInterval(_fire, _delay);
      }
    },
  };
}
