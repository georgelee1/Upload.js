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
 * let q = queue((item, done) => {
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
 */
export default function queue(handler, options = {}) {
  const _handler = handler;
  const _concurrency = Math.max(options.concurrency, 1) || 1;
  const _delay = Math.max(options.delay, 0) || 0;
  const _size = Math.max(options.size, 0) || 0;
  let _queue = [];
  let _working = [];
  let _id = 0;

  /**
   * @private
   */
  function _next() {
    if (_working.length < _concurrency) {
      const next = _queue.shift();
      if (next !== undefined) {
        const id = ++_id;
        const done = () => {
          const index = _working.indexOf(id);
          if (index >= 0) {
            _working.splice(index, 1);
            _next();
          }
        };
        const fire = () => _handler.apply(undefined, [next.item, done]);
        _working.push(id);
        if (_delay) {
          setTimeout(fire, _delay);
        } else {
          fire();
        }
      }
    }
  }

  /**
   * Offer a item to the queue to be processed by the handler. Returns True if the queue
   * accepted the item, False if the queue has reached it's max size.
   */
  function offer(item) {
    if (!_size || _queue.length < _size) {
      _queue.push({
        item,
      });
      _next();
      return true;
    }
    return false;
  }

  /**
   * Empties the queue
   */
  function clear() {
    _queue = [];
    _working = [];
  }

  return {
    offer,
    clear,
  };
}
