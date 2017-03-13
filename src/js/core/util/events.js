const ALL = '$all';

/**
 * The events module handles registering of event listeners and triggering of events.
 */
export default function events(known = []) {
  const _byKey = {};
  const _emit = [];
  const _parents = [];

  function isDefined(val) {
    return typeof val !== 'undefined' && !(typeof val === 'object' && !val);
  }

  /**
   * Register event listener
   */
  function on(key, id, listener) {
    const available = known.concat(_parents.reduce((val, next) => val.concat(next), []));
    if (available.length && available.indexOf(key) < 0) {
      console.warn('Attemping to listen to an unknown event. ' +
        `'${key}' is not one of '${available.join(', ')}'`);
    }
    if (typeof id === 'function') {
      listener = id;
      id = ALL;
    }
    const actualId = isDefined(id) ? (id).toString() : ALL;
    if (typeof listener === 'function') {
      if (!_byKey[key]) {
        _byKey[key] = {
          [ALL]: [],
        };
      }
      if (!_byKey[key][actualId]) {
        _byKey[key][actualId] = [];
      }
      _byKey[key][actualId].push(listener);
    }
  }

  /**
   * Triggers event with key and parameters
   */
  function trigger(key, event) {
    if (_byKey[key]) {
      const id = isDefined(event.id) ? (event.id).toString() : false;
      if (id && _byKey[key][id]) {
        _byKey[key][id].forEach(listener => listener(Object.assign({ type: key }, event)));
      }
      _byKey[key][ALL].forEach(listener => listener(Object.assign({ type: key }, event)));
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
