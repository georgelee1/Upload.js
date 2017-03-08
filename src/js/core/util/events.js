/**
 * The events module handles registering of event listeners and triggering of events.
 */
export default function events() {
  const _byKey = {};

  /**
   * Register event listener
   */
  function on(key, listener) {
    if (typeof listener === 'function') {
      if (!_byKey[key]) {
        _byKey[key] = [];
      }
      _byKey[key].push(listener);
    }
  }

  /**
   * Triggers event with key and parameters
   */
  function trigger(key, event) {
    if (_byKey[key]) {
      _byKey[key].forEach(listener => listener(Object.assign({ type: key }, event)));
    }
  }

  return {
    on,
    trigger,
  };
}
