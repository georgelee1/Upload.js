/**
 * The events module handles registering of event listeners and triggering of events.
 */
export default function events(known = []) {
  const _byKey = {};
  const _emit = [];
  const _parents = [];

  /**
   * Register event listener
   */
  function on(key, listener) {
    const available = known.concat(_parents.reduce((val, next) => val.concat(next), []));
    if (available.length && available.indexOf(key) < 0) {
      console.warn('Attemping to listen to an unknown event. ' +
        `'${key}' is not one of '${available.join(', ')}'`);
    }
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
    _emit.forEach(ev => ev.trigger(key, event));
  }

  /**
   * Emits events trigger in this events instance to the passed events instance.
   */
  function emit(ev) {
    if (ev && ev.trigger) {
      _emit.push(ev);
      ev._parent(known);
    }
  }

  return {
    on,
    trigger,
    emit,
    _parent(ev) {
      _parents.push(ev);
    },
  };
}
